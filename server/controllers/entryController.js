const Entry = require("../models/Entry");
const Collection = require("../models/Collection");
const fs = require("fs");
const csvParser = require("csv-parser");
const validateRowAgainstSchema = require("../utils/entryValidator");
const crypto = require("crypto");
const redisClient = require("../utils/redisClient");

const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

function generateRandomAlphaNumeric(name) {
	result = Math.random().toString(16).slice(2, 6);
	return result;
}

// Function to generate hash for filters
const generateFilterHash = (filters) => {
	return crypto.createHash("sha256").update(JSON.stringify(filters)).digest("hex");
};

const createEntry = async (req, res) => {
	const newEntry = new Entry(req.body);
	try {
		//logic for generating alphaNumeric fields
		let binomialName = "";

		if (newEntry.identification.NCBITaxonomyCode) {
			const id = newEntry.identification.NCBITaxonomyCode;

			if (!newEntry.identification.order) {
				const order = getOrder(newEntry.identification.NCBITaxonomyCode);
				newEntry.identification.order = order;
			}

			//FETCH API
			const resp = await fetch(`http://rest.ensembl.org/taxonomy/classification/${id}`, {
				// agent:proxyAgent,
				method: "GET",
				headers: {
					"Content-type": "application/json",
				},
			});

			const data = await resp.json();
			const nameTmp = data[0].children[0].scientific_name;
			binomialName = nameTmp;
		}

		const name = newEntry.archivalIdentification.archivalSpeciesName;
		newEntry.identification.itemCode =
			name +
			"_" +
			newEntry.histologicalInformation.brainPart +
			"_" +
			newEntry.histologicalInformation.stainingMethod +
			"_" +
			generateRandomAlphaNumeric(name);
		newEntry.identification.individualCode = name + "_" + generateRandomAlphaNumeric(name);
		newEntry.identification.wikipediaSpeciesName = `https://en.wikipedia.org/wiki/${name}`;
		newEntry.identification.bionomialSpeciesName = name;

		if (binomialName.length > 0) {
			newEntry.identification.bionomialSpeciesName = binomialName;
			newEntry.identification.wikipediaSpeciesName = `https://en.wikipedia.org/wiki/${binomialName}`;
		}

		if (!newEntry.identification.order) {
			const order = getOrder(data.NCBITaxonomyCode);
			newEntry.identification.order = order;
		}

		const savedEntry = await newEntry.save();

		invalidateCache(savedEntry.collectionID); // Invalidate cache for the collection

		res.status(200).json(savedEntry);
	} catch (err) {
		res.status(500).json(err);
	}
};

const updateEntry = async (req, res) => {
	const newEntry = req.body;

	try {
		let binomialName = "";

		if (newEntry.identification.NCBITaxonomyCode) {
			const id = newEntry.identification.NCBITaxonomyCode;

			if (!newEntry.identification.order) {
				const order = getOrder(newEntry.identification.NCBITaxonomyCode);
				newEntry.identification.order = order;
			}

			// const proxyAgent = new HttpProxyAgent(process.env.PROXY_UNI);

			//FETCH API
			const resp = await fetch(`http://rest.ensembl.org/taxonomy/classification/${id}`, {
				// agent:proxyAgent,
				method: "GET",
				headers: {
					"Content-type": "application/json",
				},
			});

			const data = await resp.json();
			const nameTmp = data[0].children[0].scientific_name;
			binomialName = nameTmp;
		}

		if (binomialName.length > 0) {
			newEntry.identification.bionomialSpeciesName = binomialName;
			newEntry.identification.wikipediaSpeciesName = `https://en.wikipedia.org/wiki/${binomialName}`;
		}

		const updatedEntry = await Entry.findByIdAndUpdate(
			req.params.id,
			{
				$set: newEntry,
			},
			{ new: true }
		);

		invalidateCache(updatedEntry.collectionID); // Invalidate cache for the collection

		res.status(200).json(updatedEntry);
	} catch (err) {
		res.status(500).json(err);
	}
};

const deleteEntry = async (req, res) => {
	try {
		const updatedEntry = await Entry.findByIdAndUpdate(
			req.params.id,
			{
				$set: {
					backupEntry: true,
				},
			},
			{ new: true }
		);

		invalidateCache(updatedEntry.collectionID); // Invalidate cache for the collection

		res.status(200).json(updatedEntry);
	} catch (err) {
		res.status(500).json(err);
	}
};

const deleteMultipleEntries = async (req, res) => {
	try {
		const updatedEntries = await Entry.updateMany(
			{ _id: { $in: req.body } },
			{
				$set: {
					backupEntry: true,
				},
			},
			{ new: true }
		);

		invalidateCache(req.params.collectionID); // Invalidate cache for the collection

		res.status(200).json(updatedEntries);
	} catch (err) {
		res.status(500).json(err);
	}
};

const getEntry = async (req, res) => {
	try {
		const entry = await Entry.findById(req.params.id);
		res.status(200).json(entry);
	} catch (err) {
		res.status(500).json(err);
	}
};

let totalEntriesCache = {}; // In-memory cache for total entries

// get entry by collection id
const getEntriesByCollectionId = async (req, res) => {
	try {
		const { page = 1, limit = 10, sortField, sortOrder = "asc" } = req.query; // Default to page 1 and limit 10
		const collectionID = req.params.id;

		const skip = (page - 1) * limit;

		const filter = {
			collectionID: collectionID,
			backupEntry: { $ne: true },
		};

		const sortOption = {
			[sortField]: sortOrder === "asc" ? 1 : -1,
		};

		const entries = await Entry.find(filter).sort(sortOption).skip(skip).limit(parseInt(limit)).exec();

		// Check if total count is cached
		let totalEntries;
		if (totalEntriesCache[collectionID]) {
			totalEntries = totalEntriesCache[collectionID];
		} else {
			totalEntries = await Entry.countDocuments(filter);
			totalEntriesCache[collectionID] = totalEntries; // Store in cache
		}

		res.status(200).json({
			entries,
			totalEntries,
			totalPages: Math.ceil(totalEntries / limit),
			currentPage: parseInt(page),
		});
	} catch (err) {
		res.status(500).json(err);
	}
};

// Invalidate cache when an entry is added or deleted
const invalidateCache = (collectionID) => {
	delete totalEntriesCache[collectionID];
};

const processCSVEntries = async (req, res) => {
	const { id: collectionID } = req.params;

	if (!req.file) {
		return res.status(400).json({ error: "No file uploaded" });
	}

	const results = [];
	const failedRows = [];

	fs.createReadStream(req.file.path)
		.pipe(csvParser()) // Ensure headers are read correctly
		.on("data", async (data) => {
			let updatedCollection = {};

			let scientificName = data.bionomialSpeciesName;

			const itemCode = `${scientificName}_${data.stainingMethod}_${generateRandomAlphaNumeric(scientificName)}`;
			const individualCode = `${scientificName}_${generateRandomAlphaNumeric(scientificName)}`;
			const wikipediaSpeciesName = `https://en.wikipedia.org/wiki/${scientificName}`;
			const order = getOrder(data.NCBITaxonomyCode);
			const microdraw_link = data.microdraw_link || null;
			const source_link = data.source_link || null;
			const thumbnail = data.thumbnail || null;
			const archivalCode = data.archivalCode || null;

			// Add these modifications to the data object
			updatedCollection.collectionID = collectionID;
			updatedCollection.identification = {
				bionomialSpeciesName: scientificName,
				itemCode,
				individualCode,
				NCBITaxonomyCode: data.NCBITaxonomyCode || null,
				wikipediaSpeciesName,
				order,
				microdraw_link,
				source_link,
				thumbnail,
			};

			updatedCollection.archivalIdentification = {
				archivalSpeciesCode: archivalCode,
			};

			updatedCollection.physiologicalInformation = {
				age: {
					developmentalStage: data.developmentalStage || "adult",
					number: data.ageNumber || null,
					unitOfNumber: data.ageUnit || null,
					origin: data.origin || "postNatal",
				},
				bodyWeight: data.bodyWeight || null,
				brainWeight: data.brainWeight || null,
				sex: data.sex,
			};

			updatedCollection.histologicalInformation = {
				stainingMethod: data.stainingMethod,
				sectionThickness: data.sectionThickness,
				planeOfSectioning: data.planeOfSectioning || null,
				interSectionDistance: data.interSectionDistance || null,
				brainPart: data.brainPart || null,
				comments: data.comments || null,
			};

			// Validate the modified data
			const rowErrors = validateRowAgainstSchema(updatedCollection, Entry.schema);

			if (rowErrors.length === 0) {
				results.push(updatedCollection); // Push the fully modified and validated data
			} else {
				failedRows.push({ rowNumber: failedRows.length + 1, updatedCollection, errors: rowErrors });
			}
		})
		.on("end", async () => {
			try {
				if (results.length > 0) {
					await Entry.insertMany(results);
				}

				const response = {
					status: failedRows.length > 0 ? "partial_success" : "success",
					message:
						failedRows.length > 0
							? "Some entries processed successfully with errors."
							: "CSV entries processed successfully.",
					processedCount: results.length,
					failedCount: failedRows.length,
					failedRows: failedRows.slice(0, 5), // Limit to 5 rows for detailed feedback
				};

				if (failedRows.length > 0) {
					res.status(207).json(response); // 207 status code indicates multi-status
				} else {
					res.status(200).json(response);
				}
			} catch (error) {
				res.status(500).json({
					status: "error",
					message: "Error processing CSV data",
					details: error.message,
				});
			} finally {
				fs.unlinkSync(req.file.path);
			}
		})
		.on("error", (error) => {
			res.status(500).json({
				status: "error",
				message: "Error reading CSV file",
				details: error.message,
			});
		});
};

const getOrderFromTaxonomy = (req, res) => {
	const { taxonomyId } = req.params; // Get taxonomy ID from the request parameter

	fs.readFile("./utils/combined_taxonomy_reports.json", "utf8", (err, data) => {
		if (err) {
			return res.status(500).json({ error: "Error reading taxonomy data" });
		}

		const taxonomyData = JSON.parse(data);

		// Search for the taxonomy data with the matching taxonomyId
		const taxonomyItem = taxonomyData.find((item) => item.taxonomy.taxId === parseInt(taxonomyId));

		// If taxonomy is found, return the order, else return an error
		if (taxonomyItem) {
			const order = taxonomyItem.taxonomy.classification.order;
			if (order && order.name) {
				res.status(200).json({ order: order.name });
			} else {
				res.status(404).json({ error: "Order not found" });
			}
		} else {
			res.status(404).json({ error: "Taxonomy ID not found" });
		}
	});
};

// create a simple function that returns the order from the taxonomy_id, else return Null
const getOrder = (taxonomy_id) => {
	try {
		// read the filer
		const data = fs.readFileSync("./utils/combined_taxonomy_reports.json", "utf8");
		const taxonomyData = JSON.parse(data);

		// Search for the taxonomy data with the matching taxonomyId
		const taxonomyItem = taxonomyData.find((item) => item.taxonomy.taxId === parseInt(taxonomy_id));

		// If taxonomy is found, return the order, else return null
		if (taxonomyItem) {
			const order = taxonomyItem.taxonomy.classification.order;
			if (order && order.name) {
				return order.name;
			}
		}
	} catch (err) {
		console.error("Error reading taxonomy data:", err);
	}
	return null;
};

// make a new route that return all distinct orders from the entry.identification.order
// return a list of orders
const getDistinctOrders = async (req, res) => {
	const cacheKey = "distinct_orders";

	try {
		const cached = await redisClient.get(cacheKey);
		if (cached) return res.json(JSON.parse(cached));

		const orders = await Entry.distinct("identification.order");
		await redisClient.setEx(cacheKey, 7200, JSON.stringify(orders));

		res.json(orders);
	} catch (error) {
		console.error(error);
		res.status(500).send("Server error");
	}
};

const getDistinctStainings = async (req, res) => {
	const cacheKey = "grouped_stainings";

	try {
		const cached = await redisClient.get(cacheKey);
		if (cached) return res.status(200).json(JSON.parse(cached));

		const stainingGroups = JSON.parse(fs.readFileSync("./utils/stainingGroups.json", "utf8"));

		// Fetch all distinct stainings from the database
		const distinctStainings = await Entry.distinct("histologicalInformation.stainingMethod");

		// Group stainings based on the stainingGroups.json
		const groupedStainings = {};
		for (const [group, stains] of Object.entries(stainingGroups)) {
			groupedStainings[group] = stains.filter((stain) => distinctStainings.includes(stain));
		}

		await redisClient.setEx(cacheKey, 7200, JSON.stringify(groupedStainings)); // Cache for 2 hours

		res.status(200).json(groupedStainings);
	} catch (err) {
		res.status(500).json(err);
	}
};

const getDistinctBrainParts = async (req, res) => {
	const cacheKey = "distinct_brain_parts";

	try {
		const cached = await redisClient.get(cacheKey);
		if (cached) return res.status(200).json(JSON.parse(cached));

		const brainParts = await Entry.distinct("histologicalInformation.brainPart");
		await redisClient.setEx(cacheKey, 7200, JSON.stringify(brainParts)); // Cache for 2 hours

		res.status(200).json(brainParts);
	} catch (err) {
		res.status(500).json(err);
	}
};

const getTaxonomyIDs = (commonName, scientificName) => {
	// print current working directory
	const taxonomyData = JSON.parse(fs.readFileSync("./utils/combined_taxonomy_reports.json", "utf8"));
	let matchingTaxonomies = [];

	if (scientificName) {
		matchingTaxonomies = taxonomyData.filter((item) =>
			new RegExp(scientificName, "i").test(item.taxonomy.currentScientificName.name)
		);
	} else if (commonName) {
		matchingTaxonomies = taxonomyData.filter((item) =>
			new RegExp(commonName, "i").test(item.taxonomy.curatorCommonName)
		);
	}

	return matchingTaxonomies.map((item) => item.taxonomy.taxId);
};

const advancedSearch = async (req, res) => {
	try {
		const {
			searchQuery,
			brainWeightRange,
			bodyWeightRange,
			allowNAWeight,
			developmentalStage,
			sex,
			speciesName,
			taxonomyCode,
			selectedOrder,
			selectedCollections,
			selectedStaining,
			selectedBrainParts,
			page = 1,
			limit = 10,
		} = req.query;

		console.log("Advanced search query:", req.query);

		const selectedCollectionsList = selectedCollections ? selectedCollections.split(",") : [];

		const query = {};

		if (searchQuery) {
			const searchTerms = searchQuery.split(",").map((term) => term.trim());
			searchTerms.forEach((term) => {
				const [key, value] = term.split(":").map((item) => item.trim());

				if (["scientific_name", "name", "species"].includes(key)) {
					const taxonomy_ids = getTaxonomyIDs(null, value);
					query["identification.NCBITaxonomyCode"] = { $in: taxonomy_ids };
				} else if (["common_name"].includes(key)) {
					const taxonomy_ids = getTaxonomyIDs(value, null);
					query["identification.NCBITaxonomyCode"] = { $in: taxonomy_ids };
				} else if (["taxonomy_id", "taxon_id", "taxon"].includes(key)) {
					query["identification.NCBITaxonomyCode"] = value;
				} else if (["archival_name"].includes(key)) {
					query["identification.bionomialSpeciesName"] = { $regex: value, $options: "i" };
				} else if (["staining", "stain", "staining_method"].includes(key)) {
					query["histologicalInformation.stainingMethod"] = { $regex: value, $options: "i" };
				} else if (["specimen_id", "specimen_number"].includes(key)) {
					query["archivalIdentification.archivalSpeciesCode"] = { $regex: value, $options: "i" };
				}
			});
		}

		if (brainWeightRange && brainWeightRange !== "" && allowNAWeight !== "true") {
			const [minBrainWeight, maxBrainWeight] = brainWeightRange.split(",").map(Number);
			query["$or"] = [
				{ "physiologicalInformation.brainWeight": { $gte: minBrainWeight, $lte: maxBrainWeight } },
				...(minBrainWeight === 0 ? [{ "physiologicalInformation.brainWeight": null }] : []),
			];
		}

		if (bodyWeightRange && bodyWeightRange !== "" && allowNAWeight !== "true") {
			const [minBodyWeight, maxBodyWeight] = bodyWeightRange.split(",").map(Number);
			query["$or"] = [
				{ "physiologicalInformation.bodyWeight": { $gte: minBodyWeight, $lte: maxBodyWeight } },
				...(minBodyWeight === 0 ? [{ "physiologicalInformation.bodyWeight": null }] : []),
			];
		}

		if (developmentalStage && developmentalStage !== "") {
			query["physiologicalInformation.age.developmentalStage"] = developmentalStage;
		}

		if (sex && sex !== "") {
			const sexMap = { male: "m", female: "f", undefined: "u" };
			query["physiologicalInformation.sex"] = sexMap[sex.toLowerCase()] || sex;
		}

		if (speciesName && speciesName !== "") {
			query["identification.bionomialSpeciesName"] = { $regex: speciesName, $options: "i" };
		}

		if (taxonomyCode && taxonomyCode !== "") {
			query["identification.NCBITaxonomyCode"] = taxonomyCode;
		}

		if (selectedOrder && selectedOrder !== "") {
			query["identification.order"] = selectedOrder;
		}

		if (selectedStaining && selectedStaining !== "") {
			const stainingList = selectedStaining.split(",").map((stain) => stain.trim());
			query["histologicalInformation.stainingMethod"] = { $in: stainingList };
		}

		if (selectedBrainParts && selectedBrainParts !== "") {
			const brainPartsList = selectedBrainParts.split(",").map((part) => part.trim());
			query["histologicalInformation.brainPart"] = {
				$in: brainPartsList.map((part) => new RegExp(`^${part}`, "i")),
			};
		}

		if (selectedCollectionsList && selectedCollectionsList.length > 0) {
			query["collectionID"] = { $in: selectedCollectionsList };
		} else {
			query["collectionID"] = {
				$in: await Collection.find({ publicStatus: "approved", backupCollection: { $ne: true } }).select("_id"),
			};
		}

		query["backupEntry"] = { $ne: true };

		console.log("FINAL QUERY", query);

		const skip = (page - 1) * limit;

		const entries = await Entry.find(query).skip(skip).limit(parseInt(limit));

		const queryHash = generateFilterHash(query);

		// Check cache for totalEntries
		let totalEntries;
		if (totalEntriesCache[queryHash]) {
			totalEntries = totalEntriesCache[queryHash];
		} else {
			totalEntries = await Entry.countDocuments(query);
			totalEntriesCache[queryHash] = totalEntries; // Cache it
		}

		res.json({
			entries,
			totalEntries,
			totalPages: Math.ceil(totalEntries / limit),
			currentPage: parseInt(page),
		});
	} catch (error) {
		console.error("Error fetching search results:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

module.exports = {
	createEntry,
	updateEntry,
	deleteEntry,
	getEntry,
	getEntriesByCollectionId,
	processCSVEntries,
	deleteMultipleEntries,
	getOrderFromTaxonomy,
	getOrder,
	getDistinctOrders,
	advancedSearch,
	getDistinctStainings,
	getDistinctBrainParts,
};

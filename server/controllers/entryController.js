const Entry = require("../models/Entry");
const Collection = require("../models/Collection");
const taxonomyService = require("../services/taxonomyService");
const fs = require("fs");
const csvParser = require("csv-parser");
const validateRowAgainstSchema = require("../utils/entryValidator");
const crypto = require("crypto");
const redisClient = require("../utils/redisClient");

function generateRandomAlphaNumeric(name) {
	result = Math.random().toString(16).slice(2, 6);
	return result;
}

// Function to generate hash for filters
const generateFilterHash = (filters) => {
	return crypto.createHash("sha256").update(JSON.stringify(filters)).digest("hex");
};

/**
 * Unified taxonomy data processing function
 * This function handles all taxonomy-related operations in one place
 */
const processTaxonomyData = async (speciesName, existingNCBICode = null) => {
	try {
		let ncbiTaxonomyCode = existingNCBICode;
		let scientificName = speciesName;
		let order = null;

		// Step 1: If no NCBI code provided, get it from species name
		if (!ncbiTaxonomyCode && speciesName) {
			console.log(`🔍 Looking up taxonomy ID for: "${speciesName}"`);
			const taxonomyResult = await taxonomyService.getTaxonomyIDs(null, speciesName);
			if (taxonomyResult && taxonomyResult.taxId) {
				ncbiTaxonomyCode = taxonomyResult.taxId;
				console.log(`✅ Found taxonomy ID: ${ncbiTaxonomyCode}`);
			} else {
				console.log(`❌ No taxonomy ID found for: "${speciesName}"`);
			}
		}

		// Step 2: If we have NCBI code, get complete taxonomy data
		if (ncbiTaxonomyCode) {
			console.log(`📋 Fetching taxonomy data for ID: ${ncbiTaxonomyCode}`);

			// Get order from our taxonomy service
			order = await taxonomyService.getOrderByTaxId(ncbiTaxonomyCode);

			// Get scientific name from our taxonomy service (it fetches from NCBI efetch)
			const taxonomyData = await taxonomyService.fetchTaxonomyDataByTaxId(ncbiTaxonomyCode);
			if (taxonomyData && taxonomyData.scientificName) {
				scientificName = taxonomyData.scientificName;
				console.log(`✅ Scientific name: ${scientificName}, Order: ${order}`);
			}
		}

		return {
			ncbiTaxonomyCode,
			scientificName,
			order,
		};
	} catch (error) {
		console.error("❌ Error in processTaxonomyData:", error.message);
		return {
			ncbiTaxonomyCode: existingNCBICode,
			scientificName: speciesName,
			order: null,
		};
	}
};

const createEntry = async (req, res) => {
	const newEntry = new Entry(req.body);
	try {
		// Get species name from archival identification
		const inputSpeciesName =
			newEntry.archivalIdentification?.archivalSpeciesName || newEntry.identification?.bionomialSpeciesName;

		// Process taxonomy data
		const taxonomyData = await processTaxonomyData(inputSpeciesName, newEntry.identification?.NCBITaxonomyCode);

		// Update entry with processed taxonomy data
		if (taxonomyData.ncbiTaxonomyCode) {
			newEntry.identification.NCBITaxonomyCode = taxonomyData.ncbiTaxonomyCode;
		}
		if (taxonomyData.order) {
			newEntry.identification.order = taxonomyData.order;
		}
		if (taxonomyData.scientificName) {
			newEntry.identification.bionomialSpeciesName = taxonomyData.scientificName;
			newEntry.identification.wikipediaSpeciesName = `https://en.wikipedia.org/wiki/${taxonomyData.scientificName}`;
		}

		// Generate codes
		const finalSpeciesName = taxonomyData.scientificName || inputSpeciesName;
		newEntry.identification.itemCode = `${finalSpeciesName}_${newEntry.histologicalInformation.brainPart}_${
			newEntry.histologicalInformation.stainingMethod
		}_${generateRandomAlphaNumeric(finalSpeciesName)}`;
		newEntry.identification.individualCode = `${finalSpeciesName}_${generateRandomAlphaNumeric(finalSpeciesName)}`;

		const savedEntry = await newEntry.save();
		invalidateCache(savedEntry.collectionID);

		res.status(200).json(savedEntry);
	} catch (err) {
		console.error("❌ Error creating entry:", err);
		res.status(500).json(err);
	}
};

const updateEntry = async (req, res) => {
	const newEntry = req.body;

	try {
		// Get species name for taxonomy processing
		const inputSpeciesName =
			newEntry.archivalIdentification?.archivalSpeciesName || newEntry.identification?.bionomialSpeciesName;

		// Process taxonomy data
		const taxonomyData = await processTaxonomyData(inputSpeciesName, newEntry.identification?.NCBITaxonomyCode);

		// Update entry with processed taxonomy data
		if (taxonomyData.ncbiTaxonomyCode) {
			newEntry.identification.NCBITaxonomyCode = taxonomyData.ncbiTaxonomyCode;
		}
		if (taxonomyData.order) {
			newEntry.identification.order = taxonomyData.order;
		}
		if (taxonomyData.scientificName) {
			newEntry.identification.bionomialSpeciesName = taxonomyData.scientificName;
			newEntry.identification.wikipediaSpeciesName = `https://en.wikipedia.org/wiki/${taxonomyData.scientificName}`;
		}

		const updatedEntry = await Entry.findByIdAndUpdate(req.params.id, { $set: newEntry }, { new: true });

		invalidateCache(updatedEntry.collectionID);
		res.status(200).json(updatedEntry);
	} catch (err) {
		console.error("❌ Error updating entry:", err);
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

		invalidateCache(updatedEntry.collectionID);
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

		invalidateCache(req.params.collectionID);
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
		const { page = 1, limit = 10, sortField, sortOrder = "asc" } = req.query;
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
			totalEntriesCache[collectionID] = totalEntries;
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
	const csvRows = [];

	// First, collect all CSV rows
	fs.createReadStream(req.file.path)
		.pipe(csvParser())
		.on("data", (data) => {
			csvRows.push(data);
		})
		.on("end", async () => {
			try {
				console.log(`📊 Processing ${csvRows.length} CSV rows...`);

				// Process each row with taxonomy data fetching
				for (let i = 0; i < csvRows.length; i++) {
					const data = csvRows[i];
					let updatedCollection = {};

					try {
						console.log(`\n🔄 Processing row ${i + 1}/${csvRows.length}: ${data.bionomialSpeciesName}`);

						// Process taxonomy data using our unified function
						const taxonomyData = await processTaxonomyData(
							data.bionomialSpeciesName,
							data.NCBITaxonomyCode
						);

						const scientificName = taxonomyData.scientificName;
						const ncbiTaxonomyCode = taxonomyData.ncbiTaxonomyCode;
						const order = taxonomyData.order;

						// Generate codes
						const itemCode = `${scientificName}_${data.stainingMethod}_${generateRandomAlphaNumeric(
							scientificName
						)}`;
						const individualCode = `${scientificName}_${generateRandomAlphaNumeric(scientificName)}`;
						const wikipediaSpeciesName = `https://en.wikipedia.org/wiki/${scientificName}`;

						// Build the entry
						updatedCollection.collectionID = collectionID;
						updatedCollection.identification = {
							bionomialSpeciesName: scientificName,
							itemCode,
							individualCode,
							NCBITaxonomyCode: ncbiTaxonomyCode,
							wikipediaSpeciesName,
							order,
							microdraw_link: data.microdraw_link || null,
							source_link: data.source_link || null,
							thumbnail: data.thumbnail || null,
						};

						updatedCollection.archivalIdentification = {
							archivalSpeciesCode: data.archivalCode || null,
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
							results.push(updatedCollection);
							console.log(`✅ Row ${i + 1} processed successfully`);
						} else {
							console.log(`❌ Row ${i + 1} validation failed:`, rowErrors);
							failedRows.push({
								rowNumber: i + 1,
								originalRow: data,
								updatedCollection,
								errors: rowErrors,
							});
						}
					} catch (processingError) {
						console.error(`❌ Error processing row ${i + 1}:`, processingError);
						failedRows.push({
							rowNumber: i + 1,
							originalRow: data,
							updatedCollection: null,
							errors: [`Processing error: ${processingError.message}`],
						});
					}
				}

				// Insert successful entries into database
				if (results.length > 0) {
					console.log(`💾 Inserting ${results.length} successful entries into database...`);
					await Entry.insertMany(results);
					invalidateCache(collectionID);
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

				console.log(`\n📋 CSV Processing Complete:`);
				console.log(`✅ Successful: ${results.length}`);
				console.log(`❌ Failed: ${failedRows.length}`);

				if (failedRows.length > 0) {
					res.status(207).json(response);
				} else {
					res.status(200).json(response);
				}
			} catch (error) {
				console.error("❌ Error processing CSV entries:", error);
				res.status(500).json({
					status: "error",
					message: "Error processing CSV data",
					details: error.message,
				});
			} finally {
				// Clean up the uploaded file
				fs.unlinkSync(req.file.path);
			}
		})
		.on("error", (error) => {
			console.error("❌ Error reading CSV file:", error);
			res.status(500).json({
				status: "error",
				message: "Error reading CSV file",
				details: error.message,
			});
		});
};

const getOrderFromTaxonomy = (req, res) => {
	const { taxonomyId } = req.params;

	fs.readFile("./utils/combined_taxonomy_reports.json", "utf8", (err, data) => {
		if (err) {
			return res.status(500).json({ error: "Error reading taxonomy data" });
		}

		const taxonomyData = JSON.parse(data);
		const taxonomyItem = taxonomyData.find((item) => item.taxonomy.taxId === parseInt(taxonomyId));

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

// Legacy function - kept for backward compatibility
const getOrder = (taxonomy_id) => {
	try {
		const data = fs.readFileSync("./utils/combined_taxonomy_reports.json", "utf8");
		const taxonomyData = JSON.parse(data);
		const taxonomyItem = taxonomyData.find((item) => item.taxonomy.taxId === parseInt(taxonomy_id));

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
		const distinctStainings = await Entry.distinct("histologicalInformation.stainingMethod");

		const groupedStainings = {};
		for (const [group, stains] of Object.entries(stainingGroups)) {
			groupedStainings[group] = stains.filter((stain) => distinctStainings.includes(stain));
		}

		await redisClient.setEx(cacheKey, 7200, JSON.stringify(groupedStainings));
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
		await redisClient.setEx(cacheKey, 7200, JSON.stringify(brainParts));

		res.status(200).json(brainParts);
	} catch (err) {
		res.status(500).json(err);
	}
};

// Wrapper function for backward compatibility
const getTaxonomyIDs = async (commonName, scientificName) => {
	return await taxonomyService.getTaxonomyIDs(commonName, scientificName);
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
			for (const term of searchTerms) {
				const [key, value] = term.split(":").map((item) => item.trim());

				if (["scientific_name", "name", "species"].includes(key)) {
					const taxonomyResult = await getTaxonomyIDs(null, value);
					if (taxonomyResult && taxonomyResult.taxId) {
						query["identification.NCBITaxonomyCode"] = taxonomyResult.taxId;
					}
				} else if (["common_name"].includes(key)) {
					const taxonomyResult = await getTaxonomyIDs(value, null);
					if (taxonomyResult && taxonomyResult.taxId) {
						query["identification.NCBITaxonomyCode"] = taxonomyResult.taxId;
					}
				} else if (["taxonomy_id", "taxon_id", "taxon"].includes(key)) {
					query["identification.NCBITaxonomyCode"] = value;
				} else if (["archival_name"].includes(key)) {
					query["identification.bionomialSpeciesName"] = { $regex: value, $options: "i" };
				} else if (["staining", "stain", "staining_method"].includes(key)) {
					query["histologicalInformation.stainingMethod"] = { $regex: value, $options: "i" };
				} else if (["specimen_id", "specimen_number"].includes(key)) {
					query["archivalIdentification.archivalSpeciesCode"] = { $regex: value, $options: "i" };
				}
			}
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
				$in: await Collection.find({ visibility: "public", backupCollection: { $ne: true } }).select("_id"),
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
			totalEntriesCache[queryHash] = totalEntries;
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
	getTaxonomyIDs,
	processTaxonomyData, // Export the new unified function
};

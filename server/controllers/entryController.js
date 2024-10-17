const Entry = require("../models/Entry");
const fs = require("fs");
const csvParser = require("csv-parser");

const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

function generateRandomAlphaNumeric(name) {
	result = Math.random().toString(16).slice(2, 6);
	return result;
}

const createEntry = async (req, res) => {
	const newEntry = new Entry(req.body);
	try {
		//logic for generating alphaNumeric fields
		let binomialName = "";

		if (newEntry.identification.NCBITaxonomyCode) {
			const id = newEntry.identification.NCBITaxonomyCode;

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
			console.log("DATA", data[0].children[0].scientific_name);
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

		const savedEntry = await newEntry.save();
		res.status(200).json(savedEntry);
	} catch (err) {
		res.status(500).json(err);
	}
};

const updateEntry = async (req, res) => {
	const newEntry = req.body;
	console.log("NEW ENTRY", newEntry.identification.NCBITaxonomyCode);

	try {
		let binomialName = "";

		if (newEntry.identification.NCBITaxonomyCode) {
			const id = newEntry.identification.NCBITaxonomyCode;

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

		console.log("UDPATED NEW ENTRY", newEntry);

		const updatedEntry = await Entry.findByIdAndUpdate(
			req.params.id,
			{
				$set: newEntry,
			},
			{ new: true }
		);
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

// get entry by collection id
const getEntriesByCollectionId = async (req, res) => {
	try {
		const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10
		const skip = (page - 1) * limit;
		const entries = await Entry.find({ collectionID: req.params.id, backupEntry: { $ne: true } })
			.skip(skip)
			.limit(parseInt(limit))
			.exec();

		// Count total entries for pagination purposes
		const totalEntries = await Entry.countDocuments({ collectionID: req.params.id, backupEntry: { $ne: true } });

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

const processCSVEntries = async (req, res) => {
	const { id: collectionID } = req.params;

	if (!req.file) {
		return res.status(400).json({ error: "No file uploaded" });
	}

	const results = [];

	fs.createReadStream(req.file.path)
		.pipe(csvParser()) // Ensure headers are read correctly
		.on("data", async (data) => {
			// Extract and validate each field
			const {
				bionomialSpeciesName,
				stainingMethod,
				bodyWeight,
				brainWeight,
				developmentalStage,
				sex,
				ageNumber,
				ageUnit,
				origin,
				sectionThickness,
				planeOfSectioning,
				interSectionDistance,
				brainPart,
				comments,
				NCBITaxonomyCode,
			} = data;

			if (bionomialSpeciesName && stainingMethod && developmentalStage && sex) {
				let scientificName = bionomialSpeciesName;

				const itemCode = `${scientificName}_${stainingMethod}_${generateRandomAlphaNumeric(scientificName)}`;
				const individualCode = `${scientificName}_${generateRandomAlphaNumeric(scientificName)}`;

				results.push({
					collectionID,
					identification: {
						bionomialSpeciesName: scientificName,
						itemCode,
						individualCode,
						NCBITaxonomyCode: NCBITaxonomyCode || null,
						wikipediaSpeciesName: `https://en.wikipedia.org/wiki/${scientificName}`,
					},
					physiologicalInformation: {
						age: {
							developmentalStage,
							number: ageNumber ? parseFloat(ageNumber) : null,
							unitOfNumber: ageUnit || null,
							origin: origin || "postNatal",
						},
						bodyWeight: bodyWeight ? parseFloat(bodyWeight) : null,
						brainWeight: brainWeight ? parseFloat(brainWeight) : null,
						sex,
					},
					histologicalInformation: {
						stainingMethod,
						sectionThickness: sectionThickness || null,
						planeOfSectioning: planeOfSectioning || null,
						interSectionDistance: interSectionDistance || null,
						brainPart: brainPart || null,
						comments: comments || null,
					},
				});
			} else {
				console.log("Skipping invalid row:", data); // Log any invalid rows
			}
		})
		.on("end", async () => {
			try {
				if (results.length > 0) {
					// Insert entries into the database
					await Entry.insertMany(results);
					res.status(200).json({ message: "CSV entries processed successfully" });
				} else {
					res.status(400).json({ error: "No valid entries found in CSV" });
				}
			} catch (error) {
				console.error("Error inserting CSV data:", error);
				res.status(500).json({ error: "Error processing CSV data" });
			} finally {
				// Clean up the uploaded file
				fs.unlinkSync(req.file.path);
			}
		})
		.on("error", (error) => {
			console.error("Error reading CSV file:", error);
			res.status(500).json({ error: "Error reading CSV file" });
		});
};

module.exports = {
	createEntry,
	updateEntry,
	deleteEntry,
	getEntry,
	getEntriesByCollectionId,
	processCSVEntries,
	deleteMultipleEntries,
};

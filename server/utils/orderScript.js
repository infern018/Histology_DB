const mongoose = require("mongoose");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const Entry = require("../models/Entry");

const MONGO_URL =
	"mongodb+srv://histmetadata:Heidenhain@histology-metadata.gtdly.mongodb.net/?retryWrites=true&w=majority";
const API_KEY = "c97db3d9ed989c074b2e7faf503128d33108"; // Replace with your actual API key

// Connect to MongoDB
mongoose
	.connect(MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => console.log(err));

// Fetch entries and update order field
const updateEntriesWithOrder = async () => {
	try {
		// Find all entries with an NCBITaxonomyCode
		const rawEntries = await Entry.find({
			"identification.NCBITaxonomyCode": { $exists: true, $ne: null },
		});

		// Get distinct entries by NCBITaxonomyCode
		const distinctEntries = rawEntries
			.filter(
				(entry, index, self) =>
					index ===
					self.findIndex((t) => t.identification.NCBITaxonomyCode === entry.identification.NCBITaxonomyCode)
			)
			.filter((entry) => {
				const taxonomyCode = entry.identification.NCBITaxonomyCode;
				return taxonomyCode && taxonomyCode !== "" && taxonomyCode !== "null" && !entry.identification.order;
			});

		const totalEntries = distinctEntries.length;

		let processedEntries = 0;

		for (const entry of distinctEntries) {
			const taxonomyCode = entry.identification.NCBITaxonomyCode;

			// if taxnomyCode is null, skip
			if (!taxonomyCode || taxonomyCode === "" || taxonomyCode === "null") {
				continue;
			}

			if (entry.identification.order) {
				continue;
			}

			const url = `https://api.ncbi.nlm.nih.gov/datasets/v2/taxonomy/taxon/${taxonomyCode}/download`;
			const headers = {
				accept: "application/zip",
				"api-key": API_KEY,
			};

			try {
				const response = await axios.get(url, {
					headers: headers,
					responseType: "arraybuffer",
				});

				const zipFilePath = path.join(__dirname, `../ncbi_reports/ncbi_dataset_${taxonomyCode}.zip`);
				fs.writeFileSync(zipFilePath, response.data);
			} catch (apiErr) {
				console.error(`API error for taxonomy code ${taxonomyCode}:`, apiErr.message);
				console.log("Full response data:", apiErr.response?.data);
			}

			processedEntries++;
			console.log(`Processed ${processedEntries} of ${totalEntries} entries [${taxonomyCode}.zip]`);
		}
	} catch (err) {
		console.error("Error fetching entries:", err);
	} finally {
		// Close the MongoDB connection
		mongoose.connection.close();
	}
};

// Run the update function
updateEntriesWithOrder();

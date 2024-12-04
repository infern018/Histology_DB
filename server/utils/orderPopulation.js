const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Entry = require("../models/Entry");

// MongoDB connection URI (update with your MongoDB connection string)
const MONGO_URL = "mongodb://localhost:27017/";

mongoose
	.connect(MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => {
		console.log("MongoDB connection error:", err);
		process.exit(1);
	});

const updateEntriesWithOrder = async () => {
	try {
		// Fetch all entries
		const rawEntries = await Entry.find({});

		// Read the JSON file with taxonomy reports
		const combinedTaxonomyReports = JSON.parse(
			fs.readFileSync(
				"/Users/vishwaas.singh/Documents/Personal/Projects/Histology_DB/server/utils/combined_taxonomy_reports.json",
				"utf-8"
			)
		);

		let orderNotFoundTaxIds = [];

		console.log("Combined Taxonomy Reports: ", combinedTaxonomyReports[0].taxonomy.classification);

		// Loop through each entry and find matching taxonomy report
		for (const entry of rawEntries) {
			// Find taxonomy report based on taxId
			const taxonomyReport = combinedTaxonomyReports.find(
				(report) => report.taxonomy.taxId === entry.identification.NCBITaxonomyCode
			);

			// If a matching report is found, update the order field
			if (taxonomyReport) {
				if (taxonomyReport.taxonomy.classification.order) {
					entry.identification.order = taxonomyReport.taxonomy.classification.order.name;
					await entry.save();
					// console.log(`Updated order for Entry ID: ${entry._id}`);
				} else {
					console.log(`No order found for taxonomy code: ${entry.identification.NCBITaxonomyCode}`);
					orderNotFoundTaxIds.push(entry.identification.NCBITaxonomyCode);
					console.log(`Taxonomy Classification: ${taxonomyReport.taxonomy.classification}`);
				}
			}
		}

		// for all those entries where order is not updated, make it as Unkown
		const entriesWithUnknownOrder = rawEntries.filter((entry) => !entry.identification.order);
		for (const entry of entriesWithUnknownOrder) {
			entry.identification.order = "Unknown";
			await entry.save({ validateModifiedOnly: true });
			// console.log(`Updated order for Entry ID: ${entry._id} to Unknown`);
		}

		// distinct orderNotFoundTaxIds
		orderNotFoundTaxIds = [...new Set(orderNotFoundTaxIds)];

		console.log("Entries with no order found: ", orderNotFoundTaxIds);

		console.log("Entries updated with order field successfully");
	} catch (err) {
		console.error("Error updating entries:", err);
	} finally {
		// Close the MongoDB connection
		mongoose.connection.close();
	}
};

// Run the update function
updateEntriesWithOrder();

const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Entry = require("../models/Entry");

const MONGO_URL =
	"mongodb+srv://histmetadata:Heidenhain@histology-metadata.gtdly.mongodb.net/?retryWrites=true&w=majority";

mongoose
	.connect(MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("✅ Connected to MongoDB"))
	.catch((err) => {
		console.error("❌ MongoDB connection error:", err);
		process.exit(1);
	});

const updateEntriesWithOrder = async () => {
	try {
		// Fetch all entries
		const allEntries = await Entry.find({});
		console.log(`📌 Total entries in DB: ${allEntries.length}`);

		// Filter entries that do NOT have the 'order' field
		const entriesToUpdate = allEntries.filter(
			(entry) => !entry.identification.order || entry.identification.order === "Unknown"
		);
		console.log(`🔍 Entries missing 'order': ${entriesToUpdate.length}`);

		// Read taxonomy reports
		const taxonomyReports = JSON.parse(
			fs.readFileSync(
				"/Users/vishwaas.singh/Documents/Personal/Projects/Histology_DB/server/utils/combined_taxonomy_reports.json",
				"utf-8"
			)
		);
		console.log(`📂 Loaded ${taxonomyReports.length} taxonomy reports`);

		let updatedCount = 0;
		let orderNotFoundTaxIds = [];
		let missingTaxReportIds = [];

		// Process each entry that needs updating
		for (const entry of entriesToUpdate) {
			const taxId = entry.identification.NCBITaxonomyCode;
			const taxonomyReport = taxonomyReports.find((report) => report.taxonomy.taxId === taxId);

			if (taxonomyReport) {
				const classification = taxonomyReport.taxonomy.classification;

				if (classification?.order?.name) {
					entry.identification.order = classification.order.name;
					await entry.save();
					console.log(`🔄 Updated entry: ${entry._id}`);
					updatedCount++;
				} else {
					orderNotFoundTaxIds.push(taxId);
					console.warn(`⚠️ No 'order' found for taxonomy code: ${taxId}`);
					console.warn(`🧐 Taxonomy classification: ${JSON.stringify(classification, null, 2)}`);
				}
			} else {
				console.warn(`⚠️ No taxonomy report found for taxId: ${taxId}`);
				missingTaxReportIds.push(taxId);
			}
		}

		// Remove duplicates from missing order list
		orderNotFoundTaxIds = [...new Set(orderNotFoundTaxIds)];

		console.log(`✅ Successfully updated ${updatedCount}/${entriesToUpdate.length} entries`);
		if (orderNotFoundTaxIds.length > 0) {
			console.warn(`⚠️ Entries with no order found: ${orderNotFoundTaxIds.length}`);
			console.warn(`📝 Missing order for taxIds: ${orderNotFoundTaxIds.join(", ")}`);
		}
		console.log(`✅ Missing taxonomy reports for taxIds: ${missingTaxReportIds.length}`);
	} catch (err) {
		console.error("❌ Error updating entries:", err);
	} finally {
		// Close the MongoDB connection
		mongoose.connection.close();
		console.log("🔌 MongoDB connection closed");
	}
};

// Run the update function
updateEntriesWithOrder();

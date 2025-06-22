require("dotenv").config();
const mongoose = require("mongoose");
const taxonomyService = require("../services/taxonomyService");
const taxonomyCronJob = require("../jobs/taxonomyCronJob");

const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/";

async function runMigration() {
	try {
		// Connect to MongoDB
		await mongoose.connect(MONGO_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("✅ Connected to MongoDB");

		console.log("🚀 Starting taxonomy data migration...");

		// 1. Migrate existing JSON data to MongoDB
		await taxonomyService.migrateJsonToMongoDB();

		// 2. Run a test of the background processing
		console.log("🧪 Testing background processing...");
		await taxonomyService.processBackgroundQueue(5);

		// 3. Run the cron job manually once
		console.log("🕐 Testing cron job functionality...");
		await taxonomyCronJob.runManual();

		console.log("✅ Migration and testing completed successfully!");
		console.log("\n📊 Summary:");
		console.log("- JSON data migrated to MongoDB TaxonomyCache collection");
		console.log("- Background processing tested");
		console.log("- Cron job functionality verified");
		console.log("- System is now ready for automated order population");

		console.log("\n🎯 Next steps:");
		console.log("1. Restart your server to start the cron job");
		console.log("2. Orders will be populated automatically during entry creation");
		console.log("3. Background processing will fill missing orders periodically");
		console.log("4. No more manual intervention needed!");
	} catch (error) {
		console.error("❌ Migration failed:", error);
	} finally {
		// Close the MongoDB connection
		await mongoose.connection.close();
		console.log("Connection closed");
	}
}

// Run the migration if this script is executed directly
if (require.main === module) {
	runMigration();
}

module.exports = runMigration;

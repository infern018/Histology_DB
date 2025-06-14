const mongoose = require("mongoose");
const Collection = require("../models/Collection");
const User = require("../models/User");

async function createOptimalIndexes() {
	try {
		console.log("Creating optimal indexes for getUserCollections performance...");

		// Index for Collection queries
		await Collection.collection.createIndex(
			{
				ownerID: 1,
				backupCollection: 1,
			},
			{
				name: "ownerID_backupCollection_idx",
				background: true,
			}
		);

		// Index for collaborated collections lookup
		await Collection.collection.createIndex(
			{
				_id: 1,
				backupCollection: 1,
			},
			{
				name: "id_backupCollection_idx",
				background: true,
			}
		);

		// Index for User collaboratingCollections
		await User.collection.createIndex(
			{
				"collaboratingCollections.collection_id": 1,
			},
			{
				name: "collaboratingCollections_collection_id_idx",
				background: true,
			}
		);

		// Compound index for better performance on Collection name and _id selection
		await Collection.collection.createIndex(
			{
				ownerID: 1,
				backupCollection: 1,
				name: 1,
				_id: 1,
			},
			{
				name: "ownerID_backupCollection_name_id_idx",
				background: true,
			}
		);

		console.log("✅ All indexes created successfully!");
		console.log("These indexes will significantly improve getUserCollections performance.");
	} catch (error) {
		console.error("❌ Error creating indexes:", error);
	}
}

module.exports = { createOptimalIndexes };

// If run directly
if (require.main === module) {
	// You'll need to connect to your database first
	// mongoose.connect('your-mongodb-connection-string');
	// createOptimalIndexes().then(() => process.exit(0));
	console.log("To run this script, uncomment the connection lines and add your MongoDB connection string");
}

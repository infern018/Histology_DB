const cron = require("node-cron");
const taxonomyService = require("../services/taxonomyService");
const Entry = require("../models/Entry");

class TaxonomyCronJob {
	constructor() {
		this.isRunning = false;
	}

	/**
	 * Start the cron job
	 * Runs every hour to process pending taxonomy data
	 */
	start() {
		console.log("🚀 Starting Taxonomy Cron Job...");

		// Run every hour
		cron.schedule("0 * * * *", async () => {
			if (this.isRunning) {
				console.log("⏳ Taxonomy job already running, skipping...");
				return;
			}

			this.isRunning = true;
			await this.runTaxonomyJob();
			this.isRunning = false;
		});

		// Also run a lighter job every 15 minutes for high-priority entries
		cron.schedule("*/15 * * * *", async () => {
			if (!this.isRunning) {
				await this.runQuickProcessing();
			}
		});

		console.log("✅ Taxonomy Cron Job started successfully");
	}

	/**
	 * Main taxonomy processing job
	 */
	async runTaxonomyJob() {
		try {
			console.log("🔄 Running taxonomy background job...");

			// 1. Process background queue
			await taxonomyService.processBackgroundQueue(20);

			// 2. Find entries with missing orders and queue them
			await this.queueMissingOrders();

			console.log("✅ Taxonomy job completed successfully");
		} catch (error) {
			console.error("❌ Error in taxonomy cron job:", error);
		}
	}

	/**
	 * Quick processing for recent entries
	 */
	async runQuickProcessing() {
		try {
			// Process only 5 entries for quick turnaround
			await taxonomyService.processBackgroundQueue(5);
		} catch (error) {
			console.error("❌ Error in quick taxonomy processing:", error);
		}
	}

	/**
	 * Find entries without orders and queue them for processing
	 */
	async queueMissingOrders() {
		try {
			console.log("🔍 Looking for entries with missing orders...");

			// Find entries without orders
			const entriesWithoutOrder = await Entry.find({
				"identification.NCBITaxonomyCode": { $exists: true, $ne: null, $ne: "" },
				$or: [{ "identification.order": null }, { "identification.order": { $exists: false } }],
			}).limit(50); // Process in batches

			console.log(`Found ${entriesWithoutOrder.length} entries missing orders`);

			for (const entry of entriesWithoutOrder) {
				const taxId = entry.identification.NCBITaxonomyCode;
				if (taxId && taxId !== "null" && taxId !== "") {
					// This will queue it for background processing
					const order = await taxonomyService.getOrderByTaxId(taxId);
					if (order) {
						// Update the entry immediately if we got the order
						await Entry.findByIdAndUpdate(entry._id, {
							"identification.order": order,
						});
						console.log(`✅ Updated order for entry ${entry._id}: ${order}`);
					}
				}
			}
		} catch (error) {
			console.error("❌ Error queuing missing orders:", error);
		}
	}

	/**
	 * One-time migration function
	 */
	async runMigration() {
		console.log("🔄 Running one-time taxonomy migration...");
		await taxonomyService.migrateJsonToMongoDB();
		console.log("✅ Migration completed");
	}

	/**
	 * Manual trigger for processing
	 */
	async runManual() {
		if (this.isRunning) {
			console.log("⏳ Job already running...");
			return;
		}

		this.isRunning = true;
		await this.runTaxonomyJob();
		this.isRunning = false;
	}
}

module.exports = new TaxonomyCronJob();

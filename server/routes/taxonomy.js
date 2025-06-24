const express = require("express");
const taxonomyService = require("../services/taxonomyService");
const TaxonomyCache = require("../models/TaxonomyCache");

const router = express.Router();

// GET /api/taxonomy/status - Get taxonomy cache status
router.get("/status", async (req, res) => {
	try {
		const totalCached = await TaxonomyCache.countDocuments();
		const withOrders = await TaxonomyCache.countDocuments({ order: { $exists: true, $ne: null } });
		const pending = await TaxonomyCache.countDocuments({
			$or: [{ order: null }, { order: { $exists: false } }],
		});

		res.json({
			success: true,
			stats: {
				totalCached,
				withOrders,
				pending,
				completion: totalCached > 0 ? ((withOrders / totalCached) * 100).toFixed(2) + "%" : "0%",
			},
		});
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// POST /api/taxonomy/migrate - Run migration (admin only)
router.post("/migrate", async (req, res) => {
	try {
		await taxonomyService.migrateJsonToMongoDB();
		res.json({ success: true, message: "Migration completed successfully" });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// POST /api/taxonomy/process - Manually trigger background processing (admin only)
router.post("/process", async (req, res) => {
	try {
		const { limit = 10 } = req.body;
		await taxonomyService.processBackgroundQueue(limit);
		res.json({ success: true, message: `Processed up to ${limit} entries` });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// GET /api/taxonomy/cache/:taxId - Get cached data for specific taxonomy ID
router.get("/cache/:taxId", async (req, res) => {
	try {
		const { taxId } = req.params;
		const cached = await TaxonomyCache.findOne({ taxId });

		if (!cached) {
			return res.status(404).json({ success: false, message: "Taxonomy ID not found in cache" });
		}

		res.json({ success: true, data: cached });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// POST /api/taxonomy/order/:taxId - Get order for specific taxonomy ID (triggers caching if needed)
router.post("/order/:taxId", async (req, res) => {
	try {
		const { taxId } = req.params;
		const order = await taxonomyService.getOrderByTaxId(taxId);

		res.json({
			success: true,
			taxId,
			order: order || "Processing in background - check back later",
		});
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

module.exports = router;

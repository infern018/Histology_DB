const router = require("express").Router();
const Entry = require("../models/Entry");
const { verifyEntryEditAccess, verifyEntryReadAccess, verifyPublicEntry } = require("./verifyToken");

const entryController = require("../controllers/entryController");

router.get("/distinct-orders", entryController.getDistinctOrders);

router.get("/distinct-stainings", entryController.getDistinctStainings);

router.get("/distinct-brain-parts", entryController.getDistinctBrainParts);

router.get("/advanced-search", entryController.advancedSearch);

router.post("/", verifyEntryEditAccess, entryController.createEntry);

router.put("/:id", verifyEntryEditAccess, entryController.updateEntry);

router.delete("/:id", verifyEntryEditAccess, entryController.deleteEntry);

router.get("/:id", verifyEntryReadAccess, entryController.getEntry);

router.get("/public/:id", verifyPublicEntry, entryController.getEntry);

router.get("/:id/order/", entryController.getOrderFromTaxonomy);

//GET ALL ENTRIES
//name - regex
router.get("/", async (req, res) => {
	const qName = req.query.name;
	const { skip = 0, limit = 10 } = req.query;
	const sort = {};

	if (req.query.sortBy) {
		sort[req.query.sortBy] = req.query.orderBy === "desc" ? -1 : 1;
	}

	if (qName) {
		const regex = new RegExp(qName, "i"); // i for case insensitive
		req.query["archivalIdentification.archivalSpeciesName"] = { $regex: regex };
	}

	try {
		const entries = await Entry.find(req.query).limit(limit).skip(skip).sort(sort);

		res.status(200).json(entries);
	} catch (err) {
		res.status(500).json(err);
	}
});

router.get("/numPages", async (req, res) => {
	const qName = req.query.name;
	const { skip = 0, limit = 5000 } = req.query;
	const sort = {};

	if (req.query.sortBy) {
		sort[req.query.sortBy] = req.query.orderBy === "desc" ? -1 : 1;
	}

	if (qName) {
		const regex = new RegExp(qName, "i"); // i for case insensitive
		req.query["archivalIdentification.archivalSpeciesName"] = { $regex: regex };
	}

	try {
		const entries = await Entry.find(req.query);

		res.status(200).json(entries.length);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;

const router = require("express").Router();
const stainingMethodController = require("../controllers/stainingMethodController");

// Public routes (no authentication required for reading standardized methods)

// GET /api/staining-methods/standardized
// Returns all standardized staining methods grouped by category
router.get("/standardized", stainingMethodController.getStandardizedStainings);

// POST /api/staining-methods/suggest
// Get suggestions for a single staining method input
// Body: { input: "cresyl violet", threshold: 0.7 }
router.post("/suggest", stainingMethodController.getSuggestions);

// POST /api/staining-methods/batch-suggest
// Get suggestions for multiple staining methods (bulk)
// Body: { staining_methods: ["cresyl violet", "h&e", "unknown stain"] }
router.post("/batch-suggest", stainingMethodController.getBatchSuggestions);

// POST /api/staining-methods/increment-usage
// Update usage count when a staining method is used
// Body: { name: "Nissl Stain (Cresyl Violet, Thionin)" }
router.post("/increment-usage", stainingMethodController.incrementUsage);

// Admin routes (you might want to add authentication middleware here)

// POST /api/staining-methods/add
// Add a new standardized staining method
// Body: { name: "New Stain", category: "Category", aliases: ["alias1", "alias2"], description: "Description" }
router.post("/add", stainingMethodController.addStainingMethod);

module.exports = router;

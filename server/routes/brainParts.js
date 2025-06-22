const router = require("express").Router();
const brainPartController = require("../controllers/brainPartController");

// Public routes (no authentication required for reading standardized brain parts)

// GET /api/brain-parts/standardized
// Returns all standardized brain parts grouped by category
router.get("/standardized", brainPartController.getStandardizedBrainParts);

// POST /api/brain-parts/suggest
// Get suggestions for a single brain part input
// Body: { input: "frontal cortex", threshold: 0.7 }
router.post("/suggest", brainPartController.getSuggestions);

// POST /api/brain-parts/batch-suggest
// Get suggestions for multiple brain parts (bulk)
// Body: { brain_parts: ["frontal cortex", "le hem", "whole brain"] }
router.post("/batch-suggest", brainPartController.getBatchSuggestions);

// POST /api/brain-parts/increment-usage
// Update usage count when a brain part is used
// Body: { name: "Left Hemisphere" }
router.post("/increment-usage", brainPartController.incrementUsage);

// Admin routes (you might want to add authentication middleware here)

// POST /api/brain-parts/add
// Add a new standardized brain part
// Body: { name: "New Brain Part", category: "Category", aliases: ["alias1", "alias2"], description: "Description" }
router.post("/add", brainPartController.addBrainPart);

module.exports = router;

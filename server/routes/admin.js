const router = require("express").Router();
const { verifyTokenAndAdmin, verifyToken } = require("./verifyToken");
const adminController = require("../controllers/adminController");

// Admin routes - require admin privileges
router.get("/collections/review", verifyTokenAndAdmin, adminController.getCollectionsInReview);
router.post("/collections/:id/approve", verifyTokenAndAdmin, adminController.approvePublication);
router.post("/collections/:id/request-changes", verifyTokenAndAdmin, adminController.requestChanges);
router.post("/collections/:id/comment", verifyTokenAndAdmin, adminController.addAdminComment);
router.get("/collections/:id/validation", verifyTokenAndAdmin, adminController.getValidationReport);

// User routes - for requesting publication
router.post("/collections/:id/request-publication", verifyToken, adminController.requestPublication);

module.exports = router;

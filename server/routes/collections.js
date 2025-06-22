const router = require("express").Router();
const { verifyToken, verifyTokenAndAuthCollection, verifyPublicCollection } = require("./verifyToken");
const collectionController = require("../controllers/collectionController");
const collaboratorController = require("../controllers/collaboratorController");
const entryController = require("../controllers/entryController");
const { verifyCollectionReadAccess } = require("./verifyToken");

const multer = require("multer");

router.post("/", verifyToken, collectionController.createCollection);
router.put("/:id", verifyTokenAndAuthCollection, collectionController.updateCollection);
router.delete("/:id", verifyTokenAndAuthCollection, collectionController.deleteCollection);
// flush collection (delete all entries)
router.delete("/:id/flush", verifyTokenAndAuthCollection, collectionController.flushCollection);

router.get("/public", collectionController.getPublicCollections);
router.get("/user/status", verifyToken, collectionController.getUserCollectionsWithStatus);
router.get("/:id", verifyTokenAndAuthCollection, collectionController.getCollection);
router.get("/public/:id", verifyPublicCollection, collectionController.getCollection);
router.get("/:id/stats", collectionController.getCollectionNameAndNumCollaborators);

router.post("/:id/collaborators", verifyTokenAndAuthCollection, collaboratorController.createCollaborator);
router.put("/:id/collaborators", verifyTokenAndAuthCollection, collaboratorController.updateCollaborator);
router.delete("/:id/collaborators", verifyTokenAndAuthCollection, collaboratorController.deleteCollaborator);
router.delete("/:id/collaborators/flush", verifyTokenAndAuthCollection, collaboratorController.flushCollaborators);

// get entries of a collection
router.get("/:id/entries", verifyCollectionReadAccess, entryController.getEntriesByCollectionId);

// get entries of public collection
router.get("/:id/entries/public", entryController.getEntriesByCollectionId);

// upload csv entries
const upload = multer({ dest: "uploads/" });

router.post("/:id/entries/upload-csv", upload.single("file"), entryController.processCSVEntries);

// delete multiple entries
router.delete("/:id/entries", verifyTokenAndAuthCollection, entryController.deleteMultipleEntries);

module.exports = router;

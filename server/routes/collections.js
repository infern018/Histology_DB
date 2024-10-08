const router = require("express").Router()
const { verifyToken, verifyTokenAndAuthCollection } = require('./verifyToken');
const collectionController = require("../controllers/collectionController");
const collaboratorController = require("../controllers/collaboratorController");
const entryController = require("../controllers/entryController");
const { verifyCollectionReadAccess } = require('./verifyToken');

const multer = require('multer');


router.post("/", verifyToken, collectionController.createCollection)
router.put("/:id", verifyTokenAndAuthCollection, collectionController.updateCollection)
router.delete("/:id", verifyTokenAndAuthCollection, collectionController.deleteCollection)
router.get("/:id", verifyTokenAndAuthCollection, collectionController.getCollection)
router.get("/:id/stats", collectionController.getCollectionNameAndNumCollaborators)

router.post("/:id/collaborators", verifyTokenAndAuthCollection, collaboratorController.createCollaborator)
router.put("/:id/collaborators", verifyTokenAndAuthCollection, collaboratorController.updateCollaborator)
router.delete("/:id/collaborators", verifyTokenAndAuthCollection, collaboratorController.deleteCollaborator)
router.delete("/:id/collaborators/flush", verifyTokenAndAuthCollection, collaboratorController.flushCollaborators)

// get entries of a collection
router.get("/:id/entries", verifyCollectionReadAccess, entryController.getEntriesByCollectionId);

// upload csv entries
const upload = multer({ dest: 'uploads/' });

router.post('/:id/entries/upload-csv', upload.single('file'), entryController.processCSVEntries);

// delete multiple entries
router.delete("/:id/entries", verifyTokenAndAuthCollection, entryController.deleteMultipleEntries);

module.exports = router;

const router = require("express").Router()
const { verifyToken, verifyTokenAndAuthCollection } = require('./verifyToken');
const collectionController = require("../controllers/collectionController");
const collaboratorController = require("../controllers/collaboratorController");

router.post("/", verifyToken, collectionController.createCollection)
router.put("/:id", verifyTokenAndAuthCollection, collectionController.updateCollection)
router.delete("/:id", verifyTokenAndAuthCollection, collectionController.deleteCollection)
router.get("/:id", verifyTokenAndAuthCollection, collectionController.getCollection)
router.get("/:id/stats", collectionController.getCollectionNameAndNumCollaborators)

router.post("/:id/collaborators", verifyTokenAndAuthCollection, collaboratorController.createCollaborator)
router.put("/:id/collaborators", verifyTokenAndAuthCollection, collaboratorController.updateCollaborator)
router.delete("/:id/collaborators", verifyTokenAndAuthCollection, collaboratorController.deleteCollaborator)
router.delete("/:id/collaborators/flush", verifyTokenAndAuthCollection, collaboratorController.flushCollaborators)

module.exports = router;

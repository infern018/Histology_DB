const router = require("express").Router()
const Entry = require("../models/Entry");
const {verifyToken, verifyTokenAndAuth, verifyTokenAndAdmin, verifyTokenAndAuthCollection} = require('./verifyToken');
const Collection = require("../models/Collection");
const Role = require("../models/Role");

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const generateCollectionCode = (collectionName) => {
    collectionName = collectionName.replace(/\s/g, "");
    const collectionCode = "Collection_" + collectionName;
    return collectionCode
}

//CREATE A COLLECTION
router.post("/", verifyToken, async (req,res) => {
    const newCollection = new Collection(req.body);
    newCollection.ownerID = req.user.id

    try {
        const savedCollection  = await newCollection.save();
        res.status(200).json(savedCollection)
    } catch (err) {
        res.status(500).json(err);
    }
})

//UPDATE A COLLECTION
router.put("/:id", verifyTokenAndAuthCollection, async(req,res) => {
    const newCollection = req.body;

    if(req.body.name){
        newCollection.collectionCode = generateCollectionCode(req.body.name);
    }

    try {
        const updatedCollection = await Collection.findByIdAndUpdate(
            req.params.id,
            {
                $set:newCollection
            }, {new:true}
        )


        res.status(200).json(updatedCollection)
    } catch (err) {
        res.status(500).json(err);
    }
})

// DELETE COLLECTION
// mark backupCollection as false
router.delete("/:id", verifyTokenAndAuthCollection, async (req,res)=> {
    try{
        const updatedCollection = await Collection.findByIdAndUpdate(
            req.params.id,
            {
                $set:{
                    "backupCollection":true
                }
            },{new:true}
        )

        res.status(200).json(updatedCollection);
    } catch (err){
        res.status(500).json(err);
    }
})

//GET SINGLE COLLECTION
router.get("/:id", verifyTokenAndAuthCollection ,async (req,res)=> {
    try {
        const collection = await Collection.findById(req.params.id);
        if (!collection) {
            return res.status(404).json({ error: "Collection not found" });
        }

        res.status(200).json(collection);
    } catch (err) {
        res.status(500).json(err);
    }
})

//GET ALL COLLECTIONS
router.get("/", async (req,res)=> {
    try {
        
        const collections = await Collection.find(req.query);
        res.status(200).json(collections);
    } catch (err) {
        res.status(500).json(err);
    }
})

//Get collections owned by the user
router.get("/owned/:ownerID", verifyToken, async (req, res) => {
    try {
      const ownerID = req.params.ownerID;
      const collections = await Collection.find({ ownerID: ownerID ,backupCollection: false});
      res.status(200).json(collections);
    } catch (err) {
      res.status(500).json({ error: "Failed to retrieve owned collections" });
    }
});

// Get collections the user is collaborating on
router.get("/collaborating/:id", verifyTokenAndAuth, async (req, res) => {
    try {
      const userID = req.params.id;
      const collections = await Collection.find({
        "collaborators.user": userID,
      });
      res.status(200).json(collections);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Failed to retrieve collaborating collections" });
    }
  });

//add a collaborator
router.post("/:id/collaborators", verifyTokenAndAuthCollection, async (req, res) => {
    const { collaboratorID, mode } = req.body;
    const { id } = req.params;
  
    try {
      const collection = await Collection.findById(id);
  
      if (!collection) {
        return res.status(404).json({ error: "Collection not found" });
      }
  
      // Check if the collaborator is already added
      const existingCollaborator = collection.collaborators.find(
        (collaborator) => collaborator.user.toString() === collaboratorID
      );
  
      if (existingCollaborator) {
        return res.status(409).json({ error: "Collaborator already exists" });
      }
  
      collection.collaborators.push({ user: collaboratorID, mode });
  
      const updatedCollection = await collection.save();
  
      res.status(200).json(updatedCollection);
    } catch (err) {
      res.status(500).json({ error: "Failed to add collaborator" });
    }
  });

module.exports = router;
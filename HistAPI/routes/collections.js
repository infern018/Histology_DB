const router = require("express").Router()
const Entry = require("../models/Entry");
const {verifyToken, verifyTokenAndAuth, verifyTokenAndAdmin, verifyTokenAndAuthCollection} = require('./verifyToken');
// const fetch = require('node-fetch');
const HttpProxyAgent = require("http-proxy-agent");
const { findByIdAndUpdate } = require("../models/Entry");
const Collection = require("../models/Collection");

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const generateCollectionCode = (collectionName) => {
    collectionName = collectionName.replace(/\s/g, "");
    const collectionCode = "Collection_" + collectionName;
    return collectionCode
}

//CREATE A COLLECTION
//ID HERE REFERS TO USER ID (OWNER OF COLLECTION)
router.post("/:ownerID", verifyTokenAndAuthCollection, async (req,res) => {
    const newCollection = new Collection(req.body);
    
    const collectionName = req.body.name;
    newCollection.collectionCode = generateCollectionCode(collectionName);

    try {
        const savedCollection  = await newCollection.save();
        res.status(200).json(newCollection)
    } catch (err) {
        res.status(500).json(err);
    }
})

//UPDATE A COLLECTION
router.put("/:id/:ownerID", verifyTokenAndAuthCollection, async(req,res) => {
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
router.delete("/:id/:ownerID", verifyTokenAndAuthCollection, async (req,res)=> {
    console.log("REQ",req);
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
router.get("/:id", async (req,res)=> {
    try {
        const collection = await Collection.findById(req.params.id);
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

module.exports = router;
const router = require("express").Router()
const Entry = require("../models/Entry");
const {verifyToken, verifyTokenAndAuth, verifyTokenAndAdmin, verifyTokenAndAuthCollection, verifyEntryEditAccess, verifyEntryReadAccess} = require('./verifyToken');
const HttpProxyAgent = require("http-proxy-agent");
const { findByIdAndUpdate } = require("../models/Entry");

const entryController = require("../controllers/entryController");

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

function generateRandomAlphaNumeric(name){
    result = Math.random().toString(16).slice(2,6)
    return  result
}

router.post("/", verifyEntryEditAccess, entryController.createEntry);

router.put("/:id", verifyEntryEditAccess, entryController.updateEntry);

router.delete("/:id", verifyEntryEditAccess, entryController.deleteEntry);

router.get("/:id", verifyEntryReadAccess, entryController.getEntry);

//GET ALL ENTRIES
//name - regex
router.get("/", async(req,res) => {
    const qName = req.query.name;
    const { skip = 0, limit = 10 } = req.query;
    const sort  = {}

    if(req.query.sortBy){
        sort[req.query.sortBy]   = req.query.orderBy === 'desc' ? -1 : 1
    }

    if(qName){
        const regex = new RegExp(qName, 'i') // i for case insensitive
        req.query['archivalIdentification.archivalSpeciesName'] = {$regex:regex};
    }


    try {
        const entries = await Entry.find(req.query)
                                        .limit(limit)
                                        .skip(skip)
                                        .sort(sort)
                        
        res.status(200).json(entries);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.get("/numPages",async (req,res)=>{
    const qName = req.query.name;
    const { skip = 0, limit = 5000 } = req.query;
    const sort  = {}

    if(req.query.sortBy){
        sort[req.query.sortBy]   = req.query.orderBy === 'desc' ? -1 : 1
    }

    if(qName){
        const regex = new RegExp(qName, 'i') // i for case insensitive
        req.query['archivalIdentification.archivalSpeciesName'] = {$regex:regex};
    }


    try {
        const entries = await Entry.find(req.query)
                    
        res.status(200).json(entries.length);
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;

const router = require("express").Router()
const Entry = require("../models/Entry");
const {verifyToken, verifyTokenAndAuth, verifyTokenAndAdmin, verifyTokenAndAuthCollection} = require('./verifyToken');
const HttpProxyAgent = require("http-proxy-agent");
const { findByIdAndUpdate } = require("../models/Entry");

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));


function generateRandomAlphaNumeric(name){
    result = Math.random().toString(16).slice(2,6)
    return  result
}

//CREATE SINGLE COLLECTION ENTRY
router.post("/:collectionID/:ownerID", verifyTokenAndAuthCollection, async (req,res) => {
    const newEntry = new Entry(req.body);
    try {
       //logic for generating alphaNumeric fields
       let binomialName = "";

       console.log("DEBUG1")

       if(newEntry.identification.NCBITaxonomyCode){
           console.log(newEntry.identification.NCBITaxonomyCode);
           const id = newEntry.identification.NCBITaxonomyCode;

        // const proxyAgent = new HttpProxyAgent(process.env.PROXY_UNI);

        //FETCH API
        const resp = await fetch(
            `http://rest.ensembl.org/taxonomy/classification/${id}`,
            {
                // agent:proxyAgent,
                method:'GET',
                headers :{
                    'Content-type': 'application/json'
                }
            }
        )

        const data = await resp.json();
        const nameTmp = data[0].children[0].scientific_name;
        console.log("DATA",data[0].children[0].scientific_name);
        binomialName = nameTmp;
       } 

    //    console.log("DEBUG2")
       
       const name = newEntry.archivalIdentification.archivalSpeciesName;
       newEntry.identification.itemCode = name+"_"+newEntry.histologicalInformation.brainPart+"_"+newEntry.histologicalInformation.stainingMethod+"_"+generateRandomAlphaNumeric(name);
       newEntry.identification.individualCode = name+"_"+generateRandomAlphaNumeric(name);
       newEntry.identification.wikipediaSpeciesName = `https://en.wikipedia.org/wiki/${name}`;
       newEntry.identification.bionomialSpeciesName = name;

       if(binomialName.length>0){
           newEntry.identification.bionomialSpeciesName = binomialName;
           newEntry.identification.wikipediaSpeciesName = `https://en.wikipedia.org/wiki/${binomialName}`;
       }

       console.log("FINAL",newEntry);
       const savedEntry = await newEntry.save();
       res.status(200).json(savedEntry) 
    } catch (err) {
        res.status(500).json(err);
    }
})

// UPDATE

// create separate function for NCBI fetching, use here and there
router.put("/:id", verifyTokenAndAdmin , async (req,res)=> {
    
    //ASSUMING ON CLIENT-SIDE AFTER SUBMITTING THE FORM U GET COMPLETE OBJECT BOTH WITH PREV PROPS AND NEW PROPS
    const { _id,createdAt,updatedAt,__v,...others} = req.body;
    const newEntry = others;

    // console.log("ENTRY", newEntry)

    try{ 
        let binomialName = "";

        // console.log("DEBUG1")
    
        if(newEntry.identification.NCBITaxonomyCode){
            console.log(newEntry.identification.NCBITaxonomyCode);
            const id = newEntry.identification.NCBITaxonomyCode;
    
            const proxyAgent = new HttpProxyAgent(process.env.PROXY_UNI);
    
            //FETCH API
            const resp = await fetch(
                `http://rest.ensembl.org/taxonomy/classification/${id}`,
                {
                    agent:proxyAgent,
                    method:'GET',
                    headers :{
                        'Content-type': 'application/json'
                    }
                }
            )
    
            const data = await resp.json();
            const nameTmp = data[0].children[0].scientific_name;
            // console.log("DATA",data[0].children[0].scientific_name);
            binomialName = nameTmp;
        }
    
        if(binomialName.length>0){
            newEntry.identification.bionomialSpeciesName = binomialName;
            newEntry.identification.wikipediaSpeciesName = `https://en.wikipedia.org/wiki/${binomialName}`;
        }

        const updatedEntry = await Entry.findByIdAndUpdate(
            req.params.id,
            {
                $set:newEntry
            },{ new:true }
        );
        res.status(200).json(updatedEntry);
    } catch(err){
        res.status(500).json(err);
    }
});

//DELETE
//-------> CHANGE BACKUP ENTRY TO FALSE
router.delete("/:id", verifyTokenAndAdmin, async (req,res)=> {
    try{
        const updatedEntry = await Entry.findByIdAndUpdate(
            req.params.id,
            {
                $set:{
                    "backupEntry":true
                }
            },{new:true}
        )

        res.status(200).json(updatedEntry);
    } catch (err){
        res.status(500).json(err);
    }
})

//GET SINGLE ENTRY
router.get("/:id", async (req,res)=> {
    try {
        const entry = await Entry.findById(req.params.id);
        res.status(200).json(entry);
    } catch (err) {
        res.status(500).json(err);
    }
})


//GET ALL ENTRIES
//name - regex
router.get("/", async(req,res) => {
    const qName = req.query.name;
    const { skip = 0, limit = 10 } = req.query;
    const sort  = {}

    if(req.query.sortBy){
        sort[req.query.sortBy]   = req.query.orderBy === 'desc' ? -1 : 1
        console.log("SORT",sort);
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
        console.log("SORT",sort);
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
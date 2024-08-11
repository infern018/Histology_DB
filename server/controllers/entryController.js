const Entry = require('../models/Entry');
const Collection = require('../models/Collection');
const HttpProxyAgent = require("http-proxy-agent");

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

function generateRandomAlphaNumeric(name){
    result = Math.random().toString(16).slice(2,6)
    return  result
}

const createEntry = async (req, res) => {
    const newEntry = new Entry(req.body);
    try {
       //logic for generating alphaNumeric fields
       let binomialName = "";

       if(newEntry.identification.NCBITaxonomyCode){
           const id = newEntry.identification.NCBITaxonomyCode;

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

       
       const name = newEntry.archivalIdentification.archivalSpeciesName;
       newEntry.identification.itemCode = name+"_"+newEntry.histologicalInformation.brainPart+"_"+newEntry.histologicalInformation.stainingMethod+"_"+generateRandomAlphaNumeric(name);
       newEntry.identification.individualCode = name+"_"+generateRandomAlphaNumeric(name);
       newEntry.identification.wikipediaSpeciesName = `https://en.wikipedia.org/wiki/${name}`;
       newEntry.identification.bionomialSpeciesName = name;

       if(binomialName.length>0){
           newEntry.identification.bionomialSpeciesName = binomialName;
           newEntry.identification.wikipediaSpeciesName = `https://en.wikipedia.org/wiki/${binomialName}`;
       }

       const savedEntry = await newEntry.save();
       res.status(200).json(savedEntry) 
    } catch (err) {
        res.status(500).json(err);
    }
}

const updateEntry = async(req,res) => {
    const newEntry = req.body;
    console.log("NEW ENTRY",newEntry.identification.NCBITaxonomyCode);

    try{ 
        let binomialName = "";

    
        if(newEntry.identification.NCBITaxonomyCode){
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
            binomialName = nameTmp;
        }
    
        if(binomialName.length>0){
            newEntry.identification.bionomialSpeciesName = binomialName;
            newEntry.identification.wikipediaSpeciesName = `https://en.wikipedia.org/wiki/${binomialName}`;
        }

        console.log("UDPATED NEW ENTRY",newEntry);

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
}

const deleteEntry = async(req,res) => {
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
    } catch(err){
        res.status(500).json(err);
    }
}

const getEntry = async(req,res) => {
    try{
        const entry = await Entry.findById(req.params.id);
        res.status(200).json(entry);
    } catch(err){
        res.status(500).json(err);
    }
}

module.exports = {
    createEntry,
    updateEntry,
    deleteEntry,
    getEntry
}

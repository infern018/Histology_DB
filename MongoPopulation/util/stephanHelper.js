const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const addDataStephan = (fetchedData, stephanComplete, order) => {

    const axios = require('axios')

    function generateRandomAlphaNumeric(name){
        // name.replace(" ", "").split(0, 8) + Math.random().toString(16).slice(2,6)
        result = Math.random().toString(16).slice(2,6)
        return  result
    }

    let i = 0;

    function strToInt(str){

        let ans = Number(str)

        // console.log("ID",str)

        if(ans!==ans || str=="---"){
            ans = 0;
        }


        //for weight if str=="---" change it to 0 and if Nan then change it to 0

        return ans;
    //check is Nan
    }

    // function strToInt(str){
    //     if(str!="---" && str!=""){
    //         return Number(str)
    //     } else {
    //         return 0
    //     }
    // }

    for(let i=0;i<fetchedData.length;i++){
        let singleEntry = fetchedData[i];

        let binomialName = singleEntry[11]

        // console.log(singleEntry)

        let code = singleEntry[2]
        let species = singleEntry[0]
        // let sex = singleEntry[1]
        let bodyWeight = strToInt(singleEntry[3])
        let brainWeight = strToInt(singleEntry[4]) / 1000 //coverting it into gms from mg
        let staining = singleEntry[7]
        let sectionThickness = singleEntry[6]
        let planeOfSectioning = singleEntry[5]
        let distance = singleEntry[8]
        let orderValue = order
        let ncbiID = strToInt(singleEntry[9])

        let sex = 'u';

        if(singleEntry[1]!='---'){
            sex = singleEntry[1];
            // console.log("CODE=",code);
            // console.log("SEX=",sex);
            sex = sex.toLowerCase();
        }

        if(!binomialName){
            binomialName = species;
        }

        const itemCodeValue = species+"_"+staining+"_"+generateRandomAlphaNumeric(species)
        const individualCodeValue = species+"_"+generateRandomAlphaNumeric(species)
        const wikipediaSpeciesNameValue = `https://en.wikipedia.org/wiki/${binomialName}`

        let singleFormattedEntry = {
            collectionID: '6346577b277dbfd9ccc52cd5',
            
            identification:{
                collectionCode:"Collection_Stephan1",
                itemCode:itemCodeValue,
                individualCode:individualCodeValue,
                NCBITaxonomyCode:ncbiID,
                wikipediaSpeciesName:wikipediaSpeciesNameValue,
                bionomialSpeciesName:binomialName,
            },

            archivalIdentification:{
                archivalIndividualCode:code,
                archivalSpeciesOrder:orderValue,
                archivalSpeciesName:species,
            },
            physiologicalInformation:{
                sex:sex,
                bodyWeight:bodyWeight,
                brainWeight:brainWeight
            },
        
            histologicalInformation:{
                stainingMethod:staining,

                //comma issues in this field
                sectionThickness:sectionThickness,
                planeOfSectioning:planeOfSectioning,
                interSectionDistance:distance,
        
                //work on these fields
                
        
            },
            backupEntry:false
        }

        stephanComplete.push(singleFormattedEntry);
    
    }
}

module.exports = { addDataStephan }
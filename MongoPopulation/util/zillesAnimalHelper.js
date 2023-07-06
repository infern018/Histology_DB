const mongoose = require('mongoose')
const { ObjectId } = require('mongodb');


const addDataZillesAnimal = (fetchedData, zillesAnimalComplete, order) => {

    function generateRandomAlphaNumeric(name){
        // name.replace(" ", "").split(0, 8) + Math.random().toString(16).slice(2,6)
        result = Math.random().toString(16).slice(2,6)
        return  result
    }

    function strToInt(str){
        let ans = Number(str)

        // console.log("ID",str)

        if(ans!==ans || str=="---"){
            ans = 0;
        }


        //for weight if str=="---" change it to 0 and if Nan then change it to 0

        return ans;
        
    }

    for(let i=0;i<fetchedData.length;i++){
        let singleEntry = fetchedData[i];

        // console.log(singleEntry)


        let binomialName = singleEntry[13]


        let code = singleEntry[0]
        let species = singleEntry[1]
        // let sex = singleEntry[2]

        let sex = 'u';

        if(singleEntry[1]!='---'){
            sex = singleEntry[2];
            sex = sex.toLowerCase();
        }

        let number = singleEntry[3]
        let bodyWeight = strToInt(singleEntry[4])
        let brainWeight = strToInt(singleEntry[5])
        let part = singleEntry[6]
        let staining = singleEntry[7]
        let sectionThickness = singleEntry[8]
        let planeOfSectioning = singleEntry[9]
        let distance = singleEntry[10]
        let ncbiID = strToInt(singleEntry[11])
        let orderValue = order

        if(!binomialName){
            binomialName = species;
        }

        const itemCodeValue = species+"_"+part+"_"+staining+"_"+generateRandomAlphaNumeric(species)
        const individualCodeValue = species+"_"+generateRandomAlphaNumeric(species)
        const wikipediaSpeciesNameValue = `https://en.wikipedia.org/wiki/${binomialName}`


        let singleFormattedEntry = {
            collectionID:'64a699e1c5f652c19dbbe573',
            identification:{
                collectionCode:"Collection_ZillesAnimal1",
                itemCode:itemCodeValue,
                individualCode:individualCodeValue,
                NCBITaxonomyCode:ncbiID,
                wikipediaSpeciesName:wikipediaSpeciesNameValue,
                bionomialSpeciesName:binomialName
            },

            archivalIdentification:{
                archivalIndividualCode:code,
                archivalSpeciesCode:number,
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
                sectionThickness:sectionThickness,
                planeOfSectioning:planeOfSectioning,
                interSectionDistance:distance,
                brainPart:part,
        
                //work on these fields
                
        
            },
            backupEntry:false
        }
        
        zillesAnimalComplete.push(singleFormattedEntry);
    }
}

module.exports = { addDataZillesAnimal }
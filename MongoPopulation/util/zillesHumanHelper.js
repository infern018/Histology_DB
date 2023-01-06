const mongoose = require('mongoose')
const { ObjectId } = require('mongodb');

const addDataZillesHuman = (fetchedData, zillesHumanComplete) => {

    function generateRandomAlphaNumeric(name){
        // name.replace(" ", "").split(0, 8) + Math.random().toString(16).slice(2,6)
        result = Math.random().toString(16).slice(2,6)
        return  result
    }

    function strToInt(str){
        if(str!="---" && str!=""){
            return Number(str)
        } else {
            return 0
        }
    }

    for(let i=0;i<fetchedData.length;i++){
        let singleEntry = fetchedData[i];
        let name = "Homo Sapiens"
        let code  = singleEntry[0]
        let sex = 'u';

        

        if(singleEntry[1]!='---'){
            sex = singleEntry[1];
            sex = sex.toLowerCase();
        }

        //sort out different units of age given
        let ageValue;

        if(singleEntry[3]!="---"){
            ageValue = Number(singleEntry[3]);
        }

        // let split_string = ageValue.split(/(\d+)/)

        //age + refactor for NCBI IDs in all 3
        let developmentalStage;

        if(singleEntry[5]!="---"){
            developmentalStage = singleEntry[5];
        }

        let origin;

        if(singleEntry[6]!="---"){
            origin = singleEntry[6];
        }

        let unit;

        if(singleEntry[4]!="---"){
            unit = singleEntry[4];
        }

        let number = ageValue;

        let bodyWeight = strToInt(singleEntry[7])
        let brainWeight = strToInt(singleEntry[8])
        let part = singleEntry[9]
        let staining = singleEntry[10]
        let sectionThickness = singleEntry[11]
        let planeOfSectioning = singleEntry[12]
        let distance = singleEntry[13]
        let ncbiID = strToInt(singleEntry[14])        

        const itemCodeValue = name+"_"+part+"_"+staining+"_"+generateRandomAlphaNumeric(name)
        const individualCodeValue = name+"_"+part+"_"+staining+"_"+generateRandomAlphaNumeric(name)
        const wikipediaSpeciesNameValue = `https://en.wikipedia.org/wiki/${name}`

        let singleFormattedEntry = {
            collectionID: '63b41edcafee9f8ee0768f68',
            identification:{
                collectionCode:"Collection_ZillesHuman1",
                itemCode:itemCodeValue,
                individualCode:individualCodeValue,
                NCBITaxonomyCode:ncbiID,
                wikipediaSpeciesName:wikipediaSpeciesNameValue,
                bionomialSpeciesName:name
            },

            archivalIdentification:{
                archivalIndividualCode:code,
                archivalSpeciesName:"Homo Sapiens",
            },
            physiologicalInformation:{
                age:{
                    developmentalStage : developmentalStage,
                    number : number,
                    unitOfNumber : unit,
                    origin : origin
                },
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

        zillesHumanComplete.push(singleFormattedEntry);
    }
}

module.exports = { addDataZillesHuman }
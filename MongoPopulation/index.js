const express = require('express');
const { google } = require('googleapis');
const mongo = require('./mongo')
const app = express();


//BELOW TWO LINES ARE FOR ACCESSING GOOGLE APIs THROUGH A PROXY
// process.env.HTTP_PROXY = 'http://IEC2019019:2001-01-26@172.31.2.4:8080';

// google.options({
// 	proxy:'http://IEC2019019:2001-01-26@172.31.2.4:8080'
// })

//importing functions and schemas
const EntrySchema = require('./schema/Entry')
const CollectionSchema = require('./schema/Collection')

//helper functions
const zillesHumanHelper = require('./util/zillesHumanHelper')
const zillesAnimalHelper = require('./util/zillesAnimalHelper')
const stephanHelper = require('./util/stephanHelper')

//logic for getting data from google sheets
const auth = new google.auth.GoogleAuth({
    keyFile:"creds.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets"
});

const client = auth.getClient();
const googleSheets = google.sheets({ version:"v4" , auth: client }); 
const spreadsheetId = "1FHaLxo1QNJwMIGn20zPDpVWZrO-adyI4RU3XYi1Au0Y";

//util funcions ---------
const getValues = async (span) => {
    const values = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: span
    })

    return values;
}

//arrays for adding data
collectionComplete = []

app.get("/", async (req,res)=>{

    //----------adding zillesHuman Data

    const respZillesHuman1 = await getValues('ZillesHuman!A3:O349');
    zillesHumanHelper.addDataZillesHuman(respZillesHuman1.data.values,collectionComplete);

    const respZillesHuman2 = await getValues('ZillesHuman!A353:O433');
    zillesHumanHelper.addDataZillesHuman(respZillesHuman2.data.values,collectionComplete);

    zillesLen = collectionComplete.length
    console.log("ZH",zillesLen)

    // adding zillesAnimalData
    const respZillesAnimalsVarious = await getValues('ZillesAnimals!A3:O10');
    zillesAnimalHelper.addDataZillesAnimal(respZillesAnimalsVarious.data.values, collectionComplete, 'various')

    const respZillesAnimalsMarsupalia = await getValues('ZillesAnimals!A13:O23');
    zillesAnimalHelper.addDataZillesAnimal(respZillesAnimalsMarsupalia.data.values, collectionComplete, 'marsupalia')

    const respZillesAnimalsInsectivora = await getValues('ZillesAnimals!A26:O55');
    zillesAnimalHelper.addDataZillesAnimal(respZillesAnimalsInsectivora.data.values, collectionComplete, 'insectivora')

    const respZillesAnimalsRodentia = await getValues('ZillesAnimals!A58:O82');
    zillesAnimalHelper.addDataZillesAnimal(respZillesAnimalsRodentia.data.values, collectionComplete, 'rodentia')

    const respZillesAnimalsLagomorpha = await getValues('ZillesAnimals!A85:O121');
    zillesAnimalHelper.addDataZillesAnimal(respZillesAnimalsLagomorpha.data.values, collectionComplete, 'lagomorpha')

    const respZillesAnimalsSimier = await getValues('ZillesAnimals!A124:O266');
    zillesAnimalHelper.addDataZillesAnimal(respZillesAnimalsSimier.data.values, collectionComplete, 'simier')

    zillesAnimalLen = collectionComplete.length-zillesLen;
    console.log("ZA",zillesAnimalLen)

    //adding stephan data
    const respStephanInsectivora = await getValues('Stephan!A4:N416');
    stephanHelper.addDataStephan(respStephanInsectivora.data.values, collectionComplete, 'insectivora')

    const respStephanScandentia = await getValues('Stephan!A419:N700');
    stephanHelper.addDataStephan(respStephanScandentia.data.values, collectionComplete, 'scandentia')

    const respStephanChiroptera = await getValues('Stephan!A703:N1731');
    stephanHelper.addDataStephan(respStephanChiroptera.data.values, collectionComplete, 'chiroptera')

    const respStephanPrimates = await getValues('Stephan!A1734:N2253');
    stephanHelper.addDataStephan(respStephanPrimates.data.values, collectionComplete, 'primates')

    const respStephanMiscellaneous = await getValues('Stephan!A2256:N2402');
    stephanHelper.addDataStephan(respStephanMiscellaneous.data.values, collectionComplete, 'miscellaneous')

    stephaLen = collectionComplete.length-(zillesAnimalLen+zillesLen);
    console.log("S",stephaLen)


    res.send("SUCCESS")

    // DELETE COMPASS SE FIRST
    connectToMongoDB()

    
})

// connecting to DB
const connectToMongoDB = async () => {
    await mongo().then(async mongoose => {
        console.log("connected to mongoDB");
        EntrySchema.insertMany(collectionComplete)
    })
}

//listening part
app.listen(7070, (req,res) => {
    console.log("Sprinting on 7070");
})


// proxy = "http://IEC2019019:2001-01-26@172.31.2.4:8080/"
// strict-ssl = false
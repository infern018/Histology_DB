const express = require('express');
const bodyParser = require('body-parser')
const dotenv  = require('dotenv')
const mongoose = require('mongoose')

//ROUTER
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');    
const entryRoute = require('./routes/entries');
const collectionRoute = require('./routes/collections');

const cors = require('cors')

const app = express();
const PORT = 5000;

app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'));
app.use(cors())


// parse application/json
app.use(bodyParser.json())

dotenv.config();

mongoose
    .connect(process.env.MONGO_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    })
    .then(console.log("Connected to MongoDB"))
    .catch((err) => console.log(err))

app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)
app.use("/api/entries",entryRoute)
app.use("/api/collections",collectionRoute)

app.listen(process.env.PORT, () => {
    console.log("Server running on PORT ", PORT);
})
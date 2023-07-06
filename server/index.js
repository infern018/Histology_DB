const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session');
const passport = require('./passport');
const config = require('./config')

//ROUTER
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');    
const entryRoute = require('./routes/entries');
const collectionRoute = require('./routes/collections');
const roleRoute = require('./routes/roles');


const app = express();
const PORT = config.port;

app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'));

//cors
const cors = require('cors');
const corsOptions ={
    origin:'http://localhost:3000',
    methods:"GET,POST,PUT,DELETE",
    credentials:true
}
app.use(cors());

// parse application/json
app.use(bodyParser.json())

// Configure session middleware
app.use(
    session({
      secret: 'your-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie:{
        httpOnly:true,
        secure:false,
        maxAge:24*560*60*1000,
      }
    })  
  );

// passport
app.use(passport.initialize());
app.use(passport.session());


mongoose
    .connect(config.dbURL,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    })
    .then(console.log("Connected to MongoDB"))
    .catch((err) => console.log(err))

app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)
app.use("/api/entries",entryRoute)
app.use("/api/collections",collectionRoute)
app.use("/api/roles",roleRoute)

app.listen(process.env.PORT, () => {
    console.log("Server running on PORT ", PORT);
})
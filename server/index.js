require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("./utils/passport");
const redisClient = require("./utils/redisClient");

//ROUTER
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const entryRoute = require("./routes/entries");
const collectionRoute = require("./routes/collections");
const roleRoute = require("./routes/roles");
const stainingMethodRoute = require("./routes/stainingMethods");
const brainPartRoute = require("./routes/brainParts");
const taxonomyRoute = require("./routes/taxonomy");
const adminRoute = require("./routes/admin");

const app = express();
const PORT = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/views"));

//cors
const cors = require("cors");
app.use(cors());

// parse application/json
app.use(bodyParser.json());

// Configure session middleware
app.use(
	session({
		secret: "your-secret-key",
		resave: false,
		saveUninitialized: false,
		cookie: {
			httpOnly: true,
			secure: false,
			maxAge: 24 * 560 * 60 * 1000,
		},
	})
);

// Passport config
app.use(passport.initialize());
app.use(passport.session());

// Redis Client

// database connection
mongoose
	.connect(process.env.MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("Connected to MongoDB");
	})
	.catch((err) => console.log(err));

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/entries", entryRoute);
app.use("/api/collections", collectionRoute);
app.use("/api/roles", roleRoute);
app.use("/api/staining-methods", stainingMethodRoute);
app.use("/api/brain-parts", brainPartRoute);
app.use("/api/taxonomy", taxonomyRoute);
app.use("/api/admin", adminRoute);

// send sample response in the root URL
app.get("/api", (req, res) => {
	res.send("Hello MiMe World");
});

app.listen(process.env.PORT, () => {
	console.log("Server running on PORT ", PORT);
});

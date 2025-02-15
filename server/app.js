const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const searchRoutes = require("./routes/search");

const app = express();

// ...existing code...

app.use("/api/search", searchRoutes);

// ...existing code...

module.exports = app;

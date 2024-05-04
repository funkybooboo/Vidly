const express = require("express");
const mongoose = require("mongoose");
const Fawn = require("fawn");
const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi);
const genres = require("./routes/genre");
const customers = require("./routes/customer");
const movies = require("./routes/movie");
const rentals = require("./routes/rental");

Fawn.init(mongoose);

mongoose.connect("mongodb://localhost/vidly")
    .then(() => {
        console.log("Connected to MongoDB...");
    })
    .catch(error => {
        console.log(error.message);
    });

const app = express();
app.use(express.json());

app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
});

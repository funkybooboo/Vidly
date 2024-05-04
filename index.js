const express = require("express");
const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi);
const config = require("config");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const auth = require("./routes/auth");
const error = require("./middleware/error");

if (!config.get("jwtPrivateKey")) {
    console.error("Need to set up jwtPrivateKey");
    process.exit(1);
}

mongoose.connect("mongodb://localhost/vidly")
    .then(() => {
        console.log("Connected to MongoDB...");
    })
    .catch(error => {
        console.error(error.message);
    });

const app = express();
app.use(express.json());

app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);

app.use(error);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
});

// Import required modules
const express = require("express");
const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi);
const config = require("config");
const winston = require("winston");
require("winston-mongodb");

// Import route handlers and error middleware
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const auth = require("./routes/auth");
const error = require("./middleware/error");

// Initialize Winston transports
winston.add(new winston.transports.Console());
winston.add(new winston.transports.File({ filename: "log.log" }));
winston.add(new winston.transports.MongoDB({ db: "mongodb://localhost/vidly" }));

// Set up uncaught exception and unhandled rejection handlers
process.on("uncaughtException", (error) => {
    winston.error(error.message, error);
    process.exit(1);
});

process.on("unhandledRejection", (error) => {
    winston.error(error.message, error);
    process.exit(1);
});

// Check if jwtPrivateKey is set
if (!config.get("jwtPrivateKey")) {
    winston.error("Need to set up jwtPrivateKey");
    process.exit(1);
}

// Connect to MongoDB
mongoose.connect("mongodb://localhost/vidly")
    .then(() => {
        winston.info("Connected to MongoDB...");
    })
    .catch(error => {
        winston.error("Could not connect to MongoDB");
        process.exit(1);
    });

// Create Express app
const app = express();
app.use(express.json());

// Register routes
app.use("/api/genres", genres); // Route for handling genres
app.use("/api/customers", customers); // Route for handling customers
app.use("/api/movies", movies); // Route for handling movies
app.use("/api/rentals", rentals); // Route for handling rentals
app.use("/api/users", users); // Route for handling users
app.use("/api/auth", auth); // Route for handling authentication

// Error handling middleware
app.use(error);

// Start server
const port = process.env.PORT || 3000; // Set port from environment variable or default to 3000
app.listen(port, () => {
    winston.info(`Listening on port ${port}...`);
});

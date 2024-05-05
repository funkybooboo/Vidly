// Import required modules
const express = require("express");
const winston = require("winston");
const Joi = require("joi");

// Set up validation
Joi.objectId = require('joi-objectid')(Joi);

// Import setup functions
const { generalLogging, dbLogging } = require("./startup/logging");
const values = require("./startup/values");
const routes = require("./startup/routes");
const db = require("./startup/db");

// Set up logging
generalLogging();

// Check and retrieve required environment variables
const dbConnection = values();

// Connect to MongoDB
db(dbConnection);
dbLogging(dbConnection);

// Create Express app
const app = express();

// Set up routing
routes(app);

// Start server
const port = process.env.PORT || 3000; // Set port from environment variable or default to 3000
app.listen(port, () => {
    winston.info(`Listening on port ${port}...`);
});

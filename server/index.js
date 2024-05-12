// Import required modules
const express = require("express");
const Joi = require("joi");

// Import setup functions
const { generalLogging, dbLogging } = require("./startup/logging");
const values = require("./startup/values");
const routes = require("./startup/routes");
const db = require("./startup/db");
const start = require("./startup/start");
const prod = require("./startup/prod");

// Set up logging
generalLogging();

// Set up validation
Joi.objectId = require('joi-objectid')(Joi);

// Check required environment variables
values();

// Connect to MongoDB
db();
dbLogging();

// Create Express app
const app = express();

// Set up prod routes
prod(app);

// Set up routing
routes(app);

// Start server
const server = start(app);

module.exports = server;

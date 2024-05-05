const winston = require("winston");
require("winston-mongodb");
const config = require("config");

/**
 * Sets up general logging to the console and a file, and handles uncaught exceptions and unhandled rejections.
 */
function generalLogging() {
    // Add console transport for logging to the console with colors and pretty printing
    winston.add(new winston.transports.Console({ colorize: true, prettyPrint: true }));

    // Add file transport for logging to a file
    winston.add(new winston.transports.File({ filename: "log.log" }));

    // Set up uncaught exception handler
    process.on("uncaughtException", (error) => {
        winston.error(error.message, error);
        process.exit(1); // Exit process on uncaught exception
    });

    // Set up unhandled rejection handler
    process.on("unhandledRejection", (error) => {
        winston.error(error.message, error);
        process.exit(1); // Exit process on unhandled rejection
    });
}

/**
 * Sets up logging to MongoDB.
 */
function dbLogging() {
    // Add MongoDB transport for logging to MongoDB
    winston.add(new winston.transports.MongoDB({ db: config.get("db") }));
}

module.exports.generalLogging = generalLogging;
module.exports.dbLogging = dbLogging;

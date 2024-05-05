const winston = require("winston");
const config = require("config");

/**
 * Retrieves and validates configuration values required for the application.
 * Exits the process if required values are not set.
 */
function values() {
    // Check if dbConnection is set
    const db = config.get("db");
    if (!db) {
        winston.error("Need to set up db connection string");
        process.exit(1);
    }

    // Check if jwtPrivateKey is set
    if (!config.get("jwtPrivateKey")) {
        winston.error("Need to set up jwtPrivateKey");
        process.exit(1);
    }
}

module.exports = values;

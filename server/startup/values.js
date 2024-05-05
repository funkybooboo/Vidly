const winston = require("winston");
const config = require("config");

/**
 * Retrieves and validates configuration values required for the application.
 * Exits the process if required values are not set.
 * @returns {string} The database connection string
 */
function getConfigurationValues() {
    // Check if dbConnection is set
    const dbConnection = config.get("dbConnection");
    if (!dbConnection) {
        winston.error("Need to set up dbConnection");
        process.exit(1);
    }

    // Check if jwtPrivateKey is set
    if (!config.get("jwtPrivateKey")) {
        winston.error("Need to set up jwtPrivateKey");
        process.exit(1);
    }

    // Return the database connection string
    return dbConnection;
}

module.exports = getConfigurationValues;

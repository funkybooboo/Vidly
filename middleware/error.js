const winston = require("winston");

// Middleware function to handle errors
function error(error, request, response, next) {
    // Log the error using Winston
    winston.error(error.message, error);

    // Send a 500 Internal Server Error response to the client
    response.status(500).send("Something went wrong");
}

// Export the error middleware function
module.exports = error;

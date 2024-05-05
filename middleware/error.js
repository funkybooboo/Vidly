const winston = require("winston");

function error(error, request, response, next) {
    winston.error(error.message, error);
    response.status(500).send("Something went wrong");
}

module.exports = error;
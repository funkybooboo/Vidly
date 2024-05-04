function error(error, request, response, next) {
    response.status(500).send("Something went wrong");
}

module.exports = error;
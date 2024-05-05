const mongoose = require("mongoose");
const winston = require("winston");

function db(dbConnection) {
    mongoose.connect(dbConnection)
        .then(() => winston.info("Connected to MongoDB..."));
}

module.exports = db;
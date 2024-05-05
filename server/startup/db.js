const mongoose = require("mongoose");
const winston = require("winston");
const config = require("config");

function db() {
    const db = config.get("db");
    mongoose.connect(db)
        .then(() => winston.info(`Connected to ${db}...`));
}

module.exports = db;
const mongoose = require("mongoose");
const Joi = require("joi");
const {genreSchema} = require("./genre");

const Movie = mongoose.model("Movie", new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 255
    },
    genre: {
        type: genreSchema,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    }
}));

function validate(movie) {
    const schema = {
        title: Joi.string().min(2).max(50).required(),
        genreId: Joi.objectId().required(),
        stock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required()
    }
    return schema.validate(movie);
}

module.exports.Movie = Movie;
module.exports.validate = validate;
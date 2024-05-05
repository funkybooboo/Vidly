const mongoose = require("mongoose");
const Joi = require("joi");

// Define the schema for the movie
const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 255
    },
    genre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genre', // Reference to the Genre model
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
});

// Create the Movie model using the schema
const Movie = mongoose.model("Movie", movieSchema);

// Validate the movie data using Joi
function validate(movie) {
    const schema = Joi.object({
        title: Joi.string().min(2).max(50).required(),
        genreId: Joi.objectId().required(), // Assuming objectId is a custom Joi validator for ObjectId
        stock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required()
    });
    return schema.validate(movie);
}

// Export the model and validate function
module.exports.Movie = Movie;
module.exports.validate = validate;

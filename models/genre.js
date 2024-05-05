const Joi = require("joi");
const mongoose = require("mongoose");

// Define the schema for the genre
const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    }
});

// Create the Genre model using the schema
const Genre = mongoose.model("Genre", genreSchema);

// Validate the genre data using Joi
function validate(genre) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required()
    });
    return schema.validate(genre);
}

// Export the schema, model, and validate function
module.exports.genreSchema = genreSchema;
module.exports.Genre = Genre;
module.exports.validate = validate;

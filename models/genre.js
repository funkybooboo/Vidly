const Joi = require("joi");
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    }
});

const Genre = mongoose.model("Genre", schema);

function validate(genre) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required()
    });
    return schema.validate(genre);
}

module.exports.genreSchema = schema;
module.exports.Genre = Genre;
module.exports.validate = validate;
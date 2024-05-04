const mongoose = require("mongoose");
const Joi = require("joi");

const Customer = mongoose.model("Customer", new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    isGold: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
}));

function validate(genre) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required(),
        phone: Joi.string().min(2).max(50).required(),
        isGold: Joi.boolean()
    });
    return schema.validate(genre);
}

module.exports.Customer = Customer;
module.exports.validate = validate;
const mongoose = require("mongoose");
const Joi = require("joi");

const Rental = mongoose.model("Rental", new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateIn: {
        type: Date,
    },
    rentalFee: {
        type: Number,
        min: 0
    }
}));

function validate(rental) {
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    });
    return schema.validate(rental);
}

module.exports.Rental = Rental;
module.exports.validate = validate;
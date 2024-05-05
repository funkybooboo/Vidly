const mongoose = require("mongoose");
const Joi = require("joi");

// Define the schema for the rental
const rentalSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer', // Reference to the Customer model
        required: true
    },
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie', // Reference to the Movie model
        required: true
    },
    dateOut: {
        type: Date,
        default: Date.now // Default value is the current date/time
    },
    dateIn: {
        type: Date,
    },
    fee: {
        type: Number,
        min: 0 // Rental fee cannot be negative
    }
});

// Create the Rental model using the schema
const Rental = mongoose.model("Rental", rentalSchema);

// Validate the rental data using Joi
function validator(rental) {
    const schema = Joi.object({
        customerId: Joi.objectId().required(), // Assuming objectId is a custom Joi validator for ObjectId
        movieId: Joi.objectId().required()
    });
    return schema.validate(rental);
}

// Export the model and validate function
module.exports.Rental = Rental;
module.exports.validater = validator;

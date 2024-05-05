const mongoose = require("mongoose");
const Joi = require("joi");

// Define the Customer schema
const customerSchema = new mongoose.Schema({
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
    email: {
        type: String,
        unique: true,
        required: true,
        minlength: 2,
        maxlength: 50
    }
});

// Create the Customer model using the schema
const Customer = mongoose.model("Customer", customerSchema);

// Validate the customer data using Joi
function validator(customer) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required(),
        email: Joi.string().min(2).max(50).required().email(),
        isGold: Joi.boolean()
    });
    return schema.validate(customer);
}

// Export the Customer model and the validate function
module.exports.Customer = Customer;
module.exports.validator = validator;

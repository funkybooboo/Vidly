const Joi = require("joi");
const mongoose = require("mongoose");
const config = require("config");
const jwt = require("jsonwebtoken");

// Define the schema for the user
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 2,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 1024 // Assuming hashed passwords can be long
    },
    isAdmin: {
        type: Boolean,
        default: false // Default to non-admin user
    }
});

// Method to generate authentication token for the user
userSchema.methods.generateAuthToken = function generateAuthToken() {
    const jwtPrivateKey = config.get("jwtPrivateKey"); // Retrieve private key from config
    return jwt.sign({_id: this._id, isAdmin: this.isAdmin}, jwtPrivateKey);
}

// Create the User model using the schema
const User = mongoose.model("User", userSchema);

// Validate the user data using Joi
function validate(user) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required(),
        email: Joi.string().min(2).max(255).required().email(),
        password: Joi.string().min(8).max(255).required()
    });
    return schema.validate(user);
}

// Export the model and validate function
module.exports.User = User;
module.exports.validate = validate;

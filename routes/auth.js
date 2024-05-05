const express = require("express");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const asyncCatch = require("../middleware/asyncCatch");

const router = express.Router();

// Validate the request body using Joi
function validate(request) {
    const schema = Joi.object({
        email: Joi.string().min(2).max(255).required().email(),
        password: Joi.string().min(8).max(255).required()
    });
    return schema.validate(request);
}

// Route for user authentication
router.post("/", asyncCatch(async (request, response) => {
    // Validate the request body
    const { error } = validate(request.body);
    if (error) {
        // Return a 400 error if validation fails
        response.status(400).send(error);
        return;
    }
    // Find the user by email in the database
    const user = await User.findOne({ email: request.body.email });
    if (!user) {
        // If user not found, return 400 error
        response.status(400).send("Invalid email or password");
        return;
    }
    // Compare the provided password with the hashed password in the database
    const validPassword = await bcrypt.compare(request.body.password, user.password);
    if (!validPassword) {
        // If passwords don't match, return 400 error
        response.status(400).send("Invalid email or password");
        return;
    }
    // Generate authentication token if email and password are valid
    const token = user.generateAuthToken();
    // Send the token as a response
    response.send(token);
}));

module.exports = router;

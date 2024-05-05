const express = require("express");
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const asyncCatch = require("../middleware/asyncCatch");

const router = express.Router();

// Route to get user profile (requires authentication)
router.get("/me", auth, asyncCatch(async (request, response) => {
    // Fetch user by ID and exclude password field from the response
    const user = await User.findById(request.user._id).select("-password");
    response.send(user);
}));

// Route to register a new user (requires authentication)
router.post("/", auth, asyncCatch(async (request, response) => {
    // Validate user input
    const { error } = validate(request.body);
    if (error) {
        response.status(400).send(error);
        return;
    }
    try {
        // Check if the user is already registered
        let user = await User.findOne({ email: request.body.email });
        if (user) {
            response.status(400).send("User already registered");
            return;
        }
        // Generate salt and hash the password
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(request.body.password, salt);
        // Create a new user instance with hashed password
        user = new User({
            name: request.body.name,
            email: request.body.email,
            password: hashed
        });
        // Save the user and generate authentication token
        await user.save();
        const token = user.generateAuthToken();
        // Set the authentication token in the response header
        response.header("x-auth-token", token).send({
            _id: user._id,
            name: user.name,
            email: user.email
        });
    } catch (error) {
        console.log(error.message);
    }
}));

module.exports = router;

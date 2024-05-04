const express = require("express");
const {User, validate} = require("../models/user");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/me", auth, async (request, response) => {
    const user = await User.findById(request.user._id).select("-password");
    response.send(user);
});

router.post("/", auth, async (request, response) => {
    const {error} = validate(request.body);
    if (error) {
        response.status(400).send(error);
        return;
    }
    try {
        let user = await User.findOne({email: request.body.email});
        if (!user) {
            response.status(400).send("User already registered");
            return;
        }
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(request.body.password, salt);
        user = new User({
            name: request.body.name,
            email: request.body.email,
            password: hashed
        });
        await user.save();
        const token = user.generateAuthToken();
        response.header("x-auth-token", token).send({
            _id: user._id,
            name: user.name,
            email: user.email
        });
    } catch (error) {
        console.log(error.message);
    }
});

module.exports = router;
const express = require("express");
const {User, validate} = require("../models/user");

const router = express.Router();

router.post("/", async (request, response) => {
    const {error} = validate(request.body);
    if (error) {
        response.status(400).send(error);
        return;
    }
    try {
        let user = await User.findOne({email: request.body.email});
        if (user) {
            response.status(400).send("User already registered");
            return;
        }
        user = new User({
            name: request.body.name,
            email: request.body.email,
            password: request.body.password
        });
        await user.save();
        response.send({
            _id: user._id,
            name: user.name,
            email: user.email
        });
    } catch (error) {
        console.log(error.message);
    }
});

module.exports = router;
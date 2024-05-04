const express = require("express");
const {User} = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");

const router = express.Router();

function validate(request) {
    const schema = Joi.object({
        email: Joi.string().min(2).max(255).required().email(),
        password: Joi.string().min(8).max(255).required()
    });
    return schema.validate(request);
}

router.post("/", async (request, response) => {
    const {error} = validate(request.body);
    if (error) {
        response.status(400).send(error);
        return;
    }
    try {
        const user = await User.findOne({email: request.body.email});
        if (!user) {
            response.status(400).send("Invalid email or password");
            return;
        }
        const validPassword = await bcrypt.compare(request.body.password, user.password);
        if (!validPassword) {
            response.status(400).send("Invalid email or password");
            return;
        }
        const token = user.generateAuthToken();
        response.send(token);
    } catch (error) {
        console.log(error.message);
    }
});

module.exports = router;
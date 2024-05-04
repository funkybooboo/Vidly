const Joi = require("joi");
const mongoose = require("mongoose");
const config = require("config");
const jwt = require("jsonwebtoken");

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
        maxlength: 1024
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.generateAuthToken = function() {
    const jwtPrivateKey = config.get("jwtPrivateKey");
    return jwt.sign({_id: this._id, isAdmin: this.isAdmin}, jwtPrivateKey);
}

const User = mongoose.model("User", userSchema);

function validate(user) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required(),
        email: Joi.string().min(2).max(255).required().email(),
        password: Joi.string().min(8).max(255).required()
    });
    return schema.validate(user);
}

module.exports.User = User;
module.exports.validate = validate;
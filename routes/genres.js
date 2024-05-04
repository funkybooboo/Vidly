const express = require("express");
const Joi = require("joi");
const mongoose = require("mongoose");

const router = express.Router();

const Genre = mongoose.model("Genre", new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    }
}));

function validateGenre(genre) {
    const schema = Joi.object({
        name: Joi.string().min(2).required()
    });
    return schema.validate(genre);
}

router.get("/", async (request, response) => {
    try {
        const genres = await Genre
            .find()
            .sort({name: 1});
        response.send(genres);
    } catch (error) {
        console.log(error.message);
    }
});

router.post("/", async (reqest, response) => {
    const {error} = validateGenre(reqest.body);
    if (error) {
        response.status(400).send(error);
        return;
    }
    try {
        let genre = new Genre({name: reqest.body.name});
        genre = await genre.save();
        response.send(genre);
    } catch (error) {
        console.log(error.message);
    }
});

router.put("/:id", async (request, response) => {
    try {
        let genre = await Genre.findById(request.params.id);
        if (!genre) {
            response.status(404).send("The genre with the given ID was not found.");
            return;
        }
        const {error} = validateGenre(request.body);
        if (error) {
            response.status(400).send(error);
            return;
        }
        genre.name = request.body.name;
        genre = await genre.save();
        response.send(genre);
    } catch (error) {
        console.log(error.message);
    }
});

router.delete("/:id", async (request, response) => {
    const genre = await Genre.deleteOne({_id: request.params.id});
    if (!genre) {
        response.status(404).send("The genre with the given ID was not found.");
        return;
    }
    response.send(genre);
});

router.get("/:id", async (request, response) => {
    const genre = await Genre.findById(request.params.id);
    if (!genre) {
        response.status(404).send("The genre with the given ID was not found.");
        return;
    }
    request.send(genre);
});

module.exports = router;
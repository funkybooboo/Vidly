const express = require("express");
const {Genre, validate} = require("../models/genres");

const router = express.Router();

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

router.post("/", async (request, response) => {
    const {error} = validate(request.body);
    if (error) {
        response.status(400).send(error);
        return;
    }
    try {
        let genre = new Genre({name: request.body.name});
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
        const {error} = validate(request.body);
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
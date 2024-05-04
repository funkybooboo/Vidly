const express = require("express");
const {Genre, validate} = require("../models/genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const asyncCatch = require("../middleware/asyncCatch");

const router = express.Router();

router.get("/", asyncCatch(async (request, response) => {
    const genres = await Genre
        .find()
        .sort({name: 1});
    response.send(genres);
}));

router.post("/", [auth, admin], asyncCatch(async (request, response) => {
    const {error} = validate(request.body);
    if (error) {
        response.status(400).send(error);
        return;
    }
    const genre = new Genre({name: request.body.name});
    await genre.save();
    response.send(genre);
}));

router.put("/:id", [auth, admin], asyncCatch(async (request, response) => {
    const {error} = validate(request.body);
    if (error) {
        response.status(400).send(error);
        return;
    }
    let genre = await Genre.findById(request.params.id);
    if (!genre) {
        response.status(404).send("The genre with the given ID was not found.");
        return;
    }
    genre.name = request.body.name;
    genre = await genre.save();
    response.send(genre);
}));

router.delete("/:id", [auth, admin], asyncCatch(async (request, response) => {
    const genre = await Genre.deleteOne({_id: request.params.id});
    if (!genre) {
        response.status(404).send("The genre with the given ID was not found.");
        return;
    }
    response.send(genre);
}));

router.get("/:id", asyncCatch(async (request, response) => {
    const genre = await Genre.findById(request.params.id);
    if (!genre) {
        response.status(404).send("The genre with the given ID was not found.");
        return;
    }
    response.send(genre);
}));

module.exports = router;
const validateObjectId = require("../middleware/validateObjectId")
const express = require("express");
const { Genre, validator } = require("../models/genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const asyncCatch = require("../middleware/asyncCatch");
const validate = require("../middleware/validateRequest");

const router = express.Router();

// GET route to fetch all genres
router.get("/", asyncCatch(async (request, response) => {
    const genres = await Genre.find().sort({ name: 1 });
    response.send(genres);
}));

// POST route to create a new genre
router.post("/", [auth, admin, validate(validator)], asyncCatch(async (request, response) => {
    // Create a new genre instance
    const genre = new Genre({ name: request.body.name });
    await genre.save();
    response.send(genre);
}));

// PUT route to update an existing genre
router.put("/:id", [validateObjectId, auth, admin, validate(validator)], asyncCatch(async (request, response) => {
    // Find the genre by ID
    let genre = await Genre.findById(request.params.id);
    if (!genre) {
        response.status(404).send("The genre with the given ID was not found.");
        return;
    }
    // Update the genre's name
    genre.name = request.body.name;
    await genre.save();
    response.send(genre);
}));

// DELETE route to delete a genre
router.delete("/:id", [validateObjectId, auth, admin], asyncCatch(async (request, response) => {
    const genre = await Genre.findByIdAndDelete(request.params.id);
    if (!genre) {
        response.status(404).send("The genre with the given ID was not found.");
        return;
    }
    response.send(genre);
}));

// GET route to fetch a genre by ID
router.get("/:id", validateObjectId, asyncCatch(async (request, response) => {
    const genre = await Genre.findById(request.params.id);
    if (!genre) {
        response.status(404).send("The genre with the given ID was not found.");
        return;
    }
    response.send(genre);
}));

module.exports = router;

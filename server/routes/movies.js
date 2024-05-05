const express = require("express");
const { Movie, validator } = require("../models/movie");
const { Genre } = require("../models/genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const asyncCatch = require("../middleware/asyncCatch");
const validate = require("../middleware/validateRequest");

const router = express.Router();

// GET route to fetch all movies
router.get("/", asyncCatch(async (request, response) => {
    const movies = await Movie
        .find()
        .sort({ title: 1 });
    response.send(movies);
}));

// POST route to create a new movie
router.post("/", [auth, admin, validate(validator)], asyncCatch(async (request, response) => {
    // Find the genre by ID
    const genre = await Genre.findById(request.body.genreId);
    if (!genre) {
        response.status(400).send("Invalid Genre");
        return;
    }
    // Create a new movie instance
    const movie = new Movie({
        title: request.body.title,
        genre: request.body.genreId,
        stock: request.body.stock,
        dailyRentalRate: request.body.dailyRentalRate
    });
    await movie.save();
    response.send(movie);
}));

// PUT route to update an existing movie
router.put("/:id", [auth, admin, validate(validator)], asyncCatch(async (request, response) => {
    // Find the movie by ID
    const movie = await Movie.findById(request.params.id);
    if (!movie) {
        response.status(404).send("The movie with the given ID was not found.");
        return;
    }
    // Find the genre by ID
    const genre = await Genre.findById(request.body.genreId);
    if (!genre) {
        response.status(400).send("Invalid Genre");
        return;
    }
    // Update the movie's details
    movie.title = request.body.title;
    movie.genre = request.body.genreId;
    movie.stock = request.body.stock;
    movie.dailyRentalRate = request.body.dailyRentalRate;
    await movie.save();
    response.send(movie);
}));

// DELETE route to delete a movie
router.delete("/:id", [auth, admin], asyncCatch(async (request, response) => {
    const movie = await Movie.deleteOne({ _id: request.params.id });
    if (!movie) {
        response.status(404).send("The movie with the given ID was not found.");
        return;
    }
    response.send(movie);
}));

// GET route to fetch a movie by ID
router.get("/:id", asyncCatch(async (request, response) => {
    const movie = await Movie.findById(request.params.id);
    if (!movie) {
        response.status(404).send("The movie with the given ID was not found.");
        return;
    }
    response.send(movie);
}));

module.exports = router;

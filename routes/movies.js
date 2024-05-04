const express = require("express");
const {Movie, validate} = require("../models/movie");
const {Genre} = require("../models/genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const asyncCatch = require("../middleware/asyncCatch");

const router = express.Router();

router.get("/", asyncCatch(async (request, response) => {
    const movies = await Movie
        .find()
        .sort({title: 1});
    response.send(movies);
}));

router.post("/", [auth, admin], asyncCatch(async (request, response) => {
    const {error} = validate(request.body);
    if (error) {
        response.status(400).send(error);
        return;
    }
    const genre = await Genre.findById(request.body.genreId);
    if (!genre) {
        request.status(400).send("Invalid Movie")
        return;
    }
    const movie = new Movie({
        title: request.body.title,
        genre: request.body.genreId,
        stock: request.body.stock,
        dailyRentalRate: request.body.dailyRentalRate
    });
    await movie.save();
    response.send(movie);
}));

router.put("/:id", [auth, admin], asyncCatch(async (request, response) => {
    const {error} = validate(request.body);
    if (error) {
        response.status(400).send(error);
        return;
    }
    const movie = await Movie.findById(request.params.id);
    if (!movie) {
        response.status(404).send("The movie with the given ID was not found.");
        return;
    }
    const genre = await Genre.findById(request.body.genreId);
    if (!genre) {
        request.status(400).send("Invalid Movie")
        return;
    }
    movie.title = request.body.title;
    movie.genre = request.body.genreId;
    movie.stock = request.body.stock;
    movie.dailyRentalRate = request.body.dailyRentalRate;
    await movie.save();
    response.send(movie);
}));

router.delete("/:id", [auth, admin], asyncCatch(async (request, response) => {
    const movie = await Movie.deleteOne({_id: request.params.id});
    if (!movie) {
        response.status(404).send("The movie with the given ID was not found.");
        return;
    }
    response.send(movie);
}));

router.get("/:id", asyncCatch(async (request, response) => {
    const movie = await Movie.findById(request.params.id);
    if (!movie) {
        response.status(404).send("The movie with the given ID was not found.");
        return;
    }
    response.send(movie);
}));

module.exports = router;
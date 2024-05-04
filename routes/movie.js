const express = require("express");
const {Movie, validate} = require("../models/movie");
const {Genre} = require("../models/genre");

const router = express.Router();

router.get("/", async (request, response) => {
    try {
        const movies = await Movie
            .find()
            .sort({title: 1});
        response.send(movies);
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
    const genre = await Genre.findById(request.body.genreId);
    if (!genre) {
        request.status(400).send("Invalid Movie")
        return;
    }
    try {
        const movie = new Movie({
            title: request.body.title,
            genre: {
                _id: genre._id,
                name: genre.name
            },
            stock: request.body.stock,
            dailyRentalRate: request.body.dailyRentalRate
        });
        await movie.save();
        response.send(movie);
    } catch (error) {
        console.log(error.message);
    }
});

router.put("/:id", async (request, response) => {
    const {error} = validate(request.body);
    if (error) {
        response.status(400).send(error);
        return;
    }
    let movie = await Movie.findById(request.params.id);
    if (!movie) {
        response.status(404).send("The movie with the given ID was not found.");
        return;
    }
    const genre = await Genre.findById(request.body.genreId);
    if (!genre) {
        request.status(400).send("Invalid Movie")
        return;
    }
    try {
        movie.title = request.body.title;
        movie.genre = {
            _id: genre._id,
            name: genre.name
        };
        movie.stock = request.body.stock;
        movie.dailyRentalRate = request.body.dailyRentalRate;
        movie = await movie.save();
        response.send(movie);
    } catch (error) {
        console.log(error.message);
    }
});

router.delete("/:id", async (request, response) => {
    const movie = await Movie.deleteOne({_id: request.params.id});
    if (!movie) {
        response.status(404).send("The movie with the given ID was not found.");
        return;
    }
    response.send(movie);
});

router.get("/:id", async (request, response) => {
    const movie = await Movie.findById(request.params.id);
    if (!movie) {
        response.status(404).send("The movie with the given ID was not found.");
        return;
    }
    response.send(movie);
});

module.exports = router;
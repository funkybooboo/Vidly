const express = require("express");
const { Rental, validator } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const asyncCatch = require("../middleware/asyncCatch");
const validate = require("../middleware/validateRequest");


const router = express.Router();

// GET route to fetch all rentals
router.get("/", async (request, response) => {
    // Fetch all rentals and sort by dateOut in descending order
    const rentals = await Rental
        .find()
        .sort("-dateOut");
    response.send(rentals);
});

// POST route to create a new rental
router.post("/", [auth, admin, validate(validator)], asyncCatch(async (request, response) => {
    // Find the customer by ID
    const customer = await Customer.findById(request.body.customerId);
    if (!customer) {
        response.status(400).send("Invalid Customer");
        return;
    }
    // Find the movie by ID
    const movie = await Movie.findById(request.body.movieId);
    if (!movie) {
        response.status(400).send("Invalid Movie");
        return;
    }
    // Check if the movie is out of stock
    if (movie.stock === 0) {
        response.status(400).send("Movie is out of stock");
        return;
    }
    // Create a new rental instance
    const rental = new Rental({
        customer: request.body.customerId,
        movie: request.body.movieId,
    });
    // Save the rental and decrement the movie stock
    await rental.save();
    movie.stock--;
    await movie.save();
    response.send(rental);
}));

// GET route to fetch a rental by ID
router.get("/:id", asyncCatch(async (request, response) => {
    const rental = await Rental.findById(request.params.id);
    if (!rental) {
        response.status(404).send("The rental with the given ID was not found.");
        return;
    }
    response.send(rental);
}));

module.exports = router;

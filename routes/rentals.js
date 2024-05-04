const express = require("express");
const {Rental, validate} = require("../models/rental");
const {Movie} = require("../models/movie");
const {Customer} = require("../models/customer");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const asyncCatch = require("../middleware/asyncCatch");

const router = express.Router();

router.get("/", async (request, response) => {
    const rentals = await Rental
        .find()
        .sort("-dateOut");
    response.send(rentals);
});

router.post("/", [auth, admin], asyncCatch(async (request, response) => {
    const {error} = validate(request.body);
    if (error) {
        response.status(400).send(error);
        return;
    }
    const customer = await Customer.findById(request.body.customerId);
    if (!customer) {
        response.status(400).send("Invalid Customer");
        return;
    }
    const movie = await Movie.findById(request.body.movieId);
    if (!movie) {
        response.status(400).send("Invalid Movie");
        return;
    }
    if (movie.stock === 0) {
        response.status(400).send("Movie is out of stock");
        return;
    }
    const rental = new Rental({
        customer: request.body.customerId,
        movie: request.body.movieId,
    });
    // TODO add logic to fail if both dont save
    await rental.save();
    movie.stock--;
    await movie.save();
    response.send(rental);
}));

router.get("/:id", asyncCatch(async (request, response) => {
    const rental = await Rental.findById(request.params.id);
    if (!rental) {
        response.status(404).send("The rental with the given ID was not found.");
        return;
    }
    response.send(rental);
}));


module.exports = router;
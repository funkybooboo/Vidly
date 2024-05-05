const express = require("express");
const moment = require("moment");
const asyncCatch = require("../middleware/asyncCatch");
const {Rental, validator} = require("../models/rental");
const validate = require("../middleware/validateRequest");
const auth = require("../middleware/auth");
const {Movie} = require("../models/movie");

const router = express.Router();

// GET route to fetch all genres
router.post("/", [auth, validate(validator)], asyncCatch(async (request, response) => {
    const movie = await Movie.findById(request.body.movieId);
    if (!movie) {
        response.status(404).send("Movie not found");
        return;
    }
    const rental = await Rental.findOne({
        "customer.id": request.body.customerId,
        "movie.id": request.body.movieId,
    });
    if (!rental) {
        response.status(404).send("Rental not found");
        return;
    }
    if (rental.dateIn) {
        response.status(400).send("Return already processed");
        return;
    }
    rental.dateIn = new Date();
    const rentalDays = moment().diff(rental.dateOut, "days")
    rental.fee = rentalDays * movie.dailyRentalRate;
    await rental.save();
    movie.stock++;
    await movie.save();
    response.send(rental);
}));

module.exports = router;
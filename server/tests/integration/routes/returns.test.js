const mongoose = require("mongoose");
const request = require("supertest");
const moment = require("moment");
const {Rental} = require("../../../models/rental");
const {User} = require("../../../models/user");
const {Customer} = require("../../../models/customer");
const {Movie} = require("../../../models/movie");
const {Genre} = require("../../../models/genre");

describe("/api/returns", () => {

    let server;
    let genre;
    let customer;
    let movie;
    let rental;
    let token;

    function execute() {
        return request(server)
            .post("/api/returns")
            .set("x-auth-token", token)
            .send({customerId: customer._id, movieId: movie._id});
    }

    beforeEach(async () => {
        server = require("../../../index");
        genre = new Genre({
            _id: new mongoose.Types.ObjectId(),
            name: "genre1"
        });
        customer = new Customer({
            _id: new mongoose.Types.ObjectId(),
            name: "customer",
            isGold: true,
            email: "customer@test.com"
        });
        movie = new Movie({
            _id: new mongoose.Types.ObjectId(),
            title: "TestMovie",
            genre: genre._id,
            stock: 0,
            dailyRentalRate: 2
        });
        rental = new Rental({
            customer: customer._id,
            movie: movie._id,
        });
        await Promise.all([genre.save(), customer.save(), movie.save(), rental.save()]);
        token = new User().generateAuthToken();
    });

    afterEach(async () => {
        await Rental.deleteMany({});
        await User.deleteMany({});
        await Customer.deleteMany({});
        await Movie.deleteMany({});
        await Genre.deleteMany({});
        if (server) await server.close();
    });

    it("should find rental in db", async () => {
        const result = await Rental.findById(rental._id);
        expect(result).not.toBeNull();
    });

    it("should return 401 if client is not logged in", async () => {
        token = "";
        const response = await execute();
        expect(response.status).toBe(401);
    });

    it("should return 400 if customerId is not provided", async () => {
        customer._id = "";
        const response = await execute();
        expect(response.status).toBe(400);
    });

    it("should return 400 if movieId is not provided", async () => {
        movie._id = "";
        const response = await execute();
        expect(response.status).toBe(400);
    });

    it("should return 404 if no rental found for the customer/movie", async () => {
        await Rental.deleteMany({});
        const response = await execute();
        expect(response.status).toBe(404);
    });

    it("should return 400 if return is already processed", async () => {
        rental.dateIn = new Date();
        await rental.save();
        const response = await execute();
        expect(response.status).toBe(400);
    });

    it("should return 200 if request is valid", async () => {
        const response = await execute();
        expect(response.status).toBe(200);
    });

    it("should set the return date if request is valid", async () => {
        const response = await execute();
        const result = Rental.findById(rental._id);
        expect(result.dateIn).toBeDefined();
    });

    it("should set rentalFee if request is valid", async () => {
        rental.dateOut = moment().add(-7, "days").toDate();
        await rental.save();
        const response = await execute();
        const result = await Rental.findById(rental._id);
        expect(result.fee).toBe(14);
    });

    it("should increase movie stock if request is valid", async () => {
        const response = await execute();
        const result = await Movie.findById(movie._id);
        expect(result.stock).toBe(movie.stock + 1);
    });

    it("should return the rental if request is valid", async () => {
        const response = await execute();
        const result = await Rental.findById(rental._id);
        expect(Object.keys(response.body))
            .toEqual(expect.arrayContaining(["dateOut", "dateIn", "fee", "customer", "movie"]));
    });
});
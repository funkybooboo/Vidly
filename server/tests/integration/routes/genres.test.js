const request = require("supertest");
const {Genre} = require("../../../models/genre");
const {User} = require("../../../models/user");
const mongoose = require("mongoose");

let server;

describe("/api/genres", () => {

    beforeEach(() => {
        server = require("../../../index");
    });

    afterEach(async () => {
        await Genre.deleteMany({});
        await User.deleteMany({});
        if (server) {
            server.close();
        }
    });

    describe("GET /", () => {
        it("should return all genres", async () => {
            await Genre.insertMany([
                {name: "genre1"},
                {name: "genre2"},
            ]);
            const response = await request(server).get("/api/genres");
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(2);
            expect(response.body.some(genre => genre.name === "genre1")).toBeTruthy();
            expect(response.body.some(genre => genre.name === "genre2")).toBeTruthy();
        });
    });

    describe("GET /:id", () => {
        it("should return a genre if valid id is passed", async () => {
            const genre = new Genre({name: "genre1"});
            await genre.save();
            const response = await request(server).get("/api/genres/" + genre._id);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("name", genre.name);
        });

        it("should return 404 if invalid id is passed", async () => {
            const response = await request(server).get("/api/genres/1");
            expect(response.status).toBe(404);
        });

        it("should return 404 if no genre with the given id exists", async () => {
            const id = new mongoose.Types.ObjectId();
            const response = await request(server).get("/api/genres/" + id);
            expect(response.status).toBe(404);
        });
    });

    describe("POST /", () => {
        let token;
        let name;

        function execute() {
            return request(server)
                .post("/api/genres")
                .set("x-auth-token", token)
                .send({ name });
        }

        it("should return 401 if client is not logged in", async () => {
            token = "";
            name = "genre1";
            const response = await execute();
            expect(response.status).toBe(401);
        });

        it("should return 403 if client is not admin", async () => {
            token = new User().generateAuthToken();
            name = "genre1";
            const response = await execute();
            expect(response.status).toBe(403);
        });

        it("should return 400 if genre is less than 2 characters", async () => {
            token = new User({isAdmin: true}).generateAuthToken();
            name = "1"
            const response = await execute();
            expect(response.status).toBe(400);
        });

        it("should return 400 if genre is more than 50 characters", async () => {
            token = new User({isAdmin: true}).generateAuthToken();
            name = new Array(52).join("a");
            const response = await execute();
            expect(response.status).toBe(400);
        });

        it("should save the genre if it is valid", async () => {
            token = new User({isAdmin: true}).generateAuthToken();
            name = "genre1"
            const response = await execute();
            const genre = await Genre.find({name: "genre1"});
            expect(response.status).toBe(200);
            expect(genre).not.toBeNull();
        });

        it("should return the genre if it is valid", async () => {
            token = new User({isAdmin: true}).generateAuthToken();
            name = "genre1"
            const response = await execute();
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("_id");
            expect(response.body).toHaveProperty("name", "genre1");
        });
    });
});
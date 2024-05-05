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

    describe('PUT /:id', () => {
        let token;
        let newName;
        let genre;
        let id;

        function execute() {
            return request(server)
                .put('/api/genres/' + id)
                .set('x-auth-token', token)
                .send({ name: newName });
        }

        beforeEach(async () => {
            genre = new Genre({ name: 'genre1' });
            await genre.save();
            token = new User().generateAuthToken();
            id = genre._id;
            newName = 'updatedName';
        })

        it('should return 401 if client is not logged in', async () => {
            token = '';
            const response = await execute();
            expect(response.status).toBe(401);
        });

        it('should return 400 if genre is less than 5 characters', async () => {
            newName = '1234';
            const response = await execute();
            expect(response.status).toBe(400);
        });

        it('should return 400 if genre is more than 50 characters', async () => {
            newName = new Array(52).join('a');
            const response = await execute();
            expect(response.status).toBe(400);
        });

        it('should return 404 if id is invalid', async () => {
            id = 1;
            const response = await execute();
            expect(response.status).toBe(404);
        });

        it('should return 404 if genre with the given id was not found', async () => {
            id = new mongoose.Types.ObjectId();
            const response = await execute();
            expect(response.status).toBe(404);
        });

        it('should update the genre if input is valid', async () => {
            await execute();
            const updatedGenre = await Genre.findById(genre._id);
            expect(updatedGenre.name).toBe(newName);
        });

        it('should return the updated genre if it is valid', async () => {
            const response = await execute();
            expect(response.body).toHaveProperty('_id');
            expect(response.body).toHaveProperty('name', newName);
        });
    });

    describe('DELETE /:id', () => {
        let token;
        let genre;
        let id;

        function execute() {
            return request(server)
                .delete('/api/genres/' + id)
                .set('x-auth-token', token)
                .send();
        }

        beforeEach(async () => {
            genre = new Genre({ name: 'genre1' });
            await genre.save();
            id = genre._id;
            token = new User({ isAdmin: true }).generateAuthToken();
        })

        it('should return 401 if client is not logged in', async () => {
            token = '';
            const response = await execute();
            expect(response.status).toBe(401);
        });

        it('should return 403 if the user is not an admin', async () => {
            token = new User({ isAdmin: false }).generateAuthToken();
            const response = await execute();
            expect(response.status).toBe(403);
        });

        it('should return 404 if id is invalid', async () => {
            id = 1;
            const response = await execute();
            expect(response.status).toBe(404);
        });

        it('should return 404 if no genre with the given id was found', async () => {
            id = new mongoose.Types.ObjectId();
            const response = await execute();
            expect(response.status).toBe(404);
        });

        it('should delete the genre if input is valid', async () => {
            await execute();
            const genreInDb = await Genre.findById(id);
            expect(genreInDb).toBeNull();
        });

        it('should return the removed genre', async () => {
            const response = await execute();
            expect(response.body).toHaveProperty('_id', genre._id.toHexString());
            expect(response.body).toHaveProperty('name', genre.name);
        });
    });
});
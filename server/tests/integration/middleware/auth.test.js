const request = require("supertest");
const {Genre} = require("../../../models/genre");
const {User} = require("../../../models/user");



describe("auth middleware", () => {

    let server;
    let token;

    beforeEach(() => {
        server = require("../../../index");
    });

    afterEach(async () => {
        await Genre.deleteMany({});
        await User.deleteMany({});
        if (server) await server.close();
    });

    function execute() {
        return request(server)
            .post("/api/genres")
            .set("x-auth-token", token)
            .send({name: "genre1"});
    }

    it("should return 401 if no token is provided", async () => {
        token = "";
        const response = await execute();
        expect(response.status).toBe(401);
    });

    it("should return 400 if token is invalid", async () => {
        token = null;
        const response = await execute();
        expect(response.status).toBe(400);
    });

    it("should return 200 if token is valid", async () => {
        token = new User({isAdmin: true}).generateAuthToken();
        const response = await execute();
        expect(response.status).toBe(200);
    });

});
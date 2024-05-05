const {User} = require("../../../models/user");
const auth = require("../../../middleware/auth");
const mongoose = require("mongoose");

describe("auth middleware", () => {
    it("should populate request.user with the payload of the valid JWT", () => {
        const payload = {
            _id: new mongoose.Types.ObjectId().toHexString(),
            isAdmin: true
        };
        const token = new User(payload).generateAuthToken();
        const request = {
            header: jest.fn().mockReturnValue(token)
        };
        const response = {};
        const next = jest.fn();
        auth(request, response, next);
        expect(request.user).toBeDefined();
        expect(request.user).toMatchObject(payload);
    });
});
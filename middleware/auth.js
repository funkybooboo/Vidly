const jwt = require("jsonwebtoken");
const config = require("config");

function auth(request, response, next) {
    const token = request.header("x-auth-token");
    if (!token) {
        response.status(401).send("Access denied. No token provided.");
        return;
    }
    try {
        const jwtPrivateKey = config.get("jwtPrivateKey");
        request.user = jwt.verify(token, jwtPrivateKey);
        next();
    }
    catch (error) {
        response.status(400).send("Access denied. Invalid token.");
    }
}

module.exports = auth;
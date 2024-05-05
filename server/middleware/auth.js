const jwt = require("jsonwebtoken");
const config = require("config");

// Middleware function to verify JWT tokens
function auth(request, response, next) {
    // Extract the token from the request headers
    const token = request.header("x-auth-token");

    // If no token is provided, send a 401 Unauthorized response
    if (!token) {
        return response.status(401).send("Access denied. No token provided.");
    }

    try {
        // Get the JWT private key from configuration
        const jwtPrivateKey = config.get("jwtPrivateKey");

        // Attach the decoded user information to the request object
        request.user = jwt.verify(token, jwtPrivateKey);

        // Call the next middleware function in the chain
        next();
    } catch (error) {
        // If token verification fails, send a 400 Bad Request response
        response.status(400).send("Access denied. Invalid token.");
    }
}

// Export the auth middleware function
module.exports = auth;

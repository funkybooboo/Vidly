const express = require("express");

// Import route handlers and error middleware
const genres = require("../routes/genres");
const customers = require("../routes/customers");
const movies = require("../routes/movies");
const rentals = require("../routes/rentals");
const users = require("../routes/users");
const auth = require("../routes/auth");
const errorMiddleware = require("../middleware/error");

/**
 * Registers routes and middleware for the Express application.
 * @param {express.Application} app Express application instance
 */
function registerRoutes(app) {
    // Use built-in middleware to parse JSON bodies
    app.use(express.json());

    // Register route handlers for different endpoints
    app.use("/api/genres", genres);       // Route for handling genres
    app.use("/api/customers", customers); // Route for handling customers
    app.use("/api/movies", movies);       // Route for handling movies
    app.use("/api/rentals", rentals);     // Route for handling rentals
    app.use("/api/users", users);         // Route for handling users
    app.use("/api/auth", auth);           // Route for handling authentication

    // Register error handling middleware
    app.use(errorMiddleware);
}

module.exports = registerRoutes;

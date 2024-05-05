// Middleware function to check if the user is an admin
function admin(request, response, next) {
    // Check if the user is an admin
    if (!request.user.isAdmin) {
        // If not an admin, send 403 Forbidden status with a message
        response.status(403).send("Access denied.");
        return;
    }
    // If the user is an admin, call the next middleware function
    next();
}

// Export the admin middleware function
module.exports = admin;
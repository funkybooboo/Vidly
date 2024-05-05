// Middleware function to catch asynchronous errors in route handlers
function asyncCatch(handler) {
    // Return an asynchronous middleware function
    return async (request, response, next) => {
        try {
            // Call the provided handler function asynchronously
            await handler(request, response);
        } catch (error) {
            // If an error occurs, pass it to the next middleware function
            next(error);
        }
    };
}

// Export the asyncCatch middleware function
module.exports = asyncCatch;

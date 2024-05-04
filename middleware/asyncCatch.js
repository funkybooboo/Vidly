function asyncCatch(handler) {
    return async (request, response, next) => {
        try {
            await handler(request, response);
        }
        catch (error) {
            next(error);
        }
    }
}

module.exports = asyncCatch;
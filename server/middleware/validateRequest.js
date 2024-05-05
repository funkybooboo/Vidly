function validate(validator) {
    return (request, response, next) => {
        const {error} = validator(request.body);
        if (error) {
            response.status(404).send(error);
            return;
        }
        next();
    }
}

module.exports = validate;
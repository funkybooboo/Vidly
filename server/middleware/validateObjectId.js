const mongoose = require("mongoose");

function validateObjectId(request, response, next) {
    if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
        response.status(404).send("Invalid ID.");
        return;
    }
    next();
}

module.exports = validateObjectId;
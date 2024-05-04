function admin(request, response, next) {
    if (!request.user.isAdmin) {
        response.status(403).send("Access denied.");
        return;
    }
    next();
}

module.exports = admin;
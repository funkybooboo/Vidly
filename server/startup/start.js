const winston = require("winston");

function start(app) {
    const port = process.env.PORT || 3000;
    const server = app.listen(port, () => {
        winston.info(`Listening on port ${port}...`);
    });

    // Listen for SIGINT (Ctrl+C) and SIGTERM (termination signal) events
    process.on("SIGINT", () => {
        shutdown(server);
    });

    process.on("SIGTERM", () => {
        shutdown(server);
    });

    return server;
}

function shutdown(server) {
    server.close(() => {
        winston.info("Server was gracefully closed.");
        process.exit(0);
    });
}

module.exports = start;

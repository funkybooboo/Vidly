const winston = require("winston");

function start(app) {
    const port = process.env.PORT || 3000;
    return app.listen(port, () => {
        winston.info(`Listening on port ${port}...`);
    });
}

module.exports = start;

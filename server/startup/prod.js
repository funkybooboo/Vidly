const helmet = require("helmet");
const compression = require("compression");

function prod(app) {
    app.use(helmet());
    app.use(compression());
}

module.exports = prod;
const app = require('./app')

// require('dotenv').config()

module.exports = (req, res) => {
    app(req, res);
};

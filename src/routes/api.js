const bookRoute = require('./book');
const rootRoute = require('./root');

module.exports = [...rootRoute, ...bookRoute];

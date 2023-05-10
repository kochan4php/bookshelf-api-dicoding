const Hapi = require('@hapi/hapi');
const DB = require('./database');
const api = require('./routes/api');
require('dotenv').config();

(async () => {
    try {
        await DB.connect();

        const server = Hapi.server({
            port: process.env.PORT || 9000,
            host:
                process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
            routes: { cors: true }
        });

        server.route(api);

        await server.start();
        console.log('Server in running on %s', server.info.uri);
    } catch (err) {
        console.log(err.message);
    }
})();

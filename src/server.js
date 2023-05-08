const Hapi = require('@hapi/hapi');
const api = require('./routes/api');

(async () => {
    const server = Hapi.server({
        port: process.env.PORT || 9000,
        host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
        routes: { cors: true }
    });

    server.route(api);

    await server.start();
    console.log('Server in running on %s', server.info.uri);
})();

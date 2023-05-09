module.exports = [
    {
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            const response = h.response({
                message:
                    "Welcome to NodeJS Bookshelf Submission Backend API with Hapi Framework and Prisma ORM with Postgre SQL Database! Access '/books' path to do CRUD bookshelf operation."
            });

            response.code(200);
            response.type('application/json');
            return response;
        }
    },
    {
        method: '*',
        path: '/',
        handler: (request, h) => {
            const response = h.response({
                message: `Cannot access this path using ${request.method} method`
            });

            response.code(400);
            response.type('application/json');
            return response;
        }
    }
];

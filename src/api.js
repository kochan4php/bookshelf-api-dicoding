const bookHandler = require('./bookHandler');

module.exports = [
    {
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            const response = h.response({
                message:
                    "Welcome to NodeJS Bookshelf Submission Backend API with Hapi Framework! Access '/books' path to do CRUD bookshelf operation."
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
    },
    {
        method: 'POST',
        path: '/books',
        handler: bookHandler.addBook
    },
    {
        method: 'GET',
        path: '/books',
        handler: bookHandler.getAllBooks
    },
    {
        method: 'GET',
        path: '/books/{bookId}',
        handler: bookHandler.getSpecifiedBook
    },
    {
        method: 'PUT',
        path: '/books/{bookId}',
        handler: bookHandler.updateBook
    },
    {
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: bookHandler.deleteBook
    }
];

const bookHandler = require('./bookHandler');

module.exports = [
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

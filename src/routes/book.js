const BookController = require('../controllers/BookController');

module.exports = [
    {
        method: 'POST',
        path: '/books',
        handler: BookController.addNewBook
    },
    {
        method: 'GET',
        path: '/books',
        handler: BookController.getAllBooks
    },
    {
        method: 'GET',
        path: '/books/{bookId}',
        handler: BookController.getSpecifiedBook
    },
    {
        method: 'PUT',
        path: '/books/{bookId}',
        handler: BookController.updateSpecifiedBook
    },
    {
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: BookController.deleteSpecifiedBook
    }
];

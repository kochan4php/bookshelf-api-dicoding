const { nanoid } = require('nanoid');
const Joi = require('joi');
const books = require('../models/books');
const { failResponse } = require('../helpers');

const bookValidate = () => {
    return Joi.object({
        year: Joi.number().max(new Date().getFullYear()).required(),
        author: Joi.string().max(255).min(5).required(),
        summary: Joi.string().min(5).required(),
        publisher: Joi.string().max(255).min(5).required(),
        pageCount: Joi.number().required(),
        readPage: Joi.number().required(),
        reading: Joi.boolean().required()
    });
};

module.exports = {
    addNewBook: (request, h) => {
        try {
            const {
                name,
                year,
                author,
                summary,
                publisher,
                pageCount,
                readPage,
                reading
            } = request.payload;

            if (!name) {
                const message = 'Gagal menambahkan buku. Mohon isi nama buku';
                return failResponse(h, 400, message);
            }

            if (readPage > pageCount) {
                const message =
                    'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount';
                return failResponse(h, 400, message);
            }

            const schema = bookValidate();
            const result = schema.validate({
                year,
                author,
                summary,
                publisher,
                pageCount,
                readPage,
                reading
            });

            if (result.error) {
                return failResponse(h, 400, result.error.message);
            }

            const id = nanoid(16);
            const finished = pageCount === readPage;
            const insertedAt = new Date().toISOString();
            const updatedAt = insertedAt;

            books.push({
                id,
                name,
                year,
                author,
                summary,
                publisher,
                pageCount,
                readPage,
                finished,
                reading,
                insertedAt,
                updatedAt
            });

            const isSuccess = books.find((item) => item.id === id);

            if (!isSuccess) {
                throw new Error('Gagal menambahkan buku');
            }

            const response = h.response({
                status: 'success',
                message: 'Buku berhasil ditambahkan',
                data: {
                    bookId: id
                }
            });

            response.type('application/json');
            response.code(201);
            return response;
        } catch (err) {
            return failResponse(h, 500, err.message);
        }
    },

    getAllBooks: (request, h) => {
        try {
            const { name, reading, finished } = request.query;

            let allBooks = books;

            if (reading) {
                allBooks = allBooks.filter(
                    (item) => item.reading === Boolean(Number(reading))
                );
            }

            if (finished) {
                allBooks = allBooks.filter(
                    (item) => item.finished === Boolean(Number(finished))
                );
            }

            if (name) {
                allBooks = allBooks.filter((item) =>
                    item.name.toLowerCase().includes(name.toLowerCase())
                );
            }

            allBooks = allBooks.map((item) => ({
                id: item.id,
                name: item.name,
                publisher: item.publisher
            }));

            const response = h.response({
                status: 'success',
                data: {
                    books: allBooks
                }
            });

            response.type('application/json');
            response.code(200);
            return response;
        } catch (err) {
            return failResponse(h, 500, err.message);
        }
    },

    getSpecifiedBook: (request, h) => {
        try {
            const { bookId } = request.params;
            const book = books.find((item) => item.id === bookId);

            if (!book) {
                const message = 'Buku tidak ditemukan';
                return failResponse(h, 404, message);
            }

            const response = h.response({
                status: 'success',
                data: {
                    book
                }
            });

            response.type('application/json');
            response.code(200);
            return response;
        } catch (err) {
            return failResponse(h, 500, err.message);
        }
    },

    updateSpecifiedBook: (request, h) => {
        try {
            const { bookId } = request.params;
            const bookIndex = books.findIndex((item) => item.id === bookId);

            if (bookIndex === -1) {
                const message = 'Gagal memperbarui buku. Id tidak ditemukan';
                return failResponse(h, 404, message);
            }

            const {
                name,
                year,
                author,
                summary,
                publisher,
                pageCount,
                readPage,
                reading
            } = request.payload;

            if (!name) {
                const message = 'Gagal memperbarui buku. Mohon isi nama buku';
                return failResponse(h, 400, message);
            }

            if (readPage > pageCount) {
                const message =
                    'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount';
                return failResponse(h, 400, message);
            }

            const schema = bookValidate();
            const result = schema.validate({
                year,
                author,
                summary,
                publisher,
                pageCount,
                readPage,
                reading
            });

            if (result.error) {
                return failResponse(h, 400, result.error.message);
            }

            books[bookIndex] = {
                ...books[bookIndex],
                name,
                year,
                author,
                summary,
                publisher,
                pageCount,
                readPage,
                reading
            };

            const response = h.response({
                status: 'success',
                message: 'Buku berhasil diperbarui'
            });

            response.type('application/json');
            response.code(200);
            return response;
        } catch (err) {
            return failResponse(h, 500, err.message);
        }
    },

    deleteSpecifiedBook: (request, h) => {
        try {
            const { bookId } = request.params;
            const bookIndex = books.findIndex((item) => item.id === bookId);

            if (bookIndex === -1) {
                const message = 'Buku gagal dihapus. Id tidak ditemukan';
                return failResponse(h, 404, message);
            }

            books.splice(bookIndex, 1);

            const response = h.response({
                status: 'success',
                message: 'Buku berhasil dihapus'
            });

            response.type('application/json');
            response.code(200);
            return response;
        } catch (err) {
            return failResponse(h, 500, err.message);
        }
    }
};

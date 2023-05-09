const { nanoid } = require('nanoid');
const { failResponse } = require('../helpers');
const DB = require('../database');
const bookValidation = require('../validations/bookValidation');

module.exports = {
    addNewBook: async (request, h) => {
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

            const schema = bookValidation();
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

            const id = nanoid(30);
            const finished = pageCount === readPage ? 1 : 0;
            const readStatus = reading ? 1 : 0;
            const insertedAt = new Date().toISOString();
            const updatedAt = insertedAt;

            const insertBook = await DB.query(
                `INSERT INTO books (
                    id, name, year, author, summary, publisher, page_count, read_page, finished, reading, inserted_at, updated_at
                ) VALUES (
                    $1 ,$2 ,$3 ,$4 ,$5 ,$6 ,$7 ,$8 ,$9, $10, $11, $12
                ) RETURNING id;`,
                [
                    id,
                    name,
                    year,
                    author,
                    summary,
                    publisher,
                    pageCount,
                    readPage,
                    finished,
                    readStatus,
                    insertedAt,
                    updatedAt
                ]
            );

            if (!insertBook.rowCount) {
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

    getAllBooks: async (request, h) => {
        try {
            const { name, reading, finished } = request.query;
            const result = await DB.query('SELECT * FROM books');
            let allBooks = result.rows;

            if (reading) {
                allBooks = allBooks.filter(
                    (item) => item.reading === Number(reading)
                );
            }

            if (finished) {
                allBooks = allBooks.filter(
                    (item) => item.finished === Number(finished)
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

    getSpecifiedBook: async (request, h) => {
        try {
            const { bookId } = request.params;
            const result = await DB.query('SELECT * FROM books WHERE id = $1', [
                bookId
            ]);
            const book = result.rows[0];

            if (book.length === 0) {
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

    updateSpecifiedBook: async (request, h) => {
        try {
            const { bookId } = request.params;
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

            const schema = bookValidation();
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

            const finished = pageCount === readPage ? 1 : 0;
            const readStatus = reading ? 1 : 0;
            const updatedAt = new Date().toISOString();

            const updateBook = await DB.query(
                `
                    UPDATE books SET
                        name = $2,
                        year = $3,
                        author = $4, 
                        summary = $5, 
                        publisher = $6,
                        page_count = $7,
                        read_page = $8,
                        finished = $9,
                        reading = $10,
                        updated_at = $11
                    WHERE id = $1
                `,
                [
                    bookId,
                    name,
                    year,
                    author,
                    summary,
                    publisher,
                    pageCount,
                    readPage,
                    finished,
                    readStatus,
                    updatedAt
                ]
            );

            if (!updateBook.rowCount) {
                const message = 'Gagal memperbarui buku. Id tidak ditemukan';
                return failResponse(h, 404, message);
            }

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

    deleteSpecifiedBook: async (request, h) => {
        try {
            const { bookId } = request.params;
            const result = await DB.query('DELETE FROM books WHERE id = $1', [
                bookId
            ]);

            if (!result.rowCount) {
                const message = 'Buku gagal dihapus. Id tidak ditemukan';
                return failResponse(h, 404, message);
            }

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

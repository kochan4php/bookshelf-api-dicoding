const { nanoid } = require('nanoid');
const { failResponse } = require('../helpers');
const { PrismaClient } = require('@prisma/client');
const bookValidation = require('../validations/bookValidation');

const prisma = new PrismaClient();

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

            const id = nanoid(16);
            const finished = pageCount === readPage;
            const insertedAt = new Date().toISOString();
            const updatedAt = insertedAt;

            await prisma.book.create({
                data: {
                    id,
                    name,
                    year,
                    author,
                    summary,
                    publisher,
                    page_count: pageCount,
                    read_page: readPage,
                    finished,
                    reading,
                    inserted_at: insertedAt,
                    updated_at: updatedAt
                }
            });

            const resultBook = await prisma.book.findFirst({
                where: { id }
            });

            if (!resultBook) {
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
            let books = await prisma.book.findMany({
                orderBy: { inserted_at: 'desc' }
            });

            if (reading) {
                books = books.filter(
                    (item) => item.reading === Boolean(Number(reading))
                );
            }

            if (finished) {
                books = books.filter(
                    (item) => item.finished === Boolean(Number(finished))
                );
            }

            if (name) {
                books = books.filter((item) =>
                    item.name.toLowerCase().includes(name.toLowerCase())
                );
            }

            books = books.map((item) => ({
                id: item.id,
                name: item.name,
                publisher: item.publisher
            }));

            const response = h.response({
                status: 'success',
                data: {
                    books
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
            const book = await prisma.book.findFirst({ where: { id: bookId } });

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

    updateSpecifiedBook: async (request, h) => {
        try {
            const { bookId } = request.params;
            const book = await prisma.book.findFirst({
                where: { id: bookId }
            });

            if (!book) {
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

            const updatedAt = new Date().toISOString();
            const finished = pageCount === readPage;
            await prisma.book.update({
                where: { id: bookId },
                data: {
                    name,
                    year,
                    author,
                    summary,
                    publisher,
                    page_count: pageCount,
                    read_page: readPage,
                    finished,
                    reading,
                    updated_at: updatedAt
                }
            });

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
            const book = await prisma.book.findFirst({
                where: { id: bookId }
            });

            if (!book) {
                const message = 'Buku gagal dihapus. Id tidak ditemukan';
                return failResponse(h, 404, message);
            }

            await prisma.book.delete({ where: { id: bookId } });

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

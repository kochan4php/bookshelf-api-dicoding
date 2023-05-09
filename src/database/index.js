const { Client } = require('pg');

const DB = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_DATABASE || 'dicoding_bookshelf',
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'deosbrn981#'
});

module.exports = DB;

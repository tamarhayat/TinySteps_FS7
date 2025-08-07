const mysql = require('mysql2/promise');

const userDB = mysql.createPool({
    host: 'localhost',
    user: 'esther',
    password: 'esther123',
    database: 'users_TinySteps'
});

const mainDB = mysql.createPool({
    host: 'localhost',
    user: 'malka',
    password: 'malka123',
    database: 'TinySteps'
});

module.exports = { userDB, mainDB };
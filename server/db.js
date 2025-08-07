const mysql = require('mysql2/promise');

const userDB = mysql.createPool({
    host: 'localhost',
    user: '',
    password: '',
    database: 'users_TinySteps'
});

const mainDB = mysql.createPool({
    host: 'localhost',
    user: '',
    password: '',
    database: 'TinySteps'
});

module.exports = { userDB, mainDB };
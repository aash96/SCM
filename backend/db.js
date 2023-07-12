// lib/db.js

const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'scmsystem',
  password: '12345678'
});

connection.connect();
module.exports = connection;
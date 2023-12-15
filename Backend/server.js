const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config({});

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.PASSWORD,
  database: process.env.DB,
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: " + err.stack);
    throw err;
  }
  console.log("Connected to MySQL as id " + connection.threadId);
});

module.exports = connection;

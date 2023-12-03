const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "tanvinhktqn0201@",
  database: "sys",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: " + err.stack);
    throw err;
  }
  console.log("Connected to MySQL as id " + connection.threadId);
});

module.exports = connection;

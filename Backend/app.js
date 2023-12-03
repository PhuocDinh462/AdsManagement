const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const corsOptions = require("./configs/corsOptions.js");
const homeRoute = require("./routes/homeRoute.js");

const app = express();
dotenv.config({ path: "./config.env" });

const port = 5000;

app.use(morgan("combined"));
app.use(cors(corsOptions));

// const mysql = require("mysql2");

// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "tanvinhktqn0201@",
//   database: "sys",
// });

// connection.connect((err) => {
//   if (err) {
//     console.error("Error connecting to MySQL: " + err.stack);
//     return;
//   }
//   console.log("Connected to MySQL as id " + connection.threadId);
// });

app.use("/home", homeRoute);

app.listen(port, () => {
  console.log(`Server app listening on port ${port}`);
});

// module.exports.connection = connection;

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const corsOptions = require("./configs/corsOptions.js");
const authRoute = require("./routes/authRoute.js");

const app = express();
dotenv.config({ path: "./config.env" });

const port = process.env.PORT;

app.use(morgan("combined"));
app.use(cors(corsOptions));
app.use(express.json());


app.use("/auth", authRoute)

app.listen(port, () => {
  console.log(`Server app listening on port ${port}`);
});

// module.exports.connection = connection;

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const corsOptions = require("./configs/corsOptions.js");
const authRoute = require("./routes/authRoute.js");
const accountRoute = require("./routes/accountRoute.js");
const googleRoute = require("./routes/googleRoute.js");
const authenticateUser = require("./middlewares/authentication.middleware.js")

const app = express();
dotenv.config({ path: "./config.env" });

const port = process.env.PORT;

// app.use(morgan("combined"));
app.use(cors(corsOptions));
app.use(express.json());

app.use("/", googleRoute)
app.use("/auth", authRoute)
app.use("/account", authenticateUser, accountRoute)

app.listen(port, () => {
  console.log(`Server app listening on port ${port}`);
});

// module.exports.connection = connection;

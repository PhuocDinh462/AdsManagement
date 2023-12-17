const express = require('express');
const dotenv = require('dotenv');
// const morgan = require("morgan");
const cors = require('cors');
const corsOptions = require('./configs/corsOptions.js');
const authRoute = require('./routes/authRoute.js');
const accountRoute = require('./routes/accountRoute.js');
const cardeRoute = require('./routes/cardeRoute.js');
const authenticateUser = require('./middlewares/authentication.middleware.js');

const app = express();
dotenv.config({ path: './config.env' });

const port = process.env.PORT;

// app.use(morgan("combined"));
app.use(cors(corsOptions));
app.use(express.json());

app.use('/auth', authRoute);
app.use('/account', authenticateUser, accountRoute);
app.use('/cadre', cardeRoute);

app.listen(port, () => {
  console.log(`Server app listening on port ${port}`);
});

// module.exports.connection = connection;


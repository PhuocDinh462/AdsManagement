const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const corsOptions = require('./configs/corsOptions.js');
const authRoute = require('./routes/authRoute.js');
const accountRoute = require('./routes/accountRoute.js');
const cadreRoute = require('./routes/cadreRoute.js');
const authenticateUser = require('./middlewares/authentication.middleware.js');
const googleRoute = require('./routes/googleRoute.js');

const app = express();
dotenv.config({ path: './config.env' });

const port = process.env.PORT;

app.use(cors(corsOptions));
app.use(express.json());

app.use('/', googleRoute);
app.use('/auth', authRoute);
app.use('/account', authenticateUser, accountRoute);
app.use('/cadre', cadreRoute);

app.listen(port, () => {
  console.log(`Server app listening on port ${port}`);
});


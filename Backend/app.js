const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const corsOptions = require('./configs/corsOptions.js');
const authRoute = require('./routes/authRoute.js');
const accountRoute = require('./routes/accountRoute.js');
const cadreRoute = require('./routes/cadreRoute.js');
const authenticateUser = require('./middlewares/authentication.middleware.js');
const googleRoute = require('./routes/googleRoute.js');
const wardRoute = require('./routes/wardRoute.js');
const editBoardRoute = require('./routes/editBoardRequestRoute.js')
const editPointRoute = require('./routes/editPointRequestRoute.js')
const boardTypeRoute = require('./routes/boardTypeRoute.js')
const advertisementTypeRoute = require('./routes/advertisementTypeRoute.js')
const boardRoute = require('./routes/boardRoute.js')
const pointRoute = require('./routes/pointRoute.js')

const app = express();
dotenv.config({ path: './config.env' });

const port = process.env.PORT;

app.use(cors(corsOptions));
app.use(express.json());

app.use('/', googleRoute);
app.use('/board', authenticateUser, boardRoute)
app.use('/point', authenticateUser, pointRoute)
app.use('/edit_board', authenticateUser, editBoardRoute)
app.use('/edit_point', authenticateUser, editPointRoute)
app.use('/board_type', boardTypeRoute)
app.use('/advertisement_type', advertisementTypeRoute)
app.use('/auth', authRoute);
app.use('/account', authenticateUser, accountRoute);
app.use('/cadre', cadreRoute);
app.use('/ward', wardRoute);

app.listen(port, () => {
  console.log(`Server app listening on port ${port}`);
});


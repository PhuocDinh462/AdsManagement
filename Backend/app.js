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
const editBoardRoute = require('./routes/editBoardRequestRoute.js');
const editPointRoute = require('./routes/editPointRequestRoute.js');
const boardTypeRoute = require('./routes/boardTypeRoute.js');
const advertisementTypeRoute = require('./routes/advertisementTypeRoute.js');
const boardRoute = require('./routes/boardRoute.js');
const pointRoute = require('./routes/pointRoute.js');
const { body } = require('express-validator');
const axios = require('axios');

const connection = require('./server'); // Sử dụng module quản lý kết nối cơ sở dữ liệu

const app = express();

dotenv.config({ path: './config.env' });

const port = process.env.PORT;

app.use(cors(corsOptions));

app.use(express.json());

app.use('/', googleRoute);
app.use('/board', authenticateUser, boardRoute);
app.use('/point', authenticateUser, pointRoute);
app.use('/edit_board', authenticateUser, editBoardRoute);
app.use('/edit_point', authenticateUser, editPointRoute);
app.use('/board_type', boardTypeRoute);
app.use('/advertisement_type', advertisementTypeRoute);
app.use('/auth', authRoute);
app.use('/account', authenticateUser, accountRoute);
app.use('/cadre', cadreRoute);
app.use('/ward', wardRoute);

const server = app.listen(port, () => {
  console.log(`Server app listening on port ${port}`);
});

const socketIo = require('socket.io')(server, {
  cors: { origin: '*' },
});

socketIo.on('connection', (socket) => {
  ///Handle khi có connect từ client tới
  console.log('New client connected ' + socket.id);

  // socket.emit('update', socket.id); // Example send event to client

  socket.on('disconnect', () => {
    console.log('Client disconnected'); // Khi client disconnect thì log ra terminal.
  });
});

//Cách sử dụng
// const socket = require('../app');
// socket?.socketIo?.emit('update', 'aaaaa');

module.exports.socketIo = socketIo;

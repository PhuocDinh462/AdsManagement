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

const app = express();

dotenv.config({ path: './config.env' });

const port = process.env.PORT;

app.use(cors(corsOptions));

app.use(express.json());

app.use('/', googleRoute);
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

//const io = require('./app'); // ví dụ require ở file khác để sử dụng

socketIo.on('connection', (socket) => {
  ///Handle khi có connect từ client tới
  console.log('New client connected' + socket.id);

  socket.emit('update', socket.id); // Example send event to client

  socket.on('disconnect', () => {
    console.log('Client disconnected'); // Khi client disconnect thì log ra terminal.
  });
});

module.exports = socketIo;

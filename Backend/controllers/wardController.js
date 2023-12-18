const catchAsync = require('../utils/catchAsync');
const connection = require('../server');

const getAdSpotsByWardId = catchAsync(async (req, res, next) => {
  const query = 'SELECT * FROM advertising_point where point_id = ?';

  connection.query(query, [req.params.id], (err, results) => {
    if (err) {
      console.error('Error executing query: ', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.status(200).json({ status: 'success', data: results });
  });
});

const getAdBoardsBySpotId = catchAsync(async (req, res, next) => {
  const query = 'SELECT * FROM advertising_board where point_id = ?';

  connection.query(query, [req.params.id], (err, results) => {
    if (err) {
      console.error('Error executing query: ', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.status(200).json({ status: 'success', data: results });
  });
});

module.exports = { getAdSpotsByWardId, getAdBoardsBySpotId };

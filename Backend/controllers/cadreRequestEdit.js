const catchAsync = require('../utils/catchAsync');
const connection = require('../server');

const getRequestEditBoards = catchAsync(async (req, res, next) => {
  const query = `
    SELECT
      erb.*,
      bt.type_name AS board_type_name,
      ab.advertisement_content AS board_advertisement_content,
      u.username AS created_by_username,
      u.phone AS created_by_phone,
      u.email AS created_by_email
    FROM
      edit_request_board erb
    LEFT JOIN
      board_type bt ON erb.board_type_id = bt.board_type_id
    LEFT JOIN
      advertising_board ab ON erb.board_id = ab.board_id
    LEFT JOIN
      user u ON erb.created_by = u.user_id
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.status(200).json(results);
  });
});

const getRequestEditPoints = catchAsync(async (req, res, next) => {
  const query = `
    SELECT
      erp.*,
      at.type_name AS advertisement_type_name,
      ap.ward_id,
      w.ward_name,
      u.username AS created_by_username,
      u.phone AS created_by_phone,
      u.email AS created_by_email
    FROM
      edit_request_point erp
    LEFT JOIN
      advertisement_type at ON erp.advertisement_type_id = at.advertisement_type_id
    LEFT JOIN
      advertising_point ap ON erp.point_id = ap.point_id
    LEFT JOIN
      ward w ON ap.ward_id = w.ward_id
    LEFT JOIN
      user u ON erp.created_by = u.user_id
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.status(200).json(results);
  });
});

module.exports = { getRequestEditBoards, getRequestEditPoints };


const catchAsync = require('../utils/catchAsync');
const connection = require('../server');
const socket = require('../app');

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
      ap.address,
      w.ward_name,
      ap.lat,
      ap.lng,
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

const getDetailInforBoard = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const query = `
    SELECT 
      ab.*, 
      ap.ward_id, 
      ap.advertisement_type_id, 
      ap.location_type, 
      ap.image_url AS point_image_url, 
      ap.lat, 
      ap.lng, 
      ap.is_planning, 
      ap.created_at AS point_created_at, 
      ap.updated_at AS point_updated_at, 
      bt.type_name
    FROM advertising_board ab
    JOIN advertising_point ap ON ab.point_id = ap.point_id
    JOIN board_type bt ON ab.board_type_id = bt.board_type_id
    WHERE ab.board_id = ?`;

  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ status: 'error', error: 'Internal Server Error' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ status: 'error', error: 'Board not found' });
      return;
    }

    // Send the board details with related information in the response
    res.status(200).json(results[0]);
  });
});

const getDetailAdvertisingPoint = catchAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT
        ap.*,
        at.type_name AS advertisement_type_name,
        w.ward_name,
        ap.lat,
        ap.lng
      FROM
        advertising_point ap
      LEFT JOIN
        advertisement_type at ON ap.advertisement_type_id = at.advertisement_type_id
      LEFT JOIN
        ward w ON ap.ward_id = w.ward_id
      WHERE
        ap.point_id = ?
    `;

    connection.query(query, id, (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ status: 'error', error: 'Internal Server Error' });
        return;
      }

      if (results.length === 0) {
        res.status(404).json({ status: 'error', error: 'Advertising Point not found' });
        return;
      }

      res.status(200).json({
        status: 'success',
        advertisingPoint: results[0],
      });
    });
  } catch (error) {
    console.error('Error in getDetailAdvertisingPoint:', error);
    res.status(500).json({ status: 'error', error: 'Internal Server Error' });
  }
});

const updateStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { type, status } = req.body;

  try {
    let tableName, idColumnName;
    if (type === 'board') {
      tableName = 'edit_request_board';
      idColumnName = 'id';
    } else if (type === 'point') {
      tableName = 'edit_request_point';
      idColumnName = 'id';
    } else {
      return res.status(400).json({ error: 'Invalid type' });
    }

    const updateQuery = `
      UPDATE ${tableName}
      SET edit_status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE ${idColumnName} = ?
    `;

    connection.query(updateQuery, [status, id], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ status: 'error', error: 'Internal Server Error' });
        return;
      }

      if (results.affectedRows > 0) {
        return res.status(200).json({ status: 'success', message: 'Update successful' });
      } else {
        return res.status(404).json({ status: 'error', error: 'Not found' });
      }
    });
  } catch (error) {
    console.error('Error updating edit request:', error);
    return res.status(500).json({ status: 'error', error: 'Internal Server Error' });
  }
});

module.exports = {
  getRequestEditBoards,
  getRequestEditPoints,
  getDetailInforBoard,
  getDetailAdvertisingPoint,
  updateStatus,
};


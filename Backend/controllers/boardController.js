const catchAsync = require('../utils/catchAsync');
const connection = require('../server'); // Sử dụng module quản lý kết nối cơ sở dữ liệu

const getInforBoard = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  connection.query(
    `SELECT
      ab.*,
      bt.type_name AS board_type_name,
      ep.edit_status,
      ep.reason AS edit_reason,
      bt.type_name AS board_type_name,
      ap.ward_id,
      w.ward_name
    FROM
      advertising_board ab
    LEFT JOIN
      board_type bt ON ab.board_type_id = bt.board_type_id
    LEFT JOIN
      edit_request_point ep ON ab.point_id = ep.point_id
    LEFT JOIN
      advertising_point ap ON ab.point_id = ap.point_id
    LEFT JOIN
      ward w ON ap.ward_id = w.ward_id
    WHERE
      ab.board_id = ?`,
    id,
    (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ status: 'error', error: 'Internal Server Error' });
        return;
      }

      if (results.length === 0) {
        res.status(404).json({ status: 'error', error: 'Board not found' });
        return;
      }

      res.status(200).json({
        status: 'success',
        board: results[0],
      });
    }
  );
  // const { id } = req.params;
  // connection.query(`select * from advertising_board where board_id = ?`, id, (err, results) => {
  //   res.status(200).json({
  //     status: 'success',
  //     board: results[0],
  //   });
  // });

});
const getBoardsByPoint = catchAsync(async (req, res, next) => {
  const { point_id } = req.params;
  connection.query(
    `select * from advertising_board where point_id = ?`,
    point_id,
    (err, results) => {
      res.status(200).json({
        status: "success",
        board: results,
      });

    }
  );
})
module.exports = { getInforBoard, getBoardsByPoint };


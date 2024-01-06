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

const updateBoard = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { board_type_id, advertisement_content, advertisement_image_url, width, height, point_id } = req.body;

  // Kiểm tra xem bảng quảng cáo có tồn tại không
  const checkBoardQuery = 'SELECT * FROM advertising_board WHERE board_id = ?';
  connection.query(checkBoardQuery, id, (checkErr, checkResults) => {
    if (checkErr) {
      console.error('Error checking board existence:', checkErr);
      res.status(500).json({ status: 'error', error: 'Internal Server Error' });
      return;
    }

    if (checkResults.length === 0) {
      res.status(404).json({ status: 'error', error: 'Board not found' });
      return;
    }

    // Nếu tồn tại, thực hiện cập nhật
    const updateBoardQuery = `
      UPDATE advertising_board
      SET
        board_type_id = ?,
        advertisement_content = ?,
        advertisement_image_url = ?,
        width = ?,
        height = ?,
        point_id = ?
      WHERE
        board_id = ?
    `;

    connection.query(
      updateBoardQuery,
      [board_type_id, advertisement_content, advertisement_image_url, width, height, point_id, id],
      (updateErr, updateResults) => {
        if (updateErr) {
          console.error('Error updating board:', updateErr);
          res.status(500).json({ status: 'error', error: 'Internal Server Error' });
          return;
        }

        res.status(200).json({ status: 'success', message: 'Board updated successfully' });
      }
    );
  });
});

const getBoardsByPoint = catchAsync(async (req, res, next) => {
  const { point_id } = req.params;
  connection.query(`select * from advertising_board where point_id = ?`, point_id, (err, results) => {
    res.status(200).json({
      status: 'success',
      board: results,
    });
  });
});
module.exports = { getInforBoard, updateBoard, getBoardsByPoint };


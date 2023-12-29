const catchAsync = require('../utils/catchAsync');
const connection = require('../server'); // Sử dụng module quản lý kết nối cơ sở dữ liệu

const getAllPoint = catchAsync(async (req, res) => {
  connection.query(`select * from advertising_point `, id, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
      });
      return;
    }
    res.status(200).json({
      status: 'success',
      point: results[0],
    });
  });
});

const getPointByType = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  connection.query(
    `select * from advertising_point where advertisement_type_id = ? and is_planning = true`,
    [id],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({
          status: 'error',
          message: 'Internal Server Error',
        });
        return;
      }
      res.status(200).json({
        status: 'success',
        point: results[0],
      });
    }
  );
});

const getInforPoint = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  connection.query(`select * from advertising_point where point_id = ?`, [id], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
      });
      return;
    }
    res.status(200).json({
      status: 'success',
      point: results[0],
    });
  });
});

const getPointsByManager = catchAsync(async (req, res, next) => {
  connection.query(
    `SELECT ap.*
    FROM advertising_point ap
    JOIN ward w ON ap.ward_id = w.ward_id
    WHERE w.manager_id = ?`,
    [req.user.user_id], // Đặt giá trị manager_id vào mảng tham số
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({
          status: 'error',
          message: 'Internal Server Error',
        });
      } else {
        res.status(200).json({
          status: 'success',
          point: results,
        });
      }
    }
  );
});

module.exports = { getPointByType, getAllPoint, getInforPoint, getPointsByManager };

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

const getPointByTypeAndManage = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { user_type, ward_id, district_id } = req.user;

  const queryString =
    user_type === 'district'
      ? `SELECT ap.*
          FROM advertising_point ap
          JOIN ward w ON ap.ward_id = w.ward_id
          WHERE w.district_id = ${district_id}
            AND ap.advertisement_type_id = ${id}
            AND ap.is_planning = true ;`
      : `SELECT * 
            FROM advertising_point ap
            JOIN ward w ON ap.ward_id = w.ward_id
              WHERE w.ward_id = ${ward_id}
                AND ap.advertisement_type_id = ${id}
                AND ap.is_planning = true;`;

  connection.query(queryString, (err, results) => {
    if (err) {
      res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
      });
      return;
    }

    // const response = results[0]
    res.status(200).json({
      status: 'success',
      data: results,
    });
  });
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

module.exports = { getPointByTypeAndManage, getAllPoint, getInforPoint, getPointsByManager };

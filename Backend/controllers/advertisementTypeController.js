const catchAsync = require('../utils/catchAsync');
const connection = require('../server'); // Sử dụng module quản lý kết nối cơ sở dữ liệu

const getAll = catchAsync(async (req, res, next) => {
  connection.query(`select * from advertisement_type`, (error, results) => {
    if (error) {
      console.error('Error executing query: ' + error.stack);
      return res.status(401).json({
        error: 'Invalid Information.',
      });
    }
    res.status(200).json({
      status: 'success',
      advertisement_types: results,
    });
  });
});

module.exports = { getAll };


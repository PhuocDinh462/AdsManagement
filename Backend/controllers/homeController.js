const catchAsync = require("../utils/catchAsync");
const connection = require("../server"); // Sử dụng module quản lý kết nối cơ sở dữ liệu

module.exports.getAll = catchAsync(async (req, res, next) => {
  connection.query("SELECT * FROM actor", (err, results) => {
    if (err) {
      console.error("Error executing query: " + err.stack);
      return res.status(500).json({ error: "Database error" });
    }
    console.log(results);
    res.status(200).json({
      status: "success",
      data: {
        data: results,
      },
    });
  });
});

const catchAsync = require("../utils/catchAsync");
const connection = require("../server"); // Sử dụng module quản lý kết nối cơ sở dữ liệu

const getInforBoard = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    connection.query(
        `select * from advertising_board where board_id = ?`,
        id,
        (err, results) => {
            res.status(200).json({
                status: "success",
                board: results[0],
            });

        }
    );
})

module.exports = { getInforBoard };

const catchAsync = require("../utils/catchAsync");
const connection = require("../server"); // Sử dụng module quản lý kết nối cơ sở dữ liệu

const getInforPoint = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    console.log(id);
    connection.query(
        `select * from advertising_point where point_id = ?`,
        id,
        (err, results) => {
            res.status(200).json({
                status: "success",
                point: results[0],
            });

        }
    );
})

module.exports = { getInforPoint };

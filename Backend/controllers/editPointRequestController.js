const catchAsync = require("../utils/catchAsync");
const connection = require("../server"); // Sử dụng module quản lý kết nối cơ sở dữ liệu

const createEditPointRequest = catchAsync(async (req, res, next) => {
    const { location_type, is_planning, image_url, point_id, edit_status, request_time, reason } = req.body;
    const insertRequest = "INSERT INTO `edit_request_point` (location_type, is_planning, image_url, point_id, edit_status, request_time, reason, created_by) VALUES (?,?,?,?,?,?,?,?)"
    connection.query(insertRequest, [location_type, is_planning, image_url, point_id, edit_status, request_time, reason, req.user.user_id], (error, result) => {
        if (error) {
            console.error("Error executing query: " + error.stack);
            return res.status(401).json({
                error: "Invalid Information.",
            });
        }
        const edit_request = {
            id: result.insertId,
            location_type,
            is_planning,
            image_url,
            point_id,
            edit_status,
            request_time,
            reason,
            created_by: req.user.user_id
        }
        res.status(200).json({
            status: "success",
            edit_request
        });
    });
});
module.exports = { createEditPointRequest };

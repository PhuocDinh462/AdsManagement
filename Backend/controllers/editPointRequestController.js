const catchAsync = require("../utils/catchAsync");
const connection = require("../server"); // Sử dụng module quản lý kết nối cơ sở dữ liệu
const socket = require('../app');

const getInforEditPointRequest = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    connection.query(
        `select * from edit_request_point where id = ?`,
        id,
        (err, results) => {
            res.status(200).json({
                status: "success",
                edit_point_request: results[0],
            });

        }
    );

})
const createEditPointRequest = catchAsync(async (req, res, next) => {
    const { advertisement_type_id, location_type, is_planning, image_url, point_id, edit_status, request_time, reason } = req.body;
    const insertRequest = "INSERT INTO `edit_request_point` (advertisement_type_id, location_type, is_planning, image_url, point_id, edit_status, request_time, reason, created_by) VALUES (?,?,?,?,?,?,?,?,?)"
    connection.query(insertRequest, [advertisement_type_id, location_type, is_planning, image_url, point_id, edit_status, request_time, reason, req.user.user_id], (error, result) => {
        if (error) {
            console.error("Error executing query: " + error.stack);
            return res.status(401).json({
                error: "Invalid Information.",
            });
        }
        const edit_request = {
            id: result.insertId,
            advertisement_type_id,
            location_type,
            is_planning,
            image_url,
            point_id,
            edit_status,
            request_time,
            reason,
            created_by: req.user.user_id
        }
        socket?.socketIo?.emit('createEditPointRequest', { data: edit_request });


        res.status(200).json({
            status: "success",
            edit_request
        });
    });
});
module.exports = { createEditPointRequest, getInforEditPointRequest };

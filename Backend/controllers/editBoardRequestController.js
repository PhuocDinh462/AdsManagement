const catchAsync = require("../utils/catchAsync");
const connection = require("../server"); // Sử dụng module quản lý kết nối cơ sở dữ liệu

const getInforEditBoardRequest = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    connection.query(
        `select * from edit_request_board where id = ?`,
        id,
        (err, results) => {
            res.status(200).json({
                status: "success",
                edit_board_request: results[0],
            });

        }
    );
})
const createEditBoardRequest = catchAsync(async (req, res, next) => {
    const { board_id, board_type_id, edit_status, advertisement_content, advertisement_image_url, request_time, reason, width, height } = req.body;
    const insertRequest = "INSERT INTO `edit_request_board` (board_id, board_type_id, edit_status, advertisement_content, advertisement_image_url, request_time, reason, width, height, created_by) VALUES (?,?,?,?,?,?,?,?,?,?)"
    connection.query(insertRequest, [board_id, board_type_id, edit_status, advertisement_content, advertisement_image_url, request_time, reason, width, height, req.user.user_id], (error, result) => {
        if (error) {
            console.error("Error executing query: " + error.stack);
            return res.status(401).json({
                error: "Invalid Information.",
            });
        }
        const edit_request = {
            id: result.insertId,
            board_id,
            board_type_id,
            edit_status,
            advertisement_content,
            advertisement_image_url,
            request_time,
            reason,
            width,
            height,
            created_by: req.user.user_id
        }
        res.status(200).json({
            status: "success",
            edit_request
        });
    });
});
module.exports = { createEditBoardRequest, getInforEditBoardRequest };

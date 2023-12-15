const catchAsync = require("../utils/catchAsync");
const connection = require("../server"); // Sử dụng module quản lý kết nối cơ sở dữ liệu

const moment = require('moment');

const getInforAccount = catchAsync(async (req, res, next) => {
    const localDate = moment.utc(req.user.dob).local();
    req.user.dob = localDate.format('YYYY-MM-DD HH:mm:ss')
    res.status(200).json({
        status: "success",
        user: req.user,
    });
})
const updateAccountInfor = catchAsync(async (req, res, next) => {
    const { username, email, phone, dob } = req.body;

    const selectQuery = "SELECT * FROM `user` WHERE `user_id` = ?";
    connection.query(
        "UPDATE user SET username = ?, email = ?, phone = ?, dob = ?  WHERE user_id = ?",
        [username, email, phone, dob, req.user.user_id],
        (err, results) => {
            if (err) {
                console.error("Error executing query: " + err.stack);
                return res.status(500).json({ error: "Database error" });
            }

            // Thực hiện truy vấn SELECT để lấy thông tin chi tiết của phần tử đã thêm
            connection.query(selectQuery, [req.user.user_id], (err, selectResults) => {
                if (err) {
                    console.error("Error executing query: " + err.stack);
                    return res.status(500).json({ error: "Database error" });
                }
                const localDate = moment.utc(selectResults[0].dob).local();
                selectResults[0].dob = localDate.format('YYYY-MM-DD HH:mm:ss')
                res.status(200).json({
                    status: "update account infor success",
                    data: {
                        data: selectResults[0], // Lấy phần tử đầu tiên trong mảng selectResults
                    },
                });
            });
        }
    );
});

const changePassword = catchAsync(async (req, res, next) => {

});

module.exports = { getInforAccount, updateAccountInfor };

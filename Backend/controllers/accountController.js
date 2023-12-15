const catchAsync = require("../utils/catchAsync");
const connection = require("../server"); // Sử dụng module quản lý kết nối cơ sở dữ liệu
const bcrypt = require("bcrypt");

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
                    status: "Success",
                    message: "update account infor success",
                    data: {
                        data: selectResults[0], // Lấy phần tử đầu tiên trong mảng selectResults
                    },
                });
            });
        }
    );
});

const changePassword = catchAsync(async (req, res, next) => {
    const { password, new_password } = req.body;
    connection.query(
        `select * from user where user_id = ?`,
        req.user.user_id,
        (err, results) => {
            if (err) {
                console.error("Error executing query: " + err.stack);
                return res.status(500).json({ error: "Database error" });
            }

            if (!results[0] || !bcrypt.compareSync(password, results[0].password))
                return res.status(401).json({
                    status: "fail",
                    msg: "Invalid Credential!",
                });


            bcrypt.hash(new_password, 10, (err, hashPassword) => {
                if (err) {
                    console.error(err);
                }

                connection.query(
                    "UPDATE user SET password = ? WHERE user_id = ?",
                    [hashPassword, req.user.user_id],
                    (err, results) => {
                        if (err) {
                            console.error("Error executing query: " + err.stack);
                            return res.status(500).json({ error: "Database error" });
                        }
                        res.status(200).json({
                            status: "Success",
                            message: "Change password success"
                        });

                    }
                );
            })

        }
    );
});


const forgotPassword = async (req, res) => {
    const { email, password, repassword, otp, otpVerify } = req.body;
    if (otpVerify) {
        if (!email || !password || !repassword || !otp) {
            throw new BadRequestError("Please provide name,email, password and otp");
        } else if (password !== repassword) {
            throw new BadRequestError("Password and Repassword must be same");
        } else {
            //Hashing password
            const salt = await bcrypt.genSalt(10);
            const passwordHashed = await bcrypt.hash(password, salt);
            const updatePassword = {
                password: passwordHashed,
            };
            const OTP_verify = jwt.verify(otpVerify, process.env.JWT_SECRET);
            if (OTP_verify.OTP === otp) {
                //handle change password
            } else {
                res.status(400).json({ msg: "Incorrect OTP" });
            }
        }
    } else {
        throw new BadRequestError("OTP does not exist");
    }
};
// {{URL}}/auth/otp
const createOTP = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        res
            .status(StatusCodes.BAD_REQUEST)
            .json({ msg: "Please provide an email" });
    } else {
        const OTP = await sendMail(7, email);
        if (!OTP) {
            res
                .status(StatusCodes.BAD_REQUEST)
                .json({ msg: "Sending gmail fail!!!" });
        } else {
            OTP_token = jwt.sign({ OTP }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_LIFETIME,
            });
            res.status(200).json({ otpVerify: OTP_token });
        }
    }
};
module.exports = { getInforAccount, updateAccountInfor, changePassword };

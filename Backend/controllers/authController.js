const catchAsync = require("../utils/catchAsync");
const connection = require("../server"); // Sử dụng module quản lý kết nối cơ sở dữ liệu
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

const createAccount = catchAsync(async (req, res, next) => {
    const { username, password, email, phone, user_type } = req.body;

    const insertAcc = "insert into user (username, password, email, phone, user_type) values (?,?,?,?,?)";

    const stringToHash = password;

    bcrypt.hash(stringToHash, 10, (err, hashPassword) => {
        if (err) {
            console.error(err);
        }

        connection.query(insertAcc, [username, hashPassword, email, phone, user_type], (error, result) => {
            if (error) {
                console.error("Error executing query: " + error.stack);
                return res.status(401).json({
                    error: "email unavailable...",
                });
            }
            const account = {
                username,
                email,
                hashPassword,
                phone,
                user_type,
            }
            res.status(200).json({
                status: "success",
                account
            });
        });
    });
});

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(401).json({
            status: "fail",
            msg: "Please provide email and password",
        });
    }

    connection.query(
        `select * from users where email = ?`,
        email,
        (err, results) => {
            if (err) {
                console.error("Error executing query: " + err.stack);
                return res.status(500).json({ error: "Database error" });
            }

            if (!results[0] || !bcrypt.compareSync(password, results[0].password))
                return res.status(401).json({
                    status: "fail",
                    msg: "Invalid Creadential!",
                });

            const accessToken = generateToken.accessToken(email);
            const refreshToken = generateToken.refreshToken(email);
            connection.query("select * from `users` where `email` = ?", [email], (err, account) => {
                if (err) {
                    console.error("Error executing query: " + err.stack);
                    return res.status(500).json({ error: "Database error" });
                }

                connection.query(
                    `update users set access_token = ?, refresh_token = ? where email = ?`,
                    [accessToken, refreshToken, email],
                    (err, results) => {
                        if (err) {
                            console.error("Error executing query: " + err.stack);
                            return res.status(500).json({ error: "Database error" });
                        }

                        res.status(200).json({
                            status: "success",
                            access_token: accessToken,
                            refresh_token: refreshToken,
                            account: account[0],
                        });
                    }
                );
            })

        }
    );
});


module.exports = { createAccount, login };
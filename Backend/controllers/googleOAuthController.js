const catchAsync = require("../utils/catchAsync");
const connection = require("../server"); // Sử dụng module quản lý kết nối cơ sở dữ liệu
const axios = require('axios')
const qs = require('qs')
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateToken")
const bcrypt = require("bcrypt");
const moment = require('moment');

const getGoogleOAuthTokens = async ({
    code
}) => {
    const url = "https://oauth2.googleapis.com/token";

    const values = {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SERVER,
        redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URL,
        grant_type: "authorization_code",
    };

    try {
        const res = await axios.post(
            url,
            qs.stringify(values),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );
        return res.data;
    } catch (error) {
        console.error(error.response.data.error);
        log.error(error, "Failed to fetch Google Oauth Tokens");
        throw new Error(error.message);
    }
}

const getGoogleUser = async ({ id_token, access_token }) => {
    try {
        const res = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
            {
                headers: {
                    Authorization: `Bearer ${id_token}`,
                },
            }
        );
        return res.data;
    } catch (error) {
        console.error(error, "Error fetching Google user");
        throw new Error(error.message);
    }
}

const findUser = async (googleUser) => {
    const { email, name } = googleUser;

    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT * FROM user WHERE email = ?`,
            email,
            async (err, results) => {
                if (err) {
                    console.error("Error executing query: " + err.stack);
                    reject(err);
                }

                if (results[0]) {
                    const account = results[0];
                    resolve(account);
                } else {
                    const insertAcc = "INSERT INTO user (username, password, email, phone, dob, user_type) VALUES (?,?,?,?,?,?)";
                    const salt = await bcrypt.genSalt(10);
                    const passwordHashed = await bcrypt.hash("123456", salt);

                    //DOB
                    const currentDate = new Date();
                    const year = currentDate.getFullYear();
                    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
                    const day = String(currentDate.getDate()).padStart(2, '0');
                    const dob = `${year}-${month}-${day}`;

                    const phone = null;
                    const user_type = null;

                    connection.query(insertAcc, [name, passwordHashed, email, phone, dob, user_type], (error, result) => {
                        if (error) {
                            console.error("Error executing query: " + error.stack);
                            reject(error);
                        }
                        connection.query(
                            `select * from user where user_id = ?`,
                            result.insertId,
                            (err, results) => {
                                const localDate = moment.utc(results[0].dob).local();
                                results[0].dob = localDate.format('YYYY-MM-DD HH:mm:ss')
                                resolve(results[0]);
                            }
                        );

                    });
                }
            }
        );
    });
};


const googleOAuthHandler = catchAsync(async (req, res, next) => {
    // get the code from qs
    const code = req.query.code;

    try {
        // get the id and access token with the code
        const { id_token, access_token } = await getGoogleOAuthTokens({ code });

        // get user with tokens
        const googleUser = await getGoogleUser({ id_token, access_token });
        //jwt.decode(id_token);


        if (!googleUser.verified_email) {
            return res.status(403).send("Google account is not verified");
        }

        // // upsert the user
        const user = await findUser(googleUser);
        const accessToken = generateToken.accessToken(user);

        // // redirect back to client
        res.cookie('user_id', user.user_id);
        res.cookie('token', accessToken);
        res.cookie('user-state', true)
        res.redirect("http://localhost:3000");
    } catch (error) {
        console.error(error, "Failed to authorize Google user");
        // return res.redirect(`${config.get("origin")}/oauth/error`);
        return res.status(400).json({ message: "Failed to authorize Google user" })
    }
});

module.exports = { googleOAuthHandler };

const jwt = require("jsonwebtoken");

function accessToken(user) {
    return jwt.sign(user, process.env.SECRET_KEY, {
        expiresIn: process.env.LIFETIME,
    });
}



module.exports = { accessToken };
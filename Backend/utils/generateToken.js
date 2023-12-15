const jwt = require("jsonwebtoken");

function accessToken(email) {
    return jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_LIFETIME,
    });
}

function refreshToken(email) {
    return jwt.sign({ email }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_LIFETIME,
    });
}

module.exports = { accessToken, refreshToken };
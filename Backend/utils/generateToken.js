const jwt = require('jsonwebtoken');

function accessToken(user) {
  return jwt.sign(user, process.env.SECRET_KEY, {
    expiresIn: process.env.LIFETIME,
  });
}

function refreshToken(user) {
  return jwt.sign(user, process.env.REFRESH_SECRET_KEY, {
    expiresIn: process.env.REFRESH_LIFETIME,
  });
}

module.exports = { accessToken, refreshToken };


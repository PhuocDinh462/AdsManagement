const jwt = require('jsonwebtoken');

function accessToken(email, password, user_id) {
  return jwt.sign({ email, password, user_id }, process.env.SECRET_KEY, {
    expiresIn: process.env.LIFETIME,
  });
}

function refreshToken(email, password, user_id) {
  return jwt.sign({ email, password, user_id }, process.env.REFRESH_SECRET_KEY, {
    expiresIn: process.env.REFRESH_LIFETIME,
  });
}

module.exports = { accessToken, refreshToken };


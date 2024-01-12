const jwt = require('jsonwebtoken');
const connection = require('../server');

const refresh = async (req, res, next) => {
  if (req.body.refresh_token !== null) {
    const refreshToken = req.body.refresh_token;
    try {
      const payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);
      const { iat, exp, ...newUserObject } = payload;
      req.user = { ...newUserObject };

      connection.query(`SELECT refresh_token FROM user WHERE user_id = ?`, [req.user.user_id], (err, results) => {
        if (err) {
          console.error('Error executing query: ' + err.stack);
          return res.status(500).json({ error: 'Database error' });
        }

        const refreshTokenDB = results[0]?.refresh_token;
        if (refreshTokenDB === refreshToken) {
          next();
        } else {
          return res.status(401).json({ error: 'Invalid RefreshToken' });
        }
      });
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  } else {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = refresh;


const { body } = require('express-validator');
const axios = require('axios');

// Hàm kiểm tra Recaptcha
const validateRecaptcha = async (req, res, next) => {
  const recaptcha = req.body.recaptcha;

  const secretKey = '6LeV9TopAAAAAOkM3fBu8VhVTglqldIyBlAuYf64'; // Thay YOUR_RECAPTCHA_SECRET_KEY bằng secret key của bạn

  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptcha}`
    );

    const { success } = response.data;

    if (success) {
      next(); // Nếu Recaptcha hợp lệ, tiếp tục sang middleware hoặc route tiếp theo
    } else {
      res.status(400).json({ error: 'Invalid Recaptcha' });
    }
  } catch (error) {
    console.error('Error validating Recaptcha:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Middleware kiểm tra Recaptcha
const recaptchaMiddleware = [body('recaptcha').notEmpty().withMessage('Recaptcha is required'), validateRecaptcha];

module.exports = recaptchaMiddleware;

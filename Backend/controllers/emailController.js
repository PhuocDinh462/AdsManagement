const emailService = require('../service/emailService');
const jwt = require('jsonwebtoken');
const connection = require('../server'); // Sử dụng module quản lý kết nối cơ sở dữ liệu

const catchAsync = require('../utils/catchAsync');

const createOTP = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ msg: 'Please provide an email' });
  } else {
    connection.query(`select * from user where email = ?`, email, async (err, results) => {
      if (err) {
        console.error('Error executing query: ' + err.stack);
        return res.status(500).json({ error: 'Database error' });
      }

      if (!results[0])
        return res.status(401).json({
          status: 'fail',
          msg: "Don't have this user in database",
        });
      const info = await emailService.sendEmailService(results[0]);
      if (!info) {
        res.status(400).json({ msg: 'Sending gmail fail!!!' });
      } else {
        OTP_token = jwt.sign({ OTP: info.otp }, process.env.SECRET_KEY, {
          expiresIn: process.env.OTP_LIFETIME,
        });
        res.status(200).json({ info: info.info, otpVerify: OTP_token });
      }
    });
  }
};

const replyReport = async (req, res) => {
  const { email, content } = req.body;
  if (!email) res.status(400).json({ msg: 'Please provide an email' });
  if (!content) res.status(400).json({ msg: 'Content is blank' });

  const info = await emailService.sendMail(email, 'Báo cáo', content);
  if (!info) res.status(400).json({ msg: 'Sending mail fail' });
  else res.status(200).json({ info: info.info });
};

module.exports = { createOTP, replyReport };

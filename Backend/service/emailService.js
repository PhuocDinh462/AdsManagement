const nodemailer = require('nodemailer');
const dotenv = require("dotenv");
dotenv.config({});
function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const sendEmailService = async (user) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: process.env.ACCOUNT,
            pass: process.env.PASSWORD_ACCOUNT,
        },
    });
    const otp = makeid(7);
    const htmlFile =
        `
        <p>Chào ${user.username},</p>
    <p>
      Đây là mã OTP xác thực cho tài khoản
      <a style="color: blue; text-decoration: underline">${user.email}</a> trong ứng dụng web
      <strong>City Ads Insight</strong>
      :
    </p>
    <h3>${otp}</h3>
    <p><strong>Lưu ý: </strong>Mã OTP sẽ hết hạn trong vòng <strong>5 phút</strong> kể từ khi mail này được gửi</p>
    `
    const info = await transporter.sendMail({
        from: `"City Ads" ${process.env.ACCOUNT}`, // sender address
        to: `${user.email}`, // list of receivers
        subject: "Your OTP", // Subject line
        // text: "Hello?", // plain text body
        html: htmlFile, // html body
    });

    return {
        otp: otp,
        info: info
    }
}
module.exports = sendEmailService;

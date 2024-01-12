const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
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

const sendEmailService = async (lat, lng, name, phone, email, reason) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.ACCOUNT,
      pass: process.env.PASSWORD_ACCOUNT,
    },
  });
  const htmlFile = `<p>Chào bạn,</p>
  <p>
    Chúng tôi đã nhận được báo cáo của bạn. Chúng tôi đang xem xét và sẽ sớm phản hồi cho bạn trong thời gian sớm nhất.
  </p>
  <br/>
  <br/>
  <p>Trân trọng!</p>`;
  const info = await transporter.sendMail({
    from: `"City Ads" ${process.env.ACCOUNT}`, // sender address
    to: 'tranhuuchinh500@gmail.com', // list of receivers
    subject: 'BÁO CÁO ĐỊA ĐIỂM', // Subject line
    // text: "Hello?", // plain text body
    html: htmlFile, // html body
  });

  return {
    info: info,
  };
};

const sendMail = async (email, subject, htmlFile) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.ACCOUNT,
      pass: process.env.PASSWORD_ACCOUNT,
    },
  });

  const info = await transporter.sendMail({
    from: `"City Ads" ${process.env.ACCOUNT}`, // sender address
    to: `${email}`, // list of receivers
    subject: subject, // Subject line
    // text: "Hello?", // plain text body
    html: htmlFile, // html body
  });

  return {
    info: info,
  };
};

module.exports = { sendEmailService, sendMail };

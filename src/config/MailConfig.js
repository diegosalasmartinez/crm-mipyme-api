const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

transporter
  .verify()
  .then(() => {
    console.log('Ready for send emails');
  })
  .catch((e) => {
    console.log('No se pudo iniciar el servidor SMTP: ', e.message);
  });

module.exports = { transporter };

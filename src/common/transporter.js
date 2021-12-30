const nodemailer = require('nodemailer');
const mail = {
  service: 'gmail',
  auth: {
    user: "aadarsharc.bot@gmail.com",
    pass: "Thang@1314"
  },
  tls: {
    rejectUnauthorized: false
  }

}
const transporter = nodemailer.createTransport(mail)

module.exports = transporter
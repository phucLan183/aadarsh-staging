const nodemailer = require('nodemailer');
const mail = {
  service: 'gmail',
  auth: {
    user: "anytrails1@gmail.com",
    pass: "QWE123!@#"
  }
}
const transporter = nodemailer.createTransport(mail)

module.exports = transporter
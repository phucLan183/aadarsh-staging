const nodemailer = require('nodemailer');
const { userGmail, passGmail } = require('../config')
const mail = {
  service: 'gmail',
  auth: {
    user: userGmail,
    pass: passGmail
  },
  tls: {
    rejectUnauthorized: false
  }

}
const transporter = nodemailer.createTransport(mail)

module.exports = transporter
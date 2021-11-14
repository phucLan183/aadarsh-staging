const transporter = require('../common/transporter');

module.exports = async (req, res) => {
  try {
    const body = req.body
    const dataContact = {
      to: "mailblogmyself@gmail.com",
      subject: "Thư liên hệ của khách hàng",
      html: `<h3>Test send a mail</h3>
                    <div>
                        <p>
                        <b>First Name: </b>
                        ${body.firstName}<br />
                        <b>Last Name: </b>
                        ${body.lastName}<br />
                        <b>Email: </b>
                        ${body.email}<br />
                        <b>Company: </b>
                        ${body.company}<br />
                        <b>Message: </b>
                        ${body.message}
                        </p>
                    </div >`
    }
    const sendMail = await transporter.sendMail(dataContact)
    if (!sendMail) {
      return res.status(400).json({
        status: 'false',
        message: 'Can not send mail'
      })
    }
    res.status(200).json({
      status: 'success'
    })
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message,
    })
  }
}
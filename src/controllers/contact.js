const transporter = require('../common/transporter');
const UserModel = require('../models/Users');

module.exports = async (req, res) => {
  try {
    const dataUser = await UserModel.find({
      active: true,
      'permission.contact': {
        $all: ['GET']
      }
    }).select('email')
    const sendToEmail = dataUser.map((user) => user.email)
    const body = req.body
    const currentDate = new Date()
    const dataContact = {
      to: sendToEmail,
      subject: "Thư liên hệ của khách hàng",
      html: `<div bgcolor="#F7F7F7">
    <div style="background-color:#f7f7f7">
      <table width="100%" bgcolor="#F7F7F7" cellpadding="0" cellspacing="0" border="0" style="text-align:center">
        <tbody>
          <tr>
            <td>
              <table bgcolor="#F7F7F7" cellpadding="0" cellspacing="0" border="0" width="700" align="center"
                style="margin:0px auto">
                <tr>
                  <td bgcolor="#F7F7F7" align="right" valign="top">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" align="right">
                      <tbody>
                        <tr>
                          <td valign="top" width="100%">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" align="right">
                              <tbody>
                                <tr>
                                  <td height="39" style="font-size:1px;line-height:1px">&nbsp;</td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center" valign="top">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" align="center">
                      <tbody>
                        <tr>
                          <td valign="top" width="100%">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" align="center">
                              <tbody>
                                <tr>
                                  <td align="center">
                                    <div>
                                      <img width="150" border="0" alt="Aadarsharc Team Logo"
                                        style="display:block;border:none;outline:none;text-decoration:none"
                                        src="https://aadarsharc.com/static/media/final-logo.e6f3cc34.png"
                                        class="CToWUd">
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td bgcolor="#F7F7F7" height="40" style="font-size:1px;line-height:1px">&nbsp;</td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td bgcolor="#FFFFFF" align="center">
                    <table width="100%" align="center" cellpadding="0" cellspacing="0" border="0">
                      <tbody>
                        <tr>
                          <td width="41" style="font-size:1px;line-height:1px">&nbsp;</td>
                          <td height="36" style="font-size:1px;line-height:1px">&nbsp;</td>
                          <td width="41" style="font-size:1px;line-height:1px">&nbsp;</td>
                        </tr>
                        <tr>
                          <td width="41" style="font-size:1px;line-height:1px">&nbsp;</td>
                          <td
                            style="font-family:'Proxima Nova',Calibri,Helvetica,sans-serif;font-size:16px;color:#505050!important;text-align:left;line-height:25.6px;font-weight:normal;text-transform:none">
                            <p style="color:#505050!important;">Hi Aadarsharc Team,</p>
                            <p style="color:#505050!important;">${body.firstName} ${body.lastName} gửi thư liện hệ:</p>
                            <p style="color:#505050!important;">
                              <ul>
                                <li>First Name: ${body.firstName}</li>
                                <li>Last Name: ${body.lastName}</li>
                                <li>Email: ${body.email}</li>
                                <li>Company: ${body.company}</li>
                                <li>Message: ${body.message}</li>
                              </ul>
                            </p>Trân trọng,<br>
                            <b>Aadarsharc Team</b><br><br>

                            <i>Email này do hệ thống tự động tạo. Xin đừng trả lời.</i>
                          <td width="41" style="font-size:1px;line-height:1px">&nbsp;</td>

                        </tr>
                        <tr>
                          <td width="41" style="font-size:1px;line-height:1px">&nbsp;</td>
                          <td height="41" style="font-size:1px;line-height:1px">&nbsp;</td>
                          <td width="41" style="font-size:1px;line-height:1px">&nbsp;</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td bgcolor="#F7F7F7" align="center">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" align="center">
                      <tbody>
                        <tr>
                          <td id="m_4790268208304861421edit_text_3" align="center">
                            <table width="100%" align="center" cellpadding="0" cellspacing="0" border="0">
                              <tbody>
                                <tr>
                                  <td height="10" style="font-size:1px;line-height:1px">&nbsp;</td>
                                </tr>
                                <tr>
                                  <td width="41" style="font-size:1px;line-height:1px">&nbsp;</td>
                                </tr>
                                <tr>
                                  <td width="25" style="font-size:1px;line-height:1px">&nbsp;</td>
                                  <td
                                    style="font-family:'Proxima Nova',Calibri,Helvetica,sans-serif;font-size:12px;color:#808080;font-weight:normal;text-align:center;line-height:150%">
                                    <div>
                                      <em>© Copyright ${currentDate.getFullYear()} Aadarsharc Team Center<br>All rights
                                        reserved.</em>
                                    </div>
                                  </td>
                                  <td width="25" style="font-size:1px;line-height:1px">&nbsp;</td>
                                </tr>
                                <tr>
                                  <td width="41" style="font-size:1px;line-height:1px">&nbsp;</td>
                                  <td height="20" style="font-size:1px;line-height:1px">&nbsp;</td>
                                  <td width="41" style="font-size:1px;line-height:1px">&nbsp;</td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
      </div>`
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
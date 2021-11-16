const UsersModel = require('../models/Users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const transporter = require('../common/transporter');
const config = require('../config');

const userRegister = async (req, res) => {
  try {
    const { username, password, email } = req.body

    const checkUsername = await UsersModel.findOne({ username: username }).select('username').lean()
    if (checkUsername) {
      return res.status(400).json({
        status: 'false',
        message: 'Tên đăng nhập đã được sử dụng!'
      })
    }

    const checkEmail = await UsersModel.findOne({ email: email }).select('email').lean()
    if (checkEmail) {
      return res.status(400).json({
        status: 'false',
        message: 'Email đã được sử dụng!'
      })
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await UsersModel.create({
      username: username,
      fullname: username,
      email: email,
      password: hashPassword
    })
    const userData = {
      _id: newUser._id,
      username: newUser.username,
      fullname: newUser.fullname,
      email: newUser.email
    }
    res.status(200).json({
      status: 'success',
      data: userData
    })
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message,
    })
  }
}

const userLogin = async (req, res) => {
  try {
    const { username, password } = req.body
    const checkDataUser = await UsersModel.findOne({ username: username }).lean()
    console.log(checkDataUser)
    if (!checkDataUser || checkDataUser.active === false) {
      return res.status(400).json({
        status: 'false',
        message: 'Tên đăng nhập hoặc mật khẩu không đúng!',
      })
    }
    const comparePass = await bcrypt.compare(password, checkDataUser.password)
    if (!comparePass) {
      return res.status(400).json({
        status: 'false',
        message: 'Tên đăng nhập hoặc mật khẩu không đúng!',
      })
    }
    const accessToken = jwt.sign({
      userId: checkDataUser._id,
      active: checkDataUser.active,
      permission: checkDataUser.permission,
    }, config.accessToken, {
      expiresIn: '30m'
    })

    const refreshToken = jwt.sign({
      userId: checkDataUser._id,
      active: checkDataUser.active
    }, config.refreshToken, {
      expiresIn: '7d'
    })

    const dataUserUpdate = await UsersModel.findOneAndUpdate({
      _id: checkDataUser._id
    }, {
      $push: {
        refreshToken: refreshToken
      }
    }, {
      new: true
    }).select('username email permission fullname')

    return res.json({
      status: 'success',
      data: dataUserUpdate,
      act: accessToken,
      rft: refreshToken
    });
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message,
    })
  }
}

const userLogout = async (req, res) => {
  try {
    const authHeader = req.headers['x-token']
    const token = authHeader && authHeader.split(' ')[1]
    const decode = jwt.decode(token)
    const dataUser = await UsersModel.findByIdAndUpdate({
      _id: decode.userId
    }, {
      $set: {
        refreshToken: []
      }
    })
    if (!dataUser) {
      return res.status(400).json({
        status: 'false',
        message: 'Không tìm thấy dữ liệu!'
      })
    }
    res.status(200).json({
      success: "success",
    })
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message,
    })
  }
}

const accessToken = async (req, res) => {
  if (req.user.userId) {
    res.json({
      status: 'success'
    })
  } else {
    res.json({
      status: 'false'
    })
  }
}

const refreshToken = async (req, res) => {
  try {
    const { userId, refreshToken } = req.user
    if (refreshToken === null) {
      return res.sendStatus(401)
    }
    const dataUser = await UsersModel.findOne({
      _id: userId
    }).select('active permission refreshToken').lean()

    const storageRefreshToken = dataUser.refreshToken

    if (!storageRefreshToken.includes(refreshToken)) {
      return res.sendStatus(401)
    }

    const accessToken = jwt.sign({
      userId: dataUser._id,
      active: dataUser.active,
      permission: dataUser.permission
    }, config.accessToken, {
      expiresIn: "30m"
    })

    res.status(200).json({
      status: "success",
      act: accessToken,
    })
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message,
    })
  }
}

const forgotPassword = async (req, res) => {
  try {
    const email = req.body.email
    const checkDataUser = await UsersModel.findOne({ email: email }).select('email').lean()
    if (!checkDataUser || checkDataUser === null) {
      return res.status(400).json({
        status: 'false',
        message: 'Email không tồn tại'
      })
    }

    const resetToken = jwt.sign({
      id: checkDataUser._id,
    }, config.resetPassword, {
      expiresIn: "3m"
    })

    const message = {
      to: email,
      subject: "Thay đổi mật khẩu",
      html: `<h3>CLICK A LINK TO RESET PASSWORD</h3>
             <a href="https://aadarsh-staging.netlify.app/reset-password/${resetToken}">GET OVER HERE</a><br/>`
    }
    const sendMail = await transporter.sendMail(message)
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

const resetPassword = async (req, res) => {
  try {
    const userId = req.user.userId
    const { newPassword, confirmPassword } = req.body
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        status: 'false',
        message: 'Mật khẩu không trùng khớp!'
      })
    }
    const hashPassword = await bcrypt.hash(confirmPassword, 10)
    const checkDataUser = await UsersModel.findByIdAndUpdate({
      _id: userId
    }, {
      $set: {
        password: hashPassword
      }
    })
    if (!checkDataUser) {
      return res.status(400).json({
        status: 'false',
        message: 'Không tìm thấy tài khoản này!'
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

module.exports = {
  userRegister: userRegister,
  userLogin: userLogin,
  userLogout: userLogout,
  accessToken: accessToken,
  refreshToken: refreshToken,
  forgotPassword: forgotPassword,
  resetPassword: resetPassword,
}
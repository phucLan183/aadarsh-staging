const UserModel = require('../models/Users');
const MemberModel = require('../models/Members')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const transporter = require('../common/transporter');
const config = require('../config');

const register = async (req, res) => {
  try {
    const { username, password, email } = req.body
    const checkDataMember = await MemberModel.findOne({
      $or: [
        { username: username },
        { email: email }
      ]
    }).select('username email')
    const checkDataUser = await UserModel.findOne({
      $or: [
        { username: username },
        { email: email }
      ]
    })
    const validationUsername = checkDataMember?.username === username || checkDataUser?.username === username
    const validationEmail = checkDataMember?.email === email || checkDataUser?.email === email
    if (validationUsername) {
      return res.status(400).json({
        status: 'false',
        message: `Username đã được sử dụng!`
      })
    } else if (validationEmail) {
      return res.status(400).json({
        status: 'false',
        message: `Email đã được sử dụng!`
      })
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await MemberModel.create({
      username: username,
      fullname: username,
      email: email,
      password: hashPassword
    })
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

const userLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body
    const checkDataUser = await UserModel.findOne({
      username: username,
      active: true
    }).lean()
    if (!checkDataUser) {
      return next()
    }
    const comparePass = await bcrypt.compare(password, checkDataUser.password)
    if (!comparePass) {
      return next()
    }
    const accessToken = jwt.sign({
      userId: checkDataUser._id,
      active: checkDataUser.active,
      permission: checkDataUser.permission,
      role: 'USER'
    }, config.accessToken, {
      expiresIn: '30m'
    })

    const refreshToken = jwt.sign({
      userId: checkDataUser._id,
      active: checkDataUser.active,
      role: 'USER'
    }, config.refreshToken, {
      expiresIn: '7d'
    })

    const dataUserUpdate = await UserModel.findOneAndUpdate({
      _id: checkDataUser._id
    }, {
      $push: {
        refreshToken: refreshToken
      }
    }, {
      new: true
    }).select('username email permission fullname')

    res.status(200).json({
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

const memberLogin = async (req, res) => {
  try {
    const { username, password } = req.body
    const checkDataMember = await MemberModel.findOne({
      username: username,
      active: true
    }).lean()
    if (!checkDataMember) {
      return res.status(400).json({
        status: 'false',
        message: 'Tên đăng nhập hoặc mật khẩu không đúng!',
      })
    }
    const comparePass = await bcrypt.compare(password, checkDataMember.password)
    if (!comparePass) {
      return res.status(400).json({
        status: 'false',
        message: 'Tên đăng nhập hoặc mật khẩu không đúng!',
      })
    }
    const accessToken = jwt.sign({
      userId: checkDataMember._id,
      active: checkDataMember.active,
      role: 'MEMBER'
    }, config.accessToken, {
      expiresIn: '30m'
    })

    const refreshToken = jwt.sign({
      userId: checkDataMember._id,
      active: checkDataMember.active,
      role: 'MEMBER'
    }, config.refreshToken, {
      expiresIn: '7d'
    })

    const dataUserUpdate = await MemberModel.findOneAndUpdate({
      _id: checkDataMember._id
    }, {
      $push: {
        refreshToken: refreshToken
      }
    }, {
      new: true
    }).select('username email permission fullname')

    res.status(200).json({
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
    if (decode.role === 'USER') {
      const dataUser = await UserModel.updateOne({
        _id: decode.userId
      }, {
        $set: {
          refreshToken: []
        }
      })
      return res.status(200).json({
        success: "success",
      })
    }

    if (decode.role === 'MEMBER') {
      const dataUser = await MemberModel.findByIdAndUpdate({
        _id: decode.userId
      }, {
        $set: {
          refreshToken: []
        }
      })
      return res.status(200).json({
        success: "success",
      })
    }
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message,
    })
  }
}

const refreshToken = async (req, res) => {
  try {
    const { userId, refreshToken, role } = req.user
    if (refreshToken === null && role === null) return res.sendStatus(401)
    if (role === 'USER') {
      const dataUser = await UserModel.findOne({
        _id: userId
      }).select('active permission refreshToken').lean()

      const storageRefreshToken = dataUser.refreshToken

      if (!storageRefreshToken.includes(refreshToken)) return res.sendStatus(401)

      const accessToken = jwt.sign({
        userId: dataUser._id,
        active: dataUser.active,
        permission: dataUser.permission,
        role: 'USER'
      }, config.accessToken, {
        expiresIn: "30m"
      })

      res.status(200).json({
        status: "success",
        act: accessToken,
      })
    }
    if (role === 'MEMBER') {
      const dataMember = await MemberModel.findOne({
        _id: userId
      }).select('active refreshToken').lean()

      const storageRefreshToken = dataMember.refreshToken

      if (!storageRefreshToken.includes(refreshToken)) return res.sendStatus(401)

      const accessToken = jwt.sign({
        userId: dataMember._id,
        active: dataMember.active,
        role: 'MEMBER'
      }, config.accessToken, {
        expiresIn: "30m"
      })

      res.status(200).json({
        status: "success",
        act: accessToken,
      })
    }
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
    const checkDataMember = await MemberModel.findOne({ email: email }).select('email').lean()
    if (!checkDataMember) {
      return res.status(400).json({
        status: 'false',
        message: 'Email không tồn tại'
      })
    }

    const resetToken = jwt.sign({
      userId: checkDataMember._id,
    }, config.resetToken, {
      expiresIn: "3m"
    })

    // const message = {
    //   to: email,
    //   subject: "Thay đổi mật khẩu",
    //   html: `<h3>CLICK A LINK TO RESET PASSWORD</h3>
    //          <a href="https://aadarsh-staging.netlify.app/reset-password/${resetToken}">GET OVER HERE</a><br/>`
    // }
    // const sendMail = await transporter.sendMail(message)
    // if (!sendMail) {
    //   return res.status(400).json({
    //     status: 'false',
    //     message: 'Can not send mail'
    //   })
    // }
    res.status(200).json({
      status: 'success',
      resetToken: resetToken
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
    const password = req.body.password
    const hashPassword = await bcrypt.hash(password, 10)
    const checkDataMember = await MemberModel.findByIdAndUpdate({
      _id: userId
    }, {
      $set: {
        password: hashPassword
      }
    })
    if (!checkDataMember) {
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

const getCurrentUser = async (req, res) => {
  try {
    const { userId, role } = req.user
    const selectData = '-refreshToken -createdAt -updatedAt -__v -password'
    if (role === 'USER') {
      const dataUser = await UserModel.findById({ _id: userId }).select(selectData).lean()
      return res.status(200).json({
        status: 'success',
        data: dataUser
      })
    }
    if (role === 'MEMBER') {
      const dataMember = await MemberModel.findById({ _id: userId }).select(selectData).lean()
      return res.status(200).json({
        status: 'success',
        data: dataMember
      })
    }
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message,
    })
  }
}

const putCurrentUser = async (req, res) => {
  try {
    const { userId, role } = req.user
    const body = req.body
    const filterData = '-refreshToken -createdAt -updatedAt -__v -password'
    if (role === 'USER') {
      if (body.password) var hashPassword = await bcrypt.hash(body.password, 10)
      const dataUserUpdate = await UserModel.findOneAndUpdate({
        _id: userId
      }, {
        $set: {
          username: body.username,
          email: body.email,
          permission: body.permission,
          fullname: body.fullname,
          phoneNumber: body.phoneNumber,
          active: body.active,
          avatar: body.avatar,
          password: hashPassword
        }
      }, {
        runValidators: true,
        new: true
      }).select(filterData)

      if (!dataUserUpdate) {
        return res.status(400).json({
          status: 'false',
          message: 'Không tìm thấy dữ liệu!'
        })
      }

      res.status(200).json({
        status: 'success',
        data: dataUserUpdate
      })
    }
    if (role === 'MEMBER') {
      if (body.password) var hashPassword = await bcrypt.hash(body.password, 10)
      const dataMemberUpdate = await MemberModel.findByIdAndUpdate({
        _id: userId
      }, {
        $set: {
          username: body.username,
          email: body.email,
          fullname: body.fullname,
          phoneNumber: body.phoneNumber,
          active: body.active,
          avatar: body.avatar,
          password: hashPassword
        }
      }, {
        new: true
      }).select(filterData)

      if (!dataMemberUpdate) {
        return res.status(400).json({
          status: 'false',
          message: 'Không tìm thấy dữ liệu!'
        })
      }

      res.status(200).json({
        status: 'success',
        data: dataMemberUpdate
      })
    }
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message,
    })
  }
}

module.exports = {
  register: register,
  userLogin: userLogin,
  memberLogin: memberLogin,
  userLogout: userLogout,
  refreshToken: refreshToken,
  forgotPassword: forgotPassword,
  resetPassword: resetPassword,
  getCurrentUser: getCurrentUser,
  putCurrentUser: putCurrentUser
}
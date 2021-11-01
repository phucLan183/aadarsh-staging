const UsersModel = require('../models/Users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userRegister = async (req, res) => {
  try {
    const { username, password, email, permission } = req.body
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new UsersModel({
      username: username,
      email: email,
      password: hashPassword,
      permission: permission,
    })
    const userData = await newUser.save()
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
    const {
      username,
      password
    } = req.body
    const checkDataUser = await UsersModel.findOne({ username: username }).lean()
    if (!checkDataUser) {
      return res.status(404).json({
        status: 'false',
        message: 'Username or password incorrect',
      })
    }
    const comparePass = await bcrypt.compare(password, checkDataUser.password)
    if (!comparePass) {
      return res.status(404).json({
        status: 'false',
        message: 'Username or password incorrect',
      })
    }
    const accessToken = jwt.sign({
      id: checkDataUser._id,
      username: checkDataUser.username,
      permission: checkDataUser.permission,
    }, process.env.ACCESS_TOKEN, {
      expiresIn: '30m'
    })

    const refreshToken = jwt.sign({
      id: checkDataUser._id,
      username: checkDataUser.username,
    }, process.env.REFRESH_TOKEN, {
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
    }).select('username email permission')

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
    await UsersModel.updateOne({
      username: req.user.username
    }, {
      $set: {
        refreshToken: []
      }
    })
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
  if (req.user.id) {
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
    const user = {
      username: req.user.username,
      refreshToken: req.user.refreshToken
    }
    if (user.refreshToken == null) {
      return res.sendStatus(401)
    }
    const dataUser = await UsersModel.findOne({
      username: user.username
    }).select('username permission refreshToken').lean()

    const storageRefreshToken = dataUser.refreshToken

    if (!storageRefreshToken.includes(user.refreshToken)) {
      return res.sendStatus(403)
    }

    const accessToken = jwt.sign({
      id: dataUser._id,
      username: dataUser.username,
      permission: dataUser.permission,
    }, process.env.ACCESS_TOKEN, {
      expiresIn: "30m"
    })

    res.status(200).json({
      success: "success",
      act: accessToken,
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
}
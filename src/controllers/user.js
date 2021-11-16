const UsersModel = require('../models/Users');
const bcrypt = require('bcrypt');

const filterDataUser = '-refreshToken -createdAt -updatedAt -__v -password'

const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skipPage = page * pageSize - pageSize
    const userId = req.user.userId
    const dataUsers = await UsersModel.find({
      _id: {
        $nin: userId
      }
    }).select(filterDataUser).skip(skipPage).limit(pageSize).lean()
    const totalUser = await UsersModel.countDocuments()
    res.status(200).json({
      status: 'success',
      data: dataUsers,
      total: totalUser,
    })
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message,
    })
  }
}

const getOneUser = async (req, res) => {
  try {
    const userId = req.params.id
    const dataUser = await UsersModel.findById(userId).select(filterDataUser).lean()

    if (!dataUser) {
      return res.status(400).json({
        status: 'false',
        message: 'UserId not found'
      })
    }

    res.status(200).json({
      status: 'success',
      data: dataUser
    })
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message,
    })
  }
}

const createUser = async (req, res) => {
  try {
    const body = req.body
    const hashPassword = await bcrypt.hash(body.password, 10)
    const newUser = await UsersModel.create({
      username: body.username,
      email: body.email,
      fullname: body.fullname,
      password: hashPassword,
      permission: body.permission,
    })
    const userData = {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      fullname: newUser.fullname,
      permission: newUser.permission,
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

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id
    const body = req.body
    const checkPassword = body.newPassword !== body.confirmPassword
    if (checkPassword) {
      return res.status(400).json({
        status: 'false',
        message: 'Mật khẩu không trùng khớp!'
      })
    }
    if (body.confirmPassword) var hashPassword = await bcrypt.hash(body.confirmPassword, 10)
    const dataUserUpdate = await UsersModel.findByIdAndUpdate({
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
      multi: true,
      new: true
    }).select(filterDataUser)

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
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message,
    })
  }
}

const removeUser = async (req, res) => {
  try {
    const userId = req.params.id
    const delUser = await UsersModel.deleteOne({
      _id: userId
    }).lean()
    if (!delUser) {
      return res.status(400).json({
        status: 'false',
        message: 'Không tìm thấy dữ liệu!'
      })
    }
    res.status(200).json({
      status: 'success',
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
    const currentUserId = req.user.userId
    const dataUser = await UsersModel.findById(currentUserId).select(filterDataUser).lean()
    res.status(200).json({
      status: 'success',
      data: dataUser
    })
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message,
    })
  }
}

module.exports = {
  getAllUsers: getAllUsers,
  createUser: createUser,
  getOneUser: getOneUser,
  updateUser: updateUser,
  removeUser: removeUser,
  getCurrentUser: getCurrentUser
}
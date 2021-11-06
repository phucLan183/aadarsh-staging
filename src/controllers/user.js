const UsersModel = require('../models/Users');
const bcrypt = require('bcrypt');

const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skipPage = page * pageSize - pageSize
    const dataUsers = await UsersModel.find().select('username email permission').skip(skipPage).limit(pageSize).lean()
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
    const dataUser = await UsersModel.findById(userId).select('username email permission').lean()

    if (!dataUser) {
      return res.status(404).json({
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
    const { username, email, password, permission } = req.body
    const hashPassword = await bcrypt.hash(password, 10)
    const newUser = new UsersModel({
      username: username,
      email: email,
      password: hashPassword,
      permission: permission
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

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id
    const body = req.body
    const dataUserUpdate = await UsersModel.findByIdAndUpdate({
      _id: userId
    }, {
      $set: {
        username: body.username,
        email: body.email,
        permission: body.permission,
      }
    }, {
      new: true
    }).select('username email permission')

    if (!dataUserUpdate) {
      return res.status(404).json({
        status: 'false',
        message: 'UserId not found'
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
      return res.status(404).json({
        status: 'false',
        message: 'UserId not found'
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
module.exports = {
  getAllUsers: getAllUsers,
  createUser: createUser,
  getOneUser: getOneUser,
  updateUser: updateUser,
  removeUser: removeUser
}
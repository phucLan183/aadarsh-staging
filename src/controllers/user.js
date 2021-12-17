const UserModel = require('../models/Users');
const bcrypt = require('bcrypt');

const filterDataUser = '-refreshToken -createdAt -updatedAt -__v -password'

const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skipPage = page * pageSize - pageSize
    const userId = req.user.userId
    const keyWord = req.query.keyWord || ''
    const dataUsers = await UserModel.find({
      $or: [
        { fullname: { $regex: keyWord, $options: 'i' } },
        { username: { $regex: keyWord, $options: 'i' } },
        { email: { $regex: keyWord, $options: 'i' } },
        { phoneNumber: { $regex: keyWord, $options: 'i' } }
      ],
      _id: {
        $nin: userId
      }
    }).select(filterDataUser).skip(skipPage).limit(pageSize).sort({ _id: -1 }).lean()
    const totalUser = await UserModel.countDocuments({
      $or: [
        { fullname: { $regex: keyWord, $options: 'i' } },
        { username: { $regex: keyWord, $options: 'i' } },
        { email: { $regex: keyWord, $options: 'i' } },
        { phoneNumber: { $regex: keyWord, $options: 'i' } }
      ],
      _id: {
        $nin: userId
      }
    })
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
    const dataUser = await UserModel.findById(userId).select(filterDataUser).lean()

    if (!dataUser) {
      return res.status(400).json({
        status: 'false',
        message: 'Không tìm thấy dữ liệu!'
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
    const newUser = await UserModel.create({
      username: body.username,
      email: body.email,
      fullname: body.fullname,
      password: hashPassword,
      permission: body.permission,
      phoneNumber: body.phoneNumber,
      avatar: body.avatar,
      active: body.active
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

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id
    const body = req.body
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
    const userIdToken = req.user.userId
    if (userIdToken === userId) {
      return res.status(403).json({
        status: 'false',
        message: 'Không thể tự xóa tài khoản!'
      })
    }
    const delUser = await UserModel.deleteOne({
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



module.exports = {
  getAllUsers: getAllUsers,
  createUser: createUser,
  getOneUser: getOneUser,
  updateUser: updateUser,
  removeUser: removeUser
}
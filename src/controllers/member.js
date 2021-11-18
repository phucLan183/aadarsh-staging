const MembersModel = require('../models/Members');
const bcrypt = require('bcrypt')
const filterDataMember = '-refreshToken -createdAt -updatedAt -__v -password'

const getAllMembers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skipPage = page * pageSize - pageSize
    const keyWord = req.query.keyWord || ''
    const dataMembers = await MembersModel.find({
      $or: [
        { fullname: { $regex: keyWord, $options: 'i' } },
        { username: { $regex: keyWord, $options: 'i' } },
        { email: { $regex: keyWord, $options: 'i' } },
        { phoneNumber: { $regex: keyWord, $options: 'i' } }
      ]
    }).select(filterDataMember).skip(skipPage).limit(pageSize).lean()
    const totalMember = await MembersModel.countDocuments({
      $or: [
        { fullname: { $regex: keyWord, $options: 'i' } },
        { username: { $regex: keyWord, $options: 'i' } },
        { email: { $regex: keyWord, $options: 'i' } },
        { phoneNumber: { $regex: keyWord, $options: 'i' } }
      ]
    })
    res.status(200).json({
      status: 'success',
      data: dataMembers,
      total: totalMember
    })
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message
    })
  }
}
const createMember = async (req, res) => {
  try {
    const body = req.body
    const hashPassword = await bcrypt.hash(body.password, 10)
    const newMember = await MembersModel.create({
      username: body.username,
      email: body.email,
      fullname: body.fullname,
      password: hashPassword,
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
      message: error.message
    })
  }
}

const getOneMember = async (req, res) => {
  try {
    const memberId = req.params.id
    const dataMember = await MembersModel.findById(memberId).select(filterDataMember).lean()

    if (!dataMember) {
      return res.status(400).json({
        status: 'false',
        message: 'Không tìm thấy dữ liệu!'
      })
    }

    res.status(200).json({
      status: 'success',
      data: dataMember
    })
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message
    })
  }
}
const updateMember = async (req, res) => {
  try {
    const memberId = req.params.id
    const body = req.body
    if (body.password) var hashPassword = await bcrypt.hash(body.password, 10)
    const dataMemberUpdate = await MembersModel.findByIdAndUpdate({
      _id: memberId
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
      multi: true,
      new: true
    }).select(filterDataMember)

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
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message
    })
  }
}
const removeMember = async (req, res) => {
  try {
    const memberId = req.params.id
    const delUser = await MembersModel.deleteOne({
      _id: memberId
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
      message: error.message
    })
  }
}

module.exports = {
  getAllMembers: getAllMembers,
  createMember: createMember,
  getOneMember: getOneMember,
  updateMember: updateMember,
  removeMember: removeMember,
}
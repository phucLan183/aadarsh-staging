const MemberModel = require('../models/Members');
const bcrypt = require('bcrypt')
const filterDataMember = '-refreshToken -createdAt -updatedAt -__v -password'

const getAllMembers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skipPage = page * pageSize - pageSize
    const keyWord = req.query.keyWord || ''
    const dataMembers = await MemberModel.find({
      $or: [
        { fullname: { $regex: keyWord, $options: 'i' } },
        { username: { $regex: keyWord, $options: 'i' } },
        { email: { $regex: keyWord, $options: 'i' } },
        { phoneNumber: { $regex: keyWord, $options: 'i' } }
      ]
    }).select(filterDataMember).skip(skipPage).limit(pageSize).sort({ createdAt: -1 }).lean()
    const totalMember = await MemberModel.countDocuments({
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
    const newMember = await MemberModel.create({
      username: body.username,
      email: body.email,
      fullname: body.username,
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
    const dataMember = await MemberModel.findById(memberId).select(filterDataMember).lean()

    if (!dataMember) {
      return res.status(400).json({
        status: 'false',
        message: 'Could not find member'
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
    const dataMemberUpdate = await MemberModel.findByIdAndUpdate({
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
      new: true
    }).select(filterDataMember)

    if (!dataMemberUpdate) {
      return res.status(400).json({
        status: 'false',
        message: 'Could not find member'
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
    const delUser = await MemberModel.findOneAndDelete({
      _id: memberId
    }).lean()
    if (!delUser) {
      return res.status(400).json({
        status: 'false',
        message: 'Could not find member'
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

const getCurrentMember = async (req, res) => {
  try {
    const currentMemberId = req.user.userId
    const dataMember = await UserModel.findById(currentMemberId).select(filterDataUser).lean()
    res.status(200).json({
      status: 'success',
      data: dataMember
    })
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message,
    })
  }
}

module.exports = {
  getAllMembers: getAllMembers,
  createMember: createMember,
  getOneMember: getOneMember,
  updateMember: updateMember,
  removeMember: removeMember,
  getCurrentMember: getCurrentMember
}
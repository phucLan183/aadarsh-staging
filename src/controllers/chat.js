const MessageModel = require('../models/Messages');
const RoomModel = require('../models/Rooms');

const getAllRooms = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.pageSize) || 10
    const skipPage = page * pageSize - pageSize
    const keyWord = req.query.keyWord || ''
    const { userId } = req.user
    const dataRoom = await RoomModel.find({
      $or: [
        { name: { $regex: keyWord, $options: 'i' }, userId: userId },
        { name: { $regex: keyWord, $options: 'i' }, memberId: userId }
      ]
    }).populate([
      { path: 'memberId', select: 'username fullname avatar' },
      { path: 'lastMessage', select: 'text createdAt memberId userId type', populate: [{ path: 'userId', select: 'username fullname avatar' }] }
    ]).select('-userId').skip(skipPage).limit(pageSize)
    const totalRoom = await RoomModel.countDocuments({
      $or: [
        { name: { $regex: keyWord, $options: 'i' }, userId: userId },
        { name: { $regex: keyWord, $options: 'i' }, memberId: userId }
      ]
    })
    res.status(200).json({
      status: 'success',
      data: dataRoom,
      total: totalRoom
    })
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message
    })
  }
}

const getRoomId = async (req, res) => {
  try {
    const roomId = req.params.id
    const dataRoom = await RoomModel.findById(roomId).populate({ path: 'memberId', select: 'username fullname email' }).lean()
    if (!dataRoom) {
      return res.status(404).json({
        status: 'false',
        message: 'Không tìm thấy dữ liệu!'
      })
    }
    res.status(200).json({
      status: 'success',
      data: dataRoom
    })
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message
    })
  }
}

const deleteRoom = async (req, res) => {
  try {
    const roomId = req.params.id
    const dataRoom = await RoomModel.findByIdAndDelete(roomId).lean()
    if (!dataRoom) {
      return res.status(404).json({
        status: 'false',
        message: 'Không tìm thấy dữ liệu!'
      })
    }
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

const getAllMessages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.pageSize) || 10
    const skipPage = page * pageSize - pageSize
    const roomId = req.query.roomId
    const dataMessage = await MessageModel.find({
      roomId: roomId
    }).populate([
      { path: 'memberId', select: 'username fullname avatar' },
      { path: 'userId', select: 'username fullname avatar' }
    ]).skip(skipPage).limit(pageSize)
    const totalMessage = await MessageModel.countDocuments({
      roomId: roomId
    })
    res.status(200).json({
      status: 'success',
      data: dataMessage,
      total: totalMessage
    })
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message
    })
  }
}

module.exports = {
  getAllRooms: getAllRooms,
  getRoomId: getRoomId,
  deleteRoom: deleteRoom,
  getAllMessages: getAllMessages
}
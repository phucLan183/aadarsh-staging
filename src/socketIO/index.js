const socketIO = require('socket.io');
const RoomModel = require('../models/Rooms');
const MessageModel = require('../models/Messages');
const UserModel = require('../models/Users');
const MemberModel = require('../models/Members');

module.exports = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: env.ROOT_URL,
      methods: ["GET", "POST"],
      credentials: true
    }
  })

  io.on('connection', (socket) => {

    // Client disconnect
    socket.on('END_CONVERSATION', () => {
      socket.emit('END_CONVERSATION_SUCCESS', 'User has left the chat')
    })

    socket.on('START_CONVERSATION', async ({ memberId }) => {
      let room
      room = await RoomModel.findOne({
        memberId: memberId
      }).populate([
        { path: 'memberId', select: 'username email fullname avatar updatedAt' },
        { path: 'lastMessage', select: 'text createdAt memberId userId type', populate: [{ path: 'userId', select: 'username fullname avatar' }] }
      ]).select('-userId');
      if (!room) {
        const dataUser = await UserModel.find({
          active: true,
          'permission.message': {
            $all: ["GET", "POST", "PUT", "DELETE"]
          }
        }).select('id')
        const newDataUser = dataUser.map((user) => user.id)
        const dataMember = await MemberModel.findById(memberId).select('username')
        const newRoom = await new RoomModel({
          name: dataMember.username,
          userId: newDataUser,
          memberId: memberId
        }).save()
        room = await RoomModel.findById(newRoom._id).populate({
          path: 'memberId', select: 'username email fullname avatar updatedAt'
        }).select('-userId');
      }
      socket.emit('START_CONVERSATION_SUCCESS', room);
    })

    socket.on('SEEN_CONVERSATION', async ({ roomId }) => {
      const dataRoom = await RoomModel.findByIdAndUpdate({
        _id: roomId,
      }, {
        $set: {
          seen: true
        }
      }, {
        new: true
      }).select('-userId -memberId')
      socket.emit('SEEN_CONVERSATION_SUCCESS', dataRoom)
    })

    socket.on('MARK_UNSEEN_CONVERSATION', async ({ roomId }) => {
      const dataRoom = await RoomModel.findByIdAndUpdate({
        _id: roomId,
      }, {
        $set: {
          seen: false
        }
      }, {
        new: true
      }).select('-userId -memberId')
      socket.emit('MARK_UNSEEN_CONVERSATION_SUCCESS', dataRoom)
    })

    socket.on('SEND_MESSAGE', async ({ roomId, userId, memberId, text, image, type }) => {
      let newMessage

      if (userId) {
        newMessage = await new MessageModel({
          text: text,
          image: image,
          type: type,
          userId: userId,
          roomId: roomId
        }).save()
      }

      if (memberId) {
        newMessage = await new MessageModel({
          text: text,
          image: image,
          type: type,
          memberId: memberId,
          roomId: roomId
        }).save()
      }

      const newMessageReceiver = await MessageModel.findById(newMessage._id).populate([
        { path: 'memberId', select: 'username fullname avatar email' },
        { path: 'userId', select: 'username fullname avatar email' },
        {
          path: 'roomId',
          select: 'name seen createdAt updatedAt',
          populate: {
            path: 'memberId',
            select: 'username fullname avatar email',
          }
        }
      ])


      await RoomModel.findByIdAndUpdate({
        _id: roomId,
      }, {
        $set: newMessageReceiver.userId
          ? { lastMessage: newMessage._id }
          : { lastMessage: newMessage._id, seen: false }
      })

      io.sockets.emit('RECEIVER_MESSAGE', { newMessage: newMessageReceiver });
    })
  })
}
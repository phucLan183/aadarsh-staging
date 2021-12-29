const socketIO = require('socket.io');
const RoomModel = require('../models/Rooms');
const MessageModel = require('../models/Messages');
const UserModel = require('../models/Users');
const MemberModel = require('../models/Members');

module.exports = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: "*:*",
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
      const dataUser = await UserModel.find({
        active: true,
        'permission.message': {
          $all: ["GET", "POST", "PUT", "DELETE"]
        }
      }).select('id')
      const newDataUser = dataUser.map((user) => user.id)
      let room
      room = await RoomModel.find({
        memberId: memberId
      })
      if (room.length === 0) {
        const dataMember = await MemberModel.findById(memberId).select('username')
        room = await new RoomModel({
          name: dataMember.username,
          userId: newDataUser,
          memberId: memberId
        }).save()
      }
      socket.emit('START_CONVERSATION_SUCCESS', room);
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

      await RoomModel.findByIdAndUpdate({
        _id: roomId,
      }, {
        $set: {
          lastMessage: newMessage._id
        }
      })

      socket.emit('RECEIVER_MESSAGE', { newMessage })
    })
  })
}
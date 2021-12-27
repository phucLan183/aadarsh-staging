const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
  name: {
    type: String,
    default: null,
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  },
  userId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member'
  }
}, {
  timestamps: true,
  versionKey: false
})

const Room = mongoose.model('Room', RoomSchema)
module.exports = Room
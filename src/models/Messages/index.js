const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  text: {
    type: String,
    trim: true,
    default: null
  },
  image: [{
    type: String,
    trim: true
  }],
  type: {
    type: String,
    enum: ['TEXT', 'IMAGE', 'THUMB_UP'],
    required: true
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member'
  }
}, {
  timestamps: true,
  versionKey: false
})

const Message = mongoose.model('Message', MessageSchema)
module.exports = Message
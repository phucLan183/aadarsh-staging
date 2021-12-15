const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MemberSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    min: 5
  },
  fullname: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    match: /.+\@.+\..+/,
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
  avatar: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true
  },
  refreshToken: {
    type: Array,
    default: undefined,
  }
}, {
  timestamps: true
});

const Member = mongoose.model('Member', MemberSchema);
module.exports = Member
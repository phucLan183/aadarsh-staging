const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sameValue = {
  type: Array,
  default: undefined,
  action: {
    type: String,
    upperCase: true,
    enum: ['GET', 'POST', 'PUT', 'DELETE']
  }
}

const permission = {
  blog: sameValue,
  layout: sameValue,
  product: sameValue,
  employee: sameValue,
  member: sameValue,
  contact: sameValue,
  message: sameValue,
  question: sameValue,
  experiment: sameValue
}

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    min: 5
  },
  email: {
    match: /.+\@.+\..+/,
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  permission,
  refreshToken: []
}, {
  timestamps: true
});

const User = mongoose.model('User', UserSchema);
module.exports = User
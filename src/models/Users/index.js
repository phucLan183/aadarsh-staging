const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const typeModelPermission = [{
  type: String,
  enum: ['GET', 'POST', 'PUT', 'DELETE'],
  default: undefined
}]

const permission = {
  blog: typeModelPermission,
  upload: typeModelPermission,
  product: typeModelPermission,
  category: typeModelPermission,
  user: typeModelPermission,
  member: typeModelPermission,
  message: typeModelPermission,
  question: typeModelPermission,
  review: typeModelPermission,
  order: typeModelPermission
}

const UserSchema = new Schema({
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
    default: false
  },
  permission,
  refreshToken: {
    type: Array,
    default: undefined,
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', UserSchema);
module.exports = User
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const typeModelPermission = {
  type: Array,
  default: undefined,
  action: {
    type: String,
    upperCase: true,
    enum: ['GET', 'POST', 'PUT', 'DELETE']
  }
}

const permission = {
  blog: typeModelPermission,
  layout: typeModelPermission,
  product: typeModelPermission,
  user: typeModelPermission,
  member: typeModelPermission,
  contact: typeModelPermission,
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
    default: true
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
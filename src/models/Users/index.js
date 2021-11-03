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
  experiment: typeModelPermission
}

const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, "Tên đăng nhập không được để chống!"],
    trim: true,
    unique: true,
    min: 5
  },
  email: {
    match: /.+\@.+\..+/,
    type: String,
    required: [true, "Email không được để chống!"],
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, "Mật khẩu không được để chống!"],
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
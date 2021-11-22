const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  urlId: {
    type: String,
    trim: true,
    required: true
  },
  thumbnail: {
    type: String
  },
  active: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  description: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  tagId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag'
  }]
}, {
  timestamps: true,
  versionKey: false
})

const Blog = mongoose.model('Blog', BlogSchema)
module.exports = Blog
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
  title: {
    type: String,
    required: true
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
  timestamps: true
})

const Blog = mongoose.model('Blog', BlogSchema)
module.exports = Blog
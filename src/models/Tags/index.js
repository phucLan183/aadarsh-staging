const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TagSchema = new Schema({
  label: {
    type: String,
    trim: true,
    unique: true,
    required: true
  }
}, {
  timestamps: true
})

const Tag = mongoose.model('Tag', TagSchema)
module.exports = Tag
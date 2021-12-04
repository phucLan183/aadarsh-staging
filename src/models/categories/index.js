const mongoose = require('mongoose');
const Schema = mongoose.Schema

const CategorySchema = new Schema({
  name: {
    type: String,
    trim: true,
    unique: true,
    required: true
  },
  slug: {
    type: String,
    trim: true,
    unique: true,
    required: true
  },
  price: {
    type: String,
    trim: true
  },
  thumbnail: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  storage: {
    type: Array,
    default: undefined
  }
}, {
  timestamps: true,
  versionKey: false
})

const Category = mongoose.model('Category', CategorySchema)
module.exports = Category
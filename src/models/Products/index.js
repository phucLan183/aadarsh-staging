const mongoose = require('mongoose');
const Schema = mongoose.Schema

const ProductsSchema = new Schema({
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
  categoryId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
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
  active: {
    type: Boolean,
    default: false
  },
  storage: {
    type: Array,
    default: undefined
  }
}, {
  timestamps: true,
  versionKey: false
})

const Product = mongoose.model('Product', ProductsSchema)
module.exports = Product
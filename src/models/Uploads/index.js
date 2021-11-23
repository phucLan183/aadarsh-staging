const mongoose = require('mongoose');
const Schema = mongoose.Schema
const ImageSchema = new Schema({
  urlImage: {
    type: String,
    required: true
  },
  publicIdImage: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  versionKey: false
})
const Image = mongoose.model('Image', ImageSchema)
module.exports = Image
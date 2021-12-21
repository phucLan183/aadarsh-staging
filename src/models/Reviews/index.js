const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  fullname: {
    type: String,
    required: true
  },
  star: {
    type: Number,
    min: 1,
    max: 5,
  },
  content: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    required: true,
  }
}, {
  timestamps: true
});

const Review = mongoose.model('Review', ReviewSchema);
module.exports = Review
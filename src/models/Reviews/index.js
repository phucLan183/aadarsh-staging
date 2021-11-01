const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  name: {
    type: String,
    required: [true, "Tên không được để chống!"]
  },
  productId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    default: undefined
  }],
  feedbackId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Feedback",
    default: undefined
  }]
}, {
  timestamps: true
});

const Review = mongoose.model('Review', ReviewSchema);
module.exports = Review
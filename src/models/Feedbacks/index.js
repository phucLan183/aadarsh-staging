const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeedbackSchema = new Schema({
  fullname: {
    type: String,
    required: [true, "Tên không được để chống!"]
  },
  star: {
    type: Number,
    min: 1,
    max: 5,
  },
  content: {
    type: String,
    required: true,
  }
}, {
  timestamps: true
});

const Feedback = mongoose.model('Feedback', FeedbackSchema);
module.exports = Feedback
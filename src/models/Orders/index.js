const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  productId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  price: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'INPROCESS', 'REJECT', 'RETURN', 'SUCCESS'],
    default: 'PENDING'
  },
  attachment: {
    type: Array,
    default: undefined
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  versionKey: false
})

const Order = mongoose.model('Order', OrderSchema)
module.exports = Order
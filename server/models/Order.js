const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: String,
  price: Number,
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  image: String,
  greenRating: Number,
});

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
  },
  greenPointsUsed: {
    type: Number,
    default: 0,
  },
  greenPointsEarned: {
    type: Number,
    default: 0,
  },
  discount: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'out-for-delivery', 'delivered', 'cancelled', 'returned'],
    default: 'pending',
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String,
  },
  trackingNumber: String,
  returnReason: String,
  returnType: {
    type: String,
    enum: ['return', 'recycle', null],
    default: null,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Order', orderSchema);

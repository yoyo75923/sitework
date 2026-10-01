const mongoose = require('mongoose');

const marketplaceListingSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  condition: {
    type: String,
    enum: ['new', 'like-new', 'good', 'fair', 'poor'],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: [String],
  hasReceipt: {
    type: Boolean,
    default: false,
  },
  location: {
    type: String,
    default: '',
  },
  views: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
  legacyId: { type: String, index: true },
  sellerName: { type: String, default: '' },
  sellerRating: { type: Number, default: 4.8 },
  sellerSales: { type: Number, default: 10 },
  detailedDescription: { type: String, default: '' },
  specifications: { type: mongoose.Schema.Types.Mixed, default: {} },
  status: {
    type: String,
    enum: ['active', 'sold', 'pending', 'removed'],
    default: 'active',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('MarketplaceListing', marketplaceListingSchema);

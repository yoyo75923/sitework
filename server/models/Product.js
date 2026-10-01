const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0,
  },
  originalPrice: {
    type: Number,
    min: 0,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  greenRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  certifications: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
  },
  description: {
    type: String,
    default: '',
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  type: {
    type: String,
    enum: ['new', 'refurbished'],
    default: 'new',
  },
  // Refurbished & Marketplace specific fields
  legacyId: { type: String, index: true },
  title: String,
  refurbishedPrice: Number,
  savings: Number,
  condition: String,
  warranty: String,
  warrantyMonths: Number,
  cosmeticCondition: String,
  functionalityTested: Boolean,
  originalPackaging: Boolean,
  returnDays: Number,
  location: String,
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  sellerName: String,
  sellerRating: Number,
  sellerSales: Number,
  refurbishedBy: String,
  brand: String,
  features: [String],
  specifications: { type: mongoose.Schema.Types.Mixed, default: {} },
  images: [String],
  detailedDescription: String,
  // Seller-specific fields
  manufacturerName: String,
  packagingCert: String,
  materialCert: String,
  categoryFields: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual for title/name fallback
productSchema.virtual('displayTitle').get(function() {
  return this.title || this.name;
});

// Text index for search
productSchema.index({ name: 'text', title: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Product', productSchema);

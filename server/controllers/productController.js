const Product = require('../models/Product');

// Category mapping table for hierarchical / subcategory searches
const CATEGORY_MAP = {
  'electronics': ['electronics', 'smartphones', 'laptops', 'tablets', 'audio', 'smartwatches', 'headphones', 'accessories', 'gaming', 'cameras'],
  'clothing': ['clothing', 'fashion', 'apparel', 'shoes', 'footwear'],
  'footwear': ['footwear', 'shoes'],
  'home-garden': ['home-garden', 'home', 'garden', 'home-decor'],
  'personal-care': ['personal-care', 'personal'],
  'beauty-skincare': ['beauty-skincare', 'beauty', 'skincare'],
  'sports-fitness': ['sports-fitness', 'sports', 'fitness'],
  'books-education': ['books-education', 'books', 'education', 'media'],
  'pet-care': ['pet-care', 'pets', 'pet'],
  'baby-kids': ['baby-kids', 'baby', 'kids', 'toys'],
  'office-stationery': ['office-stationery', 'office', 'stationery'],
  'outdoor-camping': ['outdoor-camping', 'outdoor', 'camping'],
  'food-beverages': ['food-beverages', 'food', 'beverages'],
  'headphones': ['headphones', 'audio'],
  'audio': ['audio', 'headphones'],
  'phones': ['phones', 'smartphones'],
  'smartphones': ['smartphones', 'phones'],
  'laptops': ['laptops', 'computers'],
  'tablets': ['tablets', 'ipads'],
  'smartwatches': ['smartwatches', 'watches'],
  'gaming': ['gaming', 'consoles'],
  'cameras': ['cameras', 'photography'],
  'accessories': ['accessories', 'electronics-accessories'],
};

// Helper to resolve category query list
const resolveCategories = (slug) => {
  if (!slug || slug === 'all') return [];
  const clean = slug.toLowerCase().trim();
  return CATEGORY_MAP[clean] || [clean];
};

// @desc    Get all products (with filters, pagination, sorting)
// @route   GET /api/products
const getProducts = async (req, res, next) => {
  try {
    const { category, search, sort, page = 1, limit = 100, type, inStock } = req.query;

    const query = {};

    if (category && category !== 'all') {
      const targetCats = resolveCategories(category);
      query.$or = [
        { category: { $in: targetCats } },
        { category: { $regex: new RegExp(`^${category}$`, 'i') } },
      ];
    }

    if (type) {
      query.type = type;
    }

    if (inStock !== undefined) {
      query.inStock = inStock === 'true';
    }

    if (search) {
      const searchOr = [
        { name: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
      if (query.$or) {
        query.$and = [{ $or: query.$or }, { $or: searchOr }];
        delete query.$or;
      } else {
        query.$or = searchOr;
      }
    }

    let sortObj = {};
    switch (sort) {
      case 'price-asc': sortObj = { price: 1 }; break;
      case 'price-desc': sortObj = { price: -1 }; break;
      case 'rating': sortObj = { rating: -1 }; break;
      case 'newest': sortObj = { createdAt: -1 }; break;
      case 'green-rating': sortObj = { greenRating: -1 }; break;
      default: sortObj = { createdAt: -1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      products,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
const getProduct = async (req, res, next) => {
  try {
    let product = null;
    const mongoose = require('mongoose');
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      product = await Product.findById(req.params.id).populate('sellerId', 'name email');
    }
    if (!product) {
      product = await Product.findOne({ legacyId: req.params.id }).populate('sellerId', 'name email');
    }
    if (!product) {
      const all = await Product.find().populate('sellerId', 'name email');
      const idx = parseInt(req.params.id);
      if (!isNaN(idx) && idx >= 1 && idx <= all.length) {
        product = all[idx - 1];
      } else {
        product = all.find(p => p.category === req.params.id || (p.name && p.name.toLowerCase().includes(req.params.id.toLowerCase())) || (p.title && p.title.toLowerCase().includes(req.params.id.toLowerCase())));
      }
    }
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:slug
const getProductsByCategory = async (req, res, next) => {
  try {
    const slug = (req.params.slug || '').toLowerCase().trim();
    const targetCategories = resolveCategories(slug);

    const products = await Product.find({
      $or: [
        { category: { $in: targetCategories } },
        { category: { $regex: new RegExp(`^${slug}$`, 'i') } }
      ]
    });

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search products
// @route   GET /api/products/search
const searchProducts = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json({ success: true, count: 0, products: [] });
    }
    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
      ],
    });
    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product (seller only)
// @route   POST /api/products
const createProduct = async (req, res, next) => {
  try {
    const productData = {
      ...req.body,
      sellerId: req.user._id,
    };
    const product = await Product.create(productData);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Update product (seller only)
// @route   PUT /api/products/:id
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check ownership (allow if seller owns this product or product has no seller)
    if (product.sellerId && product.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product (seller only)
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.sellerId && product.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get seller's products
// @route   GET /api/products/seller/mine
const getSellerProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ sellerId: req.user._id });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all categories
// @route   GET /api/categories
const getCategories = async (req, res) => {
  const categories = [
    { id: 'clothing', name: 'Sustainable Fashion', icon: '👕' },
    { id: 'electronics', name: 'Green Electronics', icon: '📱' },
    { id: 'footwear', name: 'Eco Footwear', icon: '👟' },
    { id: 'home-garden', name: 'Home & Garden', icon: '🏠' },
    { id: 'personal-care', name: 'Personal Care', icon: '🧴' },
    { id: 'beauty-skincare', name: 'Beauty & Skincare', icon: '💄' },
    { id: 'sports-fitness', name: 'Sports & Fitness', icon: '🏃‍♀️' },
    { id: 'books-education', name: 'Books & Education', icon: '📚' },
    { id: 'pet-care', name: 'Pet Care', icon: '🐾' },
    { id: 'baby-kids', name: 'Baby & Kids', icon: '👶' },
    { id: 'office-stationery', name: 'Office & Stationery', icon: '📝' },
    { id: 'outdoor-camping', name: 'Outdoor & Camping', icon: '🏕️' },
    { id: 'food-beverages', name: 'Food & Beverages', icon: '🍽️' },
  ];
  res.json(categories);
};

module.exports = {
  getProducts,
  getProduct,
  getProductsByCategory,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getSellerProducts,
  getCategories,
};

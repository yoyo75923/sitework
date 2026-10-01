const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  getProductsByCategory,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getSellerProducts,
  getCategories,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getProducts);
router.get('/search', searchProducts);
router.get('/category/:slug', getProductsByCategory);
router.get('/categories', getCategories);

// Protected routes (seller only)
router.get('/seller/mine', protect, authorize('seller'), getSellerProducts);
router.post('/', protect, authorize('seller'), createProduct);
router.put('/:id', protect, authorize('seller'), updateProduct);
router.delete('/:id', protect, authorize('seller'), deleteProduct);

// Public - single product (must be after other specific routes)
router.get('/:id', getProduct);

module.exports = router;

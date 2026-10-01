const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  returnOrder,
  getSellerOrders,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

// All order routes require auth
router.use(protect);

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/seller', authorize('seller'), getSellerOrders);
router.get('/:id', getOrder);
router.put('/:id/status', authorize('seller'), updateOrderStatus);
router.post('/:id/return', returnOrder);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getProductReviews, createReview, markHelpful, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

// Public
router.get('/product/:productId', getProductReviews);

// Protected
router.post('/', protect, createReview);
router.put('/:id/helpful', protect, markHelpful);
router.delete('/:id', protect, deleteReview);

module.exports = router;

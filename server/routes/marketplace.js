const express = require('express');
const router = express.Router();
const {
  getListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
  getMyListings,
} = require('../controllers/marketplaceController');
const { protect } = require('../middleware/auth');

// Public
router.get('/', getListings);

// Protected
router.get('/mine', protect, getMyListings);
router.post('/', protect, createListing);
router.put('/:id', protect, updateListing);
router.delete('/:id', protect, deleteListing);

// Public - single listing (must be after /mine)
router.get('/:id', getListing);

module.exports = router;

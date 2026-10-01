const MarketplaceListing = require('../models/MarketplaceListing');

// @desc    Get all marketplace listings
// @route   GET /api/marketplace
const getListings = async (req, res, next) => {
  try {
    const { category, condition, sort, search, page = 1, limit = 100 } = req.query;

    const query = { status: 'active' };
    if (category && category !== 'all') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }
    if (condition && condition !== 'all') query.condition = condition;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    let sortObj = { createdAt: -1 };
    if (sort === 'price-asc') sortObj = { price: 1 };
    if (sort === 'price-desc') sortObj = { price: -1 };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await MarketplaceListing.countDocuments(query);
    const listings = await MarketplaceListing.find(query)
      .populate('sellerId', 'name city')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      listings,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single listing
// @route   GET /api/marketplace/:id
const getListing = async (req, res, next) => {
  try {
    const mongoose = require('mongoose');
    let listing = null;

    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      listing = await MarketplaceListing.findById(req.params.id)
        .populate('sellerId', 'name city');
    }
    if (!listing) {
      listing = await MarketplaceListing.findOne({ legacyId: req.params.id })
        .populate('sellerId', 'name city');
    }
    if (!listing) {
      const all = await MarketplaceListing.find().populate('sellerId', 'name city');
      const idx = parseInt(req.params.id.replace('p2p-', ''));
      if (!isNaN(idx) && idx >= 1 && idx <= all.length) {
        listing = all[idx - 1];
      }
    }

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Increment views
    listing.views += 1;
    await listing.save();

    res.json(listing);
  } catch (error) {
    next(error);
  }
};

// @desc    Create listing
// @route   POST /api/marketplace
const createListing = async (req, res, next) => {
  try {
    const listing = await MarketplaceListing.create({
      ...req.body,
      sellerId: req.user._id,
    });
    res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

// @desc    Update listing
// @route   PUT /api/marketplace/:id
const updateListing = async (req, res, next) => {
  try {
    const listing = await MarketplaceListing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (listing.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedListing = await MarketplaceListing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedListing);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete listing
// @route   DELETE /api/marketplace/:id
const deleteListing = async (req, res, next) => {
  try {
    const listing = await MarketplaceListing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (listing.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await MarketplaceListing.findByIdAndDelete(req.params.id);
    res.json({ message: 'Listing removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my listings
// @route   GET /api/marketplace/mine
const getMyListings = async (req, res, next) => {
  try {
    const listings = await MarketplaceListing.find({ sellerId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    next(error);
  }
};

module.exports = { getListings, getListing, createListing, updateListing, deleteListing, getMyListings };

const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId })
      .sort({ createdAt: -1 });

    // Calculate summary
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

    const ratingDistribution = [5, 4, 3, 2, 1].map(stars => ({
      stars,
      count: reviews.filter(r => r.rating === stars).length,
    }));

    res.json({
      reviews,
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10,
      ratingDistribution,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a review
// @route   POST /api/reviews
const createReview = async (req, res, next) => {
  try {
    const { productId, rating, title, content } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      productId,
      userId: req.user._id,
    });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    const review = await Review.create({
      productId,
      userId: req.user._id,
      customerName: req.user.name,
      rating,
      title,
      content,
    });

    // Update product's average rating and review count
    const allReviews = await Review.find({ productId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: allReviews.length,
    });

    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

// @desc    Mark review as helpful/not helpful
// @route   PUT /api/reviews/:id/helpful
const markHelpful = async (req, res, next) => {
  try {
    const { isHelpful } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (isHelpful) {
      if (!review.helpfulUsers.includes(req.user._id)) {
        review.helpful += 1;
        review.helpfulUsers.push(req.user._id);
        // Remove from notHelpful if previously marked
        review.notHelpfulUsers = review.notHelpfulUsers.filter(
          id => id.toString() !== req.user._id.toString()
        );
      }
    } else {
      if (!review.notHelpfulUsers.includes(req.user._id)) {
        review.notHelpful += 1;
        review.notHelpfulUsers.push(req.user._id);
        review.helpfulUsers = review.helpfulUsers.filter(
          id => id.toString() !== req.user._id.toString()
        );
      }
    }

    await review.save();
    res.json(review);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete own review
// @route   DELETE /api/reviews/:id
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const productId = review.productId;
    await Review.findByIdAndDelete(req.params.id);

    // Recalculate product rating
    const allReviews = await Review.find({ productId });
    const avgRating = allReviews.length > 0
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
      : 0;

    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: allReviews.length,
    });

    res.json({ message: 'Review deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProductReviews, createReview, markHelpful, deleteReview };

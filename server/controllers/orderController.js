const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Place order from cart
// @route   POST /api/orders
const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, greenPointsUsed = 0 } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ userId: req.user._id })
      .populate('items.productId');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Build order items
    const items = cart.items.map(item => ({
      productId: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      quantity: item.quantity,
      image: item.productId.image,
      greenRating: item.productId.greenRating,
    }));

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Calculate green points discount (100 points = ₹1)
    const discount = greenPointsUsed / 100;
    const totalAmount = Math.max(0, subtotal - discount);

    // Calculate green points earned (10 points per ₹100 spent on eco products)
    const greenPointsEarned = Math.floor(totalAmount / 100) * 10;

    const order = await Order.create({
      userId: req.user._id,
      items,
      totalAmount,
      greenPointsUsed,
      greenPointsEarned,
      discount,
      status: 'confirmed',
      shippingAddress: shippingAddress || {},
      trackingNumber: `AMZ-${Date.now().toString(36).toUpperCase()}`,
    });

    // Clear cart
    cart.items = [];
    await cart.save();

    // Update user's green points
    const user = await User.findById(req.user._id);
    user.greenPoints = (user.greenPoints || 0) - greenPointsUsed + greenPointsEarned;
    user.co2Prevented = (user.co2Prevented || 0) + (greenPointsEarned * 0.05); // rough estimate
    await user.save();

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's orders
// @route   GET /api/orders
const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check ownership
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (seller)
// @route   PUT /api/orders/:id/status
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

// @desc    Initiate return
// @route   POST /api/orders/:id/return
const returnOrder = async (req, res, next) => {
  try {
    const { returnType, returnReason } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    order.status = 'returned';
    order.returnType = returnType;
    order.returnReason = returnReason;
    await order.save();

    // If recycling, give bonus green points
    if (returnType === 'recycle') {
      const user = await User.findById(req.user._id);
      user.greenPoints += 50;
      await user.save();
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

// @desc    Get seller's received orders
// @route   GET /api/orders/seller
const getSellerOrders = async (req, res, next) => {
  try {
    // Get seller's product IDs
    const sellerProducts = await Product.find({ sellerId: req.user._id }).select('_id');
    const productIds = sellerProducts.map(p => p._id);

    // Find orders containing seller's products
    const orders = await Order.find({
      'items.productId': { $in: productIds },
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getOrders, getOrder, updateOrderStatus, returnOrder, getSellerOrders };

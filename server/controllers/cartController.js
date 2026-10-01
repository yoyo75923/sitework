const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get user's cart
// @route   GET /api/cart
const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id })
      .populate('items.productId');

    if (!cart) {
      cart = { userId: req.user._id, items: [] };
    }

    // Transform to include product details
    const items = cart.items ? cart.items.map(item => ({
      _id: item._id,
      productId: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      image: item.productId.image,
      greenRating: item.productId.greenRating,
      certifications: item.productId.certifications,
      inStock: item.productId.inStock,
      quantity: item.quantity,
    })) : [];

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    res.json({ items, totalItems, totalPrice });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        userId: req.user._id,
        items: [{ productId, quantity }],
      });
    } else {
      const existingItem = cart.items.find(
        item => item.productId.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }

      await cart.save();
    }

    // Return populated cart
    cart = await Cart.findOne({ userId: req.user._id })
      .populate('items.productId');

    const items = cart.items.map(item => ({
      _id: item._id,
      productId: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      image: item.productId.image,
      greenRating: item.productId.greenRating,
      certifications: item.productId.certifications,
      quantity: item.quantity,
    }));

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    res.json({ items, totalItems, totalPrice });
  } catch (error) {
    next(error);
  }
};

// @desc    Update item quantity
// @route   PUT /api/cart/update
const updateCartItem = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    if (quantity === 0) {
      cart.items = cart.items.filter(
        item => item.productId.toString() !== productId
      );
    } else {
      const item = cart.items.find(
        item => item.productId.toString() === productId
      );
      if (item) {
        item.quantity = quantity;
      }
    }

    await cart.save();

    // Return populated cart
    const updatedCart = await Cart.findOne({ userId: req.user._id })
      .populate('items.productId');

    const items = updatedCart.items.map(item => ({
      _id: item._id,
      productId: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      image: item.productId.image,
      greenRating: item.productId.greenRating,
      certifications: item.productId.certifications,
      quantity: item.quantity,
    }));

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    res.json({ items, totalItems, totalPrice });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:productId
const removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      item => item.productId.toString() !== req.params.productId
    );
    await cart.save();

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart/clear
const clearCart = async (req, res, next) => {
  try {
    await Cart.findOneAndUpdate(
      { userId: req.user._id },
      { items: [] }
    );
    res.json({ message: 'Cart cleared', items: [], totalItems: 0, totalPrice: 0 });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };

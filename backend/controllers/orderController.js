const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Place an order
// @route   POST /api/orders
// @access  Private
const placeOrder = asyncHandler(async (req, res) => {
  const { shippingAddress } = req.body;
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error('Cart is empty');
  }

  const orderItems = cart.items.map((i) => ({
    product: i.product._id,
    name: i.product.title,
    qty: i.quantity,
    price: i.product.price,
  }));

  const totalPrice = orderItems.reduce((acc, item) => acc + item.qty * item.price, 0);

  const order = new Order({
    user: req.user._id,
    orderItems,
    shippingAddress,
    totalPrice,
  });

  const createdOrder = await order.save();

  // Decrease stock
  for (const it of cart.items) {
    const product = await Product.findById(it.product._id);
    if (product) {
      product.stock = Math.max(0, product.stock - it.quantity);
      await product.save();
    }
  }

  // Clear cart
  cart.items = [];
  await cart.save();

  res.status(201).json(createdOrder);
});

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'name email');
  res.json(orders);
});

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  const { status } = req.body;
  if (status) order.orderStatus = status;
  await order.save();
  res.json(order);
});

module.exports = { placeOrder, getMyOrders, getOrders, updateOrderStatus };

// ------------------------------------------------------------
// Order routes
//   POST  /api/orders          place a new COD order
//   GET   /api/orders          list orders, newest first (admin)
//   GET   /api/orders/track    track an order by number + phone
//   PATCH /api/orders/:id      change order status (admin)
// ------------------------------------------------------------

const express = require('express');
const Order = require('../models/Order');

const router = express.Router();

// ---------- Place an order ----------
router.post('/', async (req, res) => {
  try {
    const { items, customer } = req.body;

    // Basic validation
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    if (!customer || !customer.name || !customer.phone || !customer.address || !customer.city) {
      return res.status(400).json({ error: 'Name, phone, address and city are required' });
    }

    // Very light phone check: digits, dashes and spaces only, reasonable length
    const phoneOk = /^[0-9+\-\s]{7,16}$/.test(customer.phone);
    if (!phoneOk) {
      return res.status(400).json({ error: 'Please enter a valid phone number' });
    }

    // Server-side total so the client cannot fake the price
    const total = items.reduce((sum, item) => {
      const qty = Number(item.qty) || 0;
      const price = Number(item.price) || 0;
      return sum + qty * price;
    }, 0);

    if (total <= 0) {
      return res.status(400).json({ error: 'Order total is invalid' });
    }

    const order = new Order({ items, customer, total });
    await order.save();

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ---------- Track an order (public: order number + phone) ----------
router.get('/track', async (req, res) => {
  try {
    const { orderNumber, phone } = req.query;

    if (!orderNumber || !phone) {
      return res
        .status(400)
        .json({ error: 'Order number and phone number are required' });
    }

    const order = await Order.findOne({
      orderNumber: orderNumber.trim().toUpperCase(),
    });

    if (!order) {
      return res.status(404).json({ error: 'No order found with this number' });
    }

    // Phone must match the one used at checkout
    const clean = (s) => (s || '').replace(/[\s\-+]/g, '');
    if (clean(order.customer.phone) !== clean(phone)) {
      return res
        .status(403)
        .json({ error: 'Phone number does not match this order' });
    }

    res.json({
      orderNumber: order.orderNumber,
      status: order.status,
      total: order.total,
      items: order.items,
      createdAt: order.createdAt,
      city: order.customer.city,
    });
  } catch (err) {
    res.status(500).json({ error: 'Could not track this order' });
  }
});

// ---------- List orders ----------
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch orders' });
  }
});

// ---------- Change order status (admin) ----------
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

    if (!allowed.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

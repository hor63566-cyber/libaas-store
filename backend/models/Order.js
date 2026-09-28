// ------------------------------------------------------------
// Order model
// Cash-on-delivery orders placed through the checkout page.
// ------------------------------------------------------------

const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true, min: 1 },
    size: { type: String, default: '' },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (items) => items.length > 0,
        message: 'Order must contain at least one item',
      },
    },
    customer: {
      name: { type: String, required: [true, 'Customer name is required'] },
      phone: { type: String, required: [true, 'Phone number is required'] },
      address: { type: String, required: [true, 'Address is required'] },
      city: { type: String, required: [true, 'City is required'] },
      postalCode: { type: String, default: '' },
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    orderNumber: {
      type: String,
      unique: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);

// Human-friendly order number, e.g. LB-482913
orderSchema.pre('save', function (next) {
  if (!this.orderNumber) {
    this.orderNumber =
      'LB-' + Math.floor(100000 + Math.random() * 900000).toString();
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);

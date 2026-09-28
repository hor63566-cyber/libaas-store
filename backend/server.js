// ------------------------------------------------------------
// Libaas — backend entry point
// Express API for products and orders, backed by MongoDB.
// ------------------------------------------------------------

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/libaas';

// ---------- Middleware ----------
app.use(cors());
app.use(express.json());

// Simple request logger (helps while developing)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// ---------- Routes ----------
app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Libaas API is running' });
});

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

// ---------- 404 handler ----------
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ---------- Error handler ----------
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Something went wrong on the server' });
});

// ---------- Start ----------
async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`Libaas API listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

start();

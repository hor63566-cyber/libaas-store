// ------------------------------------------------------------
// Product routes
//   GET    /api/products            list (filters: ?category=&search=&sort=)
//   GET    /api/products/:id        single product
//   POST   /api/products            create (admin)
//   PUT    /api/products/:id        update (admin)
//   DELETE /api/products/:id        delete (admin)
// ------------------------------------------------------------

const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

// ---------- List products with optional filters ----------
router.get('/', async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    let query = Product.find(filter);

    if (sort === 'price-asc') query = query.sort({ price: 1 });
    else if (sort === 'price-desc') query = query.sort({ price: -1 });
    else if (sort === 'newest') query = query.sort({ createdAt: -1 });

    const products = await query;
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch products' });
  }
});

// ---------- Single product ----------
// Accepts either the stable slug (e.g. "rose-embroidered-pret-kurti")
// or the Mongo _id, so links keep working after a re-seed.
router.get('/:id', async (req, res) => {
  try {
    const key = req.params.id;

    let product = await Product.findOne({ slug: key });

    if (!product && /^[a-f0-9]{24}$/i.test(key)) {
      product = await Product.findById(key);
    }

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Could not load product' });
  }
});

// ---------- Create product ----------
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ---------- Update product ----------
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ---------- Delete product ----------
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid product id' });
  }
});

module.exports = router;

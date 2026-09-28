// ------------------------------------------------------------
// Auth routes
//   POST /api/auth/signup   create account, returns token + user
//   POST /api/auth/login    log in, returns token + user
//   GET  /api/auth/me       current user from token (for sessions)
// ------------------------------------------------------------

const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'libaas-dev-secret';
const TOKEN_DAYS = 7;

// Sign a simple JWT for the given user id
function signToken(userId) {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: `${TOKEN_DAYS}d` });
}

// ---------- Sign up ----------
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, phone, address, city } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: 'Name, email and password are required' });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: 'Password must be at least 6 characters' });
    }

    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) {
      return res
        .status(400)
        .json({ error: 'An account with this email already exists' });
    }

    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: (phone || '').trim(),
      address: (address || '').trim(),
      city: (city || '').trim(),
    });

    await user.save();

    res.status(201).json({
      token: signToken(user._id),
      user: user.toProfile(),
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ---------- Log in ----------
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // +password: the field is select:false by default
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select('+password');

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const ok = await user.comparePassword(password);
    if (!ok) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.json({
      token: signToken(user._id),
      user: user.toProfile(),
    });
  } catch (err) {
    res.status(500).json({ error: 'Login failed, please try again' });
  }
});

// ---------- Current user ----------
router.get('/me', async (req, res) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    res.json(user.toProfile());
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

module.exports = router;

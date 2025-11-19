const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// =============================
// REGISTER USER
// =============================
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (user)
      return res.status(400).json({ message: 'User already exists' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();

    // Create token (IMPORTANT: use _id, NOT id)
    const payload = {
      user: {
        _id: user._id,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secretkey123', {
      expiresIn: '1h',
    });

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// =============================
// LOGIN USER
// =============================
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check user exists
    let user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'Invalid credentials' });

    // Match password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials' });

    // Create token (use _id here too)
    const payload = {
      user: {
        _id: user._id,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secretkey123', {
      expiresIn: '1h',
    });

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// =============================
// GET LOGGED-IN USER
// =============================
router.get('/me', auth, async (req, res) => {
  try {
    // req.user._id comes from token payload
    const user = await User.findById(req.user._id).select('-password');

    if (!user)
      return res.status(404).json({ message: 'User not found' });

    res.json(user);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Register route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, dob } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // const hashedPassword = await bcrypt.hash(password, 10);
    // const user = new User({ name, email, password: hashedPassword, dob });
    const user = new User({ name, email, password, dob }); // hashing happens in User model

    await user.save();
    res.status(201).json({ message: 'User registered!' });

  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password1' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password2' });
    }

    res.status(200).json({ message: 'Login successful' });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

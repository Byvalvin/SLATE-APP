require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET || 'your_jwt_secret';
const JWT_EXPIRATION = '15m';
const REFRESH_TOKEN_EXPIRATION = '7d';

// Register route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, dob } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const user = new User({ name, email, password, dob });

    // Generate tokens
    const accessToken = jwt.sign({ userId: user.userId }, JWT_SECRET, {
      expiresIn: JWT_EXPIRATION,
    });
    const refreshToken = jwt.sign({ userId: user.userId }, JWT_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRATION,
    });

    // Save refresh token in DB
    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      accessToken,
      refreshToken,
      message: 'Registration successful',
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const accessToken = jwt.sign({ userId: user.userId }, JWT_SECRET, {
      expiresIn: JWT_EXPIRATION,
    });
    const refreshToken = jwt.sign({ userId: user.userId }, JWT_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRATION,
    });

    // Save refresh token in DB
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      accessToken,
      refreshToken,
      message: 'Login successful',
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


// Refresh token route
router.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token provided' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findOne({ userId: decoded.userId });

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    // Generate new access and refresh tokens
    const accessToken = jwt.sign({ userId: user.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const newRefreshToken = jwt.sign({ userId: user.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' });

    // Update user's refresh token in the database
    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (err) {
    res.status(403).json({ message: 'Invalid refresh token' });
  }
});


module.exports = router;
//rotes/auth.js
require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = require('../middleware/auth');

const JWT_EXPIRATION = '3h'; // Access token validity for 1 hour
const REFRESH_TOKEN_EXPIRATION = '30d'; // Refresh token validity for 30 days

// Register route (handles both regular and Google registration)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, dob, googleId } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    let user;
    if (googleId) {
      // If Google ID is provided, skip password and create Google-authenticated user
      user = new User({ name, email, dob, googleId, isGoogleAuth: true });
    } else {
      // Regular user registration (email/password)
      user = new User({ name, email, password, dob });
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    // Save user and generate tokens
    const accessToken = jwt.sign({ userId: user.userId }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: JWT_EXPIRATION,
    });
    const refreshToken = jwt.sign({ userId: user.userId }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRATION,
    });

    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      accessToken,
      refreshToken,
      message: 'Registration successful',
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Login route (handles both regular and Google login)
router.post('/login', async (req, res) => {
  try {
    const { email, password, googleId } = req.body;

    // If the user is logging in with Google OAuth
    if (googleId) {
      const user = await User.findOne({ googleId });
      if (!user) {
        return res.status(401).json({ message: 'Google user not found' });
      }

      // Generate access and refresh tokens
      const accessToken = jwt.sign({ userId: user.userId }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: JWT_EXPIRATION,
      });
      const refreshToken = jwt.sign({ userId: user.userId }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRATION,
      });

      // Save the refresh token in DB
      user.refreshToken = refreshToken;
      await user.save();

      return res.status(200).json({
        accessToken,
        refreshToken,
        message: 'Google login successful',
      });
    }

    // If the user is logging in with email and password
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const accessToken = jwt.sign({ userId: user.userId }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: JWT_EXPIRATION,
    });
    const refreshToken = jwt.sign({ userId: user.userId }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRATION,
    });

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
    // Validate the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findOne({ userId: decoded.userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate new tokens
    const accessToken = jwt.sign({ userId: user.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: `${JWT_EXPIRATION}` });
    const newRefreshToken = jwt.sign({ userId: user.userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: `${REFRESH_TOKEN_EXPIRATION}` });

    // Save the new refresh token in the DB
    user.refreshToken = newRefreshToken;
    await user.save();

    // Return new tokens
    return res.json({ accessToken, refreshToken: newRefreshToken });

  } catch (err) {
    console.error('Refresh token error:', err);
    if (err instanceof TokenExpiredError) {
      return res.status(403).json({ message: 'Refresh token expired. Please log in again.' });
    } else if (err instanceof JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid refresh token. Unauthorized.' });
    } else {
      return res.status(500).json({ message: 'Internal server error during token refresh' });
    }
  }
});


// Get current user info
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.user.userId })
      .select('-password -refreshToken -_id -__v');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);  // Return user info, excluding sensitive fields
  } catch (err) {
    res.status(500).json({ message: 'Server error' });  // General server error handling
  }
});


// Logout route
router.post('/logout', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.user.userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Clear the refresh token
    user.refreshToken = null;
    await user.save();

    res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error during logout' });
  }
});




module.exports = router;
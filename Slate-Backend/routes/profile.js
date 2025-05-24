const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const authMiddleware = require('../middleware/auth'); // You need to extract user ID from token

// Create a new profile
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user;

    const existing = await Profile.findOne({ userId });
    if (existing) {
      return res.status(400).json({ message: 'Profile already exists' });
    }

    const profile = new Profile({
      userId,
      ...req.body,
    });

    await profile.save();
    res.status(201).json(profile);
  } catch (err) {
    console.error('Error saving profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// (Optional) Get current user's profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.userId });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

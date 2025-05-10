const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/register', async (req, res) => {
  const { name, email, dob } = req.body;
  const user = new User({ name, email, dob });
  await user.save();
  res.json({ message: 'User registered!' });
});

module.exports = router;

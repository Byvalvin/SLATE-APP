const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  userId: { type: String, default: uuidv4 },
  name: String,
  email: { type: String, unique: true },
  password: String,
  dob: Date,
  createdAt: { type: Date, default: Date.now },

  refreshToken: { type: String, default: null },
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('User', UserSchema);

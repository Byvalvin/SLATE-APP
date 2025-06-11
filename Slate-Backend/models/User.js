const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: function() {
      // Password is required if the user is not logging in via Google OAuth
      return !this.isGoogleAuth;
    },
  },
  isGoogleAuth: {
    type: Boolean,
    default: false, // Flag to indicate if user logged in via Google
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true, // Allows null values, so regular users without Google login won't be affected
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  refreshToken: {
    type: String,
    default: null,
  },
});

// Hash password before saving, if it's not a Google auth user
UserSchema.pre('save', async function(next) {
  if (!this.isGoogleAuth && this.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
      return next(err);
    }
  }
  next();
});

module.exports = mongoose.model('User', UserSchema);

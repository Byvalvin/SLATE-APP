const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const UserSchema = new mongoose.Schema({
  userId: { type: String, default: uuidv4 }, // generates unique user ID
  name: String,
  email: { type: String, unique: true },
  dob: Date,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
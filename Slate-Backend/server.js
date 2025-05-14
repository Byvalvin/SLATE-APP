require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');

// db setup
// === MongoDB connection logic optimized for Vercel ===
let isConnected = false;


async function connectToDatabase() {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'Slate'
    });
    isConnected = true;
    console.log("✅ MongoDB connected to Slate DB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}
// Connect when this file is loaded (cold start in serverless)
connectToDatabase();

const app = express();
const baseURL = '/api';

// MIDDLEWARE
app.use(express.json());


// ROUTES

// ping
app.get(`${baseURL}`, (req, res) => {
  res.send("API Live!");
});

// auth routes
app.use(`${baseURL}/auth`, authRoutes);

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;  // Change here
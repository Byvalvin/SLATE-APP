require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');

// db setup
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'Slate'  // ✅ this explicitly tells Mongoose to use "Slate" DB
})
.then(() => console.log('MongoDB connected to Slate DB'))
.catch((err) => console.error('MongoDB connection error:', err));


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
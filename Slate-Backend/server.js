require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

// Import all your Mongoose models here
// This ensures they are registered with Mongoose early in the application lifecycle
require('./models/User');     // Your existing User model
require('./models/Exercise'); // Import Exercise model
require('./models/Program');  // Import Program model
require('./models/Profile');  // Import Profile model

const authRoutes = require('./routes/auth');
const exerciseRoutes = require('./routes/exercises'); // Import the exercises route
//const programRoutes = require('./routes/programs');   // Import the new programs route
const profileRoutes = require('./routes/profile');

// db setup
// === MongoDB connection logic optimized for Vercel ===
let isConnected = false;

async function connectToDatabase() {
    if (isConnected) {
        console.log("✅ MongoDB already connected.");
        return;
    }
    try {
        // Ensure MONGO_URI is set in your .env file
        if (!process.env.MONGO_URI) {
             console.error("❌ MONGO_URI not defined in environment variables!");
             // Depending on your setup, you might want to throw an error or exit
             // throw new Error("MONGO_URI not defined");
             return; // Exit without connecting if URI is missing
        }

        await mongoose.connect(process.env.MONGO_URI, {
            dbName: 'Slate', // Specify your database name
            // Add recommended options for stability if not already present in your setup
            // useNewUrlParser: true, // Deprecated in Mongoose 6+
            // useUnifiedTopology: true, // Deprecated in Mongoose 6+
            serverSelectionTimeoutMS: 5000, // Keep trying to connect for 5 seconds
            connectTimeoutMS: 10000 // Give up initial connection after 10 seconds
        });
        isConnected = true;
        console.log("✅ MongoDB connected to Slate DB");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
        // Depending on your error handling strategy, you might want to re-throw
        // throw err;
    }
}

// Connect when this file is loaded (important for serverless cold starts)
// In a traditional server, you might call this once and then app.listen()
connectToDatabase();

const app = express();
const baseURL = '/api'; // Define your base API path

// MIDDLEWARE
app.use(express.json()); // Parses incoming JSON requests

// ROUTES

// ping route to check if API is live
app.get(`${baseURL}`, (req, res) => {
    res.send("API Live!");
});

// auth routes (e.g., /api/auth/login, /api/auth/register)
app.use(`${baseURL}/auth`, authRoutes);

// profile routes
app.use(`${baseURL}/profile`, profileRoutes);

// exercise routes (e.g., /api/exercises/:date)
app.use(`${baseURL}/exercises`, exerciseRoutes);

// program routes (e.g., /api/programs, /api/programs/:id)
// app.use(`${baseURL}/programs`, programRoutes); // Mount the new programs route

// Export the app for serverless functions (like Vercel)
module.exports = app;

// For local development, you might add this block:
/*
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000; // Use port from env or default to 5000
    app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
}
*/


const mongoose = require('mongoose');
const Profile = require('../models/Profile');
require('dotenv').config();

async function updateProfiles() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
        dbName: 'Slate',
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
    });
    console.log('✅ Connected to MongoDB\n');

    const result = await Profile.updateMany(
      { streak: { $exists: false } }, // Only update if streak doesn't exist
      { $set: { streak: 0 } }
    );

    console.log(`Updated ${result.modifiedCount} profiles.`);
    process.exit(0);
  } catch (err) {
    console.error('Error updating profiles:', err);
    process.exit(1);
  }
}

updateProfiles();

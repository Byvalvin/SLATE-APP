// scripts/cleanup_user_legacy_fields.js
const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'Slate',
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });

    console.log('✅ Connected to MongoDB\n');

    // Ensure all documents have the fields as null if they don't exist
    await User.updateMany(
      { dob: { $exists: false } },
      { $set: { dob: null } }
    );
    await User.updateMany(
      { program_start_date: { $exists: false } },
      { $set: { program_start_date: null } }
    );
    await User.updateMany(
      { selected_program_id: { $exists: false } },
      { $set: { selected_program_id: null } }
    );

    // Now remove the fields
    const result = await User.updateMany(
      {},
      {
        $unset: {
          dob: '',
          program_start_date: '',
          selected_program_id: '',
        },
      }
    );

    console.log(`🧹 Removed legacy fields from ${result.modifiedCount} User documents\n`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Cleanup failed:', err);
    process.exit(1);
  }
})();

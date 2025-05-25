// scripts/migrate_user_fields_to_profile.js
const mongoose = require('mongoose');
const User = require('../models/User');
const Profile = require('../models/Profile');

require('dotenv').config(); // Load env vars from .env file

const DB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/YOUR_DB_NAME';

(async () => {
  try {
    await mongoose.connect(DB_URI, {
      dbName: 'Slate', // Your actual DB name
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });

    console.log('✅ Connected to MongoDB\n');

    const users = await User.find();
    let created = 0;
    let skipped = 0;
    let updated = 0;

    for (const user of users) {
      const { dob, program_start_date, selected_program_id, userId, email } = user;

      if (!userId) {
        console.warn(`⚠️ User ${email || user._id} is missing userId (UUID), skipping...`);
        continue;
      }

      const existingProfile = await Profile.findOne({ userId });

      if (existingProfile) {
        // Prepare only missing fields to update
        const updateFields = {};
        if (!existingProfile.dob && dob) updateFields.dob = dob;
        if (!existingProfile.program_start_date && program_start_date) updateFields.program_start_date = program_start_date;
        if (!existingProfile.selected_program_id && selected_program_id) updateFields.selected_program_id = selected_program_id;

        if (Object.keys(updateFields).length > 0) {
          await Profile.updateOne({ userId }, { $set: updateFields });
          updated++;
          console.log(`🔄 Updated profile for ${email} (${userId})`);
        } else {
          skipped++;
          console.log(`⏭️ Skipped ${email} (${userId}) — already has all fields`);
        }
      } else {
        await Profile.create({
          userId,
          dob: dob || null,
          program_start_date: program_start_date || null,
          selected_program_id: selected_program_id || null,
        });
        created++;
        console.log(`✅ Created profile for ${email} (${userId})`);
      }

      // Clean up old fields from User
      await User.updateOne(
        { userId },
        {
          $unset: {
            dob: "",
            program_start_date: "",
            selected_program_id: "",
          },
        }
      );
    }

    console.log(`\n🎉 Migration complete:`);
    console.log(`  ➕ Profiles created: ${created}`);
    console.log(`  🔄 Profiles updated: ${updated}`);
    console.log(`  ⏭️ Users skipped:     ${skipped}`);
    console.log(`  🧹 Fields removed from all User documents\n`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
})();

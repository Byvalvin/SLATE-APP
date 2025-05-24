// scripts/migrate_user_fields_to_profile.js
const mongoose = require('mongoose');
const User = require('../models/User');
const Profile = require('../models/Profile');

require('dotenv').config(); // Load env if needed

const DB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/YOUR_DB_NAME';

(async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log('✅ Connected to MongoDB\n');

    const users = await User.find();
    let created = 0;
    let skipped = 0;
    let updated = 0;

    for (const user of users) {
      const { dob, program_start_date, selected_program_id } = user;

      const existingProfile = await Profile.findOne({ userId: user._id });

      if (existingProfile) {
        // Optionally update profile if the fields are not already set
        const updateFields = {};
        if (!existingProfile.dob && dob) updateFields.dob = dob;
        if (!existingProfile.program_start_date && program_start_date) updateFields.program_start_date = program_start_date;
        if (!existingProfile.selected_program_id && selected_program_id) updateFields.selected_program_id = selected_program_id;

        if (Object.keys(updateFields).length > 0) {
          await Profile.updateOne({ userId: user._id }, { $set: updateFields });
          updated++;
          console.log(`🔄 Updated profile for ${user.email}`);
        } else {
          skipped++;
          console.log(`⏭️ Skipped ${user.email} (already migrated)`);
        }
      } else {
        // Create new profile
        await Profile.create({
          userId: user._id,
          dob: dob || null,
          program_start_date: program_start_date || null,
          selected_program_id: selected_program_id || null,
        });
        created++;
        console.log(`✅ Created profile for ${user.email}`);
      }

      // Remove fields from User
      await User.updateOne(
        { _id: user._id },
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
    console.log('  🧹 Fields removed from all User documents\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
})();
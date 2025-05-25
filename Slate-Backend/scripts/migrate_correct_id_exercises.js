// scripts/fixProgramExerciseIds.js
const mongoose = require('mongoose');
const Program = require('../models/Program');
const Exercise = require('../models/Exercise');
require('dotenv').config(); // if using dotenv for MONGO_URI

const runMigration = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'Slate',
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    console.log('✅ Connected to MongoDB\n');

    const programs = await Program.find();

    for (const program of programs) {
      let modified = false;

      for (const month of program.months) {
        for (const day of Object.keys(month.weekly_plan)) {
          const exercises = month.weekly_plan[day];

          for (const exerciseEntry of exercises) {
            // Only fix if the current exercise_id is an ObjectId
            if (mongoose.Types.ObjectId.isValid(exerciseEntry.exercise_id)) {
              const exerciseDoc = await Exercise.findById(exerciseEntry.exercise_id);

              if (exerciseDoc && exerciseDoc.exerciseId) {
                console.log(`Fixing ${exerciseEntry.exercise_id} -> ${exerciseDoc.exerciseId}`);
                exerciseEntry.exercise_id = exerciseDoc.exerciseId; // Replace with string UUID
                modified = true;
              } else {
                console.warn(`Exercise not found for _id: ${exerciseEntry.exercise_id}`);
              }
            }
          }
        }
      }

      if (modified) {
        await program.save();
        console.log(`✅ Program ${program.name} updated`);
      } else {
        console.log(`➡️ Program ${program.name} already valid`);
      }
    }

    console.log('🎉 Migration complete');
    process.exit(0);

  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
};

runMigration();

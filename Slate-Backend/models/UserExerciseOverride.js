// models/UserExerciseOverride.js
const mongoose = require('mongoose');

const UserExerciseOverrideSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  date: { type: String, required: true }, // Format: 'YYYY-MM-DD'
  exercises: [
    {
      exercise_id: { type: String, required: true }, // Reference to Exercise model
      sets: { type: Number },
      reps: { type: Number },
      notes: { type: String },
      isCustom: { type: Boolean, default: false }, // True if the user added this exercise
      name: { type: String }, // User-customized exercise name (optional)
      category: String, // <--- this needs to be in your schema
    }
  ]
});

UserExerciseOverrideSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('UserExerciseOverride', UserExerciseOverrideSchema);

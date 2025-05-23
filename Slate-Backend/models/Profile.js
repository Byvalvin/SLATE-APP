// models/Profile.js
const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  
  height: Number,
  weight: Number,
  
  dob: {
    type: Date
},

  gender: { type: String, enum: ['male', 'female'] },
  goal: { type: String, enum: ['gain muscle', 'lose weight', 'cardio', 'general fitness'] },
  experienceLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
  intensityPreference: { type: String, enum: ['low', 'medium', 'high'] },

  nation: String,
  budget: Number,
  motivationStatement: String,

  healthConditions: [String], // user-input "pills"

  program_start_date: Date,
  selected_program_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Program' },
});

module.exports = mongoose.model('Profile', ProfileSchema);

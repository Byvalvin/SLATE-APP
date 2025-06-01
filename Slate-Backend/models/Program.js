// models/Program.js
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const ProgramSchema = new mongoose.Schema({
  programId: { type: String, default: uuidv4, unique: true },
  name: { type: String, required: true },
  description: String,
  duration_months: Number,
  focus: String,
  months: [
    {
      month_number: Number,
      description: String,
      weekly_plan: {
        monday: [
          {
            exercise_id: { type: String }, // ✅ Changed from ObjectId to string
            sets: Number,
            reps: Number,
            notes: String,
          },
        ],
        // repeat for other days...
        tuesday: [ { exercise_id: { type: String }, sets: Number, reps: Number, notes: String } ],
        wednesday: [ { exercise_id: { type: String }, sets: Number, reps: Number, notes: String } ],
        thursday: [ { exercise_id: { type: String }, sets: Number, reps: Number, notes: String } ],
        friday: [ { exercise_id: { type: String }, sets: Number, reps: Number, notes: String } ],
        saturday: [ { exercise_id: { type: String }, sets: Number, reps: Number, notes: String } ],
        sunday: [ { exercise_id: { type: String }, sets: Number, reps: Number, notes: String } ],
      },
    },
  ],
  // 👇 NEW meta field
  meta: {
    imageUrl: { type: String, default: '' }, // URL for card image
    categories: [{ type: String }], // e.g. ["Weight Loss", "Maintenance"]
    focusTag: { type: String }, // e.g. "Vitality", "Performance"
    isNew: { type: Boolean, default: false },
    visibility: { type: Boolean, default: true }, // Optional
    featured: { type: Boolean, default: false },  // Optional
  },
  
});

module.exports = mongoose.model('Program', ProgramSchema);

const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const ExerciseSchema = new mongoose.Schema({
  exerciseId: { type: String, default: uuidv4, unique: true }, // Add a UUID for consistency
  name: { type: String, required: true },
  slug: String,
  description: String,
  instructions: [String],
  primary_muscles: [String],
  secondary_muscles: [String],
  equipment: [String],
  category: String,
  //movement_type: { type: String }, // NEW: "Pull", "Push", "Leg"
  //calories: Number, // do you actually want this??
  image_url: String, // Store the image URL directly
  realistic_image_url: String,
});

module.exports = mongoose.model('Exercise', ExerciseSchema);
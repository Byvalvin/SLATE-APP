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
  image_url: String, // Store the image URL directly
});

module.exports = mongoose.model('Exercise', ExerciseSchema);
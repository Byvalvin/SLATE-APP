const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const ExerciseSchema = new mongoose.Schema({
  exerciseId: { type: String, default: uuidv4, unique: true }, // Add a UUID for consistency
  name: { type: String, required: true },
  slug: String,
  alias: [String],
  description: String,
  instructions: [String],
  primary_muscles: [String],
  secondary_muscles: [String],
  equipment: [String],
  category: String,
  image_url: String, // Store the image URL directly
  realistic_image_url: String,
});

module.exports = mongoose.model('Exercise', ExerciseSchema);

/*
I need to create more exercise images in this watercolour gradient style from the examples provided. Pls ensure either no background or a paper-like background like in the one with the woman in the examples. Can you do one for DIPS.
*/
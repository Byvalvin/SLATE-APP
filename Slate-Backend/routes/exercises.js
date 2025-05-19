const express = require('express');
const router = express.Router();
const { format, differenceInDays } = require('date-fns'); // Import date functions
const authMiddleware = require('../middleware/auth'); // Assuming you want these routes protected
const User = require('../models/User'); // Import User model to get program_start_date and selected_program_id
const Program = require('../models/Program');
const Exercise = require('../models/Exercise');

// Get exercises for a specific day based on the user's selected program
router.get('/:date', authMiddleware, async (req, res) => {
  try {
    const { date } = req.params; // Date in YYYY-MM-DD format
    const targetDate = new Date(date);

    // Get user's program details
    const user = await User.findOne({ userId: req.user.userId }).select('selected_program_id program_start_date');

    if (!user || !user.selected_program_id || !user.program_start_date) {
      return res.status(404).json({ message: 'User program details not found.' });
    }

    const program = await Program.findById(user.selected_program_id);

    if (!program) {
      return res.status(404).json({ message: 'Program not found.' });
    }

    // Calculate the current day in the program
    const startDate = new Date(user.program_start_date);
    const dayDifference = differenceInDays(targetDate, startDate);

    if (dayDifference < 0) {
      return res.status(400).json({ message: 'Date is before program start date.' });
    }

    const currentMonthInProgram = Math.floor(dayDifference / 30); // Assuming 30 days per month
    const currentWeekInMonth = Math.floor((dayDifference % 30) / 7); // Assuming 7 days per week
    const dayOfWeek = format(targetDate, 'EEEE').toLowerCase(); // e.g., 'monday', 'tuesday'

    const programMonth = program.months.find(m => m.month_number === currentMonthInProgram + 1); // Months are 1-indexed

    if (!programMonth) {
      return res.status(404).json({ message: 'No program plan for this month.' });
    }

    const exercisesForToday = programMonth.weekly_plan[dayOfWeek] || [];

    // Populate exercise details (name, image_url, etc.)
    const populatedExercises = await Promise.all(
      exercisesForToday.map(async (programExercise) => {
        const exerciseDetails = await Exercise.findById(programExercise.exercise_id);
        if (exerciseDetails) {
          return {
            id: exerciseDetails._id.toString(), // Convert ObjectId to string for React Native key
            name: exerciseDetails.name,
            sets: programExercise.sets,
            reps: programExercise.reps,
            image_url: exerciseDetails.image_url,
          };
        }
        return null; // Handle cases where exercise details are not found
      })
    );

    res.json(populatedExercises.filter(Boolean)); // Filter out any nulls
  } catch (error) {
    console.error('Error fetching daily exercises:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Optionally, add an endpoint for adding/updating exercises if needed
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, sets, reps, date, exerciseId } = req.body;
    const targetDate = new Date(date);

    // For simplicity, this example assumes you're only adding/updating for the currently selected program.
    // In a real app, you might want more sophisticated logic to save user-specific exercise logs
    // rather than modifying the master program plan directly.
    // This is a placeholder for your actual save logic.
    console.log(`Received request to save/update exercise for ${date}:`, { name, sets, reps, exerciseId });

    // Here, you would implement logic to:
    // 1. Find the user's current program and the specific day's exercises.
    // 2. If exerciseId is provided, update existing sets/reps.
    // 3. If no exerciseId, create a new entry for this exercise.
    // This could involve creating a new `WorkoutSession` model linked to a user and a date.

    res.status(200).json({ message: 'Exercise save/update logic to be implemented on backend.' });
  } catch (error) {
    console.error('Error saving exercise:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});


module.exports = router;
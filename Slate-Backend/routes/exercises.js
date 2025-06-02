// routes/api/exercises.js (Express example)
const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const Program = require('../models/Program');
const Exercise = require('../models/Exercise');
const { getDay, differenceInCalendarWeeks } = require('date-fns');
const authMiddleware = require('../middleware/auth'); // You need to extract user ID from token

router.get('/user-daily-exercises', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId; // assuming auth middleware
    const profile = await Profile.findOne({ userId });

    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    const program = await Program.findOne({ programId: profile.selected_program_id });
    if (!program) return res.status(404).json({ error: 'Program not found' });

    const today = req.query.date ? new Date(req.query.date) : new Date();

    const startDate = new Date(profile.program_start_date);
    const weeksSinceStart = differenceInCalendarWeeks(today, startDate);
    const currentMonth = Math.floor(weeksSinceStart / 4);
    const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

    const monthData = program.months.find(m => m.month_number === currentMonth + 1);
    if (!monthData) return res.status(404).json({ error: 'Month data not found' });

    const todayPlan = monthData.weekly_plan[dayOfWeek];
    if (!todayPlan) return res.status(404).json({ error: 'No plan for today' });

    const exerciseIds = todayPlan.map(e => e.exercise_id);
    const exercises = await Exercise.find({ exerciseId: { $in: exerciseIds } });

    const result = todayPlan.map(e => {
      const exerciseDetails = exercises.find(ex => ex.exerciseId === e.exercise_id);
      return {
        name: exerciseDetails?.name || 'Unknown',
        image_url: exerciseDetails?.image_url || '',
        sets: e.sets,
        reps: e.reps,
        id: e.exercise_id
      };
    });

    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/grouped', authMiddleware, async (req, res) => {
  try {
    const pullMuscles = ['Lats', 'Biceps', 'Trapezius'];
    const pushMuscles = ['Chest', 'Triceps', 'Shoulders'];
    const legMuscles = ['Quadriceps', 'Hamstrings', 'Glutes', 'Calves'];

    const exercises = await Exercise.find({
      image_url: { $exists: true, $ne: '' }
    });

    const grouped = {
      Pull: [],
      Push: [],
      Legs: []
    };

    exercises.forEach(ex => {
      const allMuscles = [...(ex.primary_muscles || []), ...(ex.secondary_muscles || [])].map(m => m.toLowerCase());

      if (allMuscles.some(m => pullMuscles.map(pm => pm.toLowerCase()).includes(m))) {
        grouped.Pull.push(ex);
      } else if (allMuscles.some(m => pushMuscles.map(pm => pm.toLowerCase()).includes(m))) {
        grouped.Push.push(ex);
      } else if (allMuscles.some(m => legMuscles.map(pm => pm.toLowerCase()).includes(m))) {
        grouped.Legs.push(ex);
      }
    });

    // Optionally limit to 5 per category
    for (const key in grouped) {
      grouped[key] = grouped[key].slice(0, 5);
    }

    res.json(grouped);
  } catch (err) {
    console.error('Error grouping exercises:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;

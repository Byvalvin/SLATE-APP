// routes/api/exercises.js (Express example)
const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const Program = require('../models/Program');
const Exercise = require('../models/Exercise');
const UserExerciseOverride = require('../models/UserExerciseOverride'); // for custom exercising
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

    // Check if the user has overridden exercises for today
    const userOverride = await UserExerciseOverride.findOne({ userId, date: today.toISOString().split('T')[0] });

    // Default: If no override, use the original program's exercise plan
    let exercisesToReturn = todayPlan.map(e => ({
      exercise_id: e.exercise_id,
      sets: e.sets,
      reps: e.reps
    }));

    // If the user has an override, merge the overrides with the default exercises
    if (userOverride) {
      exercisesToReturn = exercisesToReturn.map(exercise => {
        const override = userOverride.exercises.find(o => o.exercise_id === exercise.exercise_id);
        if (override) {
          return { ...exercise, ...override._doc };  // Merge override (sets, reps, etc.)
        }
        return exercise;
      });

      // Add any custom exercises the user added
      userOverride.exercises.filter(e => e.isCustom).forEach(customExercise => {
        exercisesToReturn.push(customExercise);
      });
    }

    // Now, fetch the full exercise details (name, category, etc.)
    const exerciseIds = exercisesToReturn.map(e => e.exercise_id);
    const exercises = await Exercise.find({ exerciseId: { $in: exerciseIds } });

    const result = exercisesToReturn.map(ex => {
      // For custom exercises, take the name/category directly from the override
      if (ex.isCustom) {
        return {
          name: ex.name || 'Custom',
          category: ex.category || 'Uncategorized',
          image_url: ex.image_url || '',
          sets: ex.sets,
          reps: ex.reps,
          id: ex.exercise_id,
          isCustom: true, // ✅ ADD THIS LINE
        };
      }
    
      const exerciseDetails = exercises.find(exDetail => exDetail.exerciseId === ex.exercise_id);
    
      return {
        name: exerciseDetails?.name || 'Unknown',
        category: exerciseDetails?.category || 'Unknown',
        image_url: exerciseDetails?.image_url || '',
        sets: ex.sets,
        reps: ex.reps,
        id: ex.exercise_id,
        isCustom: false, // ✅ ADD THIS TOO
      };
    });
    
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// routes/api/exercises.js -> TO UPDATE CUSTOM EXERCISES
router.post('/user-daily-exercises', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { date, exercises } = req.body;

    if (!Array.isArray(exercises)) {
      return res.status(400).json({ error: 'Invalid exercises format.' });
    }

    let userOverride = await UserExerciseOverride.findOne({ userId, date });

    if (!userOverride) {
      userOverride = new UserExerciseOverride({ userId, date, exercises });
    } else {
      userOverride.exercises = exercises; // ✅ REPLACE
    }

    await userOverride.save();
    res.status(200).json({ message: 'Exercises updated successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
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

router.get('/by-category', authMiddleware, async (req, res) => {
  try {
    // Pagination setup
    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    // Extract search query and category parameters
    const searchQuery = req.query.searchQuery || '';  // If no search query, it's an empty string
    const categoriesParam = req.query.categories; // Categories query param, e.g. "Back,Arms"
    const includeUncategorized = req.query.includeUncategorized === 'true';

    // Debugging log: check the search query
    console.log('Received search query:', searchQuery);

    // Split categories into an array and capitalize the first letter of each category
    const categories = categoriesParam
      ? categoriesParam.split(',').map(c => c.trim().replace(/^\w/, (c) => c.toUpperCase()))
      : null;

    // Initialize exercises query object
    let exercisesQuery = { image_url: { $exists: true, $ne: '' } };  // Only exercises with an image

    // Apply category filter if categories are provided
    if (categories && categories.length > 0) {
      exercisesQuery.category = { $in: categories };  // Only include exercises in selected categories
    } else if (!includeUncategorized) {
      exercisesQuery.category = { $ne: 'Uncategorized' }; // Exclude 'Uncategorized' if not requested
    }

    // Apply search query filter if provided (search by exercise title/name)\
    if (searchQuery) {
      // Escape special characters in the search query
      const escapedSearchQuery = searchQuery.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&"); // Escape regex special chars
      exercisesQuery.name = new RegExp(escapedSearchQuery, 'i');  // Case-insensitive search on 'name'
      console.log('MongoDB query:', exercisesQuery);  // Log the query to check for correctness
    }

    // Fetch exercises from the database with pagination and filters applied
    const exercises = await Exercise.find(exercisesQuery)
      .skip(skip)
      .limit(limit);

    // Group exercises by category (case-insensitive)
    const grouped = exercises.reduce((acc, exercise) => {
      const category = (exercise.category || 'Uncategorized').toLowerCase();
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(exercise);
      return acc;
    }, {});

    // Log the grouped result and search query to check correctness
    console.log('Grouped exercises:', grouped);
    console.log('Search query used:', searchQuery);
    
    // Return the grouped exercises
    res.json(grouped);

  } catch (err) {
    console.error('Error grouping exercises by category:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});







// GET /api/exercises/by-ids?ids=abc123,def456,ghi789
router.get('/by-ids', authMiddleware, async (req, res) => {
  try {
    const idsParam = req.query.ids;
    if (!idsParam) {
      return res.status(400).json({ error: 'No exercise IDs provided.' });
    }

    const ids = idsParam.split(',').map(id => id.trim());
    const exercises = await Exercise.find({ exerciseId: { $in: ids } });

    res.json(exercises);
  } catch (err) {
    console.error('Error in /by-ids:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/by-ids', authMiddleware, async (req, res) => {
  try {
    const ids = req.body.ids;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'No exercise IDs provided or invalid format.' });
    }

    const exercises = await Exercise.find({ exerciseId: { $in: ids } });

    res.json(exercises);
  } catch (err) {
    console.error('Error in POST /by-ids:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// GET /api/exercises/:id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const exercise = await Exercise.findOne({ exerciseId: id });

    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found.' });
    }

    return res.json(exercise);
  } catch (err) {
    console.error('Error fetching exercise by ID:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
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
    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1; // Pagination for each category
    const skip = (page - 1) * limit;

    const searchQuery = req.query.searchQuery || "";
    if (searchQuery) {
      exercisesQuery.title = { $regex: searchQuery, $options: "i" }; // Case-insensitive search by title
    }

    const categoriesParam = req.query.categories; // e.g. "Arms,Back,Legs"
    const includeUncategorized = req.query.includeUncategorized === 'true';

    // If categoriesParam exists, split by comma and trim whitespace
    const categories = categoriesParam
    ? categoriesParam.split(',').map(c => c.trim().replace(/^\w/, (c) => c.toUpperCase())) // Capitalize first letter
    : null;
  
    // Fetch exercises with images, only from the requested categories (if specified)
    let exercisesQuery = { image_url: { $exists: true, $ne: '' } };

    // If categories are provided, only fetch exercises in those categories
    if (categories && categories.length > 0) {
      exercisesQuery.category = { $in: categories }; // Filter by selected categories
    } else if (!includeUncategorized) {
      exercisesQuery.category = { $ne: 'Uncategorized' }; // Exclude 'Uncategorized' if not needed
    }

    const exercises = await Exercise.find(exercisesQuery)
      .skip(skip)
      .limit(limit);

    // Group exercises by category (using lower case for case insensitivity)
    const grouped = exercises.reduce((acc, exercise) => {
      const category = (exercise.category || 'Uncategorized').toLowerCase();
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(exercise);
      return acc;
    }, {});
    console.log(grouped);

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

// search and filtration
router.get('/search', authMiddleware, async (req, res) => {
  try {
    const query = req.query.query?.trim().toLowerCase() || '';
    const category = req.query.category;

    console.log('Search query:', query);
    console.log('Search category:', category);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filters = {
      image_url: { $exists: true, $ne: '' },
    };

    if (category) {
      filters.category = category;
    }

    if (query) {
      filters.name = { $regex: query.replace(/\s+/g, '.*'), $options: 'i' };
    }

    const total = await Exercise.countDocuments(filters);
    const exercises = await Exercise.find(filters).skip(skip).limit(limit);

    res.json({
      data: exercises,
      page,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error('Error in /search:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
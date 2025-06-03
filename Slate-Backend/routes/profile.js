const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const Program = require('../models/Program');
const authMiddleware = require('../middleware/auth'); // You need to extract user ID from token

// Create a new profile
router.post('/', authMiddleware, async (req, res) => {
  try {
    const formData = req.body;

    // const goalMap = {
    //   'gain muscle': 'Hypertrophy Program',
    //   'lose weight': 'Fat Loss Program',
    //   'cardio': 'Cardio Endurance',
    //   'general fitness': 'Starter Fitness Program',
    // };
    
    // const requestedGoal = formData.goal?.toLowerCase();
    // const matchingFocus = goalMap[requestedGoal];
    
    // // Fallback to any program if none matched
    // const program = await Program.findOne(matchingFocus ? { focus: matchingFocus } : {});
    
    // if (program) {
    //   formData.selected_program_id = program.programId;
    //   formData.program_start_date = new Date();
    // }
    

    // Map goal to program (for now just use 1)
    const defaultProgram = await Program.findOne(); // You can improve this later by goal
    if (defaultProgram) {
      formData.selected_program_id = defaultProgram.programId;
      formData.program_start_date = new Date();
    }

    // Create or update profile
    const profile = await Profile.findOneAndUpdate(
      { userId: req.user.userId },
      { $set: { ...formData, userId: req.user.userId, streak:0 } },
      { new: true, upsert: true }
    );    

    res.status(200).json({ message: 'Profile saved successfully', profile });
  } catch (err) {
    console.error('Error saving profile:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// (Optional) Get current user's profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.userId });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update streak if not already updated today
router.post('/update-streak', authMiddleware, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.userId });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    const program = await Program.findOne({ programId: profile.selected_program_id });
    if (!program || !program.months?.length) {
      return res.status(400).json({ message: 'User has no assigned program' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let lastUpdate = profile.lastStreakUpdate || profile.program_start_date || new Date();
    lastUpdate.setHours(0, 0, 0, 0);

    // Don't reset if streak is already 0
    if ((profile.streak ?? 0) > 0) {
      let missedWorkout = false;

      let current = new Date(lastUpdate);
      current.setDate(current.getDate() + 1); // Start from next day after last update

      while (current < today) {
        const dayOfWeek = format(current, 'eeee').toLowerCase(); // e.g., 'monday'
        const daysSinceStart = differenceInCalendarDays(current, profile.program_start_date);
        const currentMonthIndex = Math.floor(daysSinceStart / 28); // approx 4 weeks per month
        const currentMonth = program.months[currentMonthIndex];

        if (!currentMonth) break; // No data for this month (end of program)

        const exercisesForDay = currentMonth.weekly_plan?.[dayOfWeek] || [];

        if (exercisesForDay.length > 0) {
          missedWorkout = true;
          break;
        }

        current.setDate(current.getDate() + 1); // Move to next day
      }

      if (missedWorkout) {
        profile.streak = 0;
      }
    }

    // Only increment streak if today isn't already counted
    if (today.getTime() !== (profile.lastStreakUpdate?.getTime() || 0)) {
      profile.streak = (profile.streak || 0) + 1;
      profile.lastStreakUpdate = new Date();
    }

    await profile.save();
    return res.status(200).json({ streak: profile.streak });
  } catch (err) {
    console.error('Error updating streak:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;

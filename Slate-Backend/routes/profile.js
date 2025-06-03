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

module.exports = router;

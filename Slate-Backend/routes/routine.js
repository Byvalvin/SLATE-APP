
import Program from "../models/Program";

// GET /api/user-daily-exercises
app.get('/api/user-daily-exercises', async (req, res) => {
  const userId = req.user.id; // assuming you’re using auth middleware

  const profile = await Profile.findOne({ userId });
  if (!profile) return res.status(404).json({ error: 'Profile not found' });

  const { selected_program_id, program_start_date } = profile;

  const { weekDay, monthNumber } = getCurrentDayAndMonth(program_start_date);

  const program = await Program.findById(selected_program_id).populate(`months.weekly_plan.${weekDay}.exercise_id`);

  const month = program.months.find(m => m.month_number === monthNumber);
  if (!month) return res.status(404).json({ error: 'No matching month in program' });

  const exercisesForToday = month.weekly_plan[weekDay];
  res.json({ exercises: exercisesForToday });
});





const getCurrentDayAndMonth = (programStartDate) => {
    const now = new Date();
    const start = new Date(programStartDate);
  
    const diffInMs = now - start;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
    const weekDay = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(now).toLowerCase(); // "monday", etc.
    const monthNumber = Math.floor(diffInDays / 30) + 1;
  
    return { weekDay, monthNumber };
  };
  
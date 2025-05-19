const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth'); // Assuming you want these routes protected
const Program = require('../models/Program');
const Exercise = require('../models/Exercise'); // Need Exercise model for population

// Note: Apply authMiddleware if programs are only accessible to logged-in users.
// If programs are public, you can remove authMiddleware from these routes.

// @route   GET /api/programs
// @desc    Get all programs
// @access  Private (or Public, depending on authMiddleware)
router.get('/', authMiddleware, async (req, res) => {
    try {
        // Fetch all programs and populate the exercise details within the nested structure.
        // The populate path needs to trace down through the schema structure.
        const programs = await Program.find({})
            .populate({
                path: 'months.weekly_plan.monday.exercise_id',
                model: 'Exercise', // Specify the model to populate from
                select: 'name slug description image_url primary_muscles secondary_muscles equipment category' // Select fields to include
            })
            .populate({
                path: 'months.weekly_plan.tuesday.exercise_id',
                model: 'Exercise',
                select: 'name slug description image_url primary_muscles secondary_muscles equipment category'
            })
            .populate({
                path: 'months.weekly_plan.wednesday.exercise_id',
                model: 'Exercise',
                select: 'name slug description image_url primary_muscles secondary_muscles equipment category'
            })
            .populate({
                path: 'months.weekly_plan.thursday.exercise_id',
                model: 'Exercise',
                select: 'name slug description image_url primary_muscles secondary_muscles equipment category'
            })
            .populate({
                path: 'months.weekly_plan.friday.exercise_id',
                model: 'Exercise',
                select: 'name slug description image_url primary_muscles secondary_muscles equipment category'
            })
            .populate({
                path: 'months.weekly_plan.saturday.exercise_id',
                model: 'Exercise',
                select: 'name slug description image_url primary_muscles secondary_muscles equipment category'
            })
            .populate({
                path: 'months.weekly_plan.sunday.exercise_id',
                model: 'Exercise',
                select: 'name slug description image_url primary_muscles secondary_muscles equipment category'
            });

        res.json(programs);
    } catch (error) {
        console.error('Error fetching programs:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// @route   GET /api/programs/:id
// @desc    Get a single program by ID
// @access  Private (or Public, depending on authMiddleware)
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const program = await Program.findById(req.params.id)
             .populate({
                path: 'months.weekly_plan.monday.exercise_id',
                model: 'Exercise',
                select: 'name slug description image_url primary_muscles secondary_muscles equipment category'
            })
            .populate({
                path: 'months.weekly_plan.tuesday.exercise_id',
                model: 'Exercise',
                select: 'name slug description image_url primary_muscles secondary_muscles equipment category'
            })
            .populate({
                path: 'months.weekly_plan.wednesday.exercise_id',
                model: 'Exercise',
                select: 'name slug description image_url primary_muscles secondary_muscles equipment category'
            })
            .populate({
                path: 'months.weekly_plan.thursday.exercise_id',
                model: 'Exercise',
                select: 'name slug description image_url primary_muscles secondary_muscles equipment category'
            })
            .populate({
                path: 'months.weekly_plan.friday.exercise_id',
                model: 'Exercise',
                select: 'name slug description image_url primary_muscles secondary_muscles equipment category'
            })
            .populate({
                path: 'months.weekly_plan.saturday.exercise_id',
                model: 'Exercise',
                select: 'name slug description image_url primary_muscles secondary_muscles equipment category'
            })
            .populate({
                path: 'months.weekly_plan.sunday.exercise_id',
                model: 'Exercise',
                select: 'name slug description image_url primary_muscles secondary_muscles equipment category'
            });


        if (!program) {
            return res.status(404).json({ message: 'Program not found.' });
        }

        res.json(program);
    } catch (error) {
        console.error('Error fetching program by ID:', error);
        // Check if the error is a CastError (invalid ObjectId format)
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid program ID format.' });
        }
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// You can add routes for creating, updating, or deleting programs here if needed.
// Example POST route (requires authentication and potentially admin roles):
/*
router.post('/', authMiddleware, async (req, res) => {
    try {
        // Logic to create a new program from req.body
        const newProgram = new Program(req.body);
        const savedProgram = await newProgram.save();
        res.status(201).json(savedProgram);
    } catch (error) {
        console.error('Error creating program:', error);
        res.status(400).json({ message: error.message }); // Send validation errors etc.
    }
});
*/


module.exports = router;

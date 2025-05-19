const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    userId: {
        type: String,
        default: uuidv4,
        unique: true // It's good practice to make custom IDs unique if they're meant to be primary keys
    },
    name: {
        type: String,
        required: true // Assuming name is always present
    },
    email: {
        type: String,
        unique: true,
        required: true // Assuming email is always present and unique
    },
    password: {
        type: String,
        required: true // Password is required for authentication
    },
    dob: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    refreshToken: {
        type: String,
        default: null
    },
    // New fields based on your provided document:
    program_start_date: {
        type: Date,
        default: null // Assuming it might not always be set
    },
    selected_program_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Program', // Reference the Program model
        default: null // Assuming a user might not always have a selected program
    }
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('User', UserSchema);
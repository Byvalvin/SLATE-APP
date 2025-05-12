require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'Slate'  // ✅ this explicitly tells Mongoose to use "Slate" DB
})
.then(() => console.log('MongoDB connected to Slate DB'))
.catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
export default app;
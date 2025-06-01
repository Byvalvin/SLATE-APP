const mongoose = require('mongoose');
const Program = require('../models/Program'); // adjust the path if needed
require('dotenv').config();

async function backfillMeta() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
        dbName: 'Slate',
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
    });
    console.log('✅ Connected to MongoDB\n');
    
    // Update Starter Fitness Program
    await Program.updateOne(
      { programId: '9b722d10-73ae-4b57-898b-0d04673c777d' },
      {
        $set: {
          meta: {
            imageUrl: '',
            categories: ['Maintenance Plans', 'Beginner', 'General Fitness'],
            focusTag: 'Vitality',
            isNew: true,
            visibility: true,
            featured: false,
          },
        },
      }
    );

    // Update A-PREP Program
    await Program.updateOne(
      { programId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' },
      {
        $set: {
          meta: {
            imageUrl: '',
            categories: ['Police Prep', 'Endurance', 'Strength', 'Weight Loss'],
            focusTag: 'Performance',
            isNew: false,
            visibility: true,
            featured: true,
          },
        },
      }
    );

    console.log('Meta fields backfilled successfully!');
  } catch (error) {
    console.error('Error backfilling meta fields:', error);
  } finally {
    mongoose.connection.close();
  }
}

backfillMeta();

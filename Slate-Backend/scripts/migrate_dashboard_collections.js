// scripts/migrate_dashboard_collections.js
const mongoose = require('mongoose');
require('dotenv').config();

const ExerciseModel = require('../models/Exercise');
const ProgramModel = require('../models/Program');

const DB_URI = process.env.MONGO_URI;

async function migrateCollection(fromCollectionName, targetModel) {
  const sourceCollection = mongoose.connection.collection(fromCollectionName);
  const docs = await sourceCollection.find().toArray();

  if (docs.length === 0) {
    console.log(`⚠️ No documents found in ${fromCollectionName}, skipping...`);
    return;
  }

  for (const doc of docs) {
    const { _id, ...rest } = doc;

    // Optional: remove original _id if you want new IDs
    await targetModel.updateOne(
      { _id }, // match by original _id to preserve references
      { $set: rest },
      { upsert: true }
    );
  }

  console.log(`✅ Migrated ${docs.length} documents from ${fromCollectionName} → ${targetModel.collection.name}`);
}

(async () => {
  try {
    console.log("Connecting to:", DB_URI);
    await mongoose.connect(DB_URI, {
      dbName: 'Slate',
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000
    });
    console.log('✅ Connected to MongoDB');

    // Use manual collection names as source
    await migrateCollection('Exercises', ExerciseModel); // Source: 'Exercises' → Mongoose: 'exercises'
    await migrateCollection('Programs', ProgramModel);   // Source: 'Programs' → Mongoose: 'programs'

    console.log('🎉 Migration complete. You can now drop the old collections (Exercises, Programs) if verified.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
})();

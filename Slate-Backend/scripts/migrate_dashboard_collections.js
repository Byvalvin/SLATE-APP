// scripts/migrate_dashboard_collections.js
const mongoose = require('mongoose');
require('dotenv').config();

const ExerciseModel = require('../models/Exercise');
const ProgramModel = require('../models/Program');

const DB_URI = process.env.MONGO_URI;

async function migrateCollection(sourceName, targetModel) {
  const sourceCollection = mongoose.connection.collection(sourceName);
  const docs = await sourceCollection.find().toArray();

  if (docs.length === 0) {
    console.log(`⚠️ No documents found in ${sourceName}, skipping...`);
    return;
  }

  for (const doc of docs) {
    // Remove _id so Mongoose can generate a new one or use same if possible
    const { _id, ...rest } = doc;
    await targetModel.updateOne({ _id }, { $set: rest }, { upsert: true });
  }

  console.log(`✅ Migrated ${docs.length} documents from ${sourceName} to ${targetModel.collection.name}`);
}

(async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log('✅ Connected to MongoDB');

    await migrateCollection('Exercise', ExerciseModel);
    await migrateCollection('Program', ProgramModel);

    console.log('🎉 Migration complete. You can now drop the old collections manually if all looks good.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
})();

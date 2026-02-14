const mongoose = require('mongoose');
const { seedStates, populateTrainingStates } = require('../utils/stateSeeder');
require('dotenv').config();

async function runSeed() {
  try {
    // REMOVE the old options (useNewUrlParser, useUnifiedTopology)
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/saksham-gis');
    
    console.log('📦 Connected to MongoDB');
    
    // Seed states
    await seedStates();
    
    // Populate state field in trainings
    await populateTrainingStates();
    
    console.log('✅ Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

runSeed();
const State = require('../models/State');
const Training = require('../models/Training');

// Indian states with approximate boundaries and centers
const indianStates = [
  {
    name: 'Delhi',
    slug: 'delhi',
    code: 'DL',
    center: { type: 'Point', coordinates: [77.2090, 28.6139] },
    bounds: {
      northeast: { lat: 28.8833, lng: 77.3466 },
      southwest: { lat: 28.4041, lng: 76.8388 }
    },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [76.8388, 28.4041],
        [77.3466, 28.4041],
        [77.3466, 28.8833],
        [76.8388, 28.8833],
        [76.8388, 28.4041]
      ]]
    }
  },
  {
    name: 'Maharashtra',
    slug: 'maharashtra',
    code: 'MH',
    center: { type: 'Point', coordinates: [75.7139, 19.7515] },
    bounds: {
      northeast: { lat: 22.0, lng: 80.9 },
      southwest: { lat: 15.6, lng: 72.6 }
    },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [72.6, 15.6],
        [80.9, 15.6],
        [80.9, 22.0],
        [72.6, 22.0],
        [72.6, 15.6]
      ]]
    }
  },
  {
    name: 'Karnataka',
    slug: 'karnataka',
    code: 'KA',
    center: { type: 'Point', coordinates: [76.6413, 15.3173] },
    bounds: {
      northeast: { lat: 18.4, lng: 78.5 },
      southwest: { lat: 11.5, lng: 74.0 }
    },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [74.0, 11.5],
        [78.5, 11.5],
        [78.5, 18.4],
        [74.0, 18.4],
        [74.0, 11.5]
      ]]
    }
  },
  {
    name: 'Tamil Nadu',
    slug: 'tamil-nadu',
    code: 'TN',
    center: { type: 'Point', coordinates: [78.6569, 11.1271] },
    bounds: {
      northeast: { lat: 13.5, lng: 80.3 },
      southwest: { lat: 8.1, lng: 76.2 }
    },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [76.2, 8.1],
        [80.3, 8.1],
        [80.3, 13.5],
        [76.2, 13.5],
        [76.2, 8.1]
      ]]
    }
  },
  {
    name: 'Rajasthan',
    slug: 'rajasthan',
    code: 'RJ',
    center: { type: 'Point', coordinates: [74.2179, 27.0238] },
    bounds: {
      northeast: { lat: 30.2, lng: 78.3 },
      southwest: { lat: 23.0, lng: 69.5 }
    },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [69.5, 23.0],
        [78.3, 23.0],
        [78.3, 30.2],
        [69.5, 30.2],
        [69.5, 23.0]
      ]]
    }
  },
  {
    name: 'Uttar Pradesh',
    slug: 'uttar-pradesh',
    code: 'UP',
    center: { type: 'Point', coordinates: [80.9462, 26.8467] },
    bounds: {
      northeast: { lat: 30.4, lng: 84.6 },
      southwest: { lat: 23.9, lng: 77.1 }
    },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [77.1, 23.9],
        [84.6, 23.9],
        [84.6, 30.4],
        [77.1, 30.4],
        [77.1, 23.9]
      ]]
    }
  }
  // Add more states as needed
];

async function seedStates() {
  try {
    console.log('Starting state seeding...');
    
    // Clear existing states
    await State.deleteMany({});
    console.log('Cleared existing states');
    
    // Insert new states
    const inserted = await State.insertMany(indianStates);
    console.log(`✅ Seeded ${inserted.length} states successfully`);
    
    return inserted;
  } catch (error) {
    console.error('❌ Error seeding states:', error);
    throw error;
  }
}

// Utility to populate state field in existing trainings
async function populateTrainingStates() {
  try {
    console.log('Starting training state population...');
    
    const trainings = await Training.find({
      location: { $exists: true },
      $or: [
        { state: { $exists: false } },
        { state: null },
        { state: '' }
      ]
    });
    
    console.log(`Found ${trainings.length} trainings without state field`);
    
    let updated = 0;
    let failed = 0;
    
    for (const training of trainings) {
      try {
        if (!training.location || !training.location.coordinates) {
          console.log(`⚠️  Training ${training._id} has no valid coordinates`);
          failed++;
          continue;
        }
        
        const [lng, lat] = training.location.coordinates;
        
        // Find state containing this point
        const state = await State.findOne({
          geometry: {
            $geoIntersects: {
              $geometry: {
                type: 'Point',
                coordinates: [lng, lat]
              }
            }
          }
        });
        
        if (state) {
          training.state = state.slug;
          
          // Also update address.state if it exists
          if (training.address) {
            training.address.state = state.name;
          }
          
          await training.save();
          updated++;
          
          if (updated % 10 === 0) {
            console.log(`Updated ${updated} trainings...`);
          }
        } else {
          console.log(`⚠️  No state found for training ${training._id} at [${lng}, ${lat}]`);
          failed++;
        }
      } catch (err) {
        console.error(`Error processing training ${training._id}:`, err.message);
        failed++;
      }
    }
    
    console.log(`✅ Population complete: ${updated} updated, ${failed} failed/skipped`);
  } catch (error) {
    console.error('❌ Error populating training states:', error);
    throw error;
  }
}

module.exports = { seedStates, populateTrainingStates, indianStates };
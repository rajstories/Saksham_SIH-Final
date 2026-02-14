const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Training = require('./models/Training');

dotenv.config();

const sampleTrainings = [
  {
    name: 'Delhi NDMA Headquarters - Earthquake Drill',
    type: 'Earthquake Drill',
    status: 'active',
    location: {
      type: 'Point',
      coordinates: [77.2090, 28.6139],
    },
    address: {
      city: 'New Delhi',
      state: 'Delhi',
      country: 'India',
    },
    participants: 150,
    startDate: new Date('2025-11-28T09:00:00'),
    endDate: new Date('2025-11-28T17:00:00'),
    instructor: {
      name: 'Dr. Rajesh Kumar',
      contact: '+91-9876543210',
    },
    description: 'Comprehensive earthquake preparedness drill for NDMA staff and volunteers.',
    resources: {
      equipment: ['Safety helmets', 'First aid kits', 'Emergency lights'],
      personnel: 25,
    },
  },
  {
    name: 'Mumbai Flood Response Training',
    type: 'Flood Response',
    status: 'active',
    location: {
      type: 'Point',
      coordinates: [72.8777, 19.0760],
    },
    address: {
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
    },
    participants: 200,
    startDate: new Date('2025-11-29T08:00:00'),
    endDate: new Date('2025-11-29T18:00:00'),
    instructor: {
      name: 'Lt. Col. Priya Sharma',
      contact: '+91-9123456789',
    },
    description: 'Advanced flood rescue operations and emergency response training.',
    resources: {
      equipment: ['Rescue boats', 'Life jackets', 'Ropes', 'Communication devices'],
      personnel: 40,
    },
  },
  {
    name: 'Bangalore Fire Safety Workshop',
    type: 'Fire Safety',
    status: 'scheduled',
    location: {
      type: 'Point',
      coordinates: [77.5946, 12.9716],
    },
    address: {
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
    },
    participants: 120,
    startDate: new Date('2025-12-05T10:00:00'),
    endDate: new Date('2025-12-05T16:00:00'),
    instructor: {
      name: 'Fire Officer Suresh Menon',
      contact: '+91-9988776655',
    },
    description: 'Fire safety protocols and emergency evacuation procedures.',
    resources: {
      equipment: ['Fire extinguishers', 'Smoke detectors', 'Safety masks'],
      personnel: 15,
    },
  },
  {
    name: 'Chennai Cyclone Preparedness Drill',
    type: 'Cyclone Drill',
    status: 'scheduled',
    location: {
      type: 'Point',
      coordinates: [80.2707, 13.0827],
    },
    address: {
      city: 'Chennai',
      state: 'Tamil Nadu',
      country: 'India',
    },
    participants: 180,
    startDate: new Date('2025-12-10T07:00:00'),
    endDate: new Date('2025-12-10T19:00:00'),
    instructor: {
      name: 'Dr. Lakshmi Narayanan',
      contact: '+91-9876501234',
    },
    description: 'Cyclone preparedness and coastal community evacuation training.',
    resources: {
      equipment: ['Tarpaulins', 'Emergency kits', 'Communication radios'],
      personnel: 30,
    },
  },
  {
    name: 'Kolkata Search & Rescue Operations',
    type: 'Search & Rescue',
    status: 'active',
    location: {
      type: 'Point',
      coordinates: [88.3639, 22.5726],
    },
    address: {
      city: 'Kolkata',
      state: 'West Bengal',
      country: 'India',
    },
    participants: 160,
    startDate: new Date('2025-11-28T06:00:00'),
    endDate: new Date('2025-11-28T20:00:00'),
    instructor: {
      name: 'Capt. Arun Das',
      contact: '+91-9123450987',
    },
    description: 'Urban search and rescue techniques for disaster scenarios.',
    resources: {
      equipment: ['Rescue tools', 'Stretchers', 'Medical supplies', 'GPS devices'],
      personnel: 35,
    },
  },
  {
    name: 'Hyderabad Medical Emergency Response',
    type: 'Medical Emergency',
    status: 'completed',
    location: {
      type: 'Point',
      coordinates: [78.4867, 17.3850],
    },
    address: {
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
    },
    participants: 100,
    startDate: new Date('2025-11-20T09:00:00'),
    endDate: new Date('2025-11-20T17:00:00'),
    instructor: {
      name: 'Dr. Sneha Reddy',
      contact: '+91-9988001122',
    },
    description: 'Emergency medical response and triage training.',
    resources: {
      equipment: ['Medical kits', 'Defibrillators', 'Oxygen cylinders'],
      personnel: 20,
    },
  },
  {
    name: 'Pune Earthquake Simulation',
    type: 'Earthquake Drill',
    status: 'completed',
    location: {
      type: 'Point',
      coordinates: [73.8567, 18.5204],
    },
    address: {
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
    },
    participants: 140,
    startDate: new Date('2025-11-15T08:00:00'),
    endDate: new Date('2025-11-15T16:00:00'),
    instructor: {
      name: 'Prof. Amit Joshi',
      contact: '+91-9765432100',
    },
    description: 'Earthquake simulation with structural safety assessment.',
    resources: {
      equipment: ['Seismic monitors', 'Safety equipment'],
      personnel: 18,
    },
  },
  {
    name: 'Jaipur Community Disaster Awareness',
    type: 'Other',
    status: 'scheduled',
    location: {
      type: 'Point',
      coordinates: [75.7873, 26.9124],
    },
    address: {
      city: 'Jaipur',
      state: 'Rajasthan',
      country: 'India',
    },
    participants: 250,
    startDate: new Date('2025-12-15T09:00:00'),
    endDate: new Date('2025-12-15T18:00:00'),
    instructor: {
      name: 'Mrs. Kavita Singh',
      contact: '+91-9871234560',
    },
    description: 'Community-level disaster awareness and preparedness program.',
    resources: {
      equipment: ['Educational materials', 'Presentation equipment'],
      personnel: 12,
    },
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing data
    await Training.deleteMany({});
    console.log('🗑️  Cleared existing trainings');

    // Insert sample data
    await Training.insertMany(sampleTrainings);
    console.log(`✅ Inserted ${sampleTrainings.length} sample trainings`);

    console.log('\n📊 Sample trainings created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
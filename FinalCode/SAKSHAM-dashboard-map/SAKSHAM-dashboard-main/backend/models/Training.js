const mongoose = require('mongoose');

const trainingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Training name is required'],
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    type: {
      type: String,
      required: [true, 'Training type is required'],
      enum: [
        'Earthquake Drill',
        'Flood Response',
        'Fire Safety',
        'Cyclone Drill',
        'Search & Rescue',
        'Medical Emergency',
        'Other',
      ],
    },
    status: {
      type: String,
      required: true,
      enum: ['active', 'scheduled', 'completed', 'cancelled'],
      default: 'scheduled',
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: [true, 'Coordinates are required'],
        validate: {
          validator: function (coords) {
            return (
              coords.length === 2 &&
              coords[0] >= -180 &&
              coords[0] <= 180 &&
              coords[1] >= -90 &&
              coords[1] <= 90
            );
          },
          message: 'Invalid coordinates format',
        },
      },
    },
    address: {
      city: String,
      state: String,
      country: { type: String, default: 'India' },
    },
    participants: {
      type: Number,
      required: [true, 'Participant count is required'],
      min: [1, 'Must have at least 1 participant'],
      max: [10000, 'Participant count too high'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
      validate: {
        validator: function (value) {
          return value >= this.startDate;
        },
        message: 'End date must be after start date',
      },
    },
    instructor: {
      name: String,
      contact: String,
    },
    description: {
      type: String,
      maxlength: [1000, 'Description too long'],
    },
    state: {
      type: String,
      lowercase: true,
      index: true // Add index for faster queries
   },
    resources: {
      equipment: [String],
      personnel: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Create geospatial index for location-based queries
trainingSchema.index({ location: '2dsphere' });

// Create index for faster queries
trainingSchema.index({ status: 1, startDate: -1 });

module.exports = mongoose.model('Training', trainingSchema);
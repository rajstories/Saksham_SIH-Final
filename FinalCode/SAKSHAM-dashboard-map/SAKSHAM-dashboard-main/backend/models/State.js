const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  code: { type: String, required: true, unique: true }, // e.g., 'DL', 'MH'
  geometry: {
    type: {
      type: String,
      enum: ['Polygon', 'MultiPolygon'],
      required: true
    },
    coordinates: {
      type: [[[Number]]], // GeoJSON coordinates
      required: true
    }
  },
  center: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  bounds: {
    northeast: { lat: Number, lng: Number },
    southwest: { lat: Number, lng: Number }
  }
}, { timestamps: true });

// Create geospatial index for polygon queries
stateSchema.index({ geometry: '2dsphere' });

module.exports = mongoose.model('State', stateSchema);
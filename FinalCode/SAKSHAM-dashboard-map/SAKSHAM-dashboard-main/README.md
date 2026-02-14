# SAKSHAM GIS Dashboard & Mapping System

## 🎯 Overview

The **SAKSHAM GIS Dashboard** provides interactive geographical visualization of disaster-prone areas, real-time resource mapping, and spatial analysis for disaster management. It combines powerful mapping libraries with real-time data to give officials comprehensive situational awareness.

## 🌟 Key Features

- 🗺️ **Interactive Maps** - Leaflet and Mapbox GL integration
- 📍 **Resource Mapping** - Emergency shelters, hospitals, fire stations
- 🌡️ **Weather Overlays** - Real-time weather data visualization
- 📊 **Cluster Visualization** - Efficient display of large datasets
- 🔄 **Real-time Updates** - Socket.io for live data streaming
- 📱 **Responsive Design** - Works on all devices

## 📁 Project Structure

```
SAKSHAM-dashboard-map/
└── SAKSHAM-dashboard-main/
    ├── backend/                # GIS API server
    │   ├── server.js          # Express server
    │   ├── routes/            # API routes
    │   ├── models/            # MongoDB models
    │   └── package.json
    ├── frontend/              # React-based map UI
    │   ├── src/
    │   │   ├── components/    # Map components
    │   │   ├── services/      # API services
    │   │   └── App.jsx
    │   └── package.json
    ├── frontend-backup/       # Backup version
    └── .env.local
```

## 🚀 Getting Started

### Prerequisites
- Node.js v18 or higher
- MongoDB (for backend)
- Mapbox API key (optional, for Mapbox features)

### Backend Setup

1. **Navigate to backend**
   ```bash
   cd SAKSHAM-dashboard-map/SAKSHAM-dashboard-main/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   Create `.env` file:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/saksham-gis
   NODE_ENV=development
   ```

4. **Start backend server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

### Frontend Setup

1. **Navigate to frontend**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   Create `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_MAPBOX_TOKEN=your_mapbox_token_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access application**
   ```
   http://localhost:5173
   ```

## 🛠️ Technology Stack

### Backend
- **Express.js** v5.1.0 - Web framework
- **MongoDB** - Geospatial database
- **Mongoose** v9.0.0 - ODM with geospatial support
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment configuration

### Frontend
- **React** v19.2.0 - UI framework
- **Vite** - Build tool
- **React Leaflet** v5.0.0 - Map component wrapper
- **Leaflet** v1.9.4 - Open-source mapping library
- **Mapbox GL** v3.17.0 - Vector map rendering
- **React Map GL** v8.1.0 - Mapbox React wrapper
- **React Leaflet Cluster** v4.0.0 - Marker clustering
- **Socket.io Client** v4.8.1 - Real-time updates
- **Axios** v1.13.2 - HTTP client
- **React Router** v7.10.1 - Navigation
- **date-fns** v4.1.0 - Date utilities

## 📡 API Endpoints

### Locations
```
GET    /api/locations              # Get all locations
GET    /api/locations/nearby       # Get nearby resources
POST   /api/locations              # Add new location
PUT    /api/locations/:id          # Update location
DELETE /api/locations/:id          # Delete location
```

### Disasters
```
GET    /api/disasters/map          # Get disaster locations
GET    /api/disasters/heatmap      # Get heatmap data
GET    /api/disasters/clusters     # Get clustered data
```

### Resources
```
GET    /api/resources              # Get emergency resources
GET    /api/resources/type/:type   # Get by type (hospital, shelter)
POST   /api/resources              # Add resource
```

## 🗺️ Map Features

### Layers
- **Base Maps** - OpenStreetMap, Satellite, Terrain
- **Disaster Zones** - Highlighted risk areas
- **Resource Markers** - Hospitals, shelters, fire stations
- **Weather Overlay** - Temperature, precipitation, wind
- **Heatmaps** - Disaster intensity visualization
- **Cluster Markers** - Grouped markers for performance

### Interactions
- **Click** - View location details
- **Hover** - Quick info tooltip
- **Zoom** - Scroll or pinch
- **Pan** - Drag to move
- **Search** - Find locations by name/address
- **Filter** - Show/hide specific layers

## 🎨 Components

### Core Components
```javascript
// Map container
<MapContainer />

// Marker clustering
<MarkerClusterGroup />

// Heatmap layer
<HeatmapLayer />

// Custom markers
<CustomMarker />

// Info sidebar
<LocationInfo />

// Layer control
<LayerControl />
```

## 📊 Geospatial Queries

### MongoDB Geospatial Indexes
```javascript
// Location schema with geospatial index
{
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
}

// Create 2dsphere index
locationSchema.index({ location: '2dsphere' });
```

### Nearby Query Example
```javascript
const nearbyResources = await Resource.find({
  location: {
    $near: {
      $geometry: {
        type: 'Point',
        coordinates: [longitude, latitude]
      },
      $maxDistance: 5000 // 5km radius
    }
  }
});
```

## 🔄 Real-time Updates

### Socket.io Integration
```javascript
// Client-side
import io from 'socket.io-client';

const socket = io(process.env.VITE_API_URL);

socket.on('disaster-update', (data) => {
  // Update map markers
  updateDisasterMarkers(data);
});

socket.on('resource-update', (data) => {
  // Update resource locations
  updateResourceMarkers(data);
});
```

## 🎯 Use Cases

### Disaster Management Officials
- **Situational Awareness** - Real-time view of affected areas
- **Resource Allocation** - Identify nearest resources
- **Evacuation Planning** - Find safe zones and routes
- **Response Coordination** - Deploy teams efficiently

### Emergency Responders
- **Quick Navigation** - Find fastest routes
- **Resource Availability** - Check hospital capacity
- **Alert Zones** - Identify high-risk areas
- **Team Tracking** - Monitor field units

## 📱 Mobile Responsiveness

- **Touch Gestures** - Pinch to zoom, swipe to pan
- **Responsive Layout** - Adapts to screen size
- **Mobile Controls** - Large touch targets
- **Offline Maps** - Cached tile support (planned)

## 🔧 Configuration

### Map Settings
```javascript
// Default map configuration
const mapDefaults = {
  center: [28.6139, 77.2090], // New Delhi
  zoom: 5,
  minZoom: 4,
  maxZoom: 18
};
```

### Mapbox Styles
- `mapbox://styles/mapbox/streets-v11` - Street view
- `mapbox://styles/mapbox/satellite-v9` - Satellite
- `mapbox://styles/mapbox/dark-v10` - Dark mode

## 🚀 Deployment

### Frontend Build
```bash
npm run build
```

### Backend Deployment
```bash
NODE_ENV=production npm start
```

### Recommended Hosting
- **Frontend**: Vercel, Netlify, Cloudflare Pages
- **Backend**: Railway, Render, Heroku
- **Database**: MongoDB Atlas

## 🔐 Security

- API key protection in environment variables
- Rate limiting on geospatial queries
- CORS configuration for allowed origins
- Input validation for coordinates

## 📈 Performance Optimization

- **Marker Clustering** - Reduce render load
- **Lazy Loading** - Load tiles on demand
- **Debounced Updates** - Limit API calls
- **Cached Tiles** - Browser caching
- **Indexed Queries** - Optimized database queries

## 🐛 Troubleshooting

### Map Not Loading
- Check Mapbox API key
- Verify internet connection
- Check browser console for errors

### Markers Not Showing
- Verify coordinate format [longitude, latitude]
- Check data structure
- Ensure proper zoom level

### Backend Connection Failed
- Verify backend is running
- Check VITE_API_URL in .env
- Check CORS configuration

## 📚 Resources

- [Leaflet Documentation](https://leafletjs.com/)
- [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/)
- [React Leaflet](https://react-leaflet.js.org/)
- [MongoDB Geospatial Queries](https://docs.mongodb.com/manual/geospatial-queries/)

---

**Part of SAKSHAM - SIH 2025 Project**


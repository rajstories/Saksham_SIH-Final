import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import './StateMap.css';

// Import Leaflet images
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// API Base URL
const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// Custom markers by status
const createCustomIcon = (status, count) => {
  const colors = {
    active: '#10b981',
    scheduled: '#f59e0b',
    planned: '#f59e0b',
    completed: '#3b82f6',
    cancelled: '#ef4444'
  };
  
  const color = colors[status?.toLowerCase()] || '#6b7280';
  
  return L.divIcon({
    html: `<div style="background-color: ${color}; color: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">${count || ''}</div>`,
    className: 'custom-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

// Component to handle map bounds
function MapBounds({ bounds }) {
  const map = useMap();
  
  useEffect(() => {
    if (bounds) {
      map.fitBounds([
        [bounds.southwest.lat, bounds.southwest.lng],
        [bounds.northeast.lat, bounds.northeast.lng]
      ], { padding: [50, 50] });
    }
  }, [bounds, map]);
  
  return null;
}

const StateMap = () => {
  const { stateSlug } = useParams();
  const navigate = useNavigate();
  
  const [stateData, setStateData] = useState(null);
  const [trainings, setTrainings] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    startDate: '',
    endDate: '',
    search: ''
  });
  
  // Socket for live updates
  const [socket, setSocket] = useState(null);
  
  // Fetch state details
  const fetchStateDetails = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/states/${stateSlug}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message);
      }
      
      setStateData(data.data);
    } catch (err) {
      setError(err.message);
    }
  }, [stateSlug]);
  
  // Fetch trainings
  const fetchTrainings = useCallback(async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.type) queryParams.append('type', filters.type);
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);
      
      const response = await fetch(`${API_URL}/api/states/${stateSlug}/trainings?${queryParams}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message);
      }
      
      let filteredTrainings = data.data.trainings;
      
      // Apply search filter on client side
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredTrainings = filteredTrainings.filter(t =>
          t.name?.toLowerCase().includes(searchLower) ||
          t.address?.city?.toLowerCase().includes(searchLower) ||
          t.type?.toLowerCase().includes(searchLower)
        );
      }
      
      setTrainings(filteredTrainings);
    } catch (err) {
      console.error('Error fetching trainings:', err);
    }
  }, [stateSlug, filters]);
  
  // Fetch summary
  const fetchSummary = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/states/${stateSlug}/summary`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message);
      }
      
      setSummary(data.data);
    } catch (err) {
      console.error('Error fetching summary:', err);
    }
  }, [stateSlug]);
  
  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchStateDetails(),
        fetchTrainings(),
        fetchSummary()
      ]);
      setLoading(false);
    };
    
    loadData();
  }, [fetchStateDetails, fetchTrainings, fetchSummary]);
  
  // Setup socket for live updates
  useEffect(() => {
    try {
      const newSocket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });
      
      setSocket(newSocket);
      
      newSocket.on('connect', () => {
        console.log('Socket connected successfully');
        setSocketConnected(true);
        newSocket.emit('joinState', stateSlug);
      });
      
      newSocket.on('connect_error', (error) => {
        console.warn('Socket connection error:', error.message);
        setSocketConnected(false);
      });
      
      // Listen for updates
      newSocket.on('trainingUpdate', (updatedTraining) => {
        setTrainings(prev => {
          const index = prev.findIndex(t => t._id === updatedTraining._id);
          if (index >= 0) {
            const newTrainings = [...prev];
            newTrainings[index] = updatedTraining;
            return newTrainings;
          }
          return [...prev, updatedTraining];
        });
        fetchSummary();
      });
      
      newSocket.on('trainingDeleted', (trainingId) => {
        setTrainings(prev => prev.filter(t => t._id !== trainingId));
        fetchSummary();
      });
      
      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
        setSocketConnected(false);
      });
      
      return () => {
        newSocket.emit('leaveState', stateSlug);
        newSocket.close();
      };
    } catch (error) {
      console.error('Error setting up socket:', error);
    }
  }, [stateSlug, fetchSummary]);
  
  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  if (loading) {
    return (
      <div className="state-map-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading {stateSlug} data...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="state-map-container">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/')}>← Back to National Map</button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="state-map-container">
      {/* Header */}
      <div className="state-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back to National Map
        </button>
        <h1>{stateData?.name} - Training Monitor</h1>
        <span className="state-code">{stateData?.code}</span>
        {/* Socket Status Indicator */}
        {!socketConnected && (
          <span style={{ 
            background: 'rgba(239, 68, 68, 0.2)', 
            padding: '0.5rem 1rem', 
            borderRadius: '8px',
            fontSize: '0.875rem'
          }}>
            ⚠️ Live updates disabled
          </span>
        )}
      </div>
      
      {/* Summary Cards */}
      {summary && (
        <div className="state-summary-cards">
          <div className="summary-card total">
            <div className="card-icon">📊</div>
            <div className="card-content">
              <span className="card-label">Total Trainings</span>
              <span className="card-value">{summary.summary.total}</span>
            </div>
          </div>
          
          <div className="summary-card active">
            <div className="card-icon">🟢</div>
            <div className="card-content">
              <span className="card-label">Active Now</span>
              <span className="card-value">{summary.summary.active}</span>
            </div>
          </div>
          
          <div className="summary-card scheduled">
            <div className="card-icon">📅</div>
            <div className="card-content">
              <span className="card-label">Scheduled</span>
              <span className="card-value">{summary.summary.scheduled + summary.summary.planned}</span>
            </div>
          </div>
          
          <div className="summary-card completed">
            <div className="card-icon">✅</div>
            <div className="card-content">
              <span className="card-label">Completed</span>
              <span className="card-value">{summary.summary.completed}</span>
            </div>
          </div>
          
          <div className="summary-card participants">
            <div className="card-icon">👥</div>
            <div className="card-content">
              <span className="card-label">Total Participants</span>
              <span className="card-value">{summary.summary.totalParticipants}</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="state-content">
        {/* Filters Sidebar */}
        <div className="filters-sidebar">
          <h3>🎛️ Filters</h3>
          
          <div className="filter-group">
            <label>Search</label>
            <input
              type="text"
              placeholder="Search trainings..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
          
          {/* ADD THIS STATUS FILTER */}
          <div className="filter-group">
            <label>Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="scheduled">Scheduled</option>
              <option value="planned">Planned</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Training Type</label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="">All Types</option>
              <option value="Earthquake Drill">Earthquake Drill</option>
              <option value="Fire Safety">Fire Safety</option>
              <option value="Flood Response">Flood Response</option>
              <option value="First Aid">First Aid</option>
              <option value="Community Awareness">Community Awareness</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
            />
          </div>
          
          <div className="filter-group">
            <label>End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
            />
          </div>
          
          <button
            className="reset-filters"
            onClick={() => setFilters({ status: '', type: '', startDate: '', endDate: '', search: '' })}
          >
            Reset Filters
          </button>
          
          {/* Legend */}
          <div className="map-legend">
            <h4>Legend</h4>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#10b981' }}></span>
              Active
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#f59e0b' }}></span>
              Scheduled/Planned
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#3b82f6' }}></span>
              Completed
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#ef4444' }}></span>
              Cancelled
            </div>
          </div>
        </div>
        
        {/* Map and List */}
        <div className="map-and-list">
          {/* Map */}
          <div className="state-map">
            <MapContainer
              center={stateData?.center.coordinates.slice().reverse() || [28.6139, 77.2090]}
              zoom={8}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {stateData?.bounds && <MapBounds bounds={stateData.bounds} />}
              
              {/* State boundary */}
              {stateData?.geometry && (
                <Polygon
                  positions={stateData.geometry.coordinates[0].map(coord => [coord[1], coord[0]])}
                  pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.1, weight: 2 }}
                />
              )}
              
              {/* Training markers */}
              <MarkerClusterGroup>
                {trainings.map(training => {
                  if (!training.location?.coordinates) return null;
                  
                  const [lng, lat] = training.location.coordinates;
                  
                  return (
                    <Marker
                      key={training._id}
                      position={[lat, lng]}
                      icon={createCustomIcon(training.status, training.participants)}
                    >
                      <Popup>
                        <div className="training-popup">
                          <h4>{training.name}</h4>
                          <p><strong>Type:</strong> {training.type}</p>
                          <p><strong>Status:</strong> <span className={`status-badge ${training.status}`}>{training.status}</span></p>
                          <p><strong>Participants:</strong> {training.participants}</p>
                          <p><strong>Location:</strong> {training.address?.city}, {training.address?.state}</p>
                          <p><strong>Date:</strong> {new Date(training.startDate).toLocaleDateString()}</p>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MarkerClusterGroup>
            </MapContainer>
          </div>
          
          {/* Training List */}
          <div className="training-list">
            <h3>Training Sessions ({trainings.length})</h3>
            <div className="list-container">
              {trainings.length === 0 ? (
                <p className="no-trainings">No trainings found matching your filters.</p>
              ) : (
                trainings.map(training => (
                  <div key={training._id} className="training-item">
                    <div className="training-item-header">
                      <h4>{training.name}</h4>
                      <span className={`status-badge ${training.status}`}>{training.status}</span>
                    </div>
                    <div className="training-item-body">
                      <p><strong>Type:</strong> {training.type}</p>
                      <p><strong>Participants:</strong> {training.participants}</p>
                      <p><strong>Location:</strong> {training.address?.city}</p>
                      <p><strong>Date:</strong> {new Date(training.startDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StateMap;
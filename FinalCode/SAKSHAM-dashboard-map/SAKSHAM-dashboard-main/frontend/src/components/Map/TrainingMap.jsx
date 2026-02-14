import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { trainingAPI } from '../../services/api';
import TrainingPopup from './TrainingPopup';
import MapControls from './MapControls';
import 'leaflet/dist/leaflet.css';

const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

// Component to handle map commands like flying to a location
const MapController = ({ flyTo }) => {
  const map = useMap();
  useEffect(() => {
    if (flyTo) {
      map.flyTo(flyTo.center, flyTo.zoom, {
        duration: flyTo.duration,
      });
    }
  }, [flyTo, map]);
  return null;
};

const TrainingMap = () => {
  const navigate = useNavigate();
  
  const [trainings, setTrainings] = useState([]);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
  });
  const [flyTo, setFlyTo] = useState(null);

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await trainingAPI.getAllTrainings();
      
      if (response.success) {
        setTrainings(response.data);
      } else {
        setError('Failed to fetch trainings');
      }
    } catch (err) {
      console.error('Error fetching trainings:', err);
      setError(err.message || 'Failed to fetch trainings');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkerClick = async (training) => {
    setSelectedTraining(training);
    
    if (training.location?.coordinates) {
      const [lng, lat] = training.location.coordinates;
      
      try {
        const response = await fetch(`${API_URL}/api/states/resolve?lng=${lng}&lat=${lat}`);
        const data = await response.json();
        
        if (data.success && data.data) {
          training._stateSlug = data.data.slug;
          training._stateName = data.data.name;
        }
      } catch (error) {
        console.error('Error resolving state:', error);
      }
    }
  };

  const navigateToState = async (training) => {
    if (training._stateSlug) {
      navigate(`/state/${training._stateSlug}`);
      return;
    }
    
    if (training.location?.coordinates) {
      const [lng, lat] = training.location.coordinates;
      
      try {
        const response = await fetch(`${API_URL}/api/states/resolve?lng=${lng}&lat=${lat}`);
        const data = await response.json();
        
        if (data.success && data.data) {
          navigate(`/state/${data.data.slug}`);
        } else {
          alert('Could not determine state for this training');
        }
      } catch (error) {
        console.error('Error resolving state:', error);
        alert('Error loading state details');
      }
    }
  };

  const filteredTrainings = trainings.filter((training) => {
    if (filters.status !== 'all' && training.status !== filters.status) {
      return false;
    }
    if (filters.type !== 'all' && training.type !== filters.type) {
      return false;
    }
    return true;
  });

  const getMarkerColor = (status) => {
    const colors = {
      active: '#22c55e',
      completed: '#3b82f6',
      scheduled: '#f59e0b',
      cancelled: '#ef4444',
    };
    return colors[status] || '#6b7280';
  };
  
  const createCustomIcon = (training) => {
    const markerHtml = `
      <div style="position: relative; cursor: pointer;">
        <div style="width: 36px; height: 36px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; position: relative; z-index: 1; background-color: ${getMarkerColor(training.status)};">
          <span style="color: white; font-size: 11px; font-weight: bold;">${training.participants}</span>
        </div>
        ${training.status === 'active' ? `<div class="animate-pulse-marker" style="position: absolute; top: 0; left: 0; width: 36px; height: 36px; border-radius: 50%; opacity: 0.4; background-color: ${getMarkerColor(training.status)};"></div>` : ''}
      </div>
    `;
    return L.divIcon({
      html: markerHtml,
      className: '', // Important to avoid default leaflet styles
      iconSize: [42, 42],
      iconAnchor: [21, 42],
    });
  };

  const flyToLocation = (training) => {
    // Leaflet uses [lat, long]
    const center = [training.location.coordinates[1], training.location.coordinates[0]];
    setFlyTo({
      center: center,
      zoom: 12,
      duration: 2,
    });
    setSelectedTraining(training);
  };
  
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div className="spinner" />
        <p style={styles.loadingText}>Loading training data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorContent}>
          <span style={styles.errorIcon}>⚠️</span>
          <h3 style={styles.errorTitle}>Error Loading Map</h3>
          <p style={styles.errorMessage}>{error}</p>
          <button onClick={fetchTrainings} style={styles.retryButton}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.mapContainer}>
      <MapControls
        filters={filters}
        setFilters={setFilters}
        trainings={filteredTrainings}
        onLocationSelect={flyToLocation}
      />

      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController flyTo={flyTo} />

        {filteredTrainings.map((training) => (
          <Marker
            key={training._id}
            position={[training.location.coordinates[1], training.location.coordinates[0]]} // Leaflet: [lat, long]
            icon={createCustomIcon(training)}
            eventHandlers={{
              click: () => {
                handleMarkerClick(training);
              },
            }}
          >
            {selectedTraining && selectedTraining._id === training._id && (
              <Popup
                onClose={() => setSelectedTraining(null)}
              >
                <TrainingPopup 
                  training={selectedTraining} 
                  onViewStateDetails={navigateToState}
                />
              </Popup>
            )}
          </Marker>
        ))}
      </MapContainer>

      {/* Stats Summary */}
      <div style={styles.statsContainer}>
        <h3 style={styles.statsTitle}>Training Summary</h3>
        <div style={styles.statsGrid}>
          <StatItem label="Total" value={filteredTrainings.length} />
          <StatItem
            label="Active"
            value={filteredTrainings.filter((t) => t.status === 'active').length}
            color="#22c55e"
          />
          <StatItem
            label="Scheduled"
            value={filteredTrainings.filter((t) => t.status === 'scheduled').length}
            color="#f59e0b"
          />
          <StatItem
            label="Completed"
            value={filteredTrainings.filter((t) => t.status === 'completed').length}
            color="#3b82f6"
          />
        </div>
      </div>
    </div>
  );
};

const StatItem = ({ label, value, color = '#1f2937' }) => (
  <div style={styles.statItem}>
    <span style={styles.statLabel}>{label}:</span>
    <span style={{ ...styles.statValue, color }}>{value}</span>
  </div>
);

const styles = {
  mapContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: '1rem',
  },
  loadingText: {
    fontSize: '1rem',
    color: '#6b7280',
  },
  errorContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: '2rem',
  },
  errorContent: {
    textAlign: 'center',
    maxWidth: '400px',
  },
  errorIcon: {
    fontSize: '3rem',
  },
  errorTitle: {
    margin: '1rem 0 0.5rem 0',
    color: '#1f2937',
  },
  errorMessage: {
    color: '#6b7280',
    marginBottom: '1.5rem',
  },
  retryButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '0.375rem',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: '500',
  },
  statsContainer: {
    position: 'absolute',
    bottom: '1rem',
    left: '1rem',
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    padding: '1rem',
    minWidth: '280px',
    zIndex: 1000, // Make sure it's above the map
  },
  statsTitle: {
    margin: '0 0 0.75rem 0',
    fontSize: '0.875rem',
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.5rem',
  },
  statItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: '0.813rem',
    color: '#6b7280',
  },
  statValue: {
    fontSize: '1rem',
    fontWeight: 'bold',
  },
};

export default TrainingMap;
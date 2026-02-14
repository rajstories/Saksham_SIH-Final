import React, { useState, useEffect, useRef } from 'react';
import Map, { Marker, Popup, NavigationControl, ScaleControl } from 'react-map-gl/mapbox';
import { useNavigate } from 'react-router-dom'; // ← NEW: ADD THIS LINE
import { trainingAPI } from '../../services/api';
import TrainingPopup from './TrainingPopup';
import MapControls from './MapControls';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

const TrainingMap = () => {
  const navigate = useNavigate(); // ← NEW: ADD THIS LINE
  
  const [viewState, setViewState] = useState({
    longitude: 78.9629,
    latitude: 20.5937,
    zoom: 4,
  });
  
  const [trainings, setTrainings] = useState([]);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
  });

  const mapRef = useRef();

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

  // ← NEW: ADD THIS ENTIRE FUNCTION
  const handleMarkerClick = async (training) => {
    // First, show the popup (keep existing behavior)
    setSelectedTraining(training);
    
    // Then prepare to navigate to state page
    if (training.location?.coordinates) {
      const [lng, lat] = training.location.coordinates;
      
      try {
        const response = await fetch(`/api/states/resolve?lng=${lng}&lat=${lat}`);
        const data = await response.json();
        
        if (data.success && data.data) {
          // Store state slug for the "View State Details" button
          training._stateSlug = data.data.slug;
          training._stateName = data.data.name;
        }
      } catch (error) {
        console.error('Error resolving state:', error);
      }
    }
  };

  // ← NEW: ADD THIS FUNCTION FOR NAVIGATION
  const navigateToState = async (training) => {
    if (training._stateSlug) {
      // If we already resolved the state, navigate directly
      navigate(`/state/${training._stateSlug}`);
      return;
    }
    
    // Otherwise, resolve it first
    if (training.location?.coordinates) {
      const [lng, lat] = training.location.coordinates;
      
      try {
        const response = await fetch(`/api/states/resolve?lng=${lng}&lat=${lat}`);
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

  const flyToLocation = (training) => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: training.location.coordinates,
        zoom: 12,
        duration: 2000,
      });
      setSelectedTraining(training);
    }
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

      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        style={{ width: '100%', height: '100%' }}
      >
        <NavigationControl position="top-right" />
        <ScaleControl position="bottom-left" />

        {filteredTrainings.map((training) => (
          <Marker
            key={training._id}
            longitude={training.location.coordinates[0]}
            latitude={training.location.coordinates[1]}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              handleMarkerClick(training); // ← MODIFIED: Now calls our new function
            }}
          >
            <div style={styles.markerContainer}>
              <div
                style={{
                  ...styles.marker,
                  backgroundColor: getMarkerColor(training.status),
                }}
              >
                <span style={styles.markerText}>
                  {training.participants}
                </span>
              </div>

              {training.status === 'active' && (
                <div
                  className="animate-pulse-marker"
                  style={{
                    ...styles.pulseDot,
                    backgroundColor: getMarkerColor(training.status),
                  }}
                />
              )}
            </div>
          </Marker>
        ))}

        {selectedTraining && (
          <Popup
            longitude={selectedTraining.location.coordinates[0]}
            latitude={selectedTraining.location.coordinates[1]}
            anchor="bottom"
            onClose={() => setSelectedTraining(null)}
            closeOnClick={false}
          >
            {/* ← MODIFIED: Pass navigateToState function to TrainingPopup */}
            <TrainingPopup 
              training={selectedTraining} 
              onViewStateDetails={navigateToState}
            />
          </Popup>
        )}
      </Map>

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
  markerContainer: {
    position: 'relative',
    cursor: 'pointer',
  },
  marker: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: '3px solid white',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 1,
    transition: 'transform 0.2s',
  },
  markerText: {
    color: 'white',
    fontSize: '11px',
    fontWeight: 'bold',
  },
  pulseDot: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    opacity: 0.4,
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
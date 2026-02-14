import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import StatsCards from './components/Dashboard/StatsCards';
import TrainingMap from './components/Map/TrainingMap';
import StateMap from './components/Map/StateMap';
import { trainingAPI } from './services/api';

// Dashboard component - your existing home page (EXACTLY as it was)
function Dashboard() {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    try {
      const response = await trainingAPI.getAllTrainings();
      if (response.success) {
        setTrainings(response.data);
      }
    } catch (error) {
      console.error('Error fetching trainings:', error);
    } finally {
      setLoading(false);
    }
  };

  // THIS IS YOUR EXACT ORIGINAL CODE - NO CHANGES
  return (
    <main style={styles.main}>
      <div style={styles.container}>
        {!loading && <StatsCards trainings={trainings} />}
        
        <div style={styles.mapWrapper}>
          <TrainingMap />
        </div>
      </div>
    </main>
  );
}

// Main App component with routing
function App() {
  return (
    <Router>
      <div style={styles.app}>
        <Navbar />
        
        <Routes>
          {/* Your original home page - shows national map with stats */}
          <Route path="/" element={<Dashboard />} />
          
          {/* New state-specific page */}
          <Route path="/state/:stateSlug" element={<StateMap />} />
        </Routes>
      </div>
    </Router>
  );
}

// YOUR EXACT ORIGINAL STYLES - NO CHANGES
const styles = {
  app: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  main: {
    flex: 1,
    padding: '1.5rem',
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
  },
  mapWrapper: {
    height: '70vh',
    minHeight: '500px',
    borderRadius: '0.5rem',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
};

export default App;
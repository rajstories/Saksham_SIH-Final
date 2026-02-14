import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import TrainingMap from './components/Map/TrainingMap';
import StateMap from './components/Map/StateMap';

// Dashboard component - your existing home page (EXACTLY as it was)
function Dashboard() {
  // THIS IS YOUR EXACT ORIGINAL CODE - NO CHANGES
  return (
    <main style={styles.main}>
      <div style={styles.container}>
        <div style={styles.mapWrapper}>
          <TrainingMap />
        </div>
      </div>
    </main>
  );
}

// Main App component with routing
export default function App() {
  return (
    <Router>  
      <div style={styles.app}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/state/:stateSlug" element={<StateMap />} />
        </Routes>
      </div>
    </Router>  
  );
}

// styles object moved outside component
const styles = {
  app: { minHeight: '100vh', display: 'flex', flexDirection: 'column' },
  main: { flex: 1, padding: '1.5rem' },
  container: { maxWidth: '1400px', margin: '0 auto' },
  mapWrapper: {
    height: '70vh',
    minHeight: '500px',
    borderRadius: '0.5rem',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
};

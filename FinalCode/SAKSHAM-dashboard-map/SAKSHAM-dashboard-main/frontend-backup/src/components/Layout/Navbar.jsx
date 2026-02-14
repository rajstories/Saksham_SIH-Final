import React from 'react';

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <div style={styles.brand}>
          <span style={styles.logo}>🗺️</span>
          <h1 style={styles.title}>SAKSHAM - GIS Training Monitor</h1>
        </div>
        <div style={styles.info}>
          <span style={styles.badge}>NDMA</span>
          <span style={styles.subtitle}>National Disaster Management Authority</span>
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#1f2937',
    color: 'white',
    padding: '1rem 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  logo: {
    fontSize: '2rem',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    margin: 0,
  },
  info: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  badge: {
    backgroundColor: '#3b82f6',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    fontWeight: 'bold',
    fontSize: '0.875rem',
  },
  subtitle: {
    fontSize: '0.875rem',
    color: '#d1d5db',
  },
};

export default Navbar;
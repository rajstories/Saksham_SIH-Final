import React, { useState } from 'react';

const MapControls = ({ filters, setFilters, trainings, onLocationSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  const filteredResults = trainings.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.address?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🎛️ Map Controls</h2>

      {/* Search */}
      <div style={styles.section}>
        <label style={styles.label}>Search Trainings</label>
        <input
          type="text"
          placeholder="Search by name, city, or type..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowResults(e.target.value.length > 0);
          }}
          onFocus={() => setShowResults(searchQuery.length > 0)}
          style={styles.input}
        />

        {showResults && filteredResults.length > 0 && (
          <div style={styles.searchResults}>
            {filteredResults.slice(0, 5).map((training) => (
              <div
                key={training._id}
                onClick={() => {
                  onLocationSelect(training);
                  setSearchQuery('');
                  setShowResults(false);
                }}
                style={styles.searchResultItem}
              >
                <div style={styles.resultName}>{training.name}</div>
                <div style={styles.resultMeta}>
                  {training.address?.city} • {training.type}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status Filter */}
      <div style={styles.section}>
        <label style={styles.label}>Status Filter</label>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          style={styles.select}
        >
          <option value="all">All Status</option>
          <option value="active">🟢 Active</option>
          <option value="scheduled">🟡 Scheduled</option>
          <option value="completed">🔵 Completed</option>
          <option value="cancelled">🔴 Cancelled</option>
        </select>
      </div>

      {/* Type Filter */}
      <div style={styles.section}>
        <label style={styles.label}>Training Type</label>
        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          style={styles.select}
        >
          <option value="all">All Types</option>
          <option value="Earthquake Drill">🏢 Earthquake Drill</option>
          <option value="Flood Response">🌊 Flood Response</option>
          <option value="Fire Safety">🔥 Fire Safety</option>
          <option value="Cyclone Drill">🌪️ Cyclone Drill</option>
          <option value="Search & Rescue">🚁 Search & Rescue</option>
          <option value="Medical Emergency">⚕️ Medical Emergency</option>
        </select>
      </div>

      {/* Legend */}
      <div style={styles.legend}>
        <h4 style={styles.legendTitle}>Legend</h4>
        <LegendItem color="#22c55e" label="Active" />
        <LegendItem color="#f59e0b" label="Scheduled" />
        <LegendItem color="#3b82f6" label="Completed" />
        <LegendItem color="#ef4444" label="Cancelled" />
      </div>
    </div>
  );
};

const LegendItem = ({ color, label }) => (
  <div style={styles.legendItem}>
    <div style={{ ...styles.legendColor, backgroundColor: color }} />
    <span style={styles.legendLabel}>{label}</span>
  </div>
);

const styles = {
  container: {
    position: 'absolute',
    top: '1rem',
    left: '1rem',
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    padding: '1.5rem',
    width: '320px',
    maxHeight: '90vh',
    overflowY: 'auto',
    zIndex: 10,
  },
  title: {
    margin: '0 0 1rem 0',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#1f2937',
  },
  section: {
    marginBottom: '1.25rem',
    position: 'relative',
  },
  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '0.5rem',
  },
  input: {
    width: '100%',
    padding: '0.625rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    outline: 'none',
  },
  select: {
    width: '100%',
    padding: '0.625rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    backgroundColor: 'white',
    cursor: 'pointer',
    outline: 'none',
  },
  searchResults: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    marginTop: '0.25rem',
    maxHeight: '200px',
    overflowY: 'auto',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    zIndex: 20,
  },
  searchResultItem: {
    padding: '0.75rem',
    cursor: 'pointer',
    borderBottom: '1px solid #f3f4f6',
  },
  resultName: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: '0.25rem',
  },
  resultMeta: {
    fontSize: '0.75rem',
    color: '#6b7280',
  },
  legend: {
    paddingTop: '1rem',
    borderTop: '1px solid #e5e7eb',
  },
  legendTitle: {
    margin: '0 0 0.75rem 0',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#374151',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.5rem',
  },
  legendColor: {
    width: '1rem',
    height: '1rem',
    borderRadius: '50%',
  },
  legendLabel: {
    fontSize: '0.813rem',
    color: '#4b5563',
  },
};

export default MapControls;
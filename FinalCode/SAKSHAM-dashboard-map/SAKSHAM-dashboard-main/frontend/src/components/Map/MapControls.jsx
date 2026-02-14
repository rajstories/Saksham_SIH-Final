import React, { useState } from 'react';

const MapControls = ({ filters, setFilters, trainings, onLocationSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleClearFilters = () => {
    setFilters({ status: 'all', type: 'all' });
    setSearchQuery('');
  };

  const filteredResults = trainings.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.address?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={styles.container}>
      {/* Search */}
      <div style={{ ...styles.section, ...styles.searchSection }}>
        <input
          type="text"
          placeholder="Search by name, city, or type..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowResults(e.target.value.length > 0);
          }}
          onFocus={() => setShowResults(searchQuery.length > 0)}
          onBlur={() => setTimeout(() => setShowResults(false), 100)}
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
      
      {/* Clear Button */}
      <div style={styles.section}>
        <button onClick={handleClearFilters} style={styles.clearButton}>
          Clear
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: 'absolute',
    top: '1rem',
    left: '1rem',
    right: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    padding: '1rem',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  section: {
    position: 'relative',
  },
  searchSection: {
    flex: 1, // Take up more space
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '0.9rem',
    outline: 'none',
  },
  select: {
    width: '100%',
    minWidth: '180px',
    padding: '0.75rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '0.9rem',
    backgroundColor: 'white',
    cursor: 'pointer',
    outline: 'none',
  },
  clearButton: {
    padding: '0.75rem 1.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '0.9rem',
    backgroundColor: 'white',
    cursor: 'pointer',
    outline: 'none',
    fontWeight: '500',
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
};

export default MapControls;
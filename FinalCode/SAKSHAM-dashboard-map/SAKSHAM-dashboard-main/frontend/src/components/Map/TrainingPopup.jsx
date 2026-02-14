import React from 'react';
import { format } from 'date-fns';

const TrainingPopup = ({ training, onViewStateDetails }) => { // ← MODIFIED: Added onViewStateDetails prop
  const getStatusColor = (status) => {
    const colors = {
      active: '#22c55e',
      scheduled: '#f59e0b',
      completed: '#3b82f6',
      cancelled: '#ef4444',
    };
    return colors[status] || '#6b7280';
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>{training.name}</h3>
        <span
          style={{
            ...styles.statusBadge,
            backgroundColor: getStatusColor(training.status),
          }}
        >
          {training.status.toUpperCase()}
        </span>
      </div>

      <div style={styles.content}>
        <InfoRow icon="📍" label="Location" value={`${training.address?.city}, ${training.address?.state}`} />
        <InfoRow icon="🎯" label="Type" value={training.type} />
        <InfoRow icon="👥" label="Participants" value={training.participants} />
        <InfoRow
          icon="📅"
          label="Start Date"
          value={format(new Date(training.startDate), 'dd MMM yyyy, HH:mm')}
        />
        <InfoRow
          icon="🏁"
          label="End Date"
          value={format(new Date(training.endDate), 'dd MMM yyyy, HH:mm')}
        />
        
        {training.instructor?.name && (
          <InfoRow icon="👨‍🏫" label="Instructor" value={training.instructor.name} />
        )}

        {training.description && (
          <div style={styles.description}>
            <p style={styles.descriptionText}>{training.description}</p>
          </div>
        )}

        {/* ← NEW: ADD THIS BUTTON HERE (at the end of content) */}
        {onViewStateDetails && (
          <button
            onClick={() => onViewStateDetails(training)}
            style={styles.stateButton}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            🗺️ View {training.address?.state || 'State'} Training Map →
          </button>
        )}
      </div>
    </div>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <div style={styles.infoRow}>
    <span style={styles.infoIcon}>{icon}</span>
    <div>
      <div style={styles.infoLabel}>{label}</div>
      <div style={styles.infoValue}>{value}</div>
    </div>
  </div>
);

const styles = {
  container: {
    minWidth: '300px',
    maxWidth: '400px',
  },
  header: {
    padding: '1rem',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '0.5rem',
  },
  title: {
    margin: 0,
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
  },
  statusBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    padding: '1rem',
  },
  infoRow: {
    display: 'flex',
    gap: '0.75rem',
    marginBottom: '0.75rem',
    alignItems: 'flex-start',
  },
  infoIcon: {
    fontSize: '1.25rem',
  },
  infoLabel: {
    fontSize: '0.75rem',
    color: '#6b7280',
    marginBottom: '0.125rem',
  },
  infoValue: {
    fontSize: '0.875rem',
    color: '#1f2937',
    fontWeight: '500',
  },
  description: {
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid #e5e7eb',
  },
  descriptionText: {
    margin: 0,
    fontSize: '0.875rem',
    color: '#4b5563',
    lineHeight: '1.5',
  },
  // ← NEW: ADD THIS STYLE FOR THE BUTTON
  stateButton: {
    marginTop: '1rem',
    padding: '0.75rem 1rem',
    width: '100%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
};

export default TrainingPopup;
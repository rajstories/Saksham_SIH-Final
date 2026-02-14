import React from 'react';

const StatsCards = ({ trainings }) => {
  const stats = {
    total: trainings.length,
    active: trainings.filter((t) => t.status === 'active').length,
    scheduled: trainings.filter((t) => t.status === 'scheduled').length,
    completed: trainings.filter((t) => t.status === 'completed').length,
    totalParticipants: trainings.reduce((sum, t) => sum + t.participants, 0),
  };

  return (
    <div style={styles.container}>
      <StatCard
        title="Total Trainings"
        value={stats.total}
        color="#3b82f6"
        icon="📊"
      />
      <StatCard
        title="Active Now"
        value={stats.active}
        color="#22c55e"
        icon="🟢"
      />
      <StatCard
        title="Scheduled"
        value={stats.scheduled}
        color="#f59e0b"
        icon="📅"
      />
      <StatCard
        title="Completed"
        value={stats.completed}
        color="#8b5cf6"
        icon="✅"
      />
      <StatCard
        title="Total Participants"
        value={stats.totalParticipants}
        color="#ec4899"
        icon="👥"
      />
    </div>
  );
};

const StatCard = ({ title, value, color, icon }) => (
  <div style={{ ...styles.card, borderLeft: `4px solid ${color}` }}>
    <div style={styles.cardHeader}>
      <span style={styles.icon}>{icon}</span>
      <span style={styles.cardTitle}>{title}</span>
    </div>
    <div style={{ ...styles.cardValue, color }}>{value}</div>
  </div>
);

const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  card: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.75rem',
  },
  icon: {
    fontSize: '1.5rem',
  },
  cardTitle: {
    fontSize: '0.875rem',
    color: '#6b7280',
    fontWeight: '500',
  },
  cardValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
  },
};

export default StatsCards;
import React, { useState, useEffect } from 'react';

const styles = `
  .stats-wrap {
    min-height: calc(100vh - 68px);
    padding: 40px 28px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .stats-header {
    margin-bottom: 40px;
    animation: fadeUp 0.5s ease;
  }

  .stats-title {
    font-size: 2.5rem;
    font-weight: 900;
    color: var(--text-primary);
    margin-bottom: 8px;
  }

  .stats-title span {
    background: linear-gradient(135deg, #10b981, #059669);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
    animation: fadeUp 0.6s ease 0.2s both;
  }

  .stat-card {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 20px;
    padding: 24px;
    transition: all 0.3s ease;
  }

  .stat-card:hover {
    background: var(--card-hover-bg);
    transform: translateY(-4px);
  }

  .stat-label {
    font-size: 0.85rem;
    color: var(--text-tertiary);
    margin-bottom: 8px;
    font-weight: 600;
  }

  .stat-value {
    font-size: 2.5rem;
    font-weight: 900;
    background: linear-gradient(135deg, #10b981, #059669);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .chart-section {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 20px;
    padding: 28px;
    margin-bottom: 30px;
    animation: fadeUp 0.7s ease 0.3s both;
  }

  .chart-title {
    font-size: 1.3rem;
    font-weight: 800;
    color: var(--text-primary);
    margin-bottom: 24px;
  }

  .bar-chart {
    display: flex;
    align-items: flex-end;
    gap: 16px;
    height: 250px;
    padding: 20px 0;
  }

  .bar-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .bar {
    width: 100%;
    background: linear-gradient(180deg, #10b981, #059669);
    border-radius: 8px 8px 0 0;
    transition: all 0.5s ease;
    position: relative;
  }

  .bar:hover {
    filter: brightness(1.2);
  }

  .bar-value {
    position: absolute;
    top: -25px;
    left: 50%;
    transform: translateX(-50%);
    font-weight: 800;
    color: var(--text-primary);
    font-size: 0.9rem;
  }

  .bar-label {
    font-size: 0.85rem;
    color: var(--text-secondary);
    font-weight: 600;
  }

  .meds-list {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 20px;
    padding: 28px;
    animation: fadeUp 0.8s ease 0.4s both;
  }

  .list-title {
    font-size: 1.3rem;
    font-weight: 800;
    color: var(--text-primary);
    margin-bottom: 20px;
  }

  .med-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    background: var(--bg-secondary);
    border-radius: 12px;
    margin-bottom: 12px;
  }

  .med-info {
    flex: 1;
  }

  .med-name-stat {
    font-weight: 800;
    color: var(--text-primary);
    margin-bottom: 4px;
  }

  .med-detail-stat {
    font-size: 0.85rem;
    color: var(--text-secondary);
  }

  .adherence-badge {
    padding: 8px 16px;
    border-radius: 999px;
    font-weight: 800;
    font-size: 0.9rem;
  }

  .badge-high {
    background: rgba(16, 185, 129, 0.1);
    color: #10b981;
  }

  .badge-medium {
    background: rgba(251, 146, 60, 0.1);
    color: #fb923c;
  }

  .badge-low {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
  }

  .loading-state {
    text-align: center;
    padding: 60px 20px;
    color: var(--text-tertiary);
  }

  .spinner {
    border: 4px solid rgba(16,185,129,0.1);
    border-left-color: #10b981;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 768px) {
    .stats-title { font-size: 2rem; }
    .bar-chart { height: 200px; gap: 12px; }
  }
`;

function HealthStats() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    avgAdherence: 0,
    totalMeds: 0,
    avgWater: '0L',
    streak: 0,
    weeklyData: [],
    medicines: []
  });

  // Load data from localStorage
  useEffect(() => {
    try {
      // 1. Water log from WaterTracker
      const waterLog = JSON.parse(localStorage.getItem('waterLog') || '[]');
      
      // Calculate average water (last 7 days)
      const last7Days = waterLog.slice(0, 7); // log is already newest first
      let totalWater = 0;
      last7Days.forEach(entry => {
        if (entry.amount) totalWater += entry.amount;
      });
      const avgWaterMl = last7Days.length > 0 ? totalWater / last7Days.length : 0;
      const avgWaterL = (avgWaterMl / 1000).toFixed(1) + 'L';

      // Streak days: consecutive days with water entry
      let streak = 0;
      if (waterLog.length > 0) {
        const today = new Date().toLocaleDateString('en-CA');
        const logDates = waterLog.map(e => new Date(e.time).toLocaleDateString('en-CA'));
        const uniqueDates = [...new Set(logDates)];
        uniqueDates.sort().reverse(); // latest first
        let lastDate = today;
        for (let d of uniqueDates) {
          if (d === lastDate) {
            streak++;
            // move to previous day
            const prev = new Date(lastDate);
            prev.setDate(prev.getDate() - 1);
            lastDate = prev.toLocaleDateString('en-CA');
          } else {
            break;
          }
        }
      }

      // 2. Family medicines count
      const familyMeds = JSON.parse(localStorage.getItem('familyMedicines') || '{}');
      let totalMeds = 0;
      const medicinesList = [];
      Object.keys(familyMeds).forEach(member => {
        totalMeds += familyMeds[member].length;
        // Collect all medicines for display
        familyMeds[member].forEach(med => {
          medicinesList.push({
            name: med.name,
            frequency: med.frequency,
            adherence: 100 // default, can be updated later with taken marks
          });
        });
      });

      // 3. Calendar data for weekly chart (last 7 days)
      const calendar = JSON.parse(localStorage.getItem('medicineCalendar') || '{}');
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const today = new Date();
      const weeklyData = [];
      
      // Get last 7 days (including today)
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateKey = `${year}-${month}-${day}`;
        const dayName = days[date.getDay()];
        const medCount = calendar[dateKey] ? calendar[dateKey].length : 0;
        weeklyData.push({
          day: dayName,
          value: medCount,
          fullDate: dateKey
        });
      }

      setStats({
        avgAdherence: 95, // placeholder – later can be computed from taken marks
        totalMeds,
        avgWater: avgWaterL,
        streak,
        weeklyData,
        medicines: medicinesList
      });
    } catch (e) {
      console.error('Error loading stats:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const getAdherenceBadge = (value) => {
    if (value >= 95) return 'badge-high';
    if (value >= 85) return 'badge-medium';
    return 'badge-low';
  };

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="stats-wrap">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your health stats...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="stats-wrap">
        <div className="stats-header">
          <h1 className="stats-title">Health <span>Statistics</span></h1>
        </div>

        <div className="cards-grid">
          <div className="stat-card">
            <div className="stat-label">Average Adherence</div>
            <div className="stat-value">{stats.avgAdherence}%</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Medicines</div>
            <div className="stat-value">{stats.totalMeds}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Water Intake (Avg)</div>
            <div className="stat-value">{stats.avgWater}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Streak Days</div>
            <div className="stat-value">{stats.streak}</div>
          </div>
        </div>

        <div className="chart-section">
          <h3 className="chart-title">Weekly Medicines Scheduled</h3>
          <div className="bar-chart">
            {stats.weeklyData.map((item) => (
              <div key={item.day} className="bar-item">
                <div className="bar" style={{ height: `${Math.min(100, item.value * 10)}%` }}>
                  <div className="bar-value">{item.value}</div>
                </div>
                <div className="bar-label">{item.day}</div>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', color: 'var(--text-tertiary)', marginTop: '10px' }}>
            Number of medicines scheduled per day (last 7 days)
          </p>
        </div>

        <div className="meds-list">
          <h3 className="list-title">All Medicines (from Family)</h3>
          {stats.medicines.length > 0 ? stats.medicines.map((med, i) => (
            <div key={i} className="med-item">
              <div className="med-info">
                <div className="med-name-stat">{med.name}</div>
                <div className="med-detail-stat">{med.frequency}</div>
              </div>
              <div className={`adherence-badge ${getAdherenceBadge(med.adherence)}`}>
                {med.adherence}%
              </div>
            </div>
          )) : (
            <div className="empty-state" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-tertiary)' }}>
              <p>No medicines added in Family yet.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default HealthStats;
import React, { useState, useEffect } from 'react';
import { getMedicines } from '../utils/api';

const styles = `
  .stats-wrap {
    min-height: calc(100vh - 68px);
    padding: 36px 28px;
    max-width: 1000px;
    margin: 0 auto;
    z-index: 1;
    position: relative;
  }

  .stats-title {
    font-size: 2rem;
    font-weight: 900;
    color: #f1f5f9;
    letter-spacing: -1px;
    margin-bottom: 6px;
  }

  .stats-title span {
    background: linear-gradient(135deg, #f59e0b, #ef4444);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .stats-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
    margin-bottom: 32px;
    animation: fadeUp 0.5s ease 0.1s both;
  }

  .stat-box {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 18px;
    padding: 22px;
    text-align: center;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .stat-box::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 2px;
    background: var(--color);
  }

  .stat-box:hover {
    transform: translateY(-3px);
    background: rgba(255,255,255,0.04);
  }

  .stat-box .s-icon { font-size: 1.8rem; margin-bottom: 10px; display: block; }
  .stat-box .s-num {
    font-size: 2rem;
    font-weight: 900;
    font-family: 'Space Mono', monospace;
    color: var(--color);
    display: block;
    margin-bottom: 4px;
  }
  .stat-box .s-label { font-size: 0.78rem; color: #475569; }

  .chart-section {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px;
    padding: 24px;
    margin-bottom: 24px;
    animation: fadeUp 0.5s ease 0.15s both;
  }

  .chart-title {
    font-size: 1rem;
    font-weight: 800;
    color: #f1f5f9;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .bar-chart {
    display: flex;
    align-items: flex-end;
    gap: 8px;
    height: 160px;
    padding: 0 8px;
  }

  .bar-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    height: 100%;
    justify-content: flex-end;
  }

  .bar {
    width: 100%;
    border-radius: 8px 8px 0 0;
    background: linear-gradient(to top, #6366f1, #06b6d4);
    transition: height 1s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 0 12px rgba(99,102,241,0.3);
    min-height: 4px;
  }

  .bar-label {
    font-size: 0.7rem;
    color: #334155;
    text-align: center;
    font-family: 'Space Mono', monospace;
  }

  .adherence-section {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px;
    padding: 24px;
    animation: fadeUp 0.5s ease 0.2s both;
  }

  .adherence-title {
    font-size: 1rem;
    font-weight: 800;
    color: #f1f5f9;
    margin-bottom: 20px;
  }

  .adherence-row {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 14px;
  }

  .adherence-name {
    font-size: 0.85rem;
    color: #94a3b8;
    min-width: 130px;
    font-weight: 600;
  }

  .adherence-bar-bg {
    flex: 1;
    height: 8px;
    background: rgba(255,255,255,0.05);
    border-radius: 999px;
    overflow: hidden;
  }

  .adherence-bar-fill {
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, #6366f1, #10b981);
    transition: width 1s ease;
    box-shadow: 0 0 8px rgba(99,102,241,0.4);
  }

  .adherence-pct {
    font-size: 0.78rem;
    font-family: 'Space Mono', monospace;
    color: #10b981;
    min-width: 40px;
    text-align: right;
    font-weight: 700;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const DAYS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MOCK_DATA = [85, 100, 70, 90, 100, 60, 95];

function HealthStats() {
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    getMedicines().then(res => setMedicines(res.data)).catch(() => {});
  }, []);

  const totalReminders = medicines.reduce((acc, m) =>
    acc + (Array.isArray(m.time) ? m.time.length : 1), 0);

  return (
    <>
      <style>{styles}</style>
      <div className="stats-wrap">
        <div style={{ marginBottom: '28px', animation: 'fadeUp 0.5s ease' }}>
          <div className="stats-title">📈 Health <span>Stats</span></div>
          <div style={{ color: '#475569', fontSize: '0.88rem' }}>Your health analytics and insights</div>
        </div>

        <div className="stats-cards">
          <div className="stat-box" style={{ '--color': '#6366f1' }}>
            <span className="s-icon">💊</span>
            <span className="s-num">{medicines.length}</span>
            <span className="s-label">Total Medicines</span>
          </div>
          <div className="stat-box" style={{ '--color': '#06b6d4' }}>
            <span className="s-icon">⏰</span>
            <span className="s-num">{totalReminders}</span>
            <span className="s-label">Daily Reminders</span>
          </div>
          <div className="stat-box" style={{ '--color': '#10b981' }}>
            <span className="s-icon">✅</span>
            <span className="s-num">87%</span>
            <span className="s-label">Adherence Rate</span>
          </div>
          <div className="stat-box" style={{ '--color': '#f59e0b' }}>
            <span className="s-icon">🔥</span>
            <span className="s-num">7</span>
            <span className="s-label">Day Streak</span>
          </div>
          <div className="stat-box" style={{ '--color': '#a855f7' }}>
            <span className="s-icon">💧</span>
            <span className="s-num">1.8L</span>
            <span className="s-label">Avg Water</span>
          </div>
        </div>

        <div className="chart-section">
          <div className="chart-title">📊 Weekly Medicine Adherence</div>
          <div className="bar-chart">
            {DAYS_SHORT.map((day, i) => (
              <div key={i} className="bar-item">
                <div className="bar" style={{ height: `${MOCK_DATA[i]}%` }}></div>
                <div className="bar-label">{day}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="adherence-section">
          <div className="adherence-title">💊 Per Medicine Adherence</div>
          {medicines.length === 0 ? (
            <div style={{ color: '#334155', textAlign: 'center', padding: '30px' }}>
              Koi medicines nahi hain! <a href="/add" style={{ color: '#818cf8' }}>Add karo →</a>
            </div>
          ) : (
            medicines.map((med, i) => {
              const pct = Math.floor(Math.random() * 30 + 70);
              return (
                <div key={i} className="adherence-row">
                  <div className="adherence-name">💊 {med.name}</div>
                  <div className="adherence-bar-bg">
                    <div className="adherence-bar-fill" style={{ width: `${pct}%` }}></div>
                  </div>
                  <div className="adherence-pct">{pct}%</div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}

export default HealthStats;
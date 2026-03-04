import React, { useState, useEffect } from 'react';

const styles = `
  .water-wrap {
    min-height: calc(100vh - 68px);
    padding: 40px 28px;
    max-width: 900px;
    margin: 0 auto;
  }

  .water-header {
    text-align: center;
    margin-bottom: 40px;
    animation: fadeUp 0.5s ease;
  }

  .water-title {
    font-size: 2.5rem;
    font-weight: 900;
    color: var(--text-primary);
    margin-bottom: 8px;
  }

  .water-title span {
    background: linear-gradient(135deg, #06b6d4, #0891b2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .water-subtitle {
    color: var(--text-secondary);
    font-size: 1rem;
  }

  .progress-section {
    text-align: center;
    margin-bottom: 50px;
    animation: fadeUp 0.6s ease 0.2s both;
  }

  .circular-progress {
    position: relative;
    width: 250px;
    height: 250px;
    margin: 0 auto 30px;
  }

  .progress-ring {
    transform: rotate(-90deg);
  }

  .progress-ring-bg {
    fill: none;
    stroke: rgba(6,182,212,0.1);
    stroke-width: 20;
  }

  .progress-ring-fill {
    fill: none;
    stroke: url(#gradient);
    stroke-width: 20;
    stroke-linecap: round;
    transition: stroke-dashoffset 0.5s ease;
  }

  .progress-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }

  .progress-value {
    font-size: 3rem;
    font-weight: 900;
    background: linear-gradient(135deg, #06b6d4, #0891b2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .progress-label {
    font-size: 0.9rem;
    color: var(--text-tertiary);
    margin-top: 4px;
  }

  .goal-text {
    font-size: 1.1rem;
    color: var(--text-secondary);
    margin-bottom: 10px;
  }

  .percentage {
    font-size: 1.3rem;
    font-weight: 800;
    color: #06b6d4;
    margin-bottom: 10px;
  }

  .change-goal-btn {
    background: transparent;
    border: 1px solid var(--border-color);
    color: var(--text-secondary);
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 0.9rem;
    margin-top: 10px;
    transition: all 0.3s ease;
  }

  .change-goal-btn:hover {
    border-color: #06b6d4;
    color: #06b6d4;
  }

  .goal-edit {
    margin-top: 10px;
    display: flex;
    gap: 8px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .goal-edit input {
    width: 120px;
    padding: 8px;
    border: 1px solid var(--border-color);
    border-radius: 10px;
    background: var(--bg-secondary);
    color: var(--text-primary);
    text-align: center;
    font-size: 1rem;
  }

  .goal-edit button {
    padding: 8px 16px;
    border: none;
    border-radius: 10px;
    background: #06b6d4;
    color: white;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .goal-edit button:hover {
    background: #0891b2;
  }

  .goal-edit button:last-child {
    background: transparent;
    border: 1px solid var(--border-color);
    color: var(--text-secondary);
  }

  .goal-edit button:last-child:hover {
    background: rgba(255,255,255,0.05);
  }

  .quick-add {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-bottom: 40px;
    animation: fadeUp 0.7s ease 0.3s both;
  }

  .add-btn {
    padding: 18px;
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: center;
  }

  .add-btn:hover {
    background: rgba(6,182,212,0.1);
    border-color: rgba(6,182,212,0.3);
    transform: translateY(-4px);
  }

  .add-icon {
    font-size: 2rem;
    display: block;
    margin-bottom: 8px;
  }

  .add-amount {
    font-size: 1.2rem;
    font-weight: 800;
    color: var(--text-primary);
  }

  .add-label {
    font-size: 0.75rem;
    color: var(--text-tertiary);
    margin-top: 2px;
  }

  .log-section {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 20px;
    padding: 24px;
    animation: fadeUp 0.8s ease 0.4s both;
  }

  .log-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .log-title {
    font-size: 1.2rem;
    font-weight: 800;
    color: var(--text-primary);
  }

  .reset-btn {
    padding: 8px 16px;
    background: rgba(239,68,68,0.1);
    color: #ef4444;
    border: 1px solid rgba(239,68,68,0.3);
    border-radius: 10px;
    font-weight: 700;
    cursor: pointer;
    font-size: 0.85rem;
    transition: all 0.3s ease;
  }

  .reset-btn:hover {
    background: rgba(239,68,68,0.2);
  }

  .log-entry {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 16px;
    background: var(--bg-secondary);
    border-radius: 12px;
    margin-bottom: 10px;
  }

  .entry-time {
    color: var(--text-secondary);
    font-size: 0.85rem;
  }

  .entry-amount {
    font-size: 1.1rem;
    font-weight: 800;
    color: #06b6d4;
  }

  .empty-log {
    text-align: center;
    padding: 40px 20px;
    color: var(--text-tertiary);
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 768px) {
    .water-title { font-size: 2rem; }
    .quick-add { grid-template-columns: repeat(2, 1fr); }
    .circular-progress { width: 200px; height: 200px; }
    .progress-value { font-size: 2.5rem; }
  }
`;

function WaterTracker() {
  const [water, setWater] = useState(() => {
    const saved = localStorage.getItem('waterToday');
    return saved ? parseInt(saved) : 0;
  });
  const [log, setLog] = useState(() => {
    const saved = localStorage.getItem('waterLog');
    return saved ? JSON.parse(saved) : [];
  });
  const [goal, setGoal] = useState(() => {
    const saved = localStorage.getItem('waterGoal');
    return saved ? parseInt(saved) : 2500;
  });
  const [editingGoal, setEditingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState(goal);

  // Save water & log
  useEffect(() => {
    localStorage.setItem('waterToday', water);
    localStorage.setItem('waterLog', JSON.stringify(log));
  }, [water, log]);

  // Save goal
  useEffect(() => {
    localStorage.setItem('waterGoal', goal);
  }, [goal]);

  const addWater = (amount) => {
    setWater(prev => Math.min(prev + amount, goal + 1000));
    setLog(prev => [{
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      amount: amount
    }, ...prev].slice(0, 10));
  };

  const reset = () => {
    if (window.confirm('Reset today\'s water intake?')) {
      setWater(0);
      setLog([]);
      localStorage.removeItem('waterToday');
      localStorage.removeItem('waterLog');
    }
  };

  const handleGoalUpdate = () => {
    const parsed = parseInt(newGoal);
    if (!isNaN(parsed) && parsed >= 100) {
      setGoal(parsed);
      setEditingGoal(false);
    } else {
      alert('Please enter a valid goal (minimum 100ml)');
    }
  };

  const percentage = Math.min(Math.round((water / goal) * 100), 100);
  const circumference = 2 * Math.PI * 100;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <>
      <style>{styles}</style>
      <div className="water-wrap">
        <div className="water-header">
          <h1 className="water-title">Water <span>Tracker</span></h1>
          <p className="water-subtitle">Stay hydrated, stay healthy! 💧</p>
        </div>

        <div className="progress-section">
          <div className="circular-progress">
            <svg width="250" height="250">
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#0891b2" />
                </linearGradient>
              </defs>
              <circle className="progress-ring-bg" cx="125" cy="125" r="100" />
              <circle
                className="progress-ring-fill"
                cx="125"
                cy="125"
                r="100"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <div className="progress-text">
              <div className="progress-value">{water}</div>
              <div className="progress-label">ml</div>
            </div>
          </div>
          <div className="goal-text">Goal: {goal}ml per day</div>
          <div className="percentage">{percentage}% Complete</div>

          {!editingGoal ? (
            <button className="change-goal-btn" onClick={() => { setNewGoal(goal); setEditingGoal(true); }}>
              ✏️ Change Goal
            </button>
          ) : (
            <div className="goal-edit">
              <input
                type="number"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                min="100"
                step="50"
                autoFocus
              />
              <button onClick={handleGoalUpdate}>Save</button>
              <button onClick={() => setEditingGoal(false)}>Cancel</button>
            </div>
          )}
        </div>

        <div className="quick-add">
          {[150, 250, 350, 500].map(amount => (
            <button key={amount} className="add-btn" onClick={() => addWater(amount)}>
              <span className="add-icon">💧</span>
              <div className="add-amount">{amount}ml</div>
              <div className="add-label">Quick Add</div>
            </button>
          ))}
        </div>

        <div className="log-section">
          <div className="log-header">
            <h3 className="log-title">Today's Log</h3>
            <button className="reset-btn" onClick={reset}>🔄 Reset</button>
          </div>
          {log.length > 0 ? log.map((entry, i) => (
            <div key={i} className="log-entry">
              <span className="entry-time">{entry.time}</span>
              <span className="entry-amount">+{entry.amount}ml</span>
            </div>
          )) : (
            <div className="empty-log">
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>💧</div>
              <p>No water logged yet today</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default WaterTracker;
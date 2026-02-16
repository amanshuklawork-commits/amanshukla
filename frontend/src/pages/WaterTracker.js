import React, { useState } from 'react';

const styles = `
  .water-wrap {
    min-height: calc(100vh - 68px);
    padding: 36px 28px;
    max-width: 800px;
    margin: 0 auto;
    z-index: 1;
    position: relative;
  }

  .water-title {
    font-size: 2rem;
    font-weight: 900;
    color: #f1f5f9;
    letter-spacing: -1px;
    margin-bottom: 6px;
  }

  .water-title span {
    background: linear-gradient(135deg, #06b6d4, #6366f1);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .water-main {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 20px;
    animation: fadeUp 0.5s ease 0.1s both;
  }

  .water-circle {
    width: 220px; height: 220px;
    border-radius: 50%;
    background: rgba(6,182,212,0.05);
    border: 3px solid rgba(6,182,212,0.2);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 32px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 0 40px rgba(6,182,212,0.15);
  }

  .water-fill {
    position: absolute;
    bottom: 0; left: 0;
    width: 100%;
    background: linear-gradient(to top, rgba(6,182,212,0.3), rgba(6,182,212,0.1));
    transition: height 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    border-radius: 0 0 50% 50%;
  }

  .water-amount {
    font-size: 2.5rem;
    font-weight: 900;
    font-family: 'Space Mono', monospace;
    color: #22d3ee;
    position: relative;
    z-index: 1;
  }

  .water-goal {
    font-size: 0.85rem;
    color: #475569;
    position: relative;
    z-index: 1;
    margin-top: 4px;
  }

  .water-emoji {
    font-size: 2.5rem;
    margin-bottom: 8px;
    position: relative;
    z-index: 1;
  }

  .water-btns {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 32px;
  }

  .water-add-btn {
    padding: 12px 20px;
    border-radius: 14px;
    border: none;
    font-size: 0.9rem;
    font-weight: 700;
    font-family: 'Outfit', sans-serif;
    cursor: pointer;
    transition: all 0.3s ease;
    background: rgba(6,182,212,0.1);
    border: 1px solid rgba(6,182,212,0.2);
    color: #22d3ee;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .water-add-btn:hover {
    background: rgba(6,182,212,0.2);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(6,182,212,0.2);
  }

  .water-add-btn:active { transform: scale(0.97); }

  .water-reset {
    padding: 12px 20px;
    border-radius: 14px;
    border: 1px solid rgba(239,68,68,0.2);
    background: rgba(239,68,68,0.08);
    color: #ef4444;
    font-size: 0.9rem;
    font-weight: 700;
    font-family: 'Outfit', sans-serif;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .water-reset:hover {
    background: rgba(239,68,68,0.15);
    transform: translateY(-2px);
  }

  .water-log {
    width: 100%;
    animation: fadeUp 0.5s ease 0.2s both;
  }

  .log-title {
    font-size: 1rem;
    font-weight: 800;
    color: #f1f5f9;
    margin-bottom: 14px;
  }

  .log-items {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .log-item {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    animation: fadeUp 0.3s ease;
  }

  .log-item:hover { background: rgba(255,255,255,0.04); }

  .log-icon { font-size: 1.2rem; }
  .log-amount { font-family: 'Space Mono', monospace; font-size: 0.88rem; color: #22d3ee; font-weight: 700; }
  .log-time { font-size: 0.78rem; color: #334155; margin-left: auto; }

  .progress-bar-bg {
    width: 100%;
    background: rgba(6,182,212,0.1);
    border-radius: 999px;
    height: 8px;
    margin-bottom: 32px;
    overflow: hidden;
    border: 1px solid rgba(6,182,212,0.15);
  }

  .progress-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #06b6d4, #10b981);
    border-radius: 999px;
    transition: width 0.6s ease;
    box-shadow: 0 0 10px rgba(6,182,212,0.4);
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const GOAL = 2500;
const AMOUNTS = [150, 250, 350, 500];

function WaterTracker() {
  const [total, setTotal] = useState(0);
  const [log, setLog] = useState([]);

  const addWater = (amount) => {
    const newTotal = Math.min(total + amount, GOAL);
    setTotal(newTotal);
    setLog(prev => [{
      amount,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      icon: amount <= 150 ? '🥤' : amount <= 250 ? '🧃' : amount <= 350 ? '🍶' : '🚰'
    }, ...prev]);
  };

  const percent = Math.round((total / GOAL) * 100);

  return (
    <>
      <style>{styles}</style>
      <div className="water-wrap">
        <div style={{ marginBottom: '32px', animation: 'fadeUp 0.5s ease' }}>
          <div className="water-title">💧 Water <span>Tracker</span></div>
          <div style={{ color: '#475569', fontSize: '0.88rem' }}>Stay hydrated for better health</div>
        </div>

        <div className="water-main">
          <div className="water-circle">
            <div className="water-fill" style={{ height: `${percent}%` }}></div>
            <span className="water-emoji">💧</span>
            <div className="water-amount">{total}ml</div>
            <div className="water-goal">Goal: {GOAL}ml</div>
          </div>

          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${percent}%` }}></div>
          </div>

          <div className="water-btns">
            {AMOUNTS.map(a => (
              <button key={a} className="water-add-btn" onClick={() => addWater(a)}>
                💧 +{a}ml
              </button>
            ))}
            <button className="water-reset" onClick={() => { setTotal(0); setLog([]); }}>
              🔄 Reset
            </button>
          </div>

          <div className="water-log" style={{ width: '100%' }}>
            <div className="log-title">📋 Today's Log</div>
            <div className="log-items">
              {log.length === 0 ? (
                <div style={{ color: '#334155', textAlign: 'center', padding: '20px' }}>
                  Koi log nahi hai abhi! Pani piyo! 💧
                </div>
              ) : (
                log.map((item, i) => (
                  <div key={i} className="log-item">
                    <span className="log-icon">{item.icon}</span>
                    <span className="log-amount">+{item.amount}ml added</span>
                    <span className="log-time">{item.time}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default WaterTracker;
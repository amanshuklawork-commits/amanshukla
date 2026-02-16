import React, { useState, useEffect } from 'react';
import { getMedicines } from '../utils/api';

const styles = `
  .cal-wrap {
    min-height: calc(100vh - 68px);
    padding: 36px 28px;
    max-width: 1000px;
    margin: 0 auto;
    z-index: 1;
    position: relative;
  }

  .cal-header {
    margin-bottom: 32px;
    animation: fadeUp 0.5s ease;
  }

  .cal-title {
    font-size: 2rem;
    font-weight: 900;
    color: #f1f5f9;
    letter-spacing: -1px;
    margin-bottom: 6px;
  }

  .cal-title span {
    background: linear-gradient(135deg, #10b981, #06b6d4);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .cal-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    padding: 16px 20px;
    margin-bottom: 24px;
    animation: fadeUp 0.5s ease 0.1s both;
  }

  .cal-month {
    font-size: 1.2rem;
    font-weight: 800;
    color: #f1f5f9;
  }

  .cal-nav-btn {
    width: 36px; height: 36px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px;
    color: #94a3b8;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cal-nav-btn:hover {
    background: rgba(16,185,129,0.1);
    border-color: rgba(16,185,129,0.3);
    color: #10b981;
  }

  .cal-grid-header {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
    margin-bottom: 8px;
  }

  .cal-day-label {
    text-align: center;
    font-size: 0.72rem;
    font-weight: 700;
    color: #334155;
    text-transform: uppercase;
    letter-spacing: 1px;
    padding: 8px;
  }

  .cal-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
    margin-bottom: 32px;
    animation: fadeUp 0.5s ease 0.15s both;
  }

  .cal-cell {
    aspect-ratio: 1;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    background: rgba(255,255,255,0.02);
    border: 1px solid transparent;
    padding: 4px;
  }

  .cal-cell:hover {
    background: rgba(255,255,255,0.05);
    border-color: rgba(255,255,255,0.1);
  }

  .cal-cell.today {
    background: rgba(16,185,129,0.1);
    border-color: rgba(16,185,129,0.3);
  }

  .cal-cell.selected {
    background: rgba(99,102,241,0.15);
    border-color: rgba(99,102,241,0.4);
  }

  .cal-cell.has-medicine::after {
    content: '';
    width: 5px; height: 5px;
    background: #6366f1;
    border-radius: 50%;
    position: absolute;
    bottom: 4px;
    box-shadow: 0 0 6px #6366f1;
  }

  .cal-cell.empty { background: transparent; border-color: transparent; cursor: default; }

  .cal-date {
    font-size: 0.85rem;
    font-weight: 600;
    color: #94a3b8;
  }

  .cal-cell.today .cal-date { color: #10b981; font-weight: 800; }
  .cal-cell.selected .cal-date { color: #818cf8; font-weight: 800; }

  .schedule-section {
    animation: fadeUp 0.5s ease 0.2s both;
  }

  .schedule-title {
    font-size: 1.1rem;
    font-weight: 800;
    color: #f1f5f9;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .schedule-grid {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .schedule-item {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px;
    padding: 16px 18px;
    display: flex;
    align-items: center;
    gap: 16px;
    transition: all 0.3s ease;
  }

  .schedule-item:hover {
    background: rgba(255,255,255,0.04);
    border-color: rgba(99,102,241,0.2);
    transform: translateX(4px);
  }

  .schedule-time {
    font-family: 'Space Mono', monospace;
    font-size: 0.9rem;
    font-weight: 700;
    color: #818cf8;
    min-width: 60px;
  }

  .schedule-dot {
    width: 10px; height: 10px;
    border-radius: 50%;
    background: linear-gradient(135deg, #6366f1, #06b6d4);
    flex-shrink: 0;
    box-shadow: 0 0 8px rgba(99,102,241,0.5);
  }

  .schedule-name {
    font-size: 0.92rem;
    font-weight: 700;
    color: #f1f5f9;
  }

  .schedule-dose {
    font-size: 0.78rem;
    color: #475569;
    margin-top: 2px;
  }

  .taken-btn {
    margin-left: auto;
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 700;
    font-family: 'Outfit', sans-serif;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
  }

  .taken-btn.not-taken {
    background: rgba(99,102,241,0.1);
    color: #818cf8;
    border: 1px solid rgba(99,102,241,0.2);
  }

  .taken-btn.taken {
    background: rgba(16,185,129,0.15);
    color: #10b981;
    border: 1px solid rgba(16,185,129,0.2);
  }

  .taken-btn:hover { transform: scale(1.05); }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function Calendar() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [medicines, setMedicines] = useState([]);
  const [taken, setTaken] = useState({});

  useEffect(() => {
    getMedicines().then(res => setMedicines(res.data)).catch(() => {});
  }, []);

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDay = (month, year) => new Date(year, month, 1).getDay();

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  const toggleTaken = (key) => {
    setTaken(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDay(currentMonth, currentYear);
  const cells = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  const allTimes = medicines.flatMap(med =>
    (Array.isArray(med.time) ? med.time : [med.time]).map(t => ({
      time: t, name: med.name, dosage: med.dosage, id: med._id
    }))
  ).sort((a, b) => a.time?.localeCompare(b.time));

  return (
    <>
      <style>{styles}</style>
      <div className="cal-wrap">
        <div className="cal-header">
          <div className="cal-title">📅 Medicine <span>Calendar</span></div>
          <div style={{ color: '#475569', fontSize: '0.88rem' }}>Track your medication schedule</div>
        </div>

        <div className="cal-nav">
          <button className="cal-nav-btn" onClick={prevMonth}>←</button>
          <div className="cal-month">{MONTHS[currentMonth]} {currentYear}</div>
          <button className="cal-nav-btn" onClick={nextMonth}>→</button>
        </div>

        <div className="cal-grid-header">
          {DAYS.map(d => <div key={d} className="cal-day-label">{d}</div>)}
        </div>

        <div className="cal-grid">
          {cells.map((day, i) => (
            <div
              key={i}
              className={`cal-cell ${!day ? 'empty' : ''} ${day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear() ? 'today' : ''} ${day === selectedDay ? 'selected' : ''} ${day && medicines.length > 0 ? 'has-medicine' : ''}`}
              onClick={() => day && setSelectedDay(day)}
            >
              {day && <span className="cal-date">{day}</span>}
            </div>
          ))}
        </div>

        <div className="schedule-section">
          <div className="schedule-title">
            💊 Schedule for {selectedDay} {MONTHS[currentMonth]}
          </div>
          <div className="schedule-grid">
            {allTimes.length === 0 ? (
              <div style={{ color: '#475569', textAlign: 'center', padding: '40px' }}>
                No medicines added yet! <a href="/add" style={{ color: '#818cf8' }}>Add medicine →</a>
              </div>
            ) : (
              allTimes.map((item, i) => {
                const key = `${selectedDay}-${item.id}-${i}`;
                return (
                  <div key={i} className="schedule-item">
                    <div className="schedule-time">{item.time}</div>
                    <div className="schedule-dot"></div>
                    <div>
                      <div className="schedule-name">{item.name}</div>
                      <div className="schedule-dose">{item.dosage}</div>
                    </div>
                    <button
                      className={`taken-btn ${taken[key] ? 'taken' : 'not-taken'}`}
                      onClick={() => toggleTaken(key)}
                    >
                      {taken[key] ? '✅ Taken' : 'Mark Taken'}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Calendar;
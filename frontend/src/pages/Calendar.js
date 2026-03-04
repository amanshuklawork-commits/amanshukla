import React, { useState, useEffect } from 'react';

const styles = `
  .calendar-wrap {
    min-height: calc(100vh - 68px);
    padding: 40px 28px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .calendar-header {
    margin-bottom: 30px;
    animation: fadeUp 0.5s ease;
  }

  .calendar-title {
    font-size: 2.5rem;
    font-weight: 900;
    color: var(--text-primary);
    margin-bottom: 8px;
  }

  .calendar-title span {
    background: linear-gradient(135deg, #f59e0b, #d97706);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .calendar-subtitle {
    color: var(--text-secondary);
    font-size: 1rem;
  }

  .month-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    animation: fadeUp 0.6s ease 0.2s both;
  }

  .month-year {
    font-size: 1.8rem;
    font-weight: 800;
    color: var(--text-primary);
  }

  .nav-buttons {
    display: flex;
    gap: 12px;
  }

  .nav-btn {
    padding: 10px 18px;
    border: 1px solid var(--border-color);
    background: var(--card-bg);
    border-radius: 30px;
    cursor: pointer;
    font-weight: 600;
    color: var(--text-secondary);
    transition: all 0.3s ease;
  }

  .nav-btn:hover {
    background: var(--card-hover-bg);
    border-color: #f59e0b;
    color: #f59e0b;
  }

  .weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    text-align: center;
    font-weight: 700;
    color: var(--text-tertiary);
    margin-bottom: 8px;
    animation: fadeUp 0.7s ease 0.3s both;
  }

  .weekday {
    padding: 12px;
    font-size: 0.9rem;
    text-transform: uppercase;
  }

  .days-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 8px;
    margin-bottom: 40px;
    animation: fadeUp 0.8s ease 0.4s both;
  }

  .day-cell {
    aspect-ratio: 1;
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 14px;
    padding: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .day-cell:hover {
    border-color: #f59e0b;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(245, 158, 11, 0.15);
  }

  .day-cell.empty {
    background: transparent;
    border-color: transparent;
    cursor: default;
    box-shadow: none;
  }

  .day-cell.empty:hover {
    transform: none;
    border-color: transparent;
  }

  .day-number {
    font-size: 1rem;
    font-weight: 700;
    color: var(--text-secondary);
    margin-bottom: 4px;
  }

  .med-indicator {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: auto;
  }

  .med-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #f59e0b;
  }

  .med-count {
    font-size: 0.7rem;
    color: #f59e0b;
    font-weight: 600;
  }

  .selected-day-panel {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 24px;
    padding: 24px;
    margin-bottom: 40px;
    animation: fadeUp 0.9s ease 0.5s both;
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .selected-date {
    font-size: 1.4rem;
    font-weight: 800;
    color: var(--text-primary);
  }

  .add-med-btn {
    padding: 12px 20px;
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: white;
    border: none;
    border-radius: 30px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .add-med-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 20px rgba(245, 158, 11, 0.4);
  }

  .add-med-form {
    background: var(--bg-secondary);
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 24px;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr auto;
    gap: 12px;
    margin-bottom: 12px;
  }

  .form-input {
    padding: 12px 16px;
    background: var(--input-bg);
    border: 1px solid var(--input-border);
    border-radius: 12px;
    color: var(--text-primary);
    font-size: 0.95rem;
    font-family: 'Outfit', sans-serif;
    outline: none;
    transition: all 0.3s ease;
  }

  .form-input:focus {
    border-color: #f59e0b;
    background: rgba(245, 158, 11, 0.05);
  }

  .form-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
  }

  .save-btn {
    padding: 12px 24px;
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: white;
    border: none;
    border-radius: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .save-btn:hover {
    transform: scale(1.05);
  }

  .cancel-btn {
    padding: 12px 24px;
    background: transparent;
    border: 1px solid var(--border-color);
    border-radius: 12px;
    color: var(--text-secondary);
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .cancel-btn:hover {
    background: rgba(255,255,255,0.05);
  }

  .meds-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .med-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    background: var(--bg-secondary);
    border-radius: 16px;
    transition: all 0.3s ease;
  }

  .med-item:hover {
    background: rgba(245, 158, 11, 0.05);
  }

  .med-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .med-name {
    font-size: 1.1rem;
    font-weight: 800;
    color: var(--text-primary);
  }

  .med-details {
    display: flex;
    gap: 16px;
    color: var(--text-tertiary);
    font-size: 0.9rem;
  }

  .med-details span {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .med-actions {
    display: flex;
    gap: 8px;
  }

  .icon-btn {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .edit-btn {
    background: rgba(245, 158, 11, 0.1);
    color: #f59e0b;
  }

  .edit-btn:hover {
    background: rgba(245, 158, 11, 0.2);
  }

  .delete-btn {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
  }

  .delete-btn:hover {
    background: rgba(239, 68, 68, 0.2);
  }

  .search-section {
    margin-top: 20px;
    animation: fadeUp 1s ease 0.6s both;
  }

  .search-box {
    display: flex;
    align-items: center;
    gap: 12px;
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 50px;
    padding: 8px 20px;
  }

  .search-icon {
    font-size: 1.2rem;
    color: var(--text-tertiary);
  }

  .search-input {
    flex: 1;
    padding: 12px 0;
    background: transparent;
    border: none;
    color: var(--text-primary);
    font-size: 1rem;
    outline: none;
  }

  .search-input::placeholder {
    color: var(--text-tertiary);
  }

  .search-results {
    margin-top: 20px;
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 20px;
    padding: 20px;
  }

  .result-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    border-bottom: 1px solid var(--border-color);
  }

  .result-item:last-child {
    border-bottom: none;
  }

  .result-date {
    font-weight: 600;
    color: #f59e0b;
  }

  .no-results {
    text-align: center;
    padding: 30px;
    color: var(--text-tertiary);
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 768px) {
    .calendar-title { font-size: 2rem; }
    .form-row { grid-template-columns: 1fr; }
    .month-year { font-size: 1.4rem; }
  }
`;

// Helper functions
const getMonthDays = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startOffset = firstDay.getDay(); // 0 = Sunday

  const days = [];
  // Previous month filler
  for (let i = 0; i < startOffset; i++) {
    days.push(null);
  }
  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(d);
  }
  return days;
};

const formatDateKey = (year, month, day) => {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function MedicineCalendar() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(null); // { year, month, day }
  const [medications, setMedications] = useState(() => {
    const saved = localStorage.getItem('medicineCalendar');
    return saved ? JSON.parse(saved) : {};
  });
  const [newMed, setNewMed] = useState({ name: '', dosage: '', time: '' });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    localStorage.setItem('medicineCalendar', JSON.stringify(medications));
  }, [medications]);

  const days = getMonthDays(year, month);

  const prevMonth = () => {
    if (month === 0) {
      setYear(year - 1);
      setMonth(11);
    } else {
      setMonth(month - 1);
    }
    setSelectedDate(null);
  };

  const nextMonth = () => {
    if (month === 11) {
      setYear(year + 1);
      setMonth(0);
    } else {
      setMonth(month + 1);
    }
    setSelectedDate(null);
  };

  const handleDayClick = (day) => {
    if (day) {
      setSelectedDate({ year, month, day });
      setNewMed({ name: '', dosage: '', time: '' });
      setEditingId(null);
    }
  };

  const getSelectedDateKey = () => {
    if (!selectedDate) return null;
    return formatDateKey(selectedDate.year, selectedDate.month, selectedDate.day);
  };

  const selectedDateKey = getSelectedDateKey();
  const selectedMeds = selectedDateKey ? medications[selectedDateKey] || [] : [];

  const addOrUpdateMed = () => {
    if (!newMed.name || !newMed.time) return;
    if (!selectedDateKey) return;

    const updatedMeds = [...selectedMeds];
    if (editingId !== null) {
      updatedMeds[editingId] = { ...newMed, id: selectedMeds[editingId].id };
    } else {
      updatedMeds.push({ ...newMed, id: Date.now() });
    }

    setMedications({
      ...medications,
      [selectedDateKey]: updatedMeds
    });

    setNewMed({ name: '', dosage: '', time: '' });
    setEditingId(null);
  };

  const deleteMed = (index) => {
    if (!selectedDateKey) return;
    const updatedMeds = selectedMeds.filter((_, i) => i !== index);
    const newMeds = { ...medications };
    if (updatedMeds.length === 0) {
      delete newMeds[selectedDateKey];
    } else {
      newMeds[selectedDateKey] = updatedMeds;
    }
    setMedications(newMeds);
  };

  const startEdit = (index) => {
    const med = selectedMeds[index];
    setNewMed({ name: med.name, dosage: med.dosage || '', time: med.time });
    setEditingId(index);
  };

  const cancelEdit = () => {
    setNewMed({ name: '', dosage: '', time: '' });
    setEditingId(null);
  };

  // Search across all medications
  const searchResults = searchTerm.trim()
    ? Object.entries(medications).flatMap(([date, meds]) =>
        meds
          .filter(med => med.name.toLowerCase().includes(searchTerm.toLowerCase()))
          .map(med => ({ ...med, date }))
      )
    : [];

  return (
    <>
      <style>{styles}</style>
      <div className="calendar-wrap">
        <div className="calendar-header">
          <h1 className="calendar-title">Medicine <span>Calendar</span></h1>
          <p className="calendar-subtitle">Track medications just like Google Calendar 💊</p>
        </div>

        {/* Month navigation */}
        <div className="month-nav">
          <div className="month-year">{monthNames[month]} {year}</div>
          <div className="nav-buttons">
            <button className="nav-btn" onClick={prevMonth}>← Prev</button>
            <button className="nav-btn" onClick={nextMonth}>Next →</button>
          </div>
        </div>

        {/* Weekday headers */}
        <div className="weekdays">
          {weekdays.map(day => <div key={day} className="weekday">{day}</div>)}
        </div>

        {/* Days grid */}
        <div className="days-grid">
          {days.map((day, index) => (
            <div
              key={index}
              className={`day-cell ${day === null ? 'empty' : ''}`}
              onClick={() => handleDayClick(day)}
            >
              {day && (
                <>
                  <span className="day-number">{day}</span>
                  {selectedDateKey === formatDateKey(year, month, day) && (
                    <div className="med-indicator">
                      <span className="med-count">selected</span>
                    </div>
                  )}
                  {medications[formatDateKey(year, month, day)]?.length > 0 && (
                    <div className="med-indicator">
                      {medications[formatDateKey(year, month, day)].slice(0, 3).map((_, i) => (
                        <div key={i} className="med-dot" />
                      ))}
                      {medications[formatDateKey(year, month, day)].length > 3 && (
                        <span className="med-count">+{medications[formatDateKey(year, month, day)].length - 3}</span>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        {/* Selected day panel */}
        {selectedDate && (
          <div className="selected-day-panel">
            <div className="panel-header">
              <div className="selected-date">
                {monthNames[selectedDate.month]} {selectedDate.day}, {selectedDate.year}
              </div>
              <button className="add-med-btn" onClick={() => { setNewMed({ name: '', dosage: '', time: '' }); setEditingId(null); }}>
                ➕ Add Medicine
              </button>
            </div>

            {/* Add/Edit form */}
            {(newMed.name || newMed.time || editingId !== null) && (
              <div className="add-med-form">
                <div className="form-row">
                  <input
                    className="form-input"
                    placeholder="Medicine name *"
                    value={newMed.name}
                    onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                  />
                  <input
                    className="form-input"
                    placeholder="Dosage (e.g. 500mg)"
                    value={newMed.dosage}
                    onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                  />
                  <input
                    className="form-input"
                    type="time"
                    value={newMed.time}
                    onChange={(e) => setNewMed({ ...newMed, time: e.target.value })}
                  />
                </div>
                <div className="form-actions">
                  <button className="save-btn" onClick={addOrUpdateMed}>
                    {editingId !== null ? 'Update' : 'Save'}
                  </button>
                  <button className="cancel-btn" onClick={cancelEdit}>Cancel</button>
                </div>
              </div>
            )}

            {/* Medicines list */}
            <div className="meds-list">
              {selectedMeds.length === 0 ? (
                <div className="empty-state" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-tertiary)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '10px' }}>💊</div>
                  <p>No medicines scheduled for this day.</p>
                </div>
              ) : (
                selectedMeds.map((med, idx) => (
                  <div key={med.id || idx} className="med-item">
                    <div className="med-info">
                      <div className="med-name">{med.name}</div>
                      <div className="med-details">
                        {med.dosage && <span>💊 {med.dosage}</span>}
                        <span>⏰ {med.time}</span>
                      </div>
                    </div>
                    <div className="med-actions">
                      <button className="icon-btn edit-btn" onClick={() => startEdit(idx)}>✏️</button>
                      <button className="icon-btn delete-btn" onClick={() => deleteMed(idx)}>🗑️</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Search */}
        <div className="search-section">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              className="search-input"
              placeholder="Search medicines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {searchTerm && (
            <div className="search-results">
              {searchResults.length === 0 ? (
                <div className="no-results">No medicines found</div>
              ) : (
                searchResults.map((med, idx) => (
                  <div key={idx} className="result-item">
                    <div>
                      <strong>{med.name}</strong> {med.dosage && `(${med.dosage})`} at {med.time}
                    </div>
                    <div className="result-date">{med.date}</div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default MedicineCalendar;
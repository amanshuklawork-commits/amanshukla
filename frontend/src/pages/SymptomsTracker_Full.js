import React, { useState, useEffect } from 'react';

const styles = `
  .symptoms-wrap {
    min-height: calc(100vh - 68px);
    padding: 40px 28px;
    max-width: 1000px;
    margin: 0 auto;
  }

  .symp-header {
    margin-bottom: 40px;
    animation: fadeUp 0.5s ease;
  }

  .symp-title {
    font-size: 2.5rem;
    font-weight: 900;
    color: var(--text-primary);
    margin-bottom: 8px;
  }

  .symp-title span {
    background: linear-gradient(135deg, #8b5cf6, #a855f7);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .symp-subtitle {
    color: var(--text-secondary);
    font-size: 1rem;
  }

  .add-symptom {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 20px;
    padding: 28px;
    margin-bottom: 40px;
    animation: fadeUp 0.6s ease 0.2s both;
  }

  .section-title {
    font-size: 1.2rem;
    font-weight: 800;
    color: var(--text-primary);
    margin-bottom: 20px;
  }

  .symptom-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 24px;
  }

  .chip {
    padding: 10px 18px;
    border-radius: 999px;
    border: 1px solid var(--border-color);
    background: var(--card-bg);
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-secondary);
  }

  .chip:hover {
    border-color: rgba(139,92,246,0.3);
    background: rgba(139,92,246,0.1);
  }

  .chip.selected {
    background: linear-gradient(135deg, #8b5cf6, #a855f7);
    color: white;
    border-color: transparent;
  }

  .severity-section {
    margin-bottom: 24px;
  }

  .severity-label {
    font-size: 0.85rem;
    color: var(--text-tertiary);
    margin-bottom: 12px;
    font-weight: 600;
  }

  .severity-options {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  .severity-btn {
    padding: 16px;
    border-radius: 14px;
    border: 2px solid var(--border-color);
    background: var(--card-bg);
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: center;
    font-weight: 700;
  }

  .severity-btn.mild {
    border-color: rgba(34,197,94,0.3);
    color: #22c55e;
  }

  .severity-btn.mild.selected {
    background: rgba(34,197,94,0.1);
    border-color: #22c55e;
  }

  .severity-btn.moderate {
    border-color: rgba(251,146,60,0.3);
    color: #fb923c;
  }

  .severity-btn.moderate.selected {
    background: rgba(251,146,60,0.1);
    border-color: #fb923c;
  }

  .severity-btn.severe {
    border-color: rgba(239,68,68,0.3);
    color: #ef4444;
  }

  .severity-btn.severe.selected {
    background: rgba(239,68,68,0.1);
    border-color: #ef4444;
  }

  .notes-input {
    width: 100%;
    padding: 14px 18px;
    background: var(--input-bg);
    border: 1px solid var(--input-border);
    border-radius: 14px;
    color: var(--text-primary);
    font-size: 0.95rem;
    font-family: 'Outfit', sans-serif;
    margin-bottom: 20px;
    resize: vertical;
    min-height: 80px;
    outline: none;
    transition: all 0.3s ease;
  }

  .notes-input:focus {
    border-color: rgba(139,92,246,0.5);
    background: rgba(139,92,246,0.05);
  }

  .log-btn {
    width: 100%;
    padding: 16px;
    background: linear-gradient(135deg, #8b5cf6, #a855f7);
    color: white;
    border: none;
    border-radius: 14px;
    font-weight: 800;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.3s ease;
  }

  .log-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(139,92,246,0.4);
  }

  .log-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .history {
    animation: fadeUp 0.7s ease 0.3s both;
  }

  .history-title {
    font-size: 1.4rem;
    font-weight: 800;
    color: var(--text-primary);
    margin-bottom: 24px;
  }

  .entry {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 16px;
    transition: all 0.3s ease;
  }

  .entry:hover {
    background: var(--card-hover-bg);
    transform: translateX(4px);
  }

  .entry-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .entry-symptom {
    font-size: 1.1rem;
    font-weight: 800;
    color: var(--text-primary);
  }

  .entry-time {
    font-size: 0.8rem;
    color: var(--text-tertiary);
  }

  .entry-severity {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .severity-mild {
    background: rgba(34,197,94,0.1);
    color: #22c55e;
  }

  .severity-moderate {
    background: rgba(251,146,60,0.1);
    color: #fb923c;
  }

  .severity-severe {
    background: rgba(239,68,68,0.1);
    color: #ef4444;
  }

  .entry-notes {
    color: var(--text-secondary);
    font-size: 0.9rem;
    line-height: 1.5;
  }

  .empty-state {
    text-align: center;
    padding: 60px 20px;
    color: var(--text-tertiary);
  }

  .empty-icon {
    font-size: 4rem;
    margin-bottom: 16px;
    opacity: 0.5;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 768px) {
    .symp-title { font-size: 2rem; }
    .severity-options { grid-template-columns: 1fr; }
  }
`;

const SYMPTOMS = [
  '🤒 Fever', '🤕 Headache', '😷 Cough', '🤧 Cold',
  '🤢 Nausea', '😫 Fatigue', '💪 Body Pain', '😵 Dizziness',
  '😣 Sore Throat', '🫁 Chest Pain'
];

function SymptomsTracker() {
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const [severity, setSeverity] = useState('');
  const [notes, setNotes] = useState('');
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('symptomsHistory');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('symptomsHistory', JSON.stringify(history));
  }, [history]);

  const logSymptom = () => {
    if (!selectedSymptom || !severity) return;

    const entry = {
      symptom: selectedSymptom,
      severity: severity,
      notes: notes,
      time: new Date().toLocaleString()
    };

    setHistory([entry, ...history]);
    setSelectedSymptom('');
    setSeverity('');
    setNotes('');
  };

  return (
    <>
      <style>{styles}</style>
      <div className="symptoms-wrap">
        <div className="symp-header">
          <h1 className="symp-title">Symptoms <span>Tracker</span></h1>
          <p className="symp-subtitle">Log your symptoms to track patterns 🩺</p>
        </div>

        <div className="add-symptom">
          <h3 className="section-title">What are you experiencing?</h3>
          <div className="symptom-chips">
            {SYMPTOMS.map(s => (
              <button
                key={s}
                className={`chip ${selectedSymptom === s ? 'selected' : ''}`}
                onClick={() => setSelectedSymptom(s)}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="severity-section">
            <div className="severity-label">How severe is it?</div>
            <div className="severity-options">
              {['Mild', 'Moderate', 'Severe'].map(s => (
                <button
                  key={s}
                  className={`severity-btn ${s.toLowerCase()} ${severity === s ? 'selected' : ''}`}
                  onClick={() => setSeverity(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <textarea
            className="notes-input"
            placeholder="Additional notes (optional)..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <button
            className="log-btn"
            onClick={logSymptom}
            disabled={!selectedSymptom || !severity}
          >
            📝 Log Symptom
          </button>
        </div>

        <div className="history">
          <h3 className="history-title">History</h3>
          {history.length > 0 ? history.map((entry, i) => (
            <div key={i} className="entry">
              <div className="entry-header">
                <span className="entry-symptom">{entry.symptom}</span>
                <span className="entry-time">{entry.time}</span>
              </div>
              <span className={`entry-severity severity-${entry.severity.toLowerCase()}`}>
                {entry.severity}
              </span>
              {entry.notes && <p className="entry-notes">{entry.notes}</p>}
            </div>
          )) : (
            <div className="empty-state">
              <div className="empty-icon">🩺</div>
              <p>No symptoms logged yet</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default SymptomsTracker;
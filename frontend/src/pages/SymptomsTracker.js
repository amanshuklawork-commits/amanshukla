import React, { useState } from 'react';

const styles = `
  .symptoms-wrap {
    min-height: calc(100vh - 68px);
    padding: 36px 28px;
    max-width: 900px;
    margin: 0 auto;
    z-index: 1;
    position: relative;
  }

  .symptoms-title {
    font-size: 2rem;
    font-weight: 900;
    color: #f1f5f9;
    letter-spacing: -1px;
    margin-bottom: 6px;
  }

  .symptoms-title span {
    background: linear-gradient(135deg, #ec4899, #a855f7);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .symptom-selector {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px;
    padding: 24px;
    margin-bottom: 24px;
    animation: fadeUp 0.5s ease 0.1s both;
  }

  .selector-title {
    font-size: 0.85rem;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-bottom: 16px;
  }

  .symptom-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 20px;
  }

  .symptom-chip {
    padding: 8px 16px;
    border-radius: 999px;
    font-size: 0.82rem;
    font-weight: 600;
    font-family: 'Outfit', sans-serif;
    cursor: pointer;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.03);
    color: #64748b;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .symptom-chip:hover {
    background: rgba(168,85,247,0.1);
    border-color: rgba(168,85,247,0.3);
    color: #c084fc;
    transform: translateY(-1px);
  }

  .symptom-chip.selected {
    background: rgba(168,85,247,0.15);
    border-color: rgba(168,85,247,0.4);
    color: #c084fc;
  }

  .severity-row {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
  }

  .severity-label {
    font-size: 0.82rem;
    color: #64748b;
    min-width: 80px;
    font-weight: 600;
  }

  .severity-btns {
    display: flex;
    gap: 8px;
  }

  .severity-btn {
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 0.78rem;
    font-weight: 700;
    font-family: 'Outfit', sans-serif;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
  }

  .severity-btn.mild { background: rgba(16,185,129,0.1); color: #10b981; border: 1px solid rgba(16,185,129,0.2); }
  .severity-btn.moderate { background: rgba(245,158,11,0.1); color: #f59e0b; border: 1px solid rgba(245,158,11,0.2); }
  .severity-btn.severe { background: rgba(239,68,68,0.1); color: #ef4444; border: 1px solid rgba(239,68,68,0.2); }

  .severity-btn.active.mild { background: rgba(16,185,129,0.25); border-color: rgba(16,185,129,0.5); }
  .severity-btn.active.moderate { background: rgba(245,158,11,0.25); border-color: rgba(245,158,11,0.5); }
  .severity-btn.active.severe { background: rgba(239,68,68,0.25); border-color: rgba(239,68,68,0.5); }

  .note-input {
    width: 100%;
    padding: 12px 16px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    color: #f1f5f9;
    font-size: 0.85rem;
    font-family: 'Outfit', sans-serif;
    outline: none;
    resize: none;
    margin-bottom: 16px;
    transition: all 0.2s ease;
  }

  .note-input:focus { border-color: rgba(168,85,247,0.4); }
  .note-input::placeholder { color: #334155; }

  .btn-log-symptom {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, #ec4899, #a855f7);
    border: none;
    border-radius: 12px;
    color: white;
    font-size: 0.95rem;
    font-weight: 700;
    font-family: 'Outfit', sans-serif;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 0 24px rgba(168,85,247,0.3);
  }

  .btn-log-symptom:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 40px rgba(168,85,247,0.5);
  }

  .btn-log-symptom:active { transform: scale(0.97); }

  .symptoms-log {
    animation: fadeUp 0.5s ease 0.2s both;
  }

  .log-header {
    font-size: 1.1rem;
    font-weight: 800;
    color: #f1f5f9;
    margin-bottom: 16px;
  }

  .symptom-log-item {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    padding: 18px;
    margin-bottom: 10px;
    transition: all 0.3s ease;
    animation: fadeUp 0.3s ease;
  }

  .symptom-log-item:hover {
    background: rgba(255,255,255,0.04);
    border-color: rgba(168,85,247,0.2);
  }

  .log-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .log-symptoms-list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .log-symptom-tag {
    font-size: 0.75rem;
    padding: 3px 10px;
    border-radius: 999px;
    background: rgba(168,85,247,0.1);
    border: 1px solid rgba(168,85,247,0.2);
    color: #c084fc;
  }

  .log-severity-badge {
    font-size: 0.72rem;
    padding: 3px 10px;
    border-radius: 999px;
    font-weight: 700;
  }

  .log-note {
    font-size: 0.8rem;
    color: #475569;
    margin-top: 8px;
    font-style: italic;
  }

  .log-time-stamp {
    font-size: 0.72rem;
    color: #334155;
    font-family: 'Space Mono', monospace;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const COMMON_SYMPTOMS = [
  { label: 'Headache', icon: '🤕' },
  { label: 'Fever', icon: '🌡️' },
  { label: 'Cough', icon: '😷' },
  { label: 'Fatigue', icon: '😴' },
  { label: 'Nausea', icon: '🤢' },
  { label: 'Body Pain', icon: '💪' },
  { label: 'Cold', icon: '🤧' },
  { label: 'Dizziness', icon: '😵' },
  { label: 'Chest Pain', icon: '💔' },
  { label: 'Shortness of Breath', icon: '😮‍💨' },
  { label: 'Stomach Pain', icon: '🤰' },
  { label: 'Vomiting', icon: '🤮' },
];

function SymptomsTracker() {
  const [selected, setSelected] = useState([]);
  const [severity, setSeverity] = useState('mild');
  const [note, setNote] = useState('');
  const [logs, setLogs] = useState([]);

  const toggleSymptom = (s) => {
    setSelected(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );
  };

  const logSymptom = () => {
    if (selected.length === 0) return;
    setLogs(prev => [{
      symptoms: selected,
      severity,
      note,
      time: new Date().toLocaleString()
    }, ...prev]);
    setSelected([]);
    setNote('');
  };

  const severityColor = { mild: '#10b981', moderate: '#f59e0b', severe: '#ef4444' };

  return (
    <>
      <style>{styles}</style>
      <div className="symptoms-wrap">
        <div style={{ marginBottom: '28px', animation: 'fadeUp 0.5s ease' }}>
          <div className="symptoms-title">🌡️ Symptoms <span>Tracker</span></div>
          <div style={{ color: '#475569', fontSize: '0.88rem' }}>Log and monitor your symptoms</div>
        </div>

        <div className="symptom-selector">
          <div className="selector-title">Select Symptoms</div>
          <div className="symptom-chips">
            {COMMON_SYMPTOMS.map((s, i) => (
              <button
                key={i}
                className={`symptom-chip ${selected.includes(s.label) ? 'selected' : ''}`}
                onClick={() => toggleSymptom(s.label)}
              >
                {s.icon} {s.label}
              </button>
            ))}
          </div>

          <div className="severity-row">
            <span className="severity-label">Severity:</span>
            <div className="severity-btns">
              {['mild', 'moderate', 'severe'].map(s => (
                <button
                  key={s}
                  className={`severity-btn ${s} ${severity === s ? 'active' : ''}`}
                  onClick={() => setSeverity(s)}
                >
                  {s === 'mild' ? '😊 Mild' : s === 'moderate' ? '😐 Moderate' : '😰 Severe'}
                </button>
              ))}
            </div>
          </div>

          <textarea
            className="note-input"
            rows="3"
            placeholder="Additional notes (optional)..."
            value={note}
            onChange={e => setNote(e.target.value)}
          />

          <button className="btn-log-symptom" onClick={logSymptom}>
            📝 Log Symptoms
          </button>
        </div>

        <div className="symptoms-log">
          <div className="log-header">📊 Symptom History</div>
          {logs.length === 0 ? (
            <div style={{ color: '#334155', textAlign: 'center', padding: '40px' }}>
              Koi symptoms log nahi hue abhi!
            </div>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="symptom-log-item">
                <div className="log-top">
                  <div className="log-symptoms-list">
                    {log.symptoms.map((s, j) => (
                      <span key={j} className="log-symptom-tag">{s}</span>
                    ))}
                  </div>
                  <span className="log-severity-badge" style={{
                    background: `rgba(${log.severity === 'mild' ? '16,185,129' : log.severity === 'moderate' ? '245,158,11' : '239,68,68'},0.1)`,
                    color: severityColor[log.severity],
                    border: `1px solid rgba(${log.severity === 'mild' ? '16,185,129' : log.severity === 'moderate' ? '245,158,11' : '239,68,68'},0.3)`
                  }}>
                    {log.severity}
                  </span>
                </div>
                {log.note && <div className="log-note">"{log.note}"</div>}
                <div className="log-time-stamp">{log.time}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default SymptomsTracker;
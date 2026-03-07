import React, { useState } from 'react';

const BASE = process.env.REACT_APP_API_URL || 'https://amanshukla.onrender.com';

const styles = `
  .add-wrap {
    min-height: calc(100vh - 68px);
    display: grid;
    grid-template-columns: 1fr 1fr;
    position: relative;
    z-index: 1;
  }

  @media (max-width: 768px) {
    .add-wrap { grid-template-columns: 1fr; }
    .add-right { display: none; }
  }

  .add-left {
    padding: 48px 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-right: 1px solid rgba(255,255,255,0.06);
  }

  .add-badge {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: rgba(99,102,241,0.08);
    border: 1px solid rgba(99,102,241,0.2);
    border-radius: 999px;
    padding: 5px 14px;
    font-size: 0.75rem;
    color: #818cf8;
    margin-bottom: 20px;
    width: fit-content;
    animation: fadeUp 0.5s ease 0.1s both;
  }

  .add-title {
    font-size: 2.2rem;
    font-weight: 900;
    color: #f1f5f9;
    letter-spacing: -1px;
    margin-bottom: 8px;
    line-height: 1.1;
    animation: fadeUp 0.5s ease 0.15s both;
  }

  .add-title span {
    background: linear-gradient(135deg, #6366f1, #06b6d4, #10b981);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .add-subtitle {
    color: #475569;
    font-size: 0.9rem;
    margin-bottom: 36px;
    animation: fadeUp 0.5s ease 0.2s both;
  }

  .med-form {
    display: flex;
    flex-direction: column;
    gap: 18px;
    animation: fadeUp 0.5s ease 0.25s both;
  }

  .field-wrap { display: flex; flex-direction: column; gap: 8px; }

  .field-label {
    font-size: 0.78rem;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .field-input {
    width: 100%;
    padding: 14px 18px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 14px;
    color: #f1f5f9;
    font-size: 0.95rem;
    font-family: 'Outfit', sans-serif;
    transition: all 0.3s ease;
    outline: none;
    box-sizing: border-box;
  }

  .field-input::placeholder { color: #334155; }

  .field-input:hover:not(:focus) {
    border-color: rgba(255,255,255,0.13);
    background: rgba(255,255,255,0.04);
  }

  .field-input:focus {
    border-color: rgba(99,102,241,0.5);
    background: rgba(99,102,241,0.04);
    box-shadow: 0 0 0 4px rgba(99,102,241,0.08), 0 0 20px rgba(99,102,241,0.1);
  }

  .field-hint {
    font-size: 0.73rem;
    color: #334155;
    padding-left: 2px;
  }

  /* ===== 12HR TIME PICKER ===== */
  .time-picker-wrap {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .time-picker-row {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 14px;
    padding: 10px 14px;
    transition: border-color 0.3s ease;
  }

  .time-picker-row:focus-within {
    border-color: rgba(99,102,241,0.5);
    background: rgba(99,102,241,0.04);
    box-shadow: 0 0 0 4px rgba(99,102,241,0.08);
  }

  .time-select {
    background: transparent;
    border: none;
    color: #f1f5f9;
    font-size: 1rem;
    font-family: 'Outfit', sans-serif;
    font-weight: 700;
    outline: none;
    cursor: pointer;
    padding: 2px 4px;
    -webkit-appearance: none;
    appearance: none;
  }

  .time-select option { background: #0f0f1a; color: #f1f5f9; }

  .time-colon {
    color: #6366f1;
    font-weight: 900;
    font-size: 1.1rem;
    user-select: none;
  }

  .ampm-toggle {
    display: flex;
    gap: 4px;
    margin-left: 4px;
  }

  .ampm-btn {
    padding: 4px 10px;
    border-radius: 8px;
    font-size: 0.78rem;
    font-weight: 700;
    font-family: 'Outfit', sans-serif;
    cursor: pointer;
    border: 1px solid rgba(255,255,255,0.08);
    background: transparent;
    color: #475569;
    transition: all 0.2s ease;
  }

  .ampm-btn.active {
    background: rgba(99,102,241,0.2);
    border-color: rgba(99,102,241,0.4);
    color: #818cf8;
  }

  .add-time-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background: rgba(99,102,241,0.08);
    border: 1px dashed rgba(99,102,241,0.3);
    border-radius: 10px;
    color: #6366f1;
    font-size: 0.82rem;
    font-weight: 700;
    font-family: 'Outfit', sans-serif;
    cursor: pointer;
    transition: all 0.2s ease;
    width: fit-content;
  }

  .add-time-btn:hover {
    background: rgba(99,102,241,0.15);
    border-color: rgba(99,102,241,0.5);
  }

  .time-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(99,102,241,0.12);
    border: 1px solid rgba(99,102,241,0.25);
    border-radius: 8px;
    padding: 5px 10px;
    font-size: 0.82rem;
    color: #818cf8;
    font-weight: 600;
  }

  .time-tag-remove {
    cursor: pointer;
    color: #475569;
    font-size: 0.9rem;
    transition: color 0.2s;
    background: none;
    border: none;
    padding: 0;
    line-height: 1;
  }

  .time-tag-remove:hover { color: #ef4444; }

  .time-tags-row {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  /* ===== REST OF STYLES ===== */
  .ntfy-input-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  .ntfy-prefix-btn {
    position: absolute;
    right: 12px;
    background: rgba(99,102,241,0.15);
    border: 1px solid rgba(99,102,241,0.3);
    border-radius: 8px;
    color: #818cf8;
    font-size: 0.75rem;
    font-weight: 700;
    padding: 5px 10px;
    cursor: pointer;
    font-family: 'Outfit', sans-serif;
    transition: all 0.2s ease;
    white-space: nowrap;
  }

  .ntfy-prefix-btn:hover {
    background: rgba(99,102,241,0.25);
    border-color: rgba(99,102,241,0.5);
  }

  .ntfy-hint {
    font-size: 0.73rem;
    color: #6366f1;
    padding-left: 2px;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .freq-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 4px; }

  .freq-chip {
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 0.78rem;
    font-weight: 600;
    font-family: 'Outfit', sans-serif;
    cursor: pointer;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.03);
    color: #64748b;
    transition: all 0.2s ease;
  }

  .freq-chip:hover {
    background: rgba(99,102,241,0.1);
    border-color: rgba(99,102,241,0.3);
    color: #818cf8;
    transform: translateY(-1px);
  }

  .freq-chip.selected {
    background: rgba(99,102,241,0.15);
    border-color: rgba(99,102,241,0.4);
    color: #818cf8;
  }

  .submit-wrap { margin-top: 8px; }

  .submit-btn {
    width: 100%;
    padding: 16px;
    background: linear-gradient(135deg, #6366f1, #06b6d4);
    color: white;
    border: none;
    border-radius: 14px;
    font-size: 1rem;
    font-weight: 800;
    font-family: 'Outfit', sans-serif;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    box-shadow: 0 0 32px rgba(99,102,241,0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .submit-btn:hover { transform: translateY(-3px); box-shadow: 0 0 50px rgba(99,102,241,0.55); }
  .submit-btn:active { transform: scale(0.97); }
  .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none !important; }

  .spinner {
    width: 18px; height: 18px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    display: inline-block;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .add-right {
    padding: 48px 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    background: rgba(99,102,241,0.02);
  }

  .preview-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    padding: 24px;
    width: 100%;
    max-width: 320px;
    animation: fadeUp 0.5s ease 0.3s both;
    transition: all 0.3s ease;
  }

  .preview-card:hover {
    background: rgba(255,255,255,0.05);
    border-color: rgba(99,102,241,0.2);
    transform: translateY(-3px);
  }

  .preview-label { font-size: 0.72rem; color: #334155; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; font-weight: 700; }

  .preview-name {
    font-size: 1.4rem;
    font-weight: 800;
    margin-bottom: 12px;
    min-height: 32px;
    background: linear-gradient(135deg, #6366f1, #06b6d4);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .preview-rows { display: flex; flex-direction: column; gap: 10px; }

  .preview-row {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.85rem;
    color: #64748b;
    padding: 8px 12px;
    background: rgba(255,255,255,0.02);
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.04);
    min-height: 36px;
  }

  .preview-row strong { color: #94a3b8; }

  .tips-section { width: 100%; max-width: 320px; animation: fadeUp 0.5s ease 0.4s both; }
  .tips-title { font-size: 0.78rem; color: #334155; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; margin-bottom: 12px; }

  .tip-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 10px 14px;
    border-radius: 10px;
    font-size: 0.82rem;
    color: #64748b;
    margin-bottom: 8px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.04);
    line-height: 1.5;
  }

  .tip-item .tip-icon { font-size: 1rem; flex-shrink: 0; }

  .ntfy-setup-box {
    background: rgba(99,102,241,0.05);
    border: 1px solid rgba(99,102,241,0.2);
    border-radius: 14px;
    padding: 16px 18px;
    margin-top: 4px;
  }

  .ntfy-setup-title {
    font-size: 0.78rem;
    font-weight: 700;
    color: #818cf8;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .ntfy-step {
    font-size: 0.78rem;
    color: #64748b;
    margin-bottom: 6px;
    display: flex;
    align-items: flex-start;
    gap: 8px;
    line-height: 1.5;
  }

  .ntfy-step-num {
    background: rgba(99,102,241,0.2);
    color: #818cf8;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    font-weight: 700;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .toast {
    position: fixed;
    bottom: 28px;
    right: 28px;
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    padding: 14px 22px;
    border-radius: 14px;
    font-weight: 700;
    font-size: 0.9rem;
    box-shadow: 0 20px 40px rgba(16,185,129,0.4);
    animation: toastIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  @keyframes toastIn {
    from { opacity: 0; transform: translateY(20px) scale(0.85); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const FREQUENCIES = [
  'Once daily', 'Twice daily', '3 times daily',
  'Every 8 hours', 'Before meals', 'After meals', 'At bedtime'
];

const HOURS   = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

// ===== 12HR TIME PICKER COMPONENT =====
function TimePickerInput({ value, onChange }) {
  const [hour,   setHour]   = useState('08');
  const [minute, setMinute] = useState('00');
  const [ampm,   setAmpm]   = useState('AM');

  // Parse existing times from comma-separated string
  const times = value ? value.split(',').map(t => t.trim()).filter(Boolean) : [];

  const addTime = () => {
    const t = `${parseInt(hour)}:${minute} ${ampm}`;
    if (times.includes(t)) return;
    const updated = [...times, t].join(', ');
    onChange(updated);
  };

  const removeTime = (idx) => {
    const updated = times.filter((_, i) => i !== idx).join(', ');
    onChange(updated);
  };

  return (
    <div className="time-picker-wrap">
      {/* Picker row */}
      <div className="time-picker-row">
        {/* Hour */}
        <select className="time-select" value={hour} onChange={e => setHour(e.target.value)}>
          {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
        </select>

        <span className="time-colon">:</span>

        {/* Minute */}
        <select className="time-select" value={minute} onChange={e => setMinute(e.target.value)}>
          {MINUTES.map(m => <option key={m} value={m}>{m}</option>)}
        </select>

        {/* AM / PM */}
        <div className="ampm-toggle">
          <button type="button" className={`ampm-btn ${ampm === 'AM' ? 'active' : ''}`}
            onClick={() => setAmpm('AM')}>AM</button>
          <button type="button" className={`ampm-btn ${ampm === 'PM' ? 'active' : ''}`}
            onClick={() => setAmpm('PM')}>PM</button>
        </div>

        {/* Add button */}
        <button type="button" className="add-time-btn" style={{marginLeft:'auto'}}
          onClick={addTime}>
          + Add
        </button>
      </div>

      {/* Added time tags */}
      {times.length > 0 && (
        <div className="time-tags-row">
          {times.map((t, i) => (
            <span key={i} className="time-tag">
              ⏰ {t}
              <button type="button" className="time-tag-remove" onClick={() => removeTime(i)}>✕</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function AddMedicine() {
  const [form, setForm] = useState({
    name: '', dosage: '', frequency: '', time: '', ntfyTopic: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFreqChip = (freq) => setForm(prev => ({ ...prev, frequency: freq }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.time) { alert('Please add at least one reminder time!'); return; }
    setLoading(true);
    try {
      const times = form.time.split(',').map(t => t.trim()).filter(Boolean);
      const response = await fetch(BASE + '/api/medicines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          dosage: form.dosage,
          frequency: form.frequency,
          time: times,
          ntfyTopic: form.ntfyTopic.trim()
        })
      });
      if (!response.ok) throw new Error('Failed');
      setSuccess(true);
      setForm({ name: '', dosage: '', frequency: '', time: '', ntfyTopic: '' });
      setTimeout(() => setSuccess(false), 3500);
    } catch (err) {
      alert('Error adding medicine! Please try again.');
    }
    setLoading(false);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="add-wrap">
        <div className="add-left">
          <div className="add-badge">New Medication</div>
          <div className="add-title">Add <span>Medicine</span></div>
          <div className="add-subtitle">Track a new medication in your daily schedule</div>

          <form className="med-form" onSubmit={handleSubmit}>

            <div className="field-wrap">
              <label className="field-label">💊 Medicine Name</label>
              <input className="field-input" type="text" placeholder="e.g. Paracetamol, Vitamin D..."
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>

            <div className="field-wrap">
              <label className="field-label">📏 Dosage</label>
              <input className="field-input" type="text" placeholder="e.g. 500mg, 1 tablet..."
                value={form.dosage} onChange={e => setForm({ ...form, dosage: e.target.value })} required />
            </div>

            <div className="field-wrap">
              <label className="field-label">📅 Frequency</label>
              <input className="field-input" type="text" placeholder="e.g. 2 times daily..."
                value={form.frequency} onChange={e => setForm({ ...form, frequency: e.target.value })} required />
              <div className="freq-chips">
                {FREQUENCIES.map(f => (
                  <button key={f} type="button"
                    className={`freq-chip ${form.frequency === f ? 'selected' : ''}`}
                    onClick={() => handleFreqChip(f)}>{f}
                  </button>
                ))}
              </div>
            </div>

            {/* 12HR TIME PICKER */}
            <div className="field-wrap">
              <label className="field-label">⏰ Reminder Times</label>
              <TimePickerInput
                value={form.time}
                onChange={val => setForm({ ...form, time: val })}
              />
              <span className="field-hint">Select time and click Add for multiple reminders</span>
            </div>

            <div className="field-wrap">
              <label className="field-label">🔔 Notification Topic</label>
              <div className="ntfy-input-wrap">
                <input className="field-input" type="text" placeholder="e.g. medremind-aman"
                  value={form.ntfyTopic} onChange={e => setForm({ ...form, ntfyTopic: e.target.value })}
                  style={{paddingRight: '145px'}} />
                <button type="button" className="ntfy-prefix-btn"
                  onClick={() => { if (!form.ntfyTopic.startsWith('medremind-')) setForm({ ...form, ntfyTopic: 'medremind-' }); }}>
                  medremind- →
                </button>
              </div>
              <span className="ntfy-hint">🔗 Get free notifications via ntfy.sh app</span>
              <div className="ntfy-setup-box">
                <div className="ntfy-setup-title">📲 How to setup (takes 1 min!)</div>
                <div className="ntfy-step"><span className="ntfy-step-num">1</span><span>Install <strong style={{color:'#818cf8'}}>Ntfy app</strong> on your phone (Android / iOS) — it's free</span></div>
                <div className="ntfy-step"><span className="ntfy-step-num">2</span><span>Open app → tap <strong style={{color:'#818cf8'}}>+</strong> → enter unique topic (e.g. <strong style={{color:'#818cf8'}}>medremind-yourname</strong>)</span></div>
                <div className="ntfy-step"><span className="ntfy-step-num">3</span><span>Type that same topic name in the field above</span></div>
                <div className="ntfy-step"><span className="ntfy-step-num">4</span><span>Done! You'll get push notifications at reminder times 🎉</span></div>
              </div>
            </div>

            <div className="submit-wrap">
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? <><span className="spinner"></span> Adding...</> : <>💊 Add Medicine</>}
              </button>
            </div>
          </form>
        </div>

        <div className="add-right">
          <div className="preview-card">
            <div className="preview-label">Live Preview</div>
            <div className="preview-name">{form.name || 'Medicine Name'}</div>
            <div className="preview-rows">
              <div className="preview-row"><strong>Dosage:</strong> {form.dosage || '-'}</div>
              <div className="preview-row"><strong>Frequency:</strong> {form.frequency || '-'}</div>
              <div className="preview-row"><strong>Times:</strong> {form.time || '-'}</div>
              <div className="preview-row"><strong>🔔 Topic:</strong> {form.ntfyTopic || '-'}</div>
            </div>
          </div>
          <div className="tips-section">
            <div className="tips-title">Pro Tips</div>
            <div className="tip-item"><span className="tip-icon">🔔</span>Use format: medremind-yourname</div>
            <div className="tip-item"><span className="tip-icon">📱</span>Ntfy app works on Android, iOS and PC!</div>
            <div className="tip-item"><span className="tip-icon">⏰</span>Set reminders at consistent times daily</div>
            <div className="tip-item"><span className="tip-icon">💧</span>Always take medicines with a full glass of water</div>
          </div>
        </div>
      </div>

      {success && <div className="toast">✅ Medicine added! Notification sent 🔔</div>}
    </>
  );
}

export default AddMedicine;
import React, { useState, useEffect } from 'react';

const BASE = process.env.REACT_APP_API_URL || 'https://amanshukla.onrender.com';
const EMAILJS_SERVICE = 'service_acccr0a';
const EMAILJS_TEMPLATE = 'template_5rvdrdz';
const EMAILJS_KEY = 'OnaP9UdEqIAgSN4Tf';

const sendReminderEmail = async (toEmail, medicineName, dosage, reminderTime) => {
  try {
    var response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE,
        template_id: EMAILJS_TEMPLATE,
        user_id: EMAILJS_KEY,
        template_params: {
          to_email: toEmail,
          medicine_name: medicineName,
          dosage: dosage,
          reminder_time: reminderTime
        }
      })
    });
    return response.ok;
  } catch (err) {
    return false;
  }
};

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

  .field-hint { font-size: 0.73rem; color: #334155; padding-left: 2px; }

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

function AddMedicine() {
  const [form, setForm] = useState({ name: '', dosage: '', frequency: '', time: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFreqChip = function(freq) {
    setForm(function(prev) { return { ...prev, frequency: freq }; });
  };

  const handleSubmit = async function(e) {
    e.preventDefault();
    setLoading(true);
    try {
      var times = form.time.split(',').map(function(t) { return t.trim(); }).filter(Boolean);
      var response = await fetch(BASE + '/api/medicines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, dosage: form.dosage, frequency: form.frequency, time: times })
      });
      if (!response.ok) throw new Error('Failed');

      if (form.email) {
        await sendReminderEmail(form.email, form.name, form.dosage, form.time);
      }

      setSuccess(true);
      setForm({ name: '', dosage: '', frequency: '', time: '', email: '' });
      setTimeout(function() { setSuccess(false); }, 3500);
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
              <label className="field-label">Medicine Name</label>
              <input className="field-input" type="text" placeholder="e.g. Paracetamol, Vitamin D..."
                value={form.name} onChange={function(e) { setForm({ ...form, name: e.target.value }); }} required />
            </div>

            <div className="field-wrap">
              <label className="field-label">Dosage</label>
              <input className="field-input" type="text" placeholder="e.g. 500mg, 1 tablet..."
                value={form.dosage} onChange={function(e) { setForm({ ...form, dosage: e.target.value }); }} required />
            </div>

            <div className="field-wrap">
              <label className="field-label">Frequency</label>
              <input className="field-input" type="text" placeholder="e.g. 2 times daily..."
                value={form.frequency} onChange={function(e) { setForm({ ...form, frequency: e.target.value }); }} required />
              <div className="freq-chips">
                {FREQUENCIES.map(function(f) {
                  return (
                    <button key={f} type="button"
                      className={'freq-chip ' + (form.frequency === f ? 'selected' : '')}
                      onClick={function() { handleFreqChip(f); }}>
                      {f}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="field-wrap">
              <label className="field-label">Reminder Times</label>
              <input className="field-input" type="text" placeholder="e.g. 08:00, 14:00, 20:00"
                value={form.time} onChange={function(e) { setForm({ ...form, time: e.target.value }); }} required />
              <span className="field-hint">Separate multiple times with commas</span>
            </div>

            <div className="field-wrap">
              <label className="field-label">Email for Reminder (Optional)</label>
              <input className="field-input" type="email" placeholder="aapka@email.com - reminder email aayega!"
                value={form.email} onChange={function(e) { setForm({ ...form, email: e.target.value }); }} />
              <span className="field-hint">Email dalo toh medicine add hone par confirmation email aayega!</span>
            </div>

            <div className="submit-wrap">
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? <><span className="spinner"></span> Adding...</> : <>Add Medicine</>}
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
              <div className="preview-row"><strong>Email:</strong> {form.email || '-'}</div>
            </div>
          </div>

          <div className="tips-section">
            <div className="tips-title">Pro Tips</div>
            <div className="tip-item"><span className="tip-icon">📧</span>Email dalo - medicine add hone par reminder email aayega!</div>
            <div className="tip-item"><span className="tip-icon">⏰</span>Set reminders at consistent times every day</div>
            <div className="tip-item"><span className="tip-icon">💧</span>Always take medicines with a full glass of water</div>
            <div className="tip-item"><span className="tip-icon">🤖</span>Use AI Health Tips on Dashboard for advice</div>
          </div>
        </div>
      </div>

      {success && (
        <div className="toast">Medicine added! Email reminder bheja gaya!</div>
      )}
    </>
  );
}

export default AddMedicine;

import React, { useState } from 'react';

const styles = `
  .emergency-wrap {
    min-height: calc(100vh - 68px);
    padding: 36px 28px;
    max-width: 900px;
    margin: 0 auto;
    z-index: 1;
    position: relative;
  }

  .sos-banner {
    background: linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05));
    border: 1px solid rgba(239,68,68,0.3);
    border-radius: 20px;
    padding: 28px;
    margin-bottom: 32px;
    text-align: center;
    animation: fadeUp 0.5s ease;
  }

  .sos-btn {
    width: 120px; height: 120px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ef4444, #dc2626);
    border: 4px solid rgba(239,68,68,0.3);
    color: white;
    font-size: 0.95rem;
    font-weight: 900;
    font-family: 'Outfit', sans-serif;
    cursor: pointer;
    margin: 0 auto 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 40px rgba(239,68,68,0.5), 0 0 80px rgba(239,68,68,0.2);
    transition: all 0.3s ease;
    animation: sosPulse 2s ease-in-out infinite;
    gap: 4px;
  }

  @keyframes sosPulse {
    0%, 100% { box-shadow: 0 0 40px rgba(239,68,68,0.5), 0 0 80px rgba(239,68,68,0.2); }
    50% { box-shadow: 0 0 60px rgba(239,68,68,0.7), 0 0 120px rgba(239,68,68,0.3); }
  }

  .sos-btn:hover { transform: scale(1.05); }
  .sos-btn:active { transform: scale(0.95); }

  .sos-btn .sos-icon { font-size: 2rem; }
  .sos-btn .sos-text { font-size: 1.1rem; letter-spacing: 2px; }

  .sos-desc {
    color: #94a3b8;
    font-size: 0.85rem;
    margin-top: 12px;
  }

  .emergency-numbers {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 14px;
    margin-bottom: 32px;
    animation: fadeUp 0.5s ease 0.1s both;
  }

  .number-card {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    padding: 20px;
    text-align: center;
    transition: all 0.3s ease;
    text-decoration: none;
    display: block;
  }

  .number-card:hover {
    transform: translateY(-4px);
    border-color: var(--color);
    box-shadow: 0 16px 32px rgba(0,0,0,0.3);
  }

  .number-card:active { transform: scale(0.97); }

  .number-icon { font-size: 2rem; margin-bottom: 8px; display: block; }
  .number-label { font-size: 0.82rem; color: #64748b; margin-bottom: 6px; }
  .number-value {
    font-size: 1.4rem;
    font-weight: 900;
    font-family: 'Space Mono', monospace;
    color: var(--color);
  }

  .contacts-section {
    animation: fadeUp 0.5s ease 0.2s both;
  }

  .section-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  .section-head h3 {
    font-size: 1.2rem;
    font-weight: 800;
    color: #f1f5f9;
  }

  .btn-add-contact {
    padding: 8px 16px;
    background: rgba(99,102,241,0.1);
    border: 1px solid rgba(99,102,241,0.2);
    border-radius: 10px;
    color: #818cf8;
    font-size: 0.82rem;
    font-weight: 600;
    font-family: 'Outfit', sans-serif;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-add-contact:hover {
    background: rgba(99,102,241,0.2);
    transform: translateY(-1px);
  }

  .contacts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 14px;
    margin-bottom: 20px;
  }

  .contact-card {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    padding: 18px;
    display: flex;
    align-items: center;
    gap: 14px;
    transition: all 0.3s ease;
  }

  .contact-card:hover {
    background: rgba(255,255,255,0.04);
    border-color: rgba(99,102,241,0.2);
    transform: translateY(-2px);
  }

  .contact-avatar {
    width: 46px; height: 46px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(6,182,212,0.2));
    border: 1px solid rgba(99,102,241,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
    flex-shrink: 0;
  }

  .contact-info { flex: 1; }
  .contact-name { font-size: 0.95rem; font-weight: 700; color: #f1f5f9; margin-bottom: 3px; }
  .contact-relation { font-size: 0.75rem; color: #475569; margin-bottom: 3px; }
  .contact-phone { font-size: 0.8rem; color: #818cf8; font-family: 'Space Mono', monospace; }

  .btn-call-contact {
    width: 36px; height: 36px;
    background: rgba(16,185,129,0.1);
    border: 1px solid rgba(16,185,129,0.2);
    border-radius: 10px;
    color: #10b981;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    transition: all 0.2s ease;
    text-decoration: none;
    flex-shrink: 0;
  }

  .btn-call-contact:hover {
    background: rgba(16,185,129,0.2);
    transform: scale(1.1);
  }

  .add-form {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    padding: 20px;
    margin-top: 16px;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    animation: fadeUp 0.3s ease;
  }

  .add-form input {
    flex: 1;
    min-width: 150px;
    padding: 10px 14px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px;
    color: #f1f5f9;
    font-size: 0.85rem;
    font-family: 'Outfit', sans-serif;
    outline: none;
    transition: all 0.2s ease;
  }

  .add-form input::placeholder { color: #334155; }
  .add-form input:focus { border-color: rgba(99,102,241,0.4); }

  .btn-save {
    padding: 10px 20px;
    background: linear-gradient(135deg, #6366f1, #06b6d4);
    border: none;
    border-radius: 10px;
    color: white;
    font-weight: 700;
    font-family: 'Outfit', sans-serif;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-save:hover { transform: translateY(-1px); }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const EMERGENCY_NUMBERS = [
  { label: 'Ambulance', value: '108', icon: '🚑', color: '#ef4444' },
  { label: 'Police', value: '100', icon: '👮', color: '#6366f1' },
  { label: 'Fire Brigade', value: '101', icon: '🚒', color: '#f59e0b' },
  { label: 'Disaster Mgmt', value: '1078', icon: '🆘', color: '#10b981' },
  { label: 'Women Helpline', value: '1091', icon: '👩', color: '#ec4899' },
  { label: 'Child Helpline', value: '1098', icon: '👶', color: '#06b6d4' },
];

function Emergency() {
  const [contacts, setContacts] = useState([
    { name: 'Maa', relation: 'Mother', phone: '9876543210', icon: '👩' },
    { name: 'Papa', relation: 'Father', phone: '9876543211', icon: '👨' },
    { name: 'Dr. Sharma', relation: 'Family Doctor', phone: '9876543212', icon: '👨‍⚕️' },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', relation: '', phone: '' });

  const handleSOS = () => {
    window.location.href = 'tel:108';
  };

  const addContact = () => {
    if (newContact.name && newContact.phone) {
      setContacts(prev => [...prev, { ...newContact, icon: '👤' }]);
      setNewContact({ name: '', relation: '', phone: '' });
      setShowForm(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="emergency-wrap">

        {/* SOS Button */}
        <div className="sos-banner">
          <button className="sos-btn" onClick={handleSOS}>
            <span className="sos-icon">🚨</span>
            <span className="sos-text">SOS</span>
          </button>
          <p className="sos-desc">Press SOS to call Ambulance (108) immediately</p>
        </div>

        {/* Emergency Numbers */}
        <div className="emergency-numbers">
          {EMERGENCY_NUMBERS.map((n, i) => (
            <a key={i} className="number-card" href={`tel:${n.value}`} style={{ '--color': n.color }}>
              <span className="number-icon">{n.icon}</span>
              <div className="number-label">{n.label}</div>
              <div className="number-value">{n.value}</div>
            </a>
          ))}
        </div>

        {/* Personal Contacts */}
        <div className="contacts-section">
          <div className="section-head">
            <h3>👥 Emergency Contacts</h3>
            <button className="btn-add-contact" onClick={() => setShowForm(!showForm)}>
              ➕ Add Contact
            </button>
          </div>

          <div className="contacts-grid">
            {contacts.map((c, i) => (
              <div key={i} className="contact-card">
                <div className="contact-avatar">{c.icon}</div>
                <div className="contact-info">
                  <div className="contact-name">{c.name}</div>
                  <div className="contact-relation">{c.relation}</div>
                  <div className="contact-phone">{c.phone}</div>
                </div>
                <a className="btn-call-contact" href={`tel:${c.phone}`}>📞</a>
              </div>
            ))}
          </div>

          {showForm && (
            <div className="add-form">
              <input
                placeholder="Name"
                value={newContact.name}
                onChange={e => setNewContact({ ...newContact, name: e.target.value })}
              />
              <input
                placeholder="Relation (e.g. Mother)"
                value={newContact.relation}
                onChange={e => setNewContact({ ...newContact, relation: e.target.value })}
              />
              <input
                placeholder="Phone Number"
                value={newContact.phone}
                onChange={e => setNewContact({ ...newContact, phone: e.target.value })}
              />
              <button className="btn-save" onClick={addContact}>Save</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Emergency;
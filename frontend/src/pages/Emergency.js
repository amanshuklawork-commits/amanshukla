import React, { useState, useEffect } from 'react';

const styles = `
  .emergency-wrap {
    min-height: calc(100vh - 68px);
    padding: 40px 28px;
    max-width: 1000px;
    margin: 0 auto;
  }

  .emerg-header {
    text-align: center;
    margin-bottom: 50px;
    animation: fadeUp 0.5s ease;
  }

  .emerg-title {
    font-size: 2.5rem;
    font-weight: 900;
    color: var(--text-primary);
    margin-bottom: 8px;
  }

  .emerg-title span {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .sos-section {
    text-align: center;
    margin-bottom: 60px;
    animation: fadeUp 0.6s ease 0.2s both;
  }

  .sos-btn {
    width: 220px;
    height: 220px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ef4444, #dc2626);
    border: 6px solid rgba(239, 68, 68, 0.3);
    color: white;
    font-size: 2.5rem;
    font-weight: 900;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    box-shadow: 0 0 50px rgba(239, 68, 68, 0.6);
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); box-shadow: 0 0 50px rgba(239, 68, 68, 0.6); }
    50% { transform: scale(1.05); box-shadow: 0 0 80px rgba(239, 68, 68, 0.8); }
  }

  .sos-btn:hover {
    transform: scale(1.1);
    box-shadow: 0 0 100px rgba(239, 68, 68, 1);
  }

  .sos-icon {
    font-size: 4rem;
    margin-bottom: 10px;
  }

  .sos-text {
    font-size: 1.3rem;
    letter-spacing: 2px;
  }

  .sos-description {
    color: var(--text-secondary);
    font-size: 1rem;
  }

  .services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
    margin-bottom: 50px;
    animation: fadeUp 0.7s ease 0.3s both;
  }

  .service-card {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    padding: 24px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .service-card:hover {
    background: var(--card-hover-bg);
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(99, 102, 241, 0.2);
  }

  .service-icon {
    font-size: 3rem;
    margin-bottom: 12px;
    display: block;
  }

  .service-name {
    font-size: 1.1rem;
    font-weight: 800;
    color: var(--text-primary);
    margin-bottom: 6px;
  }

  .service-number {
    font-size: 1.3rem;
    font-weight: 900;
    background: linear-gradient(135deg, #6366f1, #06b6d4);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .contacts-section {
    animation: fadeUp 0.8s ease 0.4s both;
  }

  .section-title {
    font-size: 1.6rem;
    font-weight: 800;
    color: var(--text-primary);
    margin-bottom: 24px;
  }

  .add-contact-form {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 30px;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr auto;
    gap: 12px;
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
    border-color: rgba(99, 102, 241, 0.5);
    background: rgba(99, 102, 241, 0.05);
  }

  .add-btn {
    padding: 12px 24px;
    background: linear-gradient(135deg, #6366f1, #06b6d4);
    color: white;
    border: none;
    border-radius: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .add-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
  }

  .contacts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
  }

  .contact-card {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    transition: all 0.3s ease;
  }

  .contact-card:hover {
    background: var(--card-hover-bg);
    transform: translateX(4px);
  }

  .contact-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, #6366f1, #06b6d4);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .contact-info {
    flex: 1;
  }

  .contact-name {
    font-size: 1.1rem;
    font-weight: 800;
    color: var(--text-primary);
    margin-bottom: 4px;
  }

  .contact-number {
    color: var(--text-secondary);
    font-size: 0.9rem;
  }

  .contact-actions {
    display: flex;
    gap: 8px;
  }

  .action-btn {
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

  .btn-call {
    background: rgba(34, 197, 94, 0.1);
    color: #22c55e;
  }

  .btn-call:hover {
    background: rgba(34, 197, 94, 0.2);
    transform: scale(1.1);
  }

  .btn-delete {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
  }

  .btn-delete:hover {
    background: rgba(239, 68, 68, 0.2);
    transform: scale(1.1);
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 768px) {
    .emerg-title { font-size: 2rem; }
    .sos-btn { width: 180px; height: 180px; }
    .sos-icon { font-size: 3rem; }
    .sos-text { font-size: 1.1rem; }
    .form-row { grid-template-columns: 1fr; }
  }
`;

const EMERGENCY_SERVICES = [
  { name: 'Police', number: '100', icon: '🚔' },
  { name: 'Fire', number: '101', icon: '🚒' },
  { name: 'Women Helpline', number: '1091', icon: '👩' },
  { name: 'Child Helpline', number: '1098', icon: '👶' },
  { name: 'Disaster Management', number: '108', icon: '⛑️' },
  { name: 'Senior Citizen', number: '1291', icon: '👴' }
];

function Emergency() {
  const [contacts, setContacts] = useState(() => {
    const saved = localStorage.getItem('emergencyContacts');
    return saved ? JSON.parse(saved) : [];
  });
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    localStorage.setItem('emergencyContacts', JSON.stringify(contacts));
  }, [contacts]);

  const callAmbulance = () => {
    if (window.confirm('Call ambulance (108)?')) {
      window.location.href = 'tel:108';
    }
  };

  const callService = (number) => {
    window.location.href = `tel:${number}`;
  };

  const addContact = () => {
    if (!name || !phone) return;
    setContacts([...contacts, { id: Date.now(), name, phone }]);
    setName('');
    setPhone('');
  };

  const deleteContact = (id) => {
    setContacts(contacts.filter(c => c.id !== id));
  };

  return (
    <>
      <style>{styles}</style>
      <div className="emergency-wrap">
        <div className="emerg-header">
          <h1 className="emerg-title">Emergency <span>SOS</span></h1>
        </div>

        <div className="sos-section">
          <button className="sos-btn" onClick={callAmbulance}>
            <span className="sos-icon">🚨</span>
            <span className="sos-text">SOS</span>
          </button>
          <p className="sos-description">Tap to call ambulance (108)</p>
        </div>

        <div className="services-grid">
          {EMERGENCY_SERVICES.map(service => (
            <div
              key={service.number}
              className="service-card"
              onClick={() => callService(service.number)}
            >
              <span className="service-icon">{service.icon}</span>
              <div className="service-name">{service.name}</div>
              <div className="service-number">{service.number}</div>
            </div>
          ))}
        </div>

        <div className="contacts-section">
          <h2 className="section-title">Personal Emergency Contacts</h2>
          
          <div className="add-contact-form">
            <div className="form-row">
              <input
                className="form-input"
                type="text"
                placeholder="Name (e.g. Mom, Doctor)"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="form-input"
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <button className="add-btn" onClick={addContact}>
                ➕ Add
              </button>
            </div>
          </div>

          <div className="contacts-grid">
            {contacts.map(contact => (
              <div key={contact.id} className="contact-card">
                <div className="contact-avatar">👤</div>
                <div className="contact-info">
                  <div className="contact-name">{contact.name}</div>
                  <div className="contact-number">{contact.phone}</div>
                </div>
                <div className="contact-actions">
                  <button
                    className="action-btn btn-call"
                    onClick={() => window.location.href = `tel:${contact.phone}`}
                  >
                    📞
                  </button>
                  <button
                    className="action-btn btn-delete"
                    onClick={() => deleteContact(contact.id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Emergency;
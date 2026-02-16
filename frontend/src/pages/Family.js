import React, { useState } from 'react';

const styles = `
  .family-wrap {
    min-height: calc(100vh - 68px);
    padding: 36px 28px;
    max-width: 1000px;
    margin: 0 auto;
    z-index: 1;
    position: relative;
  }

  .family-title {
    font-size: 2rem;
    font-weight: 900;
    color: #f1f5f9;
    letter-spacing: -1px;
    margin-bottom: 6px;
  }

  .family-title span {
    background: linear-gradient(135deg, #14b8a6, #06b6d4);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .members-row {
    display: flex;
    gap: 12px;
    margin-bottom: 28px;
    flex-wrap: wrap;
    animation: fadeUp 0.5s ease 0.1s both;
  }

  .member-chip {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    border-radius: 999px;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.03);
    font-family: 'Outfit', sans-serif;
    font-size: 0.85rem;
    font-weight: 600;
    color: #64748b;
  }

  .member-chip:hover {
    background: rgba(20,184,166,0.1);
    border-color: rgba(20,184,166,0.3);
    color: #2dd4bf;
    transform: translateY(-2px);
  }

  .member-chip.active {
    background: rgba(20,184,166,0.15);
    border-color: rgba(20,184,166,0.4);
    color: #2dd4bf;
  }

  .member-chip:active { transform: scale(0.95); }

  .member-avatar { font-size: 1.1rem; }

  .btn-add-member {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 18px;
    border-radius: 999px;
    background: rgba(99,102,241,0.08);
    border: 1px dashed rgba(99,102,241,0.3);
    color: #818cf8;
    font-size: 0.85rem;
    font-weight: 600;
    font-family: 'Outfit', sans-serif;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-add-member:hover {
    background: rgba(99,102,241,0.15);
    transform: translateY(-2px);
  }

  .member-section {
    animation: fadeUp 0.5s ease 0.15s both;
  }

  .member-header {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px;
    padding: 20px 24px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
  }

  .member-info-left {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .member-big-avatar {
    width: 56px; height: 56px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(20,184,166,0.2), rgba(6,182,212,0.2));
    border: 2px solid rgba(20,184,166,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.6rem;
  }

  .member-name { font-size: 1.2rem; font-weight: 800; color: #f1f5f9; margin-bottom: 3px; }
  .member-age { font-size: 0.82rem; color: #475569; }

  .btn-add-med {
    padding: 10px 20px;
    background: linear-gradient(135deg, #14b8a6, #06b6d4);
    border: none;
    border-radius: 12px;
    color: white;
    font-size: 0.85rem;
    font-weight: 700;
    font-family: 'Outfit', sans-serif;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 0 16px rgba(20,184,166,0.3);
  }

  .btn-add-med:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 28px rgba(20,184,166,0.5);
  }

  .meds-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 14px;
    margin-bottom: 20px;
  }

  .fam-med-card {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    padding: 18px;
    transition: all 0.3s ease;
    animation: fadeUp 0.3s ease;
  }

  .fam-med-card:hover {
    background: rgba(255,255,255,0.04);
    border-color: rgba(20,184,166,0.2);
    transform: translateY(-3px);
  }

  .fam-med-name { font-size: 1rem; font-weight: 700; color: #f1f5f9; margin-bottom: 6px; }
  .fam-med-detail { font-size: 0.8rem; color: #475569; margin-bottom: 3px; }

  .fam-time-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-top: 8px;
  }

  .fam-time-tag {
    background: rgba(20,184,166,0.1);
    border: 1px solid rgba(20,184,166,0.2);
    color: #2dd4bf;
    padding: 2px 8px;
    border-radius: 999px;
    font-size: 0.7rem;
    font-family: 'Space Mono', monospace;
  }

  .add-med-form {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    padding: 20px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    animation: fadeUp 0.3s ease;
  }

  .add-med-form input {
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

  .add-med-form input::placeholder { color: #334155; }
  .add-med-form input:focus { border-color: rgba(20,184,166,0.4); }

  .btn-save-med {
    grid-column: 1/-1;
    padding: 12px;
    background: linear-gradient(135deg, #14b8a6, #06b6d4);
    border: none;
    border-radius: 10px;
    color: white;
    font-weight: 700;
    font-family: 'Outfit', sans-serif;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-save-med:hover { transform: translateY(-2px); }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const INITIAL_MEMBERS = [
  { name: 'Maa', age: 52, icon: '👩', meds: [{ name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', time: ['08:00', '20:00'] }] },
  { name: 'Papa', age: 55, icon: '👨', meds: [{ name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', time: ['09:00'] }] },
  { name: 'Dadi', age: 75, icon: '👵', meds: [{ name: 'Vitamin D', dosage: '1000IU', frequency: 'Once daily', time: ['10:00'] }] },
];

function Family() {
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [activeMember, setActiveMember] = useState(0);
  const [showAddMed, setShowAddMed] = useState(false);
  const [newMed, setNewMed] = useState({ name: '', dosage: '', frequency: '', time: '' });

  const addMed = () => {
    if (!newMed.name) return;
    const updated = [...members];
    updated[activeMember].meds.push({
      ...newMed,
      time: newMed.time.split(',').map(t => t.trim())
    });
    setMembers(updated);
    setNewMed({ name: '', dosage: '', frequency: '', time: '' });
    setShowAddMed(false);
  };

  const current = members[activeMember];

  return (
    <>
      <style>{styles}</style>
      <div className="family-wrap">
        <div style={{ marginBottom: '28px', animation: 'fadeUp 0.5s ease' }}>
          <div className="family-title">👨‍👩‍👧 Family <span>Medicines</span></div>
          <div style={{ color: '#475569', fontSize: '0.88rem' }}>Manage medications for your entire family</div>
        </div>

        <div className="members-row">
          {members.map((m, i) => (
            <button
              key={i}
              className={`member-chip ${activeMember === i ? 'active' : ''}`}
              onClick={() => { setActiveMember(i); setShowAddMed(false); }}
            >
              <span className="member-avatar">{m.icon}</span>
              {m.name}
            </button>
          ))}
          <button className="btn-add-member">➕ Add Member</button>
        </div>

        <div className="member-section">
          <div className="member-header">
            <div className="member-info-left">
              <div className="member-big-avatar">{current.icon}</div>
              <div>
                <div className="member-name">{current.name}</div>
                <div className="member-age">Age: {current.age} years • {current.meds.length} medicines</div>
              </div>
            </div>
            <button className="btn-add-med" onClick={() => setShowAddMed(!showAddMed)}>
              ➕ Add Medicine
            </button>
          </div>

          <div className="meds-list">
            {current.meds.map((med, i) => (
              <div key={i} className="fam-med-card">
                <div className="fam-med-name">💊 {med.name}</div>
                <div className="fam-med-detail">💉 {med.dosage}</div>
                <div className="fam-med-detail">🔁 {med.frequency}</div>
                <div className="fam-time-tags">
                  {(Array.isArray(med.time) ? med.time : [med.time]).map((t, j) => (
                    <span key={j} className="fam-time-tag">⏰ {t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {showAddMed && (
            <div className="add-med-form">
              <input placeholder="Medicine Name" value={newMed.name} onChange={e => setNewMed({ ...newMed, name: e.target.value })} />
              <input placeholder="Dosage (e.g. 500mg)" value={newMed.dosage} onChange={e => setNewMed({ ...newMed, dosage: e.target.value })} />
              <input placeholder="Frequency" value={newMed.frequency} onChange={e => setNewMed({ ...newMed, frequency: e.target.value })} />
              <input placeholder="Times (e.g. 08:00, 20:00)" value={newMed.time} onChange={e => setNewMed({ ...newMed, time: e.target.value })} />
              <button className="btn-save-med" onClick={addMed}>✅ Save Medicine</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Family;
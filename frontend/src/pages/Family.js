import React, { useState, useEffect } from 'react';

const styles = `
  .family-wrap {
    min-height: calc(100vh - 68px);
    padding: 40px 28px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .family-header {
    margin-bottom: 40px;
    animation: fadeUp 0.5s ease;
  }

  .family-title {
    font-size: 2.5rem;
    font-weight: 900;
    color: var(--text-primary);
    margin-bottom: 8px;
  }

  .family-title span {
    background: linear-gradient(135deg, #a855f7, #8b5cf6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .members-tabs {
    display: flex;
    gap: 12px;
    margin-bottom: 30px;
    overflow-x: auto;
    padding-bottom: 8px;
    animation: fadeUp 0.6s ease 0.2s both;
  }

  .member-tab {
    padding: 12px 24px;
    border-radius: 999px;
    border: 1px solid var(--border-color);
    background: var(--card-bg);
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 700;
    color: var(--text-secondary);
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .member-tab:hover {
    background: rgba(168, 85, 247, 0.1);
    border-color: rgba(168, 85, 247, 0.3);
  }

  .member-tab.active {
    background: linear-gradient(135deg, #a855f7, #8b5cf6);
    color: white;
    border-color: transparent;
  }

  .member-icon {
    font-size: 1.2rem;
  }

  .member-content {
    animation: fadeUp 0.7s ease 0.3s both;
  }

  .content-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .member-name {
    font-size: 1.6rem;
    font-weight: 800;
    color: var(--text-primary);
  }

  .add-med-btn {
    padding: 12px 20px;
    background: linear-gradient(135deg, #a855f7, #8b5cf6);
    color: white;
    border: none;
    border-radius: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .add-med-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(168, 85, 247, 0.4);
  }

  .meds-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }

  .med-card-family {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 20px;
    padding: 24px;
    transition: all 0.3s ease;
  }

  .med-card-family:hover {
    background: var(--card-hover-bg);
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(168, 85, 247, 0.15);
  }

  .med-name-family {
    font-size: 1.3rem;
    font-weight: 800;
    color: var(--text-primary);
    margin-bottom: 12px;
  }

  .med-detail-family {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    color: var(--text-secondary);
    font-size: 0.9rem;
  }

  .detail-icon {
    font-size: 1rem;
  }

  .med-actions-family {
    display: flex;
    gap: 8px;
    margin-top: 16px;
  }

  .action-btn-family {
    flex: 1;
    padding: 10px;
    border-radius: 10px;
    border: none;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.85rem;
  }

  .btn-reminder {
    background: rgba(168, 85, 247, 0.1);
    color: #a855f7;
  }

  .btn-reminder:hover {
    background: rgba(168, 85, 247, 0.2);
  }

  .btn-delete-family {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
  }

  .btn-delete-family:hover {
    background: rgba(239, 68, 68, 0.2);
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
    .family-title { font-size: 2rem; }
    .member-tab { padding: 10px 18px; font-size: 0.9rem; }
  }
`;

const FAMILY_MEMBERS = [
  { id: 'self', name: 'Me', icon: '👤' },
  { id: 'mom', name: 'Mom', icon: '👩' },
  { id: 'dad', name: 'Dad', icon: '👨' },
  { id: 'grandma', name: 'Grandma', icon: '👵' },
  { id: 'grandpa', name: 'Grandpa', icon: '👴' }
];

const SAMPLE_MEDICINES = {
  self: [
    { name: 'Vitamin D', dosage: '1000 IU', frequency: 'Once daily', time: '08:00' }
  ],
  mom: [
    { name: 'Blood Pressure Tablet', dosage: '5mg', frequency: 'Once daily', time: '09:00' },
    { name: 'Calcium', dosage: '500mg', frequency: 'Twice daily', time: '08:00, 20:00' }
  ],
  dad: [
    { name: 'Cholesterol Medication', dosage: '10mg', frequency: 'Once daily', time: '20:00' }
  ],
  grandma: [
    { name: 'Diabetes Medication', dosage: '500mg', frequency: 'Twice daily', time: '08:00, 20:00' },
    { name: 'Joint Support', dosage: '1 tablet', frequency: 'Once daily', time: '12:00' }
  ],
  grandpa: [
    { name: 'Heart Medication', dosage: '2.5mg', frequency: 'Once daily', time: '09:00' }
  ]
};

function Family() {
  const [activeMember, setActiveMember] = useState('self');
  const [medicines, setMedicines] = useState(() => {
    const saved = localStorage.getItem('familyMedicines');
    return saved ? JSON.parse(saved) : SAMPLE_MEDICINES;
  });

  useEffect(() => {
    localStorage.setItem('familyMedicines', JSON.stringify(medicines));
  }, [medicines]);

  const deleteMedicine = (memberI, medIndex) => {
    setMedicines(prev => ({
      ...prev,
      [activeMember]: prev[activeMember].filter((_, i) => i !== medIndex)
    }));
  };

  const currentMedicines = medicines[activeMember] || [];

  return (
    <>
      <style>{styles}</style>
      <div className="family-wrap">
        <div className="family-header">
          <h1 className="family-title">Family <span>Medicines</span></h1>
        </div>

        <div className="members-tabs">
          {FAMILY_MEMBERS.map(member => (
            <button
              key={member.id}
              className={`member-tab ${activeMember === member.id ? 'active' : ''}`}
              onClick={() => setActiveMember(member.id)}
            >
              <span className="member-icon">{member.icon}</span>
              {member.name}
            </button>
          ))}
        </div>

        <div className="member-content">
          <div className="content-header">
            <h2 className="member-name">
              {FAMILY_MEMBERS.find(m => m.id === activeMember)?.name}'s Medicines
            </h2>
            <button className="add-med-btn">
              ➕ Add Medicine
            </button>
          </div>

          <div className="meds-grid">
            {currentMedicines.length > 0 ? currentMedicines.map((med, i) => (
              <div key={i} className="med-card-family">
                <h3 className="med-name-family">{med.name}</h3>
                <div className="med-detail-family">
                  <span className="detail-icon">💊</span>
                  <span>{med.dosage}</span>
                </div>
                <div className="med-detail-family">
                  <span className="detail-icon">🔁</span>
                  <span>{med.frequency}</span>
                </div>
                <div className="med-detail-family">
                  <span className="detail-icon">⏰</span>
                  <span>{med.time}</span>
                </div>
                <div className="med-actions-family">
                  <button className="action-btn-family btn-reminder">
                    🔔 Set Reminder
                  </button>
                  <button 
                    className="action-btn-family btn-delete-family"
                    onClick={() => deleteMedicine(activeMember, i)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            )) : (
              <div className="empty-state">
                <div className="empty-icon">💊</div>
                <p>No medicines added yet for {FAMILY_MEMBERS.find(m => m.id === activeMember)?.name}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Family;
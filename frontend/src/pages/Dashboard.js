import React, { useState, useEffect } from 'react';

const BASE = process.env.REACT_APP_API_URL || 'https://amanshukla.onrender.com';

function Dashboard() {
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await fetch(BASE + '/api/medicines');
      const data = await response.json();
      setMedicines(data);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    }
  };

  const deleteMedicine = async (id) => {
    try {
      await fetch(BASE + '/api/medicines/' + id, { method: 'DELETE' });
      setMedicines(medicines.filter(function(m) { return m._id !== id; }));
    } catch (error) {
      console.error('Error deleting medicine:', error);
    }
  };

  return (
    <>
      <style>{`
        .dash-wrap {
          min-height: calc(100vh - 68px);
          padding: 36px 28px;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }
        .dash-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .dash-title {
          font-size: 2rem;
          font-weight: 900;
          color: #f1f5f9;
          letter-spacing: -1px;
        }
        .dash-title span {
          background: linear-gradient(135deg, #6366f1, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .dash-count {
          font-size: 0.88rem;
          color: #475569;
        }
        .dash-count strong { color: #818cf8; }
        .meds-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 18px;
          margin-bottom: 32px;
        }
        .med-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 24px;
          position: relative;
          transition: all 0.3s ease;
          overflow: hidden;
        }
        .med-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 3px;
          background: linear-gradient(90deg, #6366f1, #06b6d4);
        }
        .med-card:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(99,102,241,0.25);
          transform: translateY(-4px);
          box-shadow: 0 24px 48px rgba(0,0,0,0.4);
        }
        .med-name {
          font-size: 1.2rem;
          font-weight: 800;
          color: #f1f5f9;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding-right: 80px;
        }
        .med-detail {
          font-size: 0.85rem;
          color: #64748b;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .med-detail strong { color: #94a3b8; }
        .med-time-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 12px;
        }
        .med-time-tag {
          background: rgba(99,102,241,0.1);
          border: 1px solid rgba(99,102,241,0.2);
          color: #818cf8;
          padding: 3px 10px;
          border-radius: 999px;
          font-size: 0.75rem;
          font-family: 'Space Mono', monospace;
        }
        .med-added {
          margin-top: 14px;
          padding: 8px 12px;
          background: rgba(255,255,255,0.03);
          border-radius: 8px;
          font-size: 0.75rem;
          color: #334155;
        }
        .btn-delete {
          position: absolute;
          top: 16px; right: 16px;
          padding: 7px 14px;
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 10px;
          color: #ef4444;
          font-size: 0.78rem;
          font-weight: 700;
          font-family: 'Outfit', sans-serif;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-delete:hover {
          background: rgba(239,68,68,0.2);
          transform: scale(1.05);
        }
        .empty-state {
          text-align: center;
          padding: 80px 20px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 24px;
        }
        .empty-icon { font-size: 5rem; margin-bottom: 20px; }
        .empty-title { font-size: 1.3rem; font-weight: 800; color: #475569; margin-bottom: 10px; }
        .empty-sub { color: #334155; font-size: 0.88rem; }
        .empty-sub a { color: #818cf8; text-decoration: none; }
        .empty-sub a:hover { text-decoration: underline; }
      `}</style>

      <div className="dash-wrap">
        <div className="dash-header">
          <div className="dash-title">My <span>Medicines</span></div>
          <div className="dash-count">Total: <strong>{medicines.length}</strong> medicines</div>
        </div>

        {medicines.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💊</div>
            <div className="empty-title">Koi medicine nahi hai abhi!</div>
            <div className="empty-sub">
              <a href="/add">+ Add Medicine</a> karke shuru karo!
            </div>
          </div>
        ) : (
          <div className="meds-grid">
            {medicines.map(function(medicine) {
              return (
                <div key={medicine._id} className="med-card">
                  <button className="btn-delete" onClick={function() { deleteMedicine(medicine._id); }}>
                    Delete
                  </button>
                  <div className="med-name">
                    <span>💊</span>
                    {medicine.name}
                  </div>
                  <div className="med-detail">
                    <strong>Dosage:</strong> {medicine.dosage}
                  </div>
                  <div className="med-detail">
                    <strong>Frequency:</strong> {medicine.frequency}
                  </div>
                  <div className="med-time-tags">
                    {(Array.isArray(medicine.time) ? medicine.time : [medicine.time]).map(function(t, i) {
                      return <span key={i} className="med-time-tag">⏰ {t}</span>;
                    })}
                  </div>
                  <div className="med-added">
                    Added: {new Date(medicine.createdAt).toLocaleDateString()}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

export default Dashboard;
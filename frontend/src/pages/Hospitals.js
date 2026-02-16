import React, { useState, useEffect } from 'react';

const styles = `
  .page-wrap {
    min-height: calc(100vh - 68px);
    padding: 36px 28px;
    max-width: 1100px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }
  .page-title {
    font-size: 2rem;
    font-weight: 900;
    color: #f1f5f9;
    letter-spacing: -1px;
    margin-bottom: 6px;
  }
  .page-title span {
    background: linear-gradient(135deg, #06b6d4, #10b981);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .page-sub { color: #475569; font-size: 0.88rem; margin-bottom: 28px; }
  .search-bar { display: flex; gap: 12px; margin-bottom: 20px; }
  .search-input {
    flex: 1;
    padding: 14px 18px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 14px;
    color: #f1f5f9;
    font-size: 0.95rem;
    font-family: Outfit, sans-serif;
    outline: none;
    transition: all 0.3s ease;
  }
  .search-input::placeholder { color: #334155; }
  .search-input:focus { border-color: rgba(6,182,212,0.5); }
  .search-btn {
    padding: 14px 28px;
    background: linear-gradient(135deg, #06b6d4, #10b981);
    border: none;
    border-radius: 14px;
    color: white;
    font-size: 0.95rem;
    font-weight: 700;
    font-family: Outfit, sans-serif;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .search-btn:hover { transform: translateY(-2px); }
  .filter-chips { display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap; }
  .filter-chip {
    padding: 7px 16px;
    border-radius: 999px;
    font-size: 0.8rem;
    font-weight: 600;
    font-family: Outfit, sans-serif;
    cursor: pointer;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.03);
    color: #64748b;
    transition: all 0.2s ease;
  }
  .filter-chip:hover { background: rgba(6,182,212,0.1); color: #22d3ee; }
  .filter-chip.active { background: rgba(6,182,212,0.15); border-color: rgba(6,182,212,0.4); color: #22d3ee; }
  .hospitals-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 18px;
  }
  .hospital-card {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px;
    padding: 22px;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  .hospital-card:hover {
    background: rgba(255,255,255,0.05);
    border-color: rgba(6,182,212,0.25);
    transform: translateY(-4px);
    box-shadow: 0 24px 48px rgba(0,0,0,0.4);
  }
  .hospital-top { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 14px; }
  .hospital-icon {
    width: 48px; height: 48px;
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.4rem; flex-shrink: 0;
    background: rgba(6,182,212,0.12);
    border: 1px solid rgba(6,182,212,0.2);
  }
  .hospital-name { font-size: 1.05rem; font-weight: 700; color: #f1f5f9; margin-bottom: 4px; }
  .hospital-type {
    font-size: 0.75rem; color: #22d3ee;
    background: rgba(6,182,212,0.1);
    border: 1px solid rgba(6,182,212,0.2);
    padding: 2px 10px; border-radius: 999px; display: inline-block;
  }
  .hospital-details { display: flex; flex-direction: column; gap: 7px; margin-bottom: 16px; }
  .hospital-detail { display: flex; align-items: center; gap: 8px; font-size: 0.83rem; color: #64748b; }
  .hospital-actions { display: flex; gap: 8px; }
  .btn-directions {
    flex: 1; padding: 10px;
    background: rgba(6,182,212,0.1);
    border: 1px solid rgba(6,182,212,0.2);
    border-radius: 10px; color: #22d3ee;
    font-size: 0.82rem; font-weight: 600;
    font-family: Outfit, sans-serif; cursor: pointer;
    transition: all 0.2s ease;
    display: flex; align-items: center; justify-content: center; gap: 6px;
    text-decoration: none;
  }
  .btn-directions:hover { background: rgba(6,182,212,0.2); transform: translateY(-1px); }
  .btn-call {
    flex: 1; padding: 10px;
    background: rgba(16,185,129,0.1);
    border: 1px solid rgba(16,185,129,0.2);
    border-radius: 10px; color: #10b981;
    font-size: 0.82rem; font-weight: 600;
    font-family: Outfit, sans-serif; cursor: pointer;
    transition: all 0.2s ease;
    display: flex; align-items: center; justify-content: center; gap: 6px;
    text-decoration: none;
  }
  .btn-call:hover { background: rgba(16,185,129,0.2); transform: translateY(-1px); }
  .open-badge {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 0.72rem; padding: 2px 8px;
    border-radius: 999px; font-weight: 600;
  }
  .open-badge.open { background: rgba(16,185,129,0.1); color: #10b981; border: 1px solid rgba(16,185,129,0.2); }
  .open-badge.closed { background: rgba(239,68,68,0.1); color: #ef4444; border: 1px solid rgba(239,68,68,0.2); }
  .location-banner {
    background: rgba(6,182,212,0.05);
    border: 1px solid rgba(6,182,212,0.15);
    border-radius: 16px; padding: 16px 20px; margin-bottom: 24px;
    display: flex; align-items: center; gap: 12px;
  }
  .location-banner p { font-size: 0.85rem; color: #64748b; }
  .location-banner strong { color: #22d3ee; }
`;

const HOSPITALS = [
  { name: 'AIIMS Hospital', type: 'Government', address: 'Ansari Nagar, New Delhi', phone: '01126588500', distance: '2.3 km', rating: 4.5, open: true },
  { name: 'Apollo Hospital', type: 'Private', address: 'Sarita Vihar, Delhi', phone: '01171791090', distance: '3.1 km', rating: 4.7, open: true },
  { name: 'Fortis Hospital', type: 'Private', address: 'Vasant Kunj, New Delhi', phone: '01142776222', distance: '4.5 km', rating: 4.4, open: true },
  { name: 'Max Super Speciality', type: 'Private', address: 'Saket, New Delhi', phone: '01126515050', distance: '5.2 km', rating: 4.6, open: false },
  { name: 'Safdarjung Hospital', type: 'Government', address: 'Ansari Nagar West, Delhi', phone: '01126707444', distance: '6.8 km', rating: 4.2, open: true },
  { name: 'Medanta Hospital', type: 'Private', address: 'Sector 38, Gurugram', phone: '01244141414', distance: '8.1 km', rating: 4.8, open: true },
  { name: 'City Pharmacy', type: 'Pharmacy', address: 'MG Road, Near Metro', phone: '9876543210', distance: '0.5 km', rating: 4.3, open: true },
  { name: 'HealthCare Clinic', type: 'Clinic', address: 'Sector 12, Near Park', phone: '9988776655', distance: '1.1 km', rating: 4.1, open: false },
];

const FILTERS = ['All', 'Hospital', 'Clinic', 'Pharmacy', 'Government', 'Private'];

function Hospitals() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [location, setLocation] = useState('Detecting...');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => setLocation('Your Current Location'),
        () => setLocation('New Delhi, India')
      );
    }
  }, []);

  const filtered = HOSPITALS.filter(h => {
    const matchSearch = h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.address.toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === 'All' || h.type === activeFilter;
    return matchSearch && matchFilter;
  });

  return (
    <React.Fragment>
      <style>{styles}</style>
      <div className="page-wrap">
        <div className="page-title">Nearby <span>Hospitals</span></div>
        <div className="page-sub">Find hospitals, clinics and pharmacies near you</div>

        <div className="location-banner">
          <span style={{fontSize:'1.5rem'}}>📍</span>
          <p>Showing results near: <strong>{location}</strong></p>
        </div>

        <div className="search-bar">
          <input
            className="search-input"
            type="text"
            placeholder="Search hospitals, clinics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="search-btn">Search</button>
        </div>

        <div className="filter-chips">
          {FILTERS.map(f => (
            <button
              key={f}
              className={f === activeFilter ? 'filter-chip active' : 'filter-chip'}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="hospitals-grid">
          {filtered.map((h, i) => (
            <div key={i} className="hospital-card">
              <div className="hospital-top">
                <div className="hospital-icon">🏥</div>
                <div>
                  <div className="hospital-name">{h.name}</div>
                  <span className="hospital-type">{h.type}</span>
                </div>
              </div>
              <div className="hospital-details">
                <div className="hospital-detail">📍 {h.address}</div>
                <div className="hospital-detail">
                  📏 {h.distance}
                  <span style={{marginLeft:'8px'}}>⭐ {h.rating}</span>
                  <span className={h.open ? 'open-badge open' : 'open-badge closed'} style={{marginLeft:'8px'}}>
                    {h.open ? 'Open' : 'Closed'}
                  </span>
                </div>
              </div>
              <div className="hospital-actions">
                <a
                  className="btn-directions"
                  href={'https://www.google.com/maps/search/' + encodeURIComponent(h.name)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Directions
                </a>
                <a className="btn-call" href={'tel:' + h.phone}>
                  Call
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
}

export default Hospitals;
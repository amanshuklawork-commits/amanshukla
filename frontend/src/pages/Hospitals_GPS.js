import React, { useState, useEffect } from 'react';

const styles = `
  .hospitals-wrap {
    min-height: calc(100vh - 68px);
    padding: 40px 28px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .hosp-header {
    margin-bottom: 32px;
    animation: fadeUp 0.5s ease;
  }

  .hosp-title {
    font-size: 2.5rem;
    font-weight: 900;
    color: var(--text-primary);
    margin-bottom: 8px;
  }

  .hosp-title span {
    background: linear-gradient(135deg, #6366f1, #06b6d4);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .location-banner {
    background: rgba(99,102,241,0.1);
    border: 1px solid rgba(99,102,241,0.2);
    border-radius: 14px;
    padding: 14px 18px;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--text-primary);
  }

  .location-icon {
    font-size: 1.3rem;
  }

  .location-text {
    flex: 1;
    font-size: 0.9rem;
  }

  .gps-btn {
    padding: 8px 16px;
    background: linear-gradient(135deg, #6366f1, #06b6d4);
    color: white;
    border: none;
    border-radius: 10px;
    font-weight: 700;
    cursor: pointer;
    font-size: 0.85rem;
    transition: all 0.3s ease;
  }

  .gps-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 15px rgba(99,102,241,0.4);
  }

  .filters {
    display: flex;
    gap: 10px;
    margin-bottom: 28px;
    flex-wrap: wrap;
  }

  .filter-chip {
    padding: 10px 20px;
    border-radius: 999px;
    border: 1px solid var(--border-color);
    background: var(--card-bg);
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
    font-size: 0.85rem;
  }

  .filter-chip:hover {
    border-color: rgba(99,102,241,0.3);
    background: rgba(99,102,241,0.1);
  }

  .filter-chip.active {
    background: linear-gradient(135deg, #6366f1, #06b6d4);
    color: white;
    border-color: transparent;
  }

  .hosp-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 20px;
  }

  .hosp-card {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 20px;
    padding: 24px;
    transition: all 0.3s ease;
  }

  .hosp-card:hover {
    background: var(--card-hover-bg);
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(99,102,241,0.15);
  }

  .hosp-name {
    font-size: 1.3rem;
    font-weight: 800;
    color: var(--text-primary);
    margin-bottom: 12px;
  }

  .hosp-type {
    display: inline-block;
    padding: 4px 12px;
    background: rgba(99,102,241,0.1);
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 700;
    color: #6366f1;
    margin-bottom: 12px;
  }

  .hosp-detail {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 10px;
    color: var(--text-secondary);
    font-size: 0.9rem;
    line-height: 1.5;
  }

  .hosp-icon {
    font-size: 1rem;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .hosp-actions {
    display: flex;
    gap: 10px;
    margin-top: 16px;
  }

  .hosp-btn {
    flex: 1;
    padding: 12px;
    border-radius: 12px;
    border: none;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .btn-directions {
    background: linear-gradient(135deg, #6366f1, #06b6d4);
    color: white;
  }

  .btn-directions:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(99,102,241,0.4);
  }

  .btn-call {
    background: rgba(16,185,129,0.1);
    color: #10b981;
    border: 1px solid rgba(16,185,129,0.3);
  }

  .btn-call:hover {
    background: rgba(16,185,129,0.2);
  }

  .loading-state {
    text-align: center;
    padding: 60px 20px;
    color: var(--text-tertiary);
  }

  .spinner {
    border: 4px solid rgba(99,102,241,0.1);
    border-left-color: #6366f1;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
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

  .retry-btn {
    background: #6366f1;
    color: white;
    border: none;
    padding: 12px 30px;
    border-radius: 30px;
    font-weight: 700;
    cursor: pointer;
    margin-top: 20px;
    transition: all 0.3s ease;
  }

  .retry-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 20px rgba(99,102,241,0.4);
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 768px) {
    .hosp-title { font-size: 2rem; }
    .filters { gap: 8px; }
    .filter-chip { padding: 8px 14px; font-size: 0.8rem; }
  }
`;

function Hospitals() {
  const [filter, setFilter] = useState('All');
  const [userLocation, setUserLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (err) => {
          setError('Location access denied. Please enable GPS and refresh.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation not supported by your browser.');
    }
  }, []);

  // Fetch nearby hospitals
  const fetchHospitals = async () => {
    if (!userLocation) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const radius = 5000;
      const query = `
        [out:json][timeout:10];
        (
          node["amenity"="hospital"](around:${radius},${userLocation.lat},${userLocation.lng});
          way["amenity"="hospital"](around:${radius},${userLocation.lat},${userLocation.lng});
        );
        out body;
      `;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const data = await response.json();
      
      const hospitalsList = data.elements.map(el => {
        let lat = el.lat;
        let lon = el.lon;
        if (el.type === 'way') {
          if (el.center) {
            lat = el.center.lat;
            lon = el.center.lon;
          } else {
            return null;
          }
        }
        const tags = el.tags || {};
        const name = tags.name || 'Unnamed Hospital';
        const phone = tags.phone || tags['contact:phone'] || '';
        const address = tags['addr:full'] || tags.address || 
                       `${tags['addr:street'] || ''} ${tags['addr:housenumber'] || ''}`.trim() || 
                       'Address not available';
        let type = 'Private';
        if (tags.operator && (tags.operator.toLowerCase().includes('govt') || tags.operator.toLowerCase().includes('government'))) {
          type = 'Government';
        } else if (tags.name && (tags.name.toLowerCase().includes('aiims') || tags.name.toLowerCase().includes('safdarjung'))) {
          type = 'Government';
        }
        
        return {
          id: el.id,
          name,
          lat,
          lng: lon,
          phone,
          address,
          type,
          distance: calculateDistance(userLocation.lat, userLocation.lng, lat, lon)
        };
      }).filter(h => h !== null);
      
      const unique = [];
      const seen = new Set();
      hospitalsList.forEach(h => {
        if (!seen.has(h.name)) {
          seen.add(h.name);
          unique.push(h);
        }
      });
      
      unique.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
      setHospitals(unique);
    } catch (err) {
      console.error(err);
      if (err.name === 'AbortError') {
        setError('Request timed out. Please try again.');
      } else {
        setError('Failed to fetch hospitals. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userLocation) {
      fetchHospitals();
    }
  }, [userLocation]); // eslint-disable-line react-hooks/exhaustive-deps

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1) + ' km';
  };

  const openDirections = (lat, lng, name) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
  };

  const makeCall = (phone) => {
    if (phone) {
      window.location.href = `tel:${phone}`;
    } else {
      alert('Phone number not available');
    }
  };

  const filtered = hospitals.filter(h => {
    if (filter === 'All') return true;
    return h.type === filter;
  });

  return (
    <>
      <style>{styles}</style>
      <div className="hospitals-wrap">
        <div className="hosp-header">
          <h1 className="hosp-title">Nearby <span>Hospitals</span></h1>
        </div>

        <div className="location-banner">
          <span className="location-icon">📍</span>
          <div className="location-text">
            {userLocation ? 'Showing hospitals near your current location' : 'Enable location to see nearby hospitals'}
          </div>
          {!userLocation && !loading && (
            <button className="gps-btn" onClick={() => window.location.reload()}>
              📡 Enable GPS
            </button>
          )}
        </div>

        {userLocation && (
          <div className="filters">
            {['All', 'Government', 'Private'].map(f => (
              <button
                key={f}
                className={`filter-chip ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Fetching nearby hospitals...</p>
          </div>
        )}

        {error && (
          <div className="empty-state">
            <div className="empty-icon">⚠️</div>
            <p>{error}</p>
            {userLocation && (
              <button className="retry-btn" onClick={fetchHospitals}>
                Try Again
              </button>
            )}
          </div>
        )}

        {!loading && !error && (
          <div className="hosp-grid">
            {filtered.length > 0 ? filtered.map((h) => (
              <div key={h.id} className="hosp-card">
                <h3 className="hosp-name">{h.name}</h3>
                <span className="hosp-type">{h.type}</span>
                <div className="hosp-detail">
                  <span className="hosp-icon">📍</span>
                  <span>{h.address}</span>
                </div>
                <div className="hosp-detail">
                  <span className="hosp-icon">📏</span>
                  <span>{h.distance} away</span>
                </div>
                {h.phone && (
                  <div className="hosp-detail">
                    <span className="hosp-icon">📞</span>
                    <span>{h.phone}</span>
                  </div>
                )}
                <div className="hosp-actions">
                  <button className="hosp-btn btn-directions" onClick={() => openDirections(h.lat, h.lng, h.name)}>
                    🗺️ Directions
                  </button>
                  <button className="hosp-btn btn-call" onClick={() => makeCall(h.phone)}>
                    📞 Call
                  </button>
                </div>
              </div>
            )) : (
              <div className="empty-state">
                <div className="empty-icon">🏥</div>
                <p>No hospitals found near you</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Hospitals;
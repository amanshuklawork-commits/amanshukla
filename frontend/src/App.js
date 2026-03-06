import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer';
import { ThemeProvider } from './context/ThemeContext';
import Chatbot from './components/Chatbot';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import Emergency from './pages/Emergency';
import Family from './pages/Family';
import HealthStats from './pages/HealthStats';
import HospitalsGPS from './pages/Hospitals_GPS';
import WaterTrackerFull from './pages/WaterTracker_Full';
import SymptomsTrackerFull from './pages/SymptomsTracker_Full';
import AddMedicine from './pages/AddMedicine';

const PAGE_COLORS = {
  '/':              'linear-gradient(135deg, #6366f1, #06b6d4)',
  '/dashboard':     'linear-gradient(135deg, #6366f1, #818cf8)',
  '/hospitals':     'linear-gradient(135deg, #06b6d4, #0ea5e9)',
  '/calendar':      'linear-gradient(135deg, #10b981, #34d399)',
  '/emergency':     'linear-gradient(135deg, #ef4444, #f87171)',
  '/health-stats':  'linear-gradient(135deg, #f59e0b, #fbbf24)',
  '/water-tracker': 'linear-gradient(135deg, #06b6d4, #67e8f9)',
  '/symptoms':      'linear-gradient(135deg, #ec4899, #f472b6)',
  '/family':        'linear-gradient(135deg, #14b8a6, #2dd4bf)',
  '/add-medicine':  'linear-gradient(135deg, #6366f1, #a78bfa)',
};

// ===== FLIP TRANSITION (must be inside Router) =====
function AnimatedRoutes() {
  const location = useLocation();
  const [displayedPath, setDisplayedPath] = useState(location.pathname);
  const [flipping, setFlipping]           = useState(false);
  const [nextPath, setNextPath]           = useState(null);
  const [originX, setOriginX]             = useState('50%');
  const [originY, setOriginY]             = useState('50%');
  const pendingPath = useRef(null);

  // Capture click origin from card
  useEffect(() => {
    const onClick = (e) => {
      const card = e.target.closest('a, button');
      if (!card) return;
      const rect = card.getBoundingClientRect();
      setOriginX(`${Math.round(rect.left + rect.width  / 2)}px`);
      setOriginY(`${Math.round(rect.top  + rect.height / 2)}px`);
    };
    window.addEventListener('click', onClick, true);
    return () => window.removeEventListener('click', onClick, true);
  }, []);

  // Trigger flip on route change
  useEffect(() => {
    if (location.pathname === displayedPath) return;
    if (flipping) return;
    pendingPath.current = location.pathname;
    setNextPath(location.pathname);
    setFlipping(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const onAnimEnd = () => {
    setDisplayedPath(pendingPath.current);
    setNextPath(null);
    setFlipping(false);
  };

  const flipBg = PAGE_COLORS[pendingPath.current || location.pathname] || PAGE_COLORS['/'];

  const renderPage = (path) => {
    switch (path) {
      case '/':              return <Home />;
      case '/dashboard':     return <Dashboard />;
      case '/calendar':      return <Calendar />;
      case '/emergency':     return <Emergency />;
      case '/family':        return <Family />;
      case '/health-stats':  return <HealthStats />;
      case '/hospitals':     return <HospitalsGPS />;
      case '/water-tracker': return <WaterTrackerFull />;
      case '/symptoms':      return <SymptomsTrackerFull />;
      case '/add-medicine':  return <AddMedicine />;
      default:               return <Home />;
    }
  };

  return (
    <>
      <style>{`
        .ft-scene {
          perspective: 1600px;
          width: 100%;
          min-height: 100vh;
        }
        .ft-card {
          width: 100%;
          min-height: 100vh;
          position: relative;
          transform-style: preserve-3d;
        }
        .ft-card.animating {
          animation: ft-flip 0.72s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes ft-flip {
          0%   { transform: rotateY(0deg)   scale(1);    filter: brightness(1); }
          28%  { transform: rotateY(50deg)  scale(0.93); filter: brightness(0.45); }
          50%  { transform: rotateY(90deg)  scale(0.88); filter: brightness(0.1); }
          72%  { transform: rotateY(130deg) scale(0.93); filter: brightness(0.45); }
          100% { transform: rotateY(180deg) scale(1);    filter: brightness(1); }
        }
        .ft-face {
          position: absolute;
          top: 0; left: 0;
          width: 100%;
          min-height: 100vh;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .ft-front { transform: rotateY(0deg); }
        .ft-back  { transform: rotateY(180deg); }

        .ft-flash {
          position: fixed; inset: 0;
          z-index: 9990;
          pointer-events: none;
          opacity: 0;
        }
        .ft-flash.on {
          animation: ft-flash-anim 0.72s ease forwards;
        }
        @keyframes ft-flash-anim {
          0%   { opacity: 0; }
          42%  { opacity: 0.85; }
          58%  { opacity: 0.85; }
          100% { opacity: 0; }
        }

        .ft-glare {
          position: fixed; inset: 0;
          z-index: 9991;
          pointer-events: none;
          opacity: 0;
          background: linear-gradient(
            108deg,
            transparent 25%,
            rgba(255,255,255,0.2) 50%,
            transparent 75%
          );
        }
        .ft-glare.on {
          animation: ft-glare-anim 0.72s ease forwards;
        }
        @keyframes ft-glare-anim {
          0%   { opacity: 0; transform: translateX(-110%); }
          35%  { opacity: 1; }
          100% { opacity: 0; transform: translateX(110%); }
        }
      `}</style>

      {/* Color flash overlay */}
      <div
        className={`ft-flash ${flipping ? 'on' : ''}`}
        style={{ background: flipBg }}
      />
      {/* Glare sweep */}
      <div className={`ft-glare ${flipping ? 'on' : ''}`} />

      <div className="ft-scene">
        <div
          className={`ft-card ${flipping ? 'animating' : ''}`}
          style={{ transformOrigin: `${originX} ${originY}` }}
          onAnimationEnd={flipping ? onAnimEnd : undefined}
        >
          {/* Front = current displayed page */}
          <div className="ft-face ft-front">
            {renderPage(displayedPath)}
          </div>

          {/* Back = incoming page */}
          {nextPath && (
            <div className="ft-face ft-back">
              {renderPage(nextPath)}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ===== APP =====
function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <AnimatedRoutes />
          <Footer />
          <Chatbot />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
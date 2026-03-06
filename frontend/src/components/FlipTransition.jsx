import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

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

export default function FlipTransition({ children }) {
  const location = useLocation();
  const [current, setCurrent]   = useState(children);
  const [next, setNext]         = useState(null);
  const [flipping, setFlipping] = useState(false);
  const [origin, setOrigin]     = useState({ x: '50%', y: '50%' });
  const pendingRef              = useRef(null);
  const pendingPath             = useRef(null);

  // Capture click origin
  useEffect(() => {
    const onClick = (e) => {
      const card = e.target.closest('a, button');
      if (!card) return;
      const rect = card.getBoundingClientRect();
      setOrigin({
        x: `${Math.round(rect.left + rect.width  / 2)}px`,
        y: `${Math.round(rect.top  + rect.height / 2)}px`,
      });
    };
    window.addEventListener('click', onClick, true);
    return () => window.removeEventListener('click', onClick, true);
  }, []);

  useEffect(() => {
    if (flipping) return;
    pendingRef.current  = children;
    pendingPath.current = location.pathname;
    setNext(children);
    setFlipping(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleFlipEnd = () => {
    setCurrent(pendingRef.current);
    setNext(null);
    setFlipping(false);
  };

  const bg = PAGE_COLORS[pendingPath.current] || PAGE_COLORS['/'];

  return (
    <>
      <style>{`
        .ft-scene {
          perspective: 1400px;
          position: relative;
          width: 100%;
          min-height: 100vh;
        }

        .ft-card {
          width: 100%;
          min-height: 100vh;
          position: relative;
          transform-style: preserve-3d;
          transition: none;
        }

        .ft-card.flip-anim {
          animation: flipCard 0.75s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes flipCard {
          0%   { transform: rotateY(0deg) scale(1);    filter: brightness(1); }
          30%  { transform: rotateY(45deg) scale(0.92); filter: brightness(0.5); }
          50%  { transform: rotateY(90deg) scale(0.88); filter: brightness(0.15); }
          70%  { transform: rotateY(135deg) scale(0.92); filter: brightness(0.5); }
          100% { transform: rotateY(180deg) scale(1);  filter: brightness(1); }
        }

        .ft-face {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .ft-face-front {
          transform: rotateY(0deg);
          z-index: 2;
        }

        .ft-face-back {
          transform: rotateY(180deg);
          z-index: 1;
        }

        /* Mid-flip color flash overlay */
        .ft-flash {
          position: fixed;
          inset: 0;
          z-index: 9997;
          pointer-events: none;
          opacity: 0;
          background: ${bg};
        }

        .ft-flash.active {
          animation: flashPulse 0.75s cubic-bezier(0.4,0,0.2,1) forwards;
        }

        @keyframes flashPulse {
          0%   { opacity: 0;    transform: scale(1); }
          45%  { opacity: 0.9;  transform: scale(1.04); }
          55%  { opacity: 0.9;  transform: scale(1.04); }
          100% { opacity: 0;    transform: scale(1); }
        }

        /* Glare sweep on flip */
        .ft-glare {
          position: fixed;
          inset: 0;
          z-index: 9998;
          pointer-events: none;
          opacity: 0;
          background: linear-gradient(
            105deg,
            transparent 30%,
            rgba(255,255,255,0.18) 50%,
            transparent 70%
          );
        }

        .ft-glare.active {
          animation: glareSweep 0.75s ease forwards;
        }

        @keyframes glareSweep {
          0%   { opacity: 0;   transform: translateX(-100%); }
          40%  { opacity: 1;   transform: translateX(0%); }
          100% { opacity: 0;   transform: translateX(100%); }
        }
      `}</style>

      {/* Color flash at midpoint */}
      <div className={`ft-flash ${flipping ? 'active' : ''}`}
           style={{ background: bg }} />

      {/* Glare sweep */}
      <div className={`ft-glare ${flipping ? 'active' : ''}`} />

      <div className="ft-scene">
        <div
          className={`ft-card ${flipping ? 'flip-anim' : ''}`}
          onAnimationEnd={flipping ? handleFlipEnd : undefined}
          style={{ transformOrigin: `${origin.x} ${origin.y}` }}
        >
          {/* Front face = current page */}
          <div className="ft-face ft-face-front">
            {current}
          </div>

          {/* Back face = next page */}
          <div className="ft-face ft-face-back">
            {next}
          </div>
        </div>
      </div>
    </>
  );
}
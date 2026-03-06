import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const COLORS = {
  '/':             ['#6366f1', '#06b6d4'],
  '/dashboard':    ['#6366f1', '#818cf8'],
  '/hospitals':    ['#06b6d4', '#0ea5e9'],
  '/calendar':     ['#10b981', '#34d399'],
  '/emergency':    ['#ef4444', '#f87171'],
  '/health-stats': ['#f59e0b', '#fbbf24'],
  '/water-tracker':['#06b6d4', '#67e8f9'],
  '/symptoms':     ['#ec4899', '#f472b6'],
  '/family':       ['#14b8a6', '#2dd4bf'],
  '/add-medicine': ['#6366f1', '#a78bfa'],
};

export default function LiquidTransition({ children }) {
  const location  = useLocation();
  const [phase, setPhase]         = useState('idle'); // idle | in | out
  const [displayed, setDisplayed] = useState(children);
  const [origin, setOrigin]       = useState({ x: '50%', y: '50%' });
  const pendingChildren           = useRef(null);
  const canvasRef                 = useRef(null);
  const animRef                   = useRef(null);
  const colors                    = COLORS[location.pathname] || ['#6366f1', '#06b6d4'];

  // Listen for nav — triggered by clicks on feat-cards
  useEffect(() => {
    const handleClick = (e) => {
      const card = e.target.closest('a[href], button[data-nav]');
      if (card) {
        const rect = card.getBoundingClientRect();
        setOrigin({
          x: `${rect.left + rect.width / 2}px`,
          y: `${rect.top  + rect.height / 2}px`,
        });
      }
    };
    window.addEventListener('click', handleClick, true);
    return () => window.removeEventListener('click', handleClick, true);
  }, []);

  useEffect(() => {
    if (phase === 'idle') return;
  }, [phase]);

  // On route change — trigger liquid animation
  useEffect(() => {
    pendingChildren.current = children;
    setPhase('out');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Canvas liquid blob animation
  useEffect(() => {
    if (phase === 'idle') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width  = window.innerWidth;
    const H = canvas.height = window.innerHeight;

    const cx = parseFloat(origin.x) || W / 2;
    const cy = parseFloat(origin.y) || H / 2;
    const maxR = Math.hypot(Math.max(cx, W - cx), Math.max(cy, H - cy)) * 1.1;

    let progress = phase === 'out' ? 0 : 1;
    const dir    = phase === 'out' ? 1 : -1;
    const speed  = 0.045;

    const [c1, c2] = colors;

    function drawBlob(t) {
      ctx.clearRect(0, 0, W, H);
      const r = maxR * t;
      if (r <= 0) return;

      // Wobbly blob via multiple sine waves
      ctx.beginPath();
      const pts = 80;
      for (let i = 0; i <= pts; i++) {
        const angle = (i / pts) * Math.PI * 2;
        const wobble = 1
          + 0.06 * Math.sin(angle * 3 + t * 8)
          + 0.04 * Math.sin(angle * 5 - t * 12)
          + 0.03 * Math.sin(angle * 7 + t * 6);
        const px = cx + Math.cos(angle) * r * wobble;
        const py = cy + Math.sin(angle) * r * wobble;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0,   c1 + 'ff');
      grad.addColorStop(0.5, c2 + 'dd');
      grad.addColorStop(1,   c1 + 'aa');
      ctx.fillStyle = grad;
      ctx.fill();
    }

    function tick() {
      progress = Math.min(1, Math.max(0, progress + dir * speed));
      drawBlob(progress);

      if (progress > 0 && progress < 1) {
        animRef.current = requestAnimationFrame(tick);
      } else if (phase === 'out' && progress >= 1) {
        // Full cover — swap content then reveal
        setDisplayed(pendingChildren.current);
        setPhase('in');
      } else if (phase === 'in' && progress <= 0) {
        ctx.clearRect(0, 0, W, H);
        setPhase('idle');
      }
    }

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  return (
    <>
      <div style={{ position: 'relative', zIndex: 1 }}>
        {displayed}
      </div>

      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9998,
          pointerEvents: phase !== 'idle' ? 'all' : 'none',
          opacity: phase !== 'idle' ? 1 : 0,
        }}
      />
    </>
  );
}
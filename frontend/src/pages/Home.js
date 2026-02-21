import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const styles = `
  body { background: #030306 !important; }

  #star-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 0;
    pointer-events: none;
  }

  .home-wrap {
    min-height: calc(100vh - 68px);
    position: relative;
    z-index: 2;
    overflow-x: hidden;
    background: transparent;
  }

  .hero {
    min-height: calc(100vh - 68px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 20px 20px;
    position: relative;
    z-index: 2;
    background: transparent;
  }

  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 999px;
    padding: 7px 18px;
    font-size: 0.78rem;
    color: #94a3b8;
    margin-bottom: 24px;
    animation: fadeUp 0.6s ease 0.1s both;
    backdrop-filter: blur(10px);
  }

  .live-dot {
    width: 7px; height: 7px;
    background: #10b981;
    border-radius: 50%;
    box-shadow: 0 0 8px #10b981;
    animation: livePulse 1.5s ease-in-out infinite;
  }

  @keyframes livePulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.5); opacity: 0.5; }
  }

  .hero-title {
    font-size: clamp(2.8rem, 7vw, 5.5rem);
    font-weight: 900;
    line-height: 1.05;
    letter-spacing: -3px;
    margin-bottom: 18px;
    animation: fadeUp 0.6s ease 0.2s both;
  }

  .hero-title .line1 {
    color: #f1f5f9;
    display: block;
    margin-bottom: 4px;
  }

  .hero-title .gradient-word {
    background: linear-gradient(135deg, #6366f1 0%, #06b6d4 35%, #10b981 65%, #f59e0b 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-size: 300% 300%;
    animation: gradFlow 5s ease infinite;
    display: block;
  }

  @keyframes gradFlow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .hero-sub {
    font-size: 1rem;
    color: #94a3b8;
    max-width: 480px;
    line-height: 1.75;
    margin-bottom: 32px;
    animation: fadeUp 0.6s ease 0.3s both;
  }

  .hero-btns {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 36px;
    animation: fadeUp 0.6s ease 0.4s both;
  }

  .btn-glow {
    padding: 14px 32px;
    border-radius: 14px;
    font-size: 0.95rem;
    font-weight: 700;
    font-family: 'Outfit', sans-serif;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 9px;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    border: none;
  }

  .btn-glow.primary {
    background: linear-gradient(135deg, #6366f1, #06b6d4);
    color: white;
    box-shadow: 0 0 35px rgba(99,102,241,0.4);
  }

  .btn-glow.primary:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 0 55px rgba(99,102,241,0.6);
  }

  .btn-glow.secondary {
    background: rgba(255,255,255,0.04);
    color: #94a3b8;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .btn-glow.secondary:hover {
    background: rgba(255,255,255,0.08);
    color: #f1f5f9;
    transform: translateY(-3px);
    border-color: rgba(255,255,255,0.2);
  }

  .btn-glow:active { transform: scale(0.97) !important; }

  .btn-glow::after {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
    transition: left 0.6s ease;
  }

  .btn-glow:hover::after { left: 100%; }

  .stats-band {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    width: 100%;
    max-width: 580px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px;
    overflow: hidden;
    animation: fadeUp 0.6s ease 0.5s both;
  }

  .stat-item {
    text-align: center;
    padding: 18px 12px;
    border-right: 1px solid rgba(255,255,255,0.06);
  }

  .stat-item:last-child { border-right: none; }

  .stat-num {
    font-size: 1.6rem;
    font-weight: 900;
    font-family: 'Space Mono', monospace;
    background: linear-gradient(135deg, #6366f1, #06b6d4);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: block;
    line-height: 1.1;
    white-space: nowrap;
  }

  .stat-lbl {
    font-size: 0.62rem;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-top: 5px;
    display: block;
  }

  .features-section {
    padding: 80px 32px;
    max-width: 1100px;
    margin: 0 auto;
    position: relative;
    z-index: 2;
  }

  .section-inner {
    background: rgba(99,102,241,0.02);
    border-top: 1px solid rgba(99,102,241,0.08);
    border-bottom: 1px solid rgba(99,102,241,0.08);
    margin: 0 -32px;
    padding: 70px 32px;
  }

  .section-title {
    text-align: center;
    font-size: 1.7rem;
    font-weight: 800;
    color: #f1f5f9;
    margin-bottom: 6px;
    letter-spacing: -0.5px;
  }

  .section-sub {
    text-align: center;
    color: #475569;
    font-size: 0.88rem;
    margin-bottom: 36px;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
    gap: 14px;
  }

  .feat-card {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 18px;
    padding: 26px 22px;
    cursor: pointer;
    transition: all 0.4s ease;
    position: relative;
    overflow: hidden;
    text-decoration: none;
    display: block;
  }

  .feat-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--card-gradient);
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  .feat-card:hover::before { opacity: 1; }

  .feat-card:hover {
    transform: translateY(-6px);
    border-color: var(--card-border);
    box-shadow: 0 24px 48px rgba(0,0,0,0.5), var(--card-glow);
  }

  .feat-card:active { transform: translateY(-2px) scale(0.98); }

  .feat-card.c1 { --card-gradient: linear-gradient(135deg, rgba(99,102,241,0.09), transparent); --card-border: rgba(99,102,241,0.35); --card-glow: 0 0 30px rgba(99,102,241,0.15); }
  .feat-card.c2 { --card-gradient: linear-gradient(135deg, rgba(6,182,212,0.09), transparent); --card-border: rgba(6,182,212,0.35); --card-glow: 0 0 30px rgba(6,182,212,0.15); }
  .feat-card.c3 { --card-gradient: linear-gradient(135deg, rgba(16,185,129,0.09), transparent); --card-border: rgba(16,185,129,0.35); --card-glow: 0 0 30px rgba(16,185,129,0.15); }
  .feat-card.c4 { --card-gradient: linear-gradient(135deg, rgba(245,158,11,0.09), transparent); --card-border: rgba(245,158,11,0.35); --card-glow: 0 0 30px rgba(245,158,11,0.15); }
  .feat-card.c5 { --card-gradient: linear-gradient(135deg, rgba(239,68,68,0.09), transparent); --card-border: rgba(239,68,68,0.35); --card-glow: 0 0 30px rgba(239,68,68,0.15); }
  .feat-card.c6 { --card-gradient: linear-gradient(135deg, rgba(168,85,247,0.09), transparent); --card-border: rgba(168,85,247,0.35); --card-glow: 0 0 30px rgba(168,85,247,0.15); }
  .feat-card.c7 { --card-gradient: linear-gradient(135deg, rgba(236,72,153,0.09), transparent); --card-border: rgba(236,72,153,0.35); --card-glow: 0 0 30px rgba(236,72,153,0.15); }
  .feat-card.c8 { --card-gradient: linear-gradient(135deg, rgba(20,184,166,0.09), transparent); --card-border: rgba(20,184,166,0.35); --card-glow: 0 0 30px rgba(20,184,166,0.15); }

  .feat-icon-wrap {
    width: 50px; height: 50px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    margin-bottom: 14px;
    position: relative;
    z-index: 1;
  }

  .feat-card.c1 .feat-icon-wrap { background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.2); }
  .feat-card.c2 .feat-icon-wrap { background: rgba(6,182,212,0.12); border: 1px solid rgba(6,182,212,0.2); }
  .feat-card.c3 .feat-icon-wrap { background: rgba(16,185,129,0.12); border: 1px solid rgba(16,185,129,0.2); }
  .feat-card.c4 .feat-icon-wrap { background: rgba(245,158,11,0.12); border: 1px solid rgba(245,158,11,0.2); }
  .feat-card.c5 .feat-icon-wrap { background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.2); }
  .feat-card.c6 .feat-icon-wrap { background: rgba(168,85,247,0.12); border: 1px solid rgba(168,85,247,0.2); }
  .feat-card.c7 .feat-icon-wrap { background: rgba(236,72,153,0.12); border: 1px solid rgba(236,72,153,0.2); }
  .feat-card.c8 .feat-icon-wrap { background: rgba(20,184,166,0.12); border: 1px solid rgba(20,184,166,0.2); }

  .feat-title {
    font-size: 0.98rem;
    font-weight: 700;
    color: #f1f5f9;
    margin-bottom: 6px;
    position: relative;
    z-index: 1;
  }

  .feat-desc {
    font-size: 0.8rem;
    color: #475569;
    line-height: 1.5;
    position: relative;
    z-index: 1;
  }

  .feat-arrow {
    position: absolute;
    top: 18px; right: 18px;
    color: #1e293b;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    z-index: 1;
  }

  .feat-card:hover .feat-arrow {
    color: #94a3b8;
    transform: translate(3px, -3px);
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 480px) {
    .stats-band {
      grid-template-columns: repeat(2, 1fr);
    }
    .stat-item:nth-child(2) { border-right: none; }
    .stat-item:nth-child(1),
    .stat-item:nth-child(2) {
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
  }
`;

function Home() {
  const canvasRef = useRef(null);
  const scrollYRef = useRef(0);
  const animFrameRef = useRef(null);

  const [stats, setStats] = useState({
    medicines: 0, features: 0, accuracy: 0, aiSupport: 0
  });

  // ── CANVAS STARS ──────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let width  = canvas.width  = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const STAR_COUNT = 200;
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x:     Math.random() * width,
      y:     Math.random() * height,
      r:     Math.random() * 1.6 + 0.3,
      speed: Math.random() * 0.006 + 0.002,
      phase: Math.random() * Math.PI * 2,
    }));

    let shootingStar = null;
    let lastShot = -9999;

    function spawnShootingStar(now) {
      shootingStar = {
        x:         Math.random() * width  * 0.7,
        y:         Math.random() * height * 0.4,
        vx:        7  + Math.random() * 5,
        vy:        4  + Math.random() * 3,
        len:       130 + Math.random() * 80,
        startTime: now,
        duration:  900 + Math.random() * 400,
      };
      lastShot = now;
    }

    function draw(now) {
      const parallax = scrollYRef.current * 0.12;

      // Dark background drawn on canvas itself
      ctx.fillStyle = '#030306';
      ctx.fillRect(0, 0, width, height);

      // Stars
      stars.forEach(s => {
        const alpha = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(now * s.speed + s.phase));
        const yPos  = ((s.y - parallax) % height + height) % height;
        ctx.beginPath();
        ctx.arc(s.x, yPos, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(2)})`;
        ctx.fill();
      });

      // Shooting star spawn
      if (now - lastShot > 5000) spawnShootingStar(now);

      if (shootingStar) {
        const elapsed  = now - shootingStar.startTime;
        const progress = elapsed / shootingStar.duration;

        if (progress >= 1) {
          shootingStar = null;
        } else {
          const sx    = shootingStar.x + shootingStar.vx * elapsed * 0.12;
          const sy    = shootingStar.y + shootingStar.vy * elapsed * 0.12;
          const tailX = sx - shootingStar.len * 0.85;
          const tailY = sy - shootingStar.len * 0.5;
          const alpha = progress < 0.65 ? 1 : 1 - (progress - 0.65) / 0.35;

          const grad = ctx.createLinearGradient(tailX, tailY, sx, sy);
          grad.addColorStop(0,   `rgba(255,255,255,0)`);
          grad.addColorStop(0.6, `rgba(180,220,255,${(alpha * 0.5).toFixed(2)})`);
          grad.addColorStop(1,   `rgba(255,255,255,${alpha.toFixed(2)})`);

          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(sx, sy);
          ctx.strokeStyle = grad;
          ctx.lineWidth   = 2;
          ctx.stroke();

          // Glow head
          ctx.beginPath();
          ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(2)})`;
          ctx.fill();
        }
      }

      animFrameRef.current = requestAnimationFrame(draw);
    }

    animFrameRef.current = requestAnimationFrame(draw);

    const onScroll  = () => { scrollYRef.current = window.scrollY; };
    const onResize  = () => {
      width  = canvas.width  = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // ── STATS COUNTER ─────────────────────────────────────────
  useEffect(() => {
    const targets = { medicines: 2847, features: 8, accuracy: 99, aiSupport: 24 };

    const med = setInterval(() => setStats(p => {
      if (p.medicines >= targets.medicines) { clearInterval(med); return p; }
      return { ...p, medicines: p.medicines + Math.min(31, targets.medicines - p.medicines) };
    }), 20);

    const feat = setInterval(() => setStats(p => {
      if (p.features >= targets.features) { clearInterval(feat); return p; }
      return { ...p, features: p.features + 1 };
    }), 200);

    const acc = setInterval(() => setStats(p => {
      if (p.accuracy >= targets.accuracy) { clearInterval(acc); return p; }
      return { ...p, accuracy: p.accuracy + Math.min(2, targets.accuracy - p.accuracy) };
    }), 30);

    const ai = setInterval(() => setStats(p => {
      if (p.aiSupport >= targets.aiSupport) { clearInterval(ai); return p; }
      return { ...p, aiSupport: p.aiSupport + 1 };
    }), 80);

    return () => { clearInterval(med); clearInterval(feat); clearInterval(acc); clearInterval(ai); };
  }, []);

  const features = [
    { icon: '💊', title: 'Medicine Tracker',   desc: 'Add, manage and track all your daily medications with smart reminders',          color: 'c1', link: '/dashboard' },
    { icon: '🏥', title: 'Nearby Hospitals',    desc: 'Find hospitals, clinics and pharmacies near your location instantly',             color: 'c2', link: '/hospitals' },
    { icon: '📅', title: 'Medicine Calendar',   desc: 'Visual calendar view of your complete medication schedule',                      color: 'c3', link: '/calendar'  },
    { icon: '🚨', title: 'Emergency Contacts',  desc: 'Quick access to emergency contacts and SOS calling feature',                     color: 'c5', link: '/emergency' },
    { icon: '📈', title: 'Health Stats',        desc: 'Charts and analytics of your health and medication adherence',                   color: 'c4', link: '/stats'     },
    { icon: '💧', title: 'Water Tracker',       desc: 'Track daily water intake and stay hydrated for better health',                   color: 'c6', link: '/water'     },
    { icon: '🌡️', title: 'Symptoms Tracker',   desc: 'Log and monitor your symptoms with AI-powered insights',                         color: 'c7', link: '/symptoms'  },
    { icon: '👨‍👩‍👧', title: 'Family Medicines', desc: 'Manage medications for your entire family in one place',                     color: 'c8', link: '/family'    },
  ];

  return (
    <>
      <style>{styles}</style>

      <canvas ref={canvasRef} id="star-canvas" />

      <div className="home-wrap">
        <div className="hero">
          <div className="hero-badge">
            <span className="live-dot" />
            AI-Powered Health Assistant — Always On
          </div>

          <h1 className="hero-title">
            <span className="line1">Your Personal</span>
            <span className="gradient-word">Health Guardian</span>
          </h1>

          <p className="hero-sub">
            Never miss a dose again. AI-powered medication reminders, health tracking, nearby hospitals — all in one place. 🏥
          </p>

          <div className="hero-btns">
            <Link to="/add"       className="btn-glow primary">➕ Add Medicine</Link>
            <Link to="/dashboard" className="btn-glow secondary">📋 View Dashboard</Link>
          </div>

          <div className="stats-band">
            <div className="stat-item">
              <span className="stat-num">{stats.medicines.toLocaleString()}+</span>
              <span className="stat-lbl">Medicines Tracked</span>
            </div>
            <div className="stat-item">
              <span className="stat-num">{stats.features}</span>
              <span className="stat-lbl">Features</span>
            </div>
            <div className="stat-item">
              <span className="stat-num">{stats.accuracy}%</span>
              <span className="stat-lbl">Accuracy</span>
            </div>
            <div className="stat-item">
              <span className="stat-num">{stats.aiSupport}/7</span>
              <span className="stat-lbl">AI Support</span>
            </div>
          </div>
        </div>

        <div className="features-section">
          <div className="section-inner">
            <h2 className="section-title">Everything You Need 🚀</h2>
            <p className="section-sub">8 powerful features to keep you and your family healthy</p>
            <div className="features-grid">
              {features.map((f, i) => (
                <Link to={f.link} key={i} className={`feat-card ${f.color}`}>
                  <span className="feat-arrow">↗</span>
                  <div className="feat-icon-wrap">{f.icon}</div>
                  <div className="feat-title">{f.title}</div>
                  <div className="feat-desc">{f.desc}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
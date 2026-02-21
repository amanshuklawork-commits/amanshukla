import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';  // 👈 lowercase 'c' – matches folder name
import './Navbar.css';

function DNALogo() {
  return (
    <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="dnaGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1"/>
          <stop offset="50%" stopColor="#06b6d4"/>
          <stop offset="100%" stopColor="#10b981"/>
        </linearGradient>
        <linearGradient id="dnaGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b"/>
          <stop offset="50%" stopColor="#ef4444"/>
          <stop offset="100%" stopColor="#a855f7"/>
        </linearGradient>
      </defs>

      <circle cx="19" cy="19" r="19" fill="url(#dnaGrad1)" opacity="0.15"/>
      <circle cx="19" cy="19" r="18" stroke="url(#dnaGrad1)" strokeWidth="1" fill="none" opacity="0.4"/>
      <rect x="16" y="9" width="6" height="20" rx="2" fill="url(#dnaGrad1)" opacity="0.9"/>
      <rect x="9" y="16" width="20" height="6" rx="2" fill="url(#dnaGrad1)" opacity="0.9"/>
      <circle cx="13" cy="13" r="2" fill="#06b6d4" opacity="0.8"/>
      <circle cx="25" cy="13" r="2" fill="#10b981" opacity="0.8"/>
      <circle cx="13" cy="25" r="2" fill="#f59e0b" opacity="0.8"/>
      <circle cx="25" cy="25" r="2" fill="#a855f7" opacity="0.8"/>
      <circle cx="19" cy="19" r="3" fill="white" opacity="0.95"/>
      <circle cx="19" cy="19" r="1.5" fill="url(#dnaGrad1)"/>
    </svg>
  );
}

function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { darkMode, toggleTheme } = useTheme();

  const links = [
    { to: '/', label: 'Home', icon: '🏠' },
    { to: '/dashboard', label: 'Dashboard', icon: '📋' },
    { to: '/add', label: 'Add Medicine', icon: '➕' },
    { to: '/hospitals', label: 'Hospitals', icon: '🏥' },
    { to: '/emergency', label: 'Emergency', icon: '🚨' },
  ];

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <div className="navbar-logo">
          <DNALogo />
        </div>
        <div className="navbar-title-wrap">
          <span className="navbar-title">MediRemind</span>
          <span className="navbar-subtitle">AI</span>
        </div>
      </Link>

      <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={location.pathname === link.to ? 'active' : ''}
            onClick={() => setMenuOpen(false)}
          >
            <span className="nav-icon">{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        ))}
      </div>

      <div className="navbar-right">
        <div className="health-score">
          <span className="score-dot"></span>
          <span>Health Score: <strong>92</strong></span>
        </div>

        <button className="theme-toggle" onClick={toggleTheme}>
          {darkMode ? '☀️' : '🌙'}
        </button>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
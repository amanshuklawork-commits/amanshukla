import React, { useState, useRef, useEffect } from 'react';

const BASE = process.env.REACT_APP_API_URL || 'https://amanshukla.onrender.com';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Namaste! Main MediRemind AI hun - tera health ka best dost! Koi bhi sawaal pooch, seedha jawab dunga! 😄💊' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch(BASE + '/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg })
      });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'bot', text: data.reply || 'Dobara try karo yaar!' }]);
    } catch {
      const errors = [
        'Arre yaar! Thoda network ka drama ho gaya!',
        'Oops! Main gym mein tha! Ab ready hun!',
        'Technical chai thandi ho gayi! Thodi der baad try karo!'
      ];
      setMessages(prev => [...prev, { role: 'bot', text: errors[Math.floor(Math.random() * errors.length)] }]);
    }
    setLoading(false);
  };

  return (
    <React.Fragment>
      <style>{`
        /* ===== MINI ROBOT BUTTON ===== */
        .cb-btn {
          position: fixed; bottom: 28px; right: 28px;
          width: 64px; height: 64px;
          background: transparent;
          border: none; cursor: pointer;
          z-index: 9999;
          transition: transform 0.3s ease;
          padding: 0;
        }
        .cb-btn:hover { transform: scale(1.08); }
        .cb-btn:hover .robot-body { box-shadow: 0 0 30px rgba(99,102,241,0.7), 0 0 60px rgba(6,182,212,0.3); }

        /* Robot SVG wrapper */
        .robot-wrap {
          position: relative;
          width: 64px; height: 64px;
        }

        /* Orbit ring */
        .orbit-ring {
          position: absolute; inset: -8px;
          border-radius: 50%;
          border: 1.5px solid rgba(99,102,241,0.25);
          border-top-color: rgba(99,102,241,0.7);
          border-right-color: rgba(6,182,212,0.5);
          animation: orbitSpin 3s linear infinite;
        }
        .orbit-ring::after {
          content: '';
          position: absolute;
          top: -4px; left: 50%;
          transform: translateX(-50%);
          width: 7px; height: 7px;
          background: linear-gradient(135deg, #6366f1, #06b6d4);
          border-radius: 50%;
          box-shadow: 0 0 8px rgba(99,102,241,0.8);
        }

        @keyframes orbitSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Robot body */
        .robot-body {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, #0f0f1a, #1a1a2e);
          border: 1.5px solid rgba(99,102,241,0.4);
          border-radius: 16px;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 3px;
          box-shadow: 0 0 20px rgba(99,102,241,0.3), inset 0 1px 0 rgba(255,255,255,0.05);
          transition: box-shadow 0.3s ease;
          overflow: hidden;
        }

        /* Robot head */
        .robot-head {
          width: 28px; height: 22px;
          background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(6,182,212,0.15));
          border: 1px solid rgba(99,102,241,0.35);
          border-radius: 8px;
          position: relative;
          display: flex; align-items: center; justify-content: center; gap: 5px;
        }

        /* Robot eyes */
        .robot-eye {
          width: 6px; height: 6px;
          background: #6366f1;
          border-radius: 50%;
          box-shadow: 0 0 6px #6366f1;
          animation: eyeBlink 3s ease-in-out infinite;
        }
        .robot-eye.right { background: #06b6d4; box-shadow: 0 0 6px #06b6d4; animation-delay: 0.15s; }

        @keyframes eyeBlink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }

        /* Antenna */
        .robot-antenna {
          position: absolute;
          top: -9px; left: 50%; transform: translateX(-50%);
          width: 2px; height: 8px;
          background: rgba(99,102,241,0.6);
          border-radius: 1px;
        }
        .robot-antenna::after {
          content: '';
          position: absolute;
          top: -4px; left: 50%; transform: translateX(-50%);
          width: 5px; height: 5px;
          background: #6366f1;
          border-radius: 50%;
          box-shadow: 0 0 6px #6366f1;
          animation: antennaPulse 1.5s ease-in-out infinite;
        }
        @keyframes antennaPulse {
          0%, 100% { opacity: 1; transform: translateX(-50%) scale(1); }
          50% { opacity: 0.4; transform: translateX(-50%) scale(0.7); }
        }

        /* Robot body lower */
        .robot-torso {
          width: 22px; height: 12px;
          background: linear-gradient(135deg, rgba(6,182,212,0.15), rgba(99,102,241,0.1));
          border: 1px solid rgba(6,182,212,0.25);
          border-radius: 5px;
          display: flex; align-items: center; justify-content: center; gap: 3px;
        }
        .robot-light {
          width: 4px; height: 4px; border-radius: 50%;
          animation: lightPulse 1.2s ease-in-out infinite;
        }
        .robot-light.l1 { background: #10b981; box-shadow: 0 0 4px #10b981; }
        .robot-light.l2 { background: #6366f1; box-shadow: 0 0 4px #6366f1; animation-delay: 0.4s; }
        .robot-light.l3 { background: #06b6d4; box-shadow: 0 0 4px #06b6d4; animation-delay: 0.8s; }

        @keyframes lightPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        /* Scan line */
        .robot-scan {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, transparent 0%, rgba(99,102,241,0.06) 50%, transparent 100%);
          animation: scanLine 2s linear infinite;
        }
        @keyframes scanLine {
          from { transform: translateY(-100%); }
          to { transform: translateY(100%); }
        }

        /* Close X overlay */
        .robot-close {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.1rem; color: #ef4444;
          opacity: 0; transition: opacity 0.2s ease;
          background: rgba(239,68,68,0.1);
          border-radius: 16px;
        }
        .cb-btn:hover .robot-close-wrap .robot-close { opacity: 1; }

        /* Pulse ring when closed */
        .pulse-ring {
          position: absolute; inset: -4px;
          border-radius: 50%;
          border: 2px solid rgba(99,102,241,0.3);
          animation: pulseRing 2s ease-out infinite;
        }
        @keyframes pulseRing {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.4); opacity: 0; }
        }

        /* ===== CHAT WINDOW ===== */
        .cb-window {
          position: fixed; bottom: 108px; right: 28px;
          width: 340px; height: 500px;
          background: #0a0a0f;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px; display: flex;
          flex-direction: column; z-index: 9999;
          box-shadow: 0 40px 80px rgba(0,0,0,0.6);
          overflow: hidden;
          animation: slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .cb-header {
          padding: 16px 18px;
          background: linear-gradient(135deg,rgba(99,102,241,0.15),rgba(6,182,212,0.1));
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex; align-items: center; justify-content: space-between;
        }
        .cb-header-left { display: flex; align-items: center; gap: 10px; }
        .cb-avatar {
          width: 36px; height: 36px; border-radius: 10px;
          background: linear-gradient(135deg,#6366f1,#06b6d4);
          display: flex; align-items: center; justify-content: center; font-size: 1rem;
        }
        .cb-name { font-size: 0.88rem; font-weight: 700; color: #f1f5f9; font-family: Outfit,sans-serif; }
        .cb-status { font-size: 0.7rem; color: #10b981; font-family: Outfit,sans-serif; display: flex; align-items: center; gap: 4px; }
        .cb-status-dot { width: 5px; height: 5px; background: #10b981; border-radius: 50%; animation: livePulse 1.5s ease-in-out infinite; }
        @keyframes livePulse { 0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(1.5);opacity:0.5;} }
        .cb-close {
          width: 28px; height: 28px; background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08); border-radius: 7px;
          color: #64748b; cursor: pointer; font-size: 0.85rem;
          display: flex; align-items: center; justify-content: center; transition: all 0.2s ease;
        }
        .cb-close:hover { background: rgba(239,68,68,0.1); color: #ef4444; }
        .cb-msgs {
          flex: 1; overflow-y: auto; padding: 14px;
          display: flex; flex-direction: column; gap: 10px;
        }
        .cb-msgs::-webkit-scrollbar { width: 3px; }
        .cb-msgs::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.3); border-radius: 999px; }
        .cb-msg { display: flex; gap: 8px; animation: msgIn 0.3s ease both; }
        @keyframes msgIn { from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);} }
        .cb-msg.user { flex-direction: row-reverse; }
        .cb-msg-icon {
          width: 26px; height: 26px; border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.75rem; flex-shrink: 0; margin-top: 2px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.07);
        }
        .cb-bubble {
          max-width: 78%; padding: 9px 13px; border-radius: 14px;
          font-size: 0.82rem; line-height: 1.55; font-family: Outfit,sans-serif;
        }
        .cb-msg.bot .cb-bubble {
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.07);
          color: #cbd5e1; border-radius: 4px 14px 14px 14px;
        }
        .cb-msg.user .cb-bubble {
          background: linear-gradient(135deg,rgba(99,102,241,0.25),rgba(6,182,212,0.2));
          border: 1px solid rgba(99,102,241,0.2); color: #e2e8f0;
          border-radius: 14px 4px 14px 14px;
        }
        .cb-typing { display: flex; gap: 4px; padding: 4px 2px; }
        .cb-typing-dot { width: 6px; height: 6px; border-radius: 50%; animation: typeBounce 1.2s ease-in-out infinite; }
        .cb-typing-dot:nth-child(1) { background: #6366f1; animation-delay: 0s; }
        .cb-typing-dot:nth-child(2) { background: #06b6d4; animation-delay: 0.2s; }
        .cb-typing-dot:nth-child(3) { background: #10b981; animation-delay: 0.4s; }
        @keyframes typeBounce { 0%,100%{transform:translateY(0);opacity:0.5;}50%{transform:translateY(-5px);opacity:1;} }
        .cb-chips {
          display: flex; flex-wrap: wrap; gap: 5px;
          padding: 8px 14px; border-top: 1px solid rgba(255,255,255,0.04);
        }
        .cb-chip {
          padding: 4px 11px; background: rgba(99,102,241,0.08);
          border: 1px solid rgba(99,102,241,0.15); border-radius: 999px;
          font-size: 0.7rem; color: #818cf8; cursor: pointer;
          font-family: Outfit,sans-serif; transition: all 0.2s ease;
        }
        .cb-chip:hover { background: rgba(99,102,241,0.15); transform: translateY(-1px); }
        .cb-input-row {
          padding: 10px 14px; border-top: 1px solid rgba(255,255,255,0.06);
          display: flex; gap: 8px; background: rgba(0,0,0,0.2);
        }
        .cb-input {
          flex: 1; background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08); border-radius: 10px;
          padding: 9px 13px; color: #f1f5f9; font-size: 0.82rem;
          font-family: Outfit,sans-serif; outline: none; transition: all 0.2s ease;
        }
        .cb-input::placeholder { color: #334155; }
        .cb-input:focus { border-color: rgba(99,102,241,0.4); }
        .cb-send {
          width: 36px; height: 36px;
          background: linear-gradient(135deg,#6366f1,#06b6d4);
          border: none; border-radius: 9px; color: white;
          cursor: pointer; font-size: 0.9rem; transition: all 0.2s ease;
          display: flex; align-items: center; justify-content: center;
        }
        .cb-send:hover { transform: scale(1.08); }
        .cb-send:disabled { opacity: 0.4; cursor: not-allowed; }
      `}</style>

      {/* ===== ROBOT BUTTON ===== */}
      <button className="cb-btn" onClick={() => setIsOpen(!isOpen)} title="MediRemind AI">
        <div className="robot-wrap">
          {!isOpen && <div className="pulse-ring" />}
          <div className="orbit-ring" />
          <div className="robot-body">
            <div className="robot-scan" />
            <div className="robot-head">
              <div className="robot-antenna" />
              <div className="robot-eye" />
              <div className="robot-eye right" />
            </div>
            <div className="robot-torso">
              <div className="robot-light l1" />
              <div className="robot-light l2" />
              <div className="robot-light l3" />
            </div>
            {isOpen && (
              <div className="robot-close">✕</div>
            )}
          </div>
        </div>
      </button>

      {/* ===== CHAT WINDOW ===== */}
      {isOpen && (
        <div className="cb-window">
          <div className="cb-header">
            <div className="cb-header-left">
              <div className="cb-avatar">🤖</div>
              <div>
                <div className="cb-name">MediRemind AI</div>
                <div className="cb-status">
                  <span className="cb-status-dot" />
                  Online - Hamesha Ready!
                </div>
              </div>
            </div>
            <button className="cb-close" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="cb-msgs">
            {messages.map((msg, i) => (
              <div key={i} className={'cb-msg ' + msg.role}>
                <div className="cb-msg-icon">{msg.role === 'bot' ? '🤖' : '👤'}</div>
                <div className="cb-bubble">{msg.text}</div>
              </div>
            ))}
            {loading && (
              <div className="cb-msg bot">
                <div className="cb-msg-icon">🤖</div>
                <div className="cb-bubble">
                  <div className="cb-typing">
                    <div className="cb-typing-dot" />
                    <div className="cb-typing-dot" />
                    <div className="cb-typing-dot" />
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="cb-chips">
            {['💊 Medicine tips', '💧 Water intake', '😴 Sleep advice', '🏃 Exercise tips'].map((s, i) => (
              <button key={i} className="cb-chip" onClick={() => sendMessage(s)}>{s}</button>
            ))}
          </div>

          <div className="cb-input-row">
            <input
              className="cb-input"
              type="text"
              placeholder="Kuch bhi pooch yaar! 😄"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
              disabled={loading}
            />
            <button className="cb-send" onClick={() => sendMessage()} disabled={loading || !input.trim()}>➤</button>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

export default Chatbot;
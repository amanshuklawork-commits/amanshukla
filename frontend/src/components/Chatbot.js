import React, { useState, useRef, useEffect } from 'react';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Namaste! 👋 Main MediRemind AI hun! Koi bhi health ya medicine question puchho! 😊' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Sorry! Backend se connect nahi ho pa raha. 🙏' }]);
    }
    setLoading(false);
  };

  return (
    <>
      <style>{`
        .cb-btn {
          position: fixed;
          bottom: 28px;
          right: 28px;
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #06b6d4);
          border: none;
          cursor: pointer;
          font-size: 1.4rem;
          box-shadow: 0 0 30px rgba(99,102,241,0.5);
          z-index: 9998;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cb-btn:hover { transform: scale(1.1); }
        .cb-btn:active { transform: scale(0.95); }

        .cb-dot {
          position: absolute;
          top: 2px; right: 2px;
          width: 12px; height: 12px;
          background: #10b981;
          border-radius: 50%;
          border: 2px solid #030306;
          animation: cbPulse 2s infinite;
        }

        @keyframes cbPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.3); }
        }

        .cb-window {
          position: fixed;
          bottom: 100px;
          right: 28px;
          width: 340px;
          height: 500px;
          background: #0a0a0f;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          display: flex;
          flex-direction: column;
          z-index: 9999;
          box-shadow: 0 40px 80px rgba(0,0,0,0.6);
          animation: cbIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          overflow: hidden;
        }

        @keyframes cbIn {
          from { opacity: 0; transform: translateY(20px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .cb-header {
          padding: 16px 18px;
          background: linear-gradient(135deg, rgba(99,102,241,0.15), rgba(6,182,212,0.1));
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .cb-header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .cb-avatar {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #6366f1, #06b6d4);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
        }

        .cb-name {
          font-size: 0.88rem;
          font-weight: 700;
          color: #f1f5f9;
          font-family: 'Outfit', sans-serif;
        }

        .cb-status {
          font-size: 0.7rem;
          color: #10b981;
          font-family: 'Outfit', sans-serif;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .cb-status-dot {
          width: 5px; height: 5px;
          background: #10b981;
          border-radius: 50%;
        }

        .cb-close {
          width: 28px; height: 28px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 7px;
          color: #64748b;
          cursor: pointer;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .cb-close:hover {
          background: rgba(239,68,68,0.1);
          color: #ef4444;
        }

        .cb-msgs {
          flex: 1;
          overflow-y: auto;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .cb-msgs::-webkit-scrollbar { width: 3px; }
        .cb-msgs::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.3); border-radius: 999px; }

        .cb-msg {
          display: flex;
          gap: 8px;
          animation: msgIn 0.3s ease;
        }

        @keyframes msgIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .cb-msg.user { flex-direction: row-reverse; }

        .cb-msg-icon {
          width: 26px; height: 26px;
          border-radius: 7px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          flex-shrink: 0;
          margin-top: 2px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.07);
        }

        .cb-bubble {
          max-width: 78%;
          padding: 9px 13px;
          border-radius: 14px;
          font-size: 0.82rem;
          line-height: 1.55;
          font-family: 'Outfit', sans-serif;
        }

        .cb-msg.bot .cb-bubble {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.07);
          color: #cbd5e1;
          border-radius: 4px 14px 14px 14px;
        }

        .cb-msg.user .cb-bubble {
          background: linear-gradient(135deg, rgba(99,102,241,0.25), rgba(6,182,212,0.2));
          border: 1px solid rgba(99,102,241,0.2);
          color: #e2e8f0;
          border-radius: 14px 4px 14px 14px;
        }

        .cb-typing {
          display: flex;
          gap: 4px;
          padding: 4px 2px;
        }

        .cb-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          animation: typeBounce 1.2s ease-in-out infinite;
        }

        .cb-dot:nth-child(1) { background: #6366f1; animation-delay: 0s; }
        .cb-dot:nth-child(2) { background: #06b6d4; animation-delay: 0.2s; }
        .cb-dot:nth-child(3) { background: #10b981; animation-delay: 0.4s; }

        @keyframes typeBounce {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(-5px); opacity: 1; }
        }

        .cb-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          padding: 8px 14px;
          border-top: 1px solid rgba(255,255,255,0.04);
        }

        .cb-chip {
          padding: 4px 11px;
          background: rgba(99,102,241,0.08);
          border: 1px solid rgba(99,102,241,0.15);
          border-radius: 999px;
          font-size: 0.7rem;
          color: #818cf8;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
          transition: all 0.2s ease;
        }

        .cb-chip:hover {
          background: rgba(99,102,241,0.15);
          transform: translateY(-1px);
        }

        .cb-input-row {
          padding: 10px 14px;
          border-top: 1px solid rgba(255,255,255,0.06);
          display: flex;
          gap: 8px;
          background: rgba(0,0,0,0.2);
        }

        .cb-input {
          flex: 1;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 9px 13px;
          color: #f1f5f9;
          font-size: 0.82rem;
          font-family: 'Outfit', sans-serif;
          outline: none;
          transition: all 0.2s ease;
        }

        .cb-input::placeholder { color: #334155; }

        .cb-input:focus {
          border-color: rgba(99,102,241,0.4);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.08);
        }

        .cb-send {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, #6366f1, #06b6d4);
          border: none;
          border-radius: 9px;
          color: white;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 12px rgba(99,102,241,0.3);
        }

        .cb-send:hover { transform: scale(1.08); }
        .cb-send:active { transform: scale(0.93); }
        .cb-send:disabled { opacity: 0.4; cursor: not-allowed; }
      `}</style>

      <button className="cb-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : '🤖'}
        <span className="cb-dot"></span>
      </button>

      {isOpen && (
        <div className="cb-window">
          <div className="cb-header">
            <div className="cb-header-left">
              <div className="cb-avatar">🤖</div>
              <div>
                <div className="cb-name">MediRemind AI</div>
                <div className="cb-status">
                  <span className="cb-status-dot"></span>
                  Online
                </div>
              </div>
            </div>
            <button className="cb-close" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="cb-msgs">
            {messages.map((msg, i) => (
              <div key={i} className={`cb-msg ${msg.role}`}>
                <div className="cb-msg-icon">
                  {msg.role === 'bot' ? '🤖' : '👤'}
                </div>
                <div className="cb-bubble">{msg.text}</div>
              </div>
            ))}
            {loading && (
              <div className="cb-msg bot">
                <div className="cb-msg-icon">🤖</div>
                <div className="cb-bubble">
                  <div className="cb-typing">
                    <div className="cb-dot"></div>
                    <div className="cb-dot"></div>
                    <div className="cb-dot"></div>
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
              placeholder="Health question puchho..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              disabled={loading}
            />
            <button className="cb-send" onClick={() => sendMessage()} disabled={loading || !input.trim()}>
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;
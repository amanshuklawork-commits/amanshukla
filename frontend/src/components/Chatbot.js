import React, { useState, useRef, useEffect } from 'react';

const BASE =
  process.env.REACT_APP_API_URL ||
  (window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : 'https://YOUR-RENDER-BACKEND.onrender.com');

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: 'Namaste! 👋 Main MediRemind AI hun – tera health ka best dost! Koi bhi sawaal pooch, seedha jawab dunga! 😄💊'
    }
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

    setMessages((prev) => [...prev, { role: 'user', text: msg }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${BASE}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: msg }),
        mode: 'cors'
      });

      if (!res.ok) throw new Error('API error');

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: data.reply || 'Hmm… kuch gadbad lag rahi hai 🤔' }
      ]);
    } catch (err) {
      const errors = [
        'Arre yaar! Thoda network ka drama ho gaya 📶 Ek baar aur try karo!',
        'Oops! Main gym mein tha 💪 Ab ready hun, dobara pooch!',
        'Technical chai thandi ho gayi ☕ Thodi der baad try karo!',
        'Backend se baat nahi ho pa rahi 😅 Retry karo!'
      ];
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: errors[Math.floor(Math.random() * errors.length)] }
      ]);
    }

    setLoading(false);
  };

  return (
    <>
      <button
        style={{
          position: 'fixed',
          bottom: 28,
          right: 28,
          width: 58,
          height: 58,
          borderRadius: '50%',
          background: 'linear-gradient(135deg,#6366f1,#06b6d4)',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1.4rem',
          color: '#fff',
          zIndex: 9999
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '✕' : '🤖'}
      </button>

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: 100,
            right: 28,
            width: 340,
            height: 480,
            background: '#0a0a0f',
            borderRadius: 20,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 9999,
            boxShadow: '0 30px 70px rgba(0,0,0,0.6)'
          }}
        >
          <div style={{ padding: 14, color: '#fff', fontWeight: 700 }}>
            MediRemind AI 🤖
          </div>

          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: 12,
              color: '#e5e7eb'
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  textAlign: m.role === 'user' ? 'right' : 'left',
                  marginBottom: 10
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    padding: '8px 12px',
                    borderRadius: 12,
                    background:
                      m.role === 'user'
                        ? 'rgba(99,102,241,0.35)'
                        : 'rgba(255,255,255,0.08)'
                  }}
                >
                  {m.text}
                </span>
              </div>
            ))}
            {loading && <div>🤖 Typing...</div>}
            <div ref={endRef} />
          </div>

          <div style={{ display: 'flex', padding: 10 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Kuch bhi pooch yaar 😄"
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 10,
                border: 'none',
                outline: 'none'
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              style={{
                marginLeft: 8,
                padding: '0 14px',
                borderRadius: 10,
                border: 'none',
                background: '#6366f1',
                color: '#fff'
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;

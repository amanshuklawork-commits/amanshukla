import React, { useState, useEffect } from 'react';

function Dashboard() {
  const [medicines, setMedicines] = useState([]);
  const [aiInput, setAiInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { 
      role: 'bot', 
      text: 'Namaste! 👋 Main MediRemind AI hoon. Aapka naam kya hai? Aur main aapki kaise help kar sakta hoon? 😊' 
    }
  ]);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/medicines');
      const data = await response.json();
      setMedicines(data);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    }
  };

  const deleteMedicine = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/medicines/${id}`, {
        method: 'DELETE'
      });
      setMedicines(medicines.filter(m => m.id !== id));
    } catch (error) {
      console.error('Error deleting medicine:', error);
    }
  };

  const askAI = async () => {
    if (!aiInput.trim()) return;
    
    const newHistory = [...chatHistory, { role: 'user', text: aiInput }];
    setChatHistory(newHistory);
    
    setLoading(true);
    setAiInput('');
    
    try {
      const response = await fetch('http://localhost:5000/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: aiInput,
          sessionId: 'user123'
        })
      });
      const data = await response.json();
      
      setChatHistory([...newHistory, { role: 'bot', text: data.reply }]);
      
    } catch (error) {
      setChatHistory([...newHistory, {
        role: 'bot',
        text: 'Sorry, abhi AI se connect nahi ho pa raha. Backend check karo! 🙏'
      }]);
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      askAI();
    }
  };

  const pageStyle = {
    padding: '40px 20px',
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '20px'
  };

  const titleStyle = {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#333',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  };

  const medicineGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '20px',
    marginBottom: '40px'
  };

  const medicineCardStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '16px',
    padding: '25px',
    color: 'white',
    position: 'relative',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
    transition: 'transform 0.3s ease'
  };

  const medicineNameStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  };

  const medicineDetailStyle = {
    fontSize: '16px',
    marginBottom: '8px',
    opacity: 0.9
  };

  const deleteButtonStyle = {
    position: 'absolute',
    top: '15px',
    right: '15px',
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 16px',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s ease'
  };

  const aiSectionStyle = {
    background: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
    borderRadius: '16px',
    padding: '30px',
    boxShadow: '0 4px 15px rgba(255, 152, 0, 0.2)'
  };

  const aiTitleStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  };

  const chatBoxStyle = {
    maxHeight: '400px',
    overflowY: 'auto',
    marginBottom: '20px',
    padding: '20px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.05)'
  };

  const messageStyle = (role) => ({
    marginBottom: '15px',
    textAlign: role === 'user' ? 'right' : 'left'
  });

  const messageBubbleStyle = (role) => ({
    display: 'inline-block',
    padding: '12px 18px',
    borderRadius: '16px',
    maxWidth: '75%',
    background: role === 'user' 
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      : '#f0f0f0',
    color: role === 'user' ? 'white' : '#333',
    fontSize: '15px',
    lineHeight: '1.6',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'left'
  });

  const aiInputStyle = {
    width: '100%',
    padding: '16px',
    border: '2px solid #FFB74D',
    borderRadius: '12px',
    fontSize: '16px',
    marginBottom: '15px',
    fontFamily: 'inherit',
    resize: 'vertical',
    minHeight: '100px'
  };

  const emptyStateStyle = {
    textAlign: 'center',
    padding: '60px 20px',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
  };

  return (
    <div style={pageStyle} className="fade-in">
      <div style={headerStyle}>
        <h1 style={titleStyle}>
          <span>📋</span> My Medicines
        </h1>
        <div style={{fontSize: '18px', color: '#666'}}>
          Total: <strong>{medicines.length}</strong> medicines
        </div>
      </div>

      {medicines.length === 0 ? (
        <div style={emptyStateStyle}>
          <div style={{fontSize: '80px', marginBottom: '20px'}}>💊</div>
          <h2 style={{color: '#666', marginBottom: '10px'}}>No medicines added yet!</h2>
          <p style={{color: '#999'}}>Click "Add Medicine" to get started</p>
        </div>
      ) : (
        <div style={medicineGridStyle}>
          {medicines.map((medicine) => (
            <div 
              key={medicine.id} 
              style={medicineCardStyle}
              className="card"
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <button 
                style={deleteButtonStyle}
                onClick={() => deleteMedicine(medicine.id)}
                onMouseOver={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                🗑️ Delete
              </button>

              <div style={medicineNameStyle}>
                <span>💊</span>
                {medicine.name}
              </div>

              <div style={medicineDetailStyle}>
                <strong>📏 Dosage:</strong> {medicine.dosage}
              </div>

              <div style={medicineDetailStyle}>
                <strong>📅 Frequency:</strong> {medicine.frequency}
              </div>

              <div style={medicineDetailStyle}>
                <strong>⏰ Times:</strong> {medicine.times?.join(', ') || 'Not set'}
              </div>

              <div style={{
                marginTop: '15px',
                padding: '10px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                fontSize: '14px'
              }}>
                Added: {new Date(medicine.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={aiSectionStyle} className="card">
        <h2 style={aiTitleStyle}>
          <span>🤖</span> MediRemind AI — Your Health Companion
        </h2>
        
        <p style={{color: '#E65100', fontSize: '14px', marginBottom: '20px', fontWeight: '500'}}>
          💙 Mental health, depression, stress — sab pe baat kar sakte hain. Main yahan hoon!
        </p>

        <div style={chatBoxStyle}>
          {chatHistory.map((msg, idx) => (
            <div key={idx} style={messageStyle(msg.role)}>
              <div style={messageBubbleStyle(msg.role)}>
                <strong style={{display: 'block', marginBottom: '5px'}}>
                  {msg.role === 'user' ? '👤 You' : '🤖 MediRemind AI'}
                </strong>
                <div>{msg.text}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div style={messageStyle('bot')}>
              <div style={messageBubbleStyle('bot')}>
                <span className="loading"></span>
                <span style={{marginLeft: '10px'}}>Typing...</span>
              </div>
            </div>
          )}
        </div>

        <textarea
          style={aiInputStyle}
          placeholder="Kuch bhi puchho... depression, anxiety, medicine advice, general health questions! 💬"
          value={aiInput}
          onChange={(e) => setAiInput(e.target.value)}
          onKeyPress={handleKeyPress}
          rows="3"
        />

        <button 
          className="btn btn-primary"
          onClick={askAI}
          disabled={loading || !aiInput.trim()}
          style={{width: '100%', fontSize: '18px', padding: '14px'}}
        >
          {loading ? (
            <>
              <span className="loading"></span> Processing...
            </>
          ) : (
            <>🚀 Send Message</>
          )}
        </button>
        
        <div style={{
          marginTop: '15px',
          padding: '10px',
          fontSize: '12px',
          color: '#E65100',
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.5)',
          borderRadius: '8px'
        }}>
          ⚕️ <strong>Disclaimer:</strong> AI advice general information hai. Serious health issues ke liye doctor consult karein.
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
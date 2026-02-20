const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Groq = require('groq-sdk');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Proper CORS setup
app.use(cors({
  origin: ['https://amanshukla-ashy.vercel.app', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// ✅ Root route - check karo backend live hai ya nahi
app.get('/', (req, res) => {
  res.json({ 
    status: 'MediRemind Backend Live 🚀',
    message: 'Server chal raha hai bilkul smooth!',
    timestamp: new Date().toISOString()
  });
});

// ✅ Initialize Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// ✅ Chatbot API endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        error: 'Bhai message toh bhej pehle! 😅' 
      });
    }

    console.log('📨 User message:', message);

    // System prompt for Hinglish responses
    const systemPrompt = `Tu MediRemind AI hai - ek friendly health assistant jo Hinglish mein baat karta hai. 
    Tera kaam hai logon ki health-related problems ka solution dena simple bhasha mein.
    Hamesha chhota aur helpful jawab de (max 3 lines). Emojis use kar.`;

    // Call Groq API
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      model: 'llama3-70b-8192',
      temperature: 0.7,
      max_tokens: 200
    });

    const reply = completion.choices[0]?.message?.content || 'Kuch technical issue aa gaya! Dobara try karo.';

    console.log('🤖 Bot reply:', reply);

    res.json({ 
      reply: reply,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Groq API Error:', error);
    
    // Funny error messages for users
    const funnyErrors = [
      'Arre yaar! Main thoda gym jaake aaya, ab ready hoon! Dobara try kar! 💪',
      'Oops! Meri chai thandi ho gayi! Ek minute mein aata hoon! ☕',
      'Bohot saare log baat kar rahe hain mujhse! Thodi der mein jawab dunga! 🚀',
      'Network ka drama ho gaya! Ek baar aur try kar yaar! 📡'
    ];
    
    res.status(500).json({ 
      reply: funnyErrors[Math.floor(Math.random() * funnyErrors.length)],
      error: error.message 
    });
  }
});

// ✅ Test route for API
app.get('/api/ai/chat', (req, res) => {
  res.json({ 
    message: 'Yeh POST route hai, GET nahi! Chatbot ko POST request bhejo 🤖',
    hint: 'Frontend mein fetch POST use kar raha hai na?'
  });
});

// ✅ Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: '✅ Healthy', 
    groq: process.env.GROQ_API_KEY ? '✅ API Key set hai' : '❌ API Key nahi hai',
    port: PORT,
    time: new Date().toISOString()
  });
});

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Yeh route exist nahi karta bhai!',
    availableRoutes: ['/', '/health', '/api/ai/chat (POST)']
  });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`
  🚀 MediRemind Backend Started!
  📍 Port: ${PORT}
  🤖 Groq: ${process.env.GROQ_API_KEY ? 'Connected' : 'API Key Missing!'}
  🌐 URL: https://amanshukla.onrender.com
  `);
});
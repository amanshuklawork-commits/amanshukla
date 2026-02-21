const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Groq = require('groq-sdk');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS setup
app.use(cors({
  origin: [
    'https://amanshukla-ashy.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:3002'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());
app.use(express.json());

// ==================== MEDICINE STORAGE ====================
let medicines = [];
let nextId = 1;

// GET all medicines
app.get('/api/medicines', (req, res) => {
  res.json(medicines);
});

// POST new medicine
app.post('/api/medicines', (req, res) => {
  const { name, dosage, frequency, time, phone } = req.body;
  if (!name || !dosage || !frequency || !time) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newMedicine = {
    _id: (nextId++).toString(),
    name,
    dosage,
    frequency,
    time: Array.isArray(time) ? time : [time],
    phone: phone || '',
    createdAt: new Date().toISOString()
  };

  medicines.push(newMedicine);
  res.status(201).json(newMedicine);
});

// DELETE medicine
app.delete('/api/medicines/:id', (req, res) => {
  const id = req.params.id;
  const initialLength = medicines.length;
  medicines = medicines.filter(med => med._id !== id);
  if (medicines.length === initialLength) {
    return res.status(404).json({ error: 'Medicine not found' });
  }
  res.json({ message: 'Medicine deleted' });
});

// ==================== AI CHAT ====================
app.get('/', (req, res) => {
  res.json({ status: 'MediRemind Backend Live 🚀' });
});

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ reply: 'Message bhej bhai!' });

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'Tu Hinglish mein health assistant hai.' },
        { role: 'user', content: message }
      ],
      model: 'llama3-70b-8192',
      temperature: 0.7,
      max_tokens: 200
    });

    const reply = completion.choices[0]?.message?.content || 'Kuch error aa gaya!';
    res.json({ reply });
  } catch (error) {
    res.status(500).json({ reply: 'Main thoda busy tha, ab ready hoon! Dobara try kar.' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: '✅ Healthy', medicines: medicines.length });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route exist nahi karta' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
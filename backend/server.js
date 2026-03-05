const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Groq = require('groq-sdk');
const https = require('https');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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

// ==================== NTFY NOTIFICATION HELPER ====================
function sendNtfyNotification({ topic, title, message, priority = 'high', tags = ['pill'] }) {
  if (!topic) {
    console.log('Ntfy: topic missing, skipping notification');
    return;
  }

  const body = JSON.stringify({ 
    topic: topic,
    message: message,
    title: title,
    priority: priority
  });

  const options = {
    hostname: 'ntfy.sh',
    port: 443,
    path: '/',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body)
    }
  };

  const req = https.request(options, (res) => {
    console.log(`Ntfy notification sent! Status: ${res.statusCode} | Topic: ${topic}`);
  });

  req.on('error', (err) => {
    console.error('Ntfy error:', err.message);
  });

  req.write(body);
  req.end();
}

// ==================== MEDICINE STORAGE ====================
let medicines = [];
let nextId = 1;

// GET all medicines
app.get('/api/medicines', (req, res) => {
  res.json(medicines);
});

// POST add new medicine
app.post('/api/medicines', (req, res) => {
  const { name, dosage, frequency, time, ntfyTopic } = req.body;

  if (!name || !dosage || !frequency || !time) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newMedicine = {
    _id: (nextId++).toString(),
    name,
    dosage,
    frequency,
    time: Array.isArray(time) ? time : [time],
    ntfyTopic: ntfyTopic || '',
    createdAt: new Date().toISOString()
  };

  medicines.push(newMedicine);

  // Send "medicine added" notification
  if (ntfyTopic) {
    sendNtfyNotification({
      topic: ntfyTopic,
      title: '✅ Medicine Added — MediRemind',
      message: `💊 ${name} (${dosage}) added successfully!\n⏰ Reminder set for: ${Array.isArray(time) ? time.join(', ') : time}\n📅 Frequency: ${frequency}\n\nStay healthy! 💪`,
      priority: 'default',
      tags: ['pill', 'white_check_mark']
    });
  }

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

// ==================== REMINDER CHECKER (every 60 seconds) ====================
setInterval(() => {
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  medicines.forEach(med => {
    const times = Array.isArray(med.time) ? med.time : [med.time];

    if (times.includes(currentTime) && med.ntfyTopic) {
      sendNtfyNotification({
        topic: med.ntfyTopic,
        title: '🔔 Medicine Reminder — MediRemind',
        message: `💊 Time to take ${med.name}!\n📏 Dosage: ${med.dosage}\n📅 Frequency: ${med.frequency}\n\nDon't skip your dose! Stay healthy 💪`,
        priority: 'urgent',
        tags: ['rotating_light', 'pill']
      });
    }
  });
}, 60000);

// ==================== AI CHAT ====================
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ reply: 'Message bhej bhai!' });

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Tu ek helpful health assistant hai. Hinglish mein jawab de. Short aur clear rakho.'
        },
        { role: 'user', content: message }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 200
    });

    const reply = completion.choices[0]?.message?.content || 'Kuch error aa gaya!';
    res.json({ reply });
  } catch (error) {
    console.error('Groq Error:', error.message);
    res.status(500).json({ reply: 'Main thoda busy tha, ab ready hoon! Dobara try kar.' });
  }
});

// ==================== BASIC ROUTES ====================
app.get('/', (req, res) => {
  res.json({ status: 'MediRemind Backend Live 🚀' });
});

app.get('/health', (req, res) => {
  res.json({ status: '✅ Healthy', medicines: medicines.length });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route exist nahi karta bhai!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
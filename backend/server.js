const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Groq = require('groq-sdk');

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
async function sendNtfyNotification({ topic, title, message, priority = 'default' }) {
  if (!topic) return;
  try {
    const res = await fetch('https://ntfy.sh/' + topic, {
      method: 'POST',
      headers: {
        'Title': title,
        'Priority': priority,
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Title': title
      },
      body: message
    });
    console.log('Ntfy Status:', res.status, '| Topic:', topic);
  } catch (err) {
    console.error('Ntfy error:', err.message);
  }
}

// ==================== TIME HELPERS ====================

// Get current IST time in 12hr format => "9:05 AM" or "1:30 PM"
function getCurrentTime12hr() {
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  let hours   = now.getHours();
  const mins  = String(now.getMinutes()).padStart(2, '0');
  const ampm  = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${mins} ${ampm}`;
}

// Normalize any time string to "H:MM AM/PM" for comparison
// Handles: "9:05 AM", "09:05 AM", "13:30" (24hr), "1:30 PM"
function normalizeTime(t) {
  if (!t) return '';
  t = t.trim();

  // Already has AM/PM
  if (/AM|PM/i.test(t)) {
    const match = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (match) {
      const h    = parseInt(match[1]);
      const m    = match[2];
      const ampm = match[3].toUpperCase();
      return `${h}:${m} ${ampm}`;
    }
  }

  // 24hr format => convert to 12hr
  const match24 = t.match(/^(\d{1,2}):(\d{2})$/);
  if (match24) {
    let h      = parseInt(match24[1]);
    const m    = match24[2];
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
  }

  return t;
}

// ==================== MEDICINE STORAGE ====================
let medicines = [];
let nextId = 1;

app.get('/api/medicines', (req, res) => {
  res.json(medicines);
});

app.post('/api/medicines', async (req, res) => {
  const { name, dosage, frequency, time, ntfyTopic } = req.body;

  if (!name || !dosage || !frequency || !time) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Normalize all times to 12hr on save
  const rawTimes = Array.isArray(time) ? time : [time];
  const normalizedTimes = rawTimes.map(normalizeTime);

  const newMedicine = {
    _id: (nextId++).toString(),
    name,
    dosage,
    frequency,
    time: normalizedTimes,
    ntfyTopic: ntfyTopic || '',
    createdAt: new Date().toISOString()
  };

  medicines.push(newMedicine);
  console.log('Medicine added:', name, '| Times (12hr):', normalizedTimes, '| ntfyTopic:', ntfyTopic);

  if (ntfyTopic) {
    await sendNtfyNotification({
      topic: ntfyTopic,
      title: 'Medicine Added - MediRemind',
      message:
        `${name} (${dosage}) added!\n` +
        `Reminder set for: ${normalizedTimes.join(', ')}\n` +
        `Frequency: ${frequency}`,
      priority: 'default'
    });
  }

  res.status(201).json(newMedicine);
});

app.delete('/api/medicines/:id', (req, res) => {
  const id = req.params.id;
  const before = medicines.length;
  medicines = medicines.filter(med => med._id !== id);
  if (medicines.length === before) {
    return res.status(404).json({ error: 'Medicine not found' });
  }
  res.json({ message: 'Medicine deleted' });
});

// ==================== REMINDER CHECKER ====================
setInterval(async () => {
  const currentTime = getCurrentTime12hr();
  console.log('Checking reminders at:', currentTime, '| Total medicines:', medicines.length);

  for (const med of medicines) {
    const times = Array.isArray(med.time) ? med.time : [med.time];
    const match = times.includes(currentTime);
    console.log('Medicine:', med.name, '| Times:', times, '| Current:', currentTime, '| Match:', match);

    if (match && med.ntfyTopic) {
      console.log('🔔 Sending reminder for:', med.name);
      await sendNtfyNotification({
        topic: med.ntfyTopic,
        title: 'Medicine Reminder - MediRemind',
        message:
          `Time to take ${med.name}!\n` +
          `Dosage: ${med.dosage}\n` +
          `Frequency: ${med.frequency}\n\n` +
          `Don't skip your dose!`,
        priority: 'urgent'
      });
    }
  }
}, 60000);

// ==================== AI CHAT ====================
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ reply: 'Message bhej bhai!' });

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'Tu ek helpful health assistant hai. Hinglish mein jawab de. Short aur clear rakho.' },
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
    res.status(500).json({ reply: 'Main thoda busy tha, dobara try kar.' });
  }
});

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
  console.log('🚀 Backend running on port ' + PORT);
});
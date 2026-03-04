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

// ==================== TELEGRAM HELPER ====================
function sendTelegramMessage(chatId, message) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token || !chatId) {
    console.log('Telegram: token ya chatId missing');
    return;
  }

  const text = encodeURIComponent(message);
  const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${text}&parse_mode=HTML`;

  https.get(url, (res) => {
    console.log('Telegram status:', res.statusCode);
  }).on('error', (err) => {
    console.error('Telegram error:', err.message);
  });
}

// ==================== MEDICINE STORAGE ====================
let medicines = [];
let nextId = 1;

app.get('/api/medicines', (req, res) => {
  res.json(medicines);
});

app.post('/api/medicines', (req, res) => {
  const { name, dosage, frequency, time, phone, telegramChatId } = req.body;
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
    telegramChatId: telegramChatId || '',
    createdAt: new Date().toISOString()
  };

  medicines.push(newMedicine);

  // Telegram notification — frontend se aaya chatId ya env se
  const chatId = telegramChatId || process.env.TELEGRAM_CHAT_ID;
  if (chatId) {
    sendTelegramMessage(
      chatId,
      `✅ <b>Medicine Added!</b>\n💊 <b>${name}</b> - ${dosage}\n⏰ Time: ${Array.isArray(time) ? time.join(', ') : time}\n📅 Frequency: ${frequency}`
    );
  }

  res.status(201).json(newMedicine);
});

app.delete('/api/medicines/:id', (req, res) => {
  const id = req.params.id;
  const initialLength = medicines.length;
  medicines = medicines.filter(med => med._id !== id);
  if (medicines.length === initialLength) {
    return res.status(404).json({ error: 'Medicine not found' });
  }
  res.json({ message: 'Medicine deleted' });
});

// ==================== REMINDER CHECKER ====================
setInterval(() => {
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  medicines.forEach(med => {
    const times = Array.isArray(med.time) ? med.time : [med.time];
    if (times.includes(currentTime)) {
      const chatId = med.telegramChatId || process.env.TELEGRAM_CHAT_ID;
      if (chatId) {
        sendTelegramMessage(
          chatId,
          `🔔 <b>Medicine Reminder!</b>\n💊 Time to take <b>${med.name}</b>\n📏 Dosage: ${med.dosage}\n\nStay healthy! 💪`
        );
      }
    }
  });
}, 60000);

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
    res.status(500).json({ reply: 'Main thoda busy tha, ab ready hoon! Dobara try kar.' });
  }
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
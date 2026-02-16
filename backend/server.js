require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

let medicines = [];
let idCounter = 1;
let conversationHistory = [];

app.get('/api/medicines', function(req, res) {
  res.json(medicines);
});

app.post('/api/medicines', function(req, res) {
  const medicine = {
    _id: idCounter++,
    name: req.body.name,
    dosage: req.body.dosage,
    frequency: req.body.frequency,
    time: req.body.time,
    createdAt: new Date()
  };
  medicines.push(medicine);
  res.status(201).json(medicine);
});

app.delete('/api/medicines/:id', function(req, res) {
  medicines = medicines.filter(function(m) { return m._id != req.params.id; });
  res.json({ message: 'Deleted' });
});

app.post('/api/ai/health-tip', async function(req, res) {
  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: 'Give a brief health tip for someone taking ' + req.body.medicine + '. Keep it under 3 sentences. Be friendly.' }],
      model: 'llama-3.3-70b-versatile'
    });
    res.json({ tip: completion.choices[0].message.content });
  } catch (err) {
    res.json({ tip: 'Yeh medicine bilkul sahi time pe lena! Paani khub peeyo! 💊' });
  }
});

app.post('/api/ai/chat', async function(req, res) {
  try {
    var userMessage = req.body.message;
    conversationHistory.push({ role: 'user', content: userMessage });
    if (conversationHistory.length > 20) {
      conversationHistory = conversationHistory.slice(-20);
    }
    var messages = [
      { role: 'system', content: 'Tum MediRemind AI ho - ek funny aur caring health assistant! Hinglish mein baat karo. Thoda humor rakho lekin health advice serious do. Hamesha positive aur encouraging raho! Jaise ek best friend jo doctor bhi ho!' }
    ];
    conversationHistory.forEach(function(msg) { messages.push(msg); });
    const completion = await groq.chat.completions.create({
      messages: messages,
      model: 'llama-3.3-70b-versatile'
    });
    var reply = completion.choices[0].message.content;
    conversationHistory.push({ role: 'assistant', content: reply });
    res.json({ reply: reply });
  } catch (err) {
    res.json({ reply: 'Yaar thodi der mein wapas aata hun! Abhi busy hun health tips dhundne mein! 😄 Retry karo!' });
  }
});

app.get('/', function(req, res) {
  res.json({ status: 'MediRemind Backend Live hai bhai! 🚀' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, function() { console.log('Backend chal pada! Port: ' + PORT); });
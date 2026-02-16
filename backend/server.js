require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

let medicines = [];
let idCounter = 1;

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
      messages: [{ role: 'user', content: 'Give a brief health tip for someone taking ' + req.body.medicine + '. Keep it under 3 sentences.' }],
      model: 'llama-3.3-70b-versatile'
    });
    res.json({ tip: completion.choices[0].message.content });
  } catch (err) {
    res.json({ tip: 'Take medicine as prescribed by your doctor. Stay hydrated!' });
  }
});

app.post('/api/ai/chat', async function(req, res) {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are MediRemind AI, a friendly health assistant. Answer in Hinglish. Keep answers short and helpful.' },
        { role: 'user', content: req.body.message }
      ],
      model: 'llama-3.3-70b-versatile'
    });
    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    res.json({ reply: 'Sorry! Dobara try karo!' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, function() { console.log('Backend running on port ' + PORT); });
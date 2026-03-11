const express = require('express');
const router = express.Router();
const axios = require('axios');

const GEMINI_KEY = 'AIzaSyDGJTojXTGvqMGHFPRKiyP-ojJwavUxrDc';

// Store conversation history per session (in production, use database)
const conversationHistory = new Map();

router.post('/chat', async (req, res) => {
  try {
    const { message, sessionId = 'default' } = req.body;
    
    // Get or create conversation history for this session
    if (!conversationHistory.has(sessionId)) {
      conversationHistory.set(sessionId, []);
    }
    const history = conversationHistory.get(sessionId);
    
    // Build context-aware prompt
    const systemPrompt = `You are MediRemind AI, an empathetic and knowledgeable health assistant created by medical researchers.

🎯 YOUR CAPABILITIES:
- Provide research-backed medical information with disclaimers
- Offer emotional support for mental health issues (depression, anxiety, stress)
- Remember context from previous messages in the conversation
- Answer general health and wellness questions
- Give lifestyle advice (exercise, diet, sleep, hydration)
- Suggest when to see a doctor for serious issues

🗣️ YOUR PERSONALITY:
- Warm, caring, and empathetic like a trusted friend
- Use Hinglish (mix of Hindi and English) naturally
- Keep responses conversational, not robotic
- Use emojis occasionally to feel friendly (💙 😊 💪)
- Never judgmental, always supportive

⚠️ IMPORTANT RULES:
- Always add disclaimer for medical advice: "Yeh general information hai. Serious issues ke liye doctor se zaroor consult karein."
- For mental health: Be extra compassionate, validate feelings, suggest professional help if needed
- Never diagnose conditions definitively
- Encourage healthy habits and self-care

📝 CONVERSATION HISTORY:
${history.map(h => `${h.role}: ${h.text}`).join('\n')}

👤 USER SAYS NOW: ${message}

Respond naturally in Hinglish. Keep it 3-5 sentences unless user needs detailed explanation.`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_KEY}`,
      {
        contents: [{
          parts: [{ text: systemPrompt }]
        }]
      }
    );

    const aiReply = response.data.candidates[0].content.parts[0].text;
    
    history.push({ role: 'user', text: message });
    history.push({ role: 'assistant', text: aiReply });
    
   
    if (history.length > 20) {
      history.splice(0, history.length - 20);
    }

    res.json({ 
      reply: aiReply,
      sessionId: sessionId
    });

  } catch (err) {
    console.error('AI Error:', err.message);
    
    
    if (err.message.includes('quota') || err.message.includes('rate')) {
      res.json({ 
        reply: '⏳ Abhi bahut zyada requests aa rahi hain. 1-2 minute baad dobara try karo! Free tier limit hit ho gayi hai.'
      });
    } else if (err.message.includes('safety')) {
      res.json({
        reply: 'Sorry, yeh topic thoda sensitive hai. Koi aur health question puchho, main zaroor help karunga! 😊'
      });
    } else {
      res.json({ 
        reply: 'Kuch technical issue aa gaya. Thodi der baad dobara try karo! 🙏'
      });
    }
  }
});

// Clear conversation history endpoint (optional)
router.post('/clear-history', (req, res) => {
  const { sessionId = 'default' } = req.body;
  conversationHistory.delete(sessionId);
  res.json({ message: 'Conversation history cleared!' });
});

module.exports = router;
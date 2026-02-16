require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");

const app = express();

/* =======================
   ✅ CORS FIX (IMPORTANT)
   ======================= */
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://amanshukla-ashy.vercel.app"
  ],
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options("*", cors()); // 🔥 preflight fix
app.use(express.json());

/* =======================
   AI CONFIG
   ======================= */
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

/* =======================
   IN-MEMORY DATA
   ======================= */
let medicines = [];
let idCounter = 1;
let conversationHistory = [];

/* =======================
   MEDICINE ROUTES
   ======================= */
app.get("/api/medicines", (req, res) => {
  res.json(medicines);
});

app.post("/api/medicines", (req, res) => {
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

app.delete("/api/medicines/:id", (req, res) => {
  medicines = medicines.filter(m => m._id != req.params.id);
  res.json({ message: "Deleted" });
});

/* =======================
   AI HEALTH TIP
   ======================= */
app.post("/api/ai/health-tip", async (req, res) => {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `Give a brief health tip for someone taking ${req.body.medicine}. Keep it under 3 sentences.`
        }
      ]
    });

    res.json({ tip: completion.choices[0].message.content });
  } catch (err) {
    res.json({
      tip: "Yeh medicine sahi time pe lena aur paani zyada peena! 💊💧"
    });
  }
});

/* =======================
   AI CHAT
   ======================= */
app.post("/api/ai/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    conversationHistory.push({ role: "user", content: userMessage });
    if (conversationHistory.length > 20) {
      conversationHistory = conversationHistory.slice(-20);
    }

    const messages = [
      {
        role: "system",
        content:
          "Tum MediRemind AI ho — ek friendly, caring aur funny health assistant. Hinglish me baat karo. Health advice serious rakho, tone best friend jaisa ho."
      },
      ...conversationHistory
    ];

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages
    });

    const reply = completion.choices[0].message.content;
    conversationHistory.push({ role: "assistant", content: reply });

    res.json({ reply });
  } catch (err) {
    res.json({
      reply:
        "Thoda sa busy ho gaya tha yaar 😅 Ab ready hoon, dobara pooch!"
    });
  }
});

/* =======================
   HEALTH CHECK
   ======================= */
app.get("/", (req, res) => {
  res.json({ status: "MediRemind Backend Live 🚀" });
});

/* =======================
   SERVER START
   ======================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log("Backend chal pada 🚀 Port:", PORT)
);
import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running");
});

app.post("/api/chat", (req, res) => {
  res.json({ reply: "API working" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

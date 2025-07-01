const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../public')));

// Debug: Static file path
console.log('Static file path:', path.join(__dirname, '../../public'));

// Import TMDB-RAG system (replaces old vector search)
const { tmdbRagChatbot } = require('../lib/rag/tmdb-rag');

// 測試根路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

app.post('/api/message', async (req, res) => {
  const userMessage = req.body.message;

  try {
    console.log(`📨 Received message: "${userMessage}"`);

    // Use TMDB-RAG system to generate response
    const reply = await tmdbRagChatbot(userMessage);

    console.log(`🤖 Sending reply: "${reply.substring(0, 100)}..."`);
    res.json({ reply });
  } catch (error) {
    console.error('❌ Error processing message:', error);
    res.json({ reply: "Sorry, I am unable to process your request at the moment. Please try again later." });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

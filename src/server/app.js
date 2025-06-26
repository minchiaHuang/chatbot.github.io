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

// TODO: Import RAG system when ready
// const { ragChatbot } = require('../lib/rag/complete-rag');

app.post('/api/message', async (req, res) => {
  const userMessage = req.body.message;

  try {
    // TODO: Replace with RAG system
    // const reply = await ragChatbot(userMessage);
    const reply = `Echo: ${userMessage}`;
    res.json({ reply });
  } catch (error) {
    console.error('Error processing message:', error);
    res.json({ reply: "Sorry, I couldn't process your request." });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});

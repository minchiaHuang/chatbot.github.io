const express = require('express')
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const app = express();
const port = 3000;

app.use(cors())
app.use(express.json());
app.use(express.static('public'));

app.post('/api/message', async (req, res) => {
  const userMessage = req.body.message;

  const payload = {
    model: "Llama 3 8B Instruct",
    messages: [
      { role: "user", content: userMessage }
    ]
  };

  try {
    const response = await fetch('http://localhost:4891/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    const reply = data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.json({ reply: "Sorry, I couldn't reach the AI model." })
  }

});









app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
})

app.post('/api/message', (req, res) => {
  const userMessage = req.body.message;
  res.json({ reply: `You said: ${userMessage}` });
})

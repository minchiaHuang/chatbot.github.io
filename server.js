const express = require('express')
const cors = require('cors');
const app = express();
const port = 3000;

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

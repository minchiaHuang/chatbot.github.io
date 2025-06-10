const chatArea = document.getElementById('chat-area');
const input = document.getElementById('user-input');
const sendBtn = document.getElementById('sendBtn');

async function sendMessageToServer(message) {
  const response = await fetch('/api/message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message: message })
  })
  const data = await response.json();
  return data.reply;
}


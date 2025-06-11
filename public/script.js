const chatArea = document.getElementById('chat-area');
const input = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

//Sending message
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

//Handing server response
async function handleSend() {
  const userMessage = input.value.trim();

  if (!userMessage) return;

  const reply = await sendMessageToServer(userMessage)

  //Updating the chat window
  const userMessageElement = document.createElement("div");
  userMessageElement.classList.add("user-message");
  userMessageElement.textContent = userMessage;
  chatArea.appendChild(userMessageElement);

  const botMessageElement = document.createElement("div");
  botMessageElement.classList.add("bot-message");
  botMessageElement.textContent = reply;
  chatArea.appendChild(botMessageElement);

}

sendBtn.addEventListener('click', function () {
  handleSend();
})




/**
 * Movie Chatbot Frontend JavaScript
 * Handles user interactions and API communication
 */

class ChatInterface {
  constructor() {
    this.chatArea = document.getElementById('chat-area');
    this.chatBox = document.getElementById('chat-box');
    this.input = document.getElementById('user-input');
    this.sendBtn = document.getElementById('send-btn');

    this.chatWindow = document.getElementById('chat-window');
    this.chatToggle = document.getElementById('chat-toggle');
    this.closeBtn = document.getElementById('close-btn');

    this.initializeEventListeners();
    this.restoreChatState();
  }

  /**
   * Initialize event listeners for user interactions
   */
  initializeEventListeners() {
    this.sendBtn.addEventListener('click', () => this.handleSend());
    this.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.handleSend();
      }
    });

    this.chatToggle.addEventListener('click', () => this.openChat());
    this.closeBtn.addEventListener('click', () => this.closeChat());
  }

  openChat() {
    this.chatWindow.style.display = 'flex';
    localStorage.setItem('chatWindowOpen', 'true');
  }

  closeChat() {
    this.chatWindow.style.display = 'none';
    localStorage.setItem('chatWindowOpen', 'false');
  }

  /**
   * Send message to server API
   * @param {string} message - User message
   * @returns {Promise<string>} - Server response
   */
  async sendMessageToServer(message) {
    try {
      const response = await fetch('/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.reply;
    } catch (error) {
      console.error('Error sending message:', error);
      return 'Sorry, there was an error processing your request.';
    }
  }

  /**
   * Handle sending a message
   */
  async handleSend() {
    const userMessage = this.input.value.trim();

    if (!userMessage) return;

    // Clear input
    this.input.value = '';

    // Add user message to chat
    this.addMessageToChat(userMessage, 'user-message');
    this.scrollToBottom();

    // Show loading indicator
    const loadingElement = this.addMessageToChat('Thinking...', 'bot-message', 'loading');

    try {
      // Get response from server
      const reply = await this.sendMessageToServer(userMessage);

      // Remove loading indicator
      this.chatArea.removeChild(loadingElement);

      // Add bot response
      const botMessageElement = this.addMessageToChat('', 'bot-message')
      await this.typeWriterEffect(botMessageElement, reply);
    } catch (error) {
      // Remove loading indicator
      this.chatArea.removeChild(loadingElement);

      // Show error message
      const errorMessageElement = this.addMessageToChat('', 'bot-message')
      this.typeWriterEffect('Sorry, there was an error processing your request.', 'bot-message');
    }

    // Scroll to bottom
    this.scrollToBottom();
  }

  /**
   * Add message to chat area
   * @param {string} message - Message text
   * @param {string} className - CSS class name
   * @param {string} id - Optional element ID
   * @param {boolean} useTypewriter - Whether to use typewriter effect
   * @returns {HTMLElement} - Created message element
   */

  addMessageToChat(message, className, id = null, useTypewriter = false) {
    const messageElement = document.createElement('div');
    messageElement.classList.add(className);

    if (useTypewriter) {
      messageElement.textContent = '';
    } else {
      messageElement.textContent = message;
    }

    if (id) {
      messageElement.id = id;
    }

    this.chatArea.appendChild(messageElement);
    return messageElement;
  }

  async typeWriterEffect(element, text, speed = 25) {
    return new Promise((resolve) => {
      let i = 0;

      const typeInterval = setInterval(() => {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;

          this.scrollToBottom();
        } else {
          clearInterval(typeInterval);
          resolve();
        }
      }, speed);
    });
  }



  /**
   * Scroll chat area to bottom
   */
  scrollToBottom() {
    this.chatBox.scrollTop = this.chatBox.scrollHeight;
  }

  restoreChatState() {
    const isOpen = localStorage.getItem('chatWindowOpen');
    if (isOpen === 'true') {
      this.chatWindow.style.display = 'flex';
    } else {
      this.chatWindow.style.display = 'none';
    }
  }
}

// Initialize chat interface when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ChatInterface();
});




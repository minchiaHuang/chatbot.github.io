/**
 * Movie Chatbot Frontend JavaScript
 * Handles user interactions and API communication
 */

class ChatInterface {
  constructor() {
    this.chatArea = document.getElementById('chat-area');
    this.input = document.getElementById('user-input');
    this.sendBtn = document.getElementById('send-btn');
    this.initializeEventListeners();
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

    // Show loading indicator
    const loadingElement = this.addMessageToChat('Thinking...', 'bot-message', 'loading');

    try {
      // Get response from server
      const reply = await this.sendMessageToServer(userMessage);

      // Remove loading indicator
      this.chatArea.removeChild(loadingElement);

      // Add bot response
      this.addMessageToChat(reply, 'bot-message');
    } catch (error) {
      // Remove loading indicator
      this.chatArea.removeChild(loadingElement);

      // Show error message
      this.addMessageToChat('Sorry, there was an error processing your request.', 'bot-message');
    }

    // Scroll to bottom
    this.scrollToBottom();
  }

  /**
   * Add message to chat area
   * @param {string} message - Message text
   * @param {string} className - CSS class name
   * @param {string} id - Optional element ID
   * @returns {HTMLElement} - Created message element
   */
  addMessageToChat(message, className, id = null) {
    const messageElement = document.createElement('div');
    messageElement.classList.add(className);
    messageElement.textContent = message;

    if (id) {
      messageElement.id = id;
    }

    this.chatArea.appendChild(messageElement);
    return messageElement;
  }

  /**
   * Scroll chat area to bottom
   */
  scrollToBottom() {
    this.chatArea.scrollTop = this.chatArea.scrollHeight;
  }
}

// Initialize chat interface when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ChatInterface();
});




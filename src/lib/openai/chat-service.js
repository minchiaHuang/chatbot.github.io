const { OpenAI } = require('openai');
require('dotenv').config();

/**
 * OpenAI Chat Service for RAG Movie Chatbot
 * Handles chat completions with context from movie search results
 */
class ChatService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.model = 'gpt-3.5-turbo';
  }

  /**
   * Generate response using OpenAI Chat Completion
   * @param {string} userMessage - User's question
   * @param {Array} movieContext - Array of relevant movies from search
   * @returns {Promise<string>} - AI generated response
   */
  async generateResponse(userMessage, movieContext = []) {
    try {
      // Create system prompt with movie context
      const systemPrompt = this.createSystemPrompt(movieContext);

      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
        max_tokens: 500,
        temperature: 0.7
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating AI response:', error);
      throw new Error('Failed to generate response');
    }
  }

  /**
   * Create system prompt with movie context
   * @param {Array} movies - Array of movie objects
   * @returns {string} - Formatted system prompt
   */
  createSystemPrompt(movies) {
    let systemPrompt = `You are a helpful movie recommendation assistant. You have access to a database of movies and can provide personalized recommendations.

Always respond in Traditional Chinese (繁體中文). Be friendly, enthusiastic, and knowledgeable about movies.

When recommending movies, include:
- Movie title and year
- Brief description of genres
- Why you think the user might enjoy it`;

    // Add movie context if available
    if (movies && movies.length > 0) {
      systemPrompt += `\n\nHere are some relevant movies from our database:\n`;
      movies.forEach((movieData, index) => {
        const movie = movieData.movie || movieData;
        systemPrompt += `${index + 1}. "${movie.title || movie.primaryTitle}" (${movie.year || movie.startYear}) - ${movie.genres}\n`;
      });
      systemPrompt += `\nUse these movies as context for your recommendations, but feel free to discuss movies in general as well.`;
    } else {
      systemPrompt += `\n\nIf the user asks for movie recommendations, apologize that you couldn't find specific matches in the database, but offer general movie advice.`;
    }

    return systemPrompt;
  }

  /**
   * Generate embedding for user query (for vector search)
   * @param {string} text - User's message
   * @returns {Promise<Array>} - Embedding vector
   */
  async generateQueryEmbedding(text) {
    try {
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text
      });
      return response.data[0].embedding;
    } catch (error) {
      console.error('Error generating query embedding:', error);
      throw new Error('Failed to generate query embedding');
    }
  }
}

module.exports = { ChatService }; 
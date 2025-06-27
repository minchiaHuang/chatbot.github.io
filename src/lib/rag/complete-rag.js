const { ChatService } = require('../openai/chat-service');
const { DataAPIClient } = require('@datastax/astra-db-ts');
require('dotenv').config();

/**
 * Complete RAG (Retrieval-Augmented Generation) System
 * Combines vector search with OpenAI chat completion
 */
class CompleteRAG {
  constructor() {
    this.chatService = new ChatService();
    this.client = new DataAPIClient(process.env.ASTRA_DB_APPLICATION_TOKEN);
    this.db = this.client.db(process.env.ASTRA_DB_API_ENDPOINT);
    this.collection = this.db.collection('movie_embeddings');
  }

  /**
   * Main RAG function: Search + Generate
   * @param {string} userMessage - User's question
   * @returns {Promise<string>} - AI generated response with context
   */
  async ragChatbot(userMessage) {
    try {
      console.log(`🤖 Processing: "${userMessage}"`);

      // Step 1: Generate embedding for user query
      console.log('📊 Generating query embedding...');
      const queryEmbedding = await this.chatService.generateQueryEmbedding(userMessage);

      // Step 2: Search for similar movies in Astra DB
      console.log('🔍 Searching for relevant movies...');
      const relevantMovies = await this.searchSimilarMovies(queryEmbedding, 5);

      console.log(`📚 Found ${relevantMovies.length} relevant movies`);
      relevantMovies.forEach((movie, index) => {
        console.log(`${index + 1}. "${movie.title}" (${movie.year}) - ${movie.genres}`);
      });

      // Step 3: Generate response using OpenAI with movie context
      console.log('✨ Generating AI response...');
      const aiResponse = await this.chatService.generateResponse(userMessage, relevantMovies);

      console.log('✅ RAG process completed successfully!');
      return aiResponse;

    } catch (error) {
      console.error('❌ RAG Error:', error.message);

      // Fallback: Generate response without context
      try {
        console.log('🔄 Attempting fallback response...');
        return await this.chatService.generateResponse(userMessage, []);
      } catch (fallbackError) {
        console.error('❌ Fallback failed:', fallbackError.message);
        return '抱歉，我現在無法處理您的請求。請稍後再試。';
      }
    }
  }

  /**
   * Search for similar movies using vector search
   * @param {Array} queryEmbedding - Query vector
   * @param {number} limit - Number of results to return
   * @returns {Promise<Array>} - Array of similar movies
   */
  async searchSimilarMovies(queryEmbedding, limit = 5) {
    try {
      const results = await this.collection.find({}, {
        vector: queryEmbedding,
        limit: limit
      }).toArray();

      return results.map(doc => ({
        title: doc.title,
        originalTitle: doc.originalTitle,
        year: doc.year,
        genres: doc.genres,
        type: doc.type,
        runtime: doc.runtime
      }));

    } catch (error) {
      console.error('❌ Vector search error:', error.message);
      return [];
    }
  }

  /**
   * Test the RAG system with a sample query
   * @returns {Promise<void>}
   */
  async testRAG() {
    console.log('🧪 Testing RAG system...');
    const testMessage = "推薦一些科幻電影";
    const response = await this.ragChatbot(testMessage);
    console.log('🎬 Test Response:');
    console.log(response);
  }
}

/**
 * Simple function interface for server integration
 * @param {string} userMessage - User's question
 * @returns {Promise<string>} - AI response
 */
async function ragChatbot(userMessage) {
  const rag = new CompleteRAG();
  return await rag.ragChatbot(userMessage);
}

module.exports = { CompleteRAG, ragChatbot }; 
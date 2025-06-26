const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
require('dotenv').config();

/**
 * Generate embeddings for movie data using OpenAI API
 */
class EmbeddingGenerator {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.model = 'text-embedding-3-small';
  }

  /**
   * Generate embedding for a single movie
   * @param {Object} movie - Movie object with title and genres
   * @returns {Promise<Array>} - Embedding vector
   */
  async generateMovieEmbedding(movie) {
    try {
      const text = `${movie.primaryTitle} ${movie.genres}`;
      const response = await this.openai.embeddings.create({
        model: this.model,
        input: text
      });
      return response.data[0].embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw error;
    }
  }

  /**
   * Load movies from JSON file
   * @returns {Array} - Array of movie objects
   */
  loadMovies() {
    const moviesPath = path.join(__dirname, '../../../data/movies.json');
    return JSON.parse(fs.readFileSync(moviesPath, 'utf-8'));
  }
}

module.exports = { EmbeddingGenerator };
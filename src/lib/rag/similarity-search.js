
const fs = require('fs');
const path = require('path');

/**
 * Calculate cosine similarity between two vectors
 * @param {Array} vecA - First vector
 * @param {Array} vecB - Second vector
 * @returns {number} - Cosine similarity score (0-1)
 */
function cosineSimilarity(vecA, vecB) {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must have the same length');
  }

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
  return magnitude === 0 ? 0 : dot / magnitude;
}

/**
 * Find similar movies based on vector similarity
 */
class SimilaritySearch {
  constructor() {
    this.moviesWithEmbeddings = null;
  }

  /**
   * Load movies with embeddings from JSON file
   */
  loadMoviesWithEmbeddings() {
    if (!this.moviesWithEmbeddings) {
      const dataPath = path.join(__dirname, '../../../data/movies-with-embeddings.json');
      this.moviesWithEmbeddings = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    }
    return this.moviesWithEmbeddings;
  }

  /**
   * Find most similar movies to a query embedding
   * @param {Array} queryEmbedding - Query vector
   * @param {number} topK - Number of results to return
   * @returns {Array} - Array of {movie, score} objects
   */
  findSimilarMovies(queryEmbedding, topK = 5) {
    const movies = this.loadMoviesWithEmbeddings();
    const movieScores = [];

    for (const movie of movies) {
      if (movie.embedding) {
        const similarity = cosineSimilarity(queryEmbedding, movie.embedding);
        movieScores.push({ movie, score: similarity });
      }
    }

    movieScores.sort((a, b) => b.score - a.score);
    return movieScores.slice(0, topK);
  }
}

module.exports = { SimilaritySearch, cosineSimilarity };
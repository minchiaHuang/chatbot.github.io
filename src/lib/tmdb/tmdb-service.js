require('dotenv').config();

/**
 * TMDB API Service
 * Provides modern movie data from The Movie Database
 * Uses Node.js built-in fetch (available in Node.js 18+)
 */
class TMDBService {
  constructor() {
    this.apiKey = process.env.TMDB_API_KEY;
    this.baseURL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';

    if (!this.apiKey) {
      throw new Error('TMDB_API_KEY is required in environment variables');
    }
  }

  /**
   * Search movies by query
   * @param {string} query - Search term
   * @param {number} page - Page number (default: 1)
   * @returns {Promise<Object>} - TMDB search results
   */
  async searchMovies(query, page = 1) {
    try {
      const url = `${this.baseURL}/search/movie?api_key=${this.apiKey}&query=${encodeURIComponent(query)}&page=${page}&language=en-US`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  }

  /**
   * Get popular movies
   * @param {number} page - Page number (default: 1)
   * @returns {Promise<Object>} - Popular movies
   */
  async getPopularMovies(page = 1) {
    try {
      const url = `${this.baseURL}/movie/popular?api_key=${this.apiKey}&page=${page}&language=en-US`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting popular movies:', error);
      throw error;
    }
  }

  /**
   * Get upcoming movies
   * @param {number} page - Page number (default: 1)
   * @returns {Promise<Object>} - Upcoming movies
   */
  async getUpcomingMovies(page = 1) {
    try {
      const url = `${this.baseURL}/movie/upcoming?api_key=${this.apiKey}&page=${page}&language=en-US`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting upcoming movies:', error);
      throw error;
    }
  }

  /**
   * Get movies by genre
   * @param {string} genre - Genre name (e.g., 'Science Fiction', 'Action')
   * @param {number} page - Page number (default: 1)
   * @returns {Promise<Object>} - Movies by genre
   */
  async getMoviesByGenre(genre, page = 1) {
    try {
      // First get genre list to find genre ID
      const genresUrl = `${this.baseURL}/genre/movie/list?api_key=${this.apiKey}&language=en-US`;
      const genresResponse = await fetch(genresUrl);
      const genresData = await genresResponse.json();

      // Find genre ID
      const genreObj = genresData.genres.find(g =>
        g.name.toLowerCase().includes(genre.toLowerCase()) ||
        genre.toLowerCase().includes(g.name.toLowerCase())
      );

      if (!genreObj) {
        throw new Error(`Genre "${genre}" not found`);
      }

      // Search movies by genre ID
      const url = `${this.baseURL}/discover/movie?api_key=${this.apiKey}&with_genres=${genreObj.id}&page=${page}&language=en-US&sort_by=popularity.desc`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting movies by genre:', error);
      throw error;
    }
  }

  /**
   * Format movie data for RAG system
   * @param {Object} movie - TMDB movie object
   * @returns {Object} - Formatted movie data
   */
  formatMovieForRAG(movie) {
    return {
      id: movie.id,
      title: movie.title,
      originalTitle: movie.original_title,
      year: movie.release_date ? new Date(movie.release_date).getFullYear() : null,
      releaseDate: movie.release_date,
      genres: movie.genre_ids || movie.genres?.map(g => g.name).join(', ') || 'Unknown',
      overview: movie.overview,
      popularity: movie.popularity,
      voteAverage: movie.vote_average,
      voteCount: movie.vote_count,
      posterPath: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
      backdropPath: movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : null
    };
  }
}

module.exports = { TMDBService };
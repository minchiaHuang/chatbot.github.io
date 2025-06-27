const { ChatService } = require('../openai/chat-service');
const { TMDBService } = require('../tmdb/tmdb-service');
require('dotenv').config();

/**
 * TMDB-RAG (Retrieval-Augmented Generation) System
 * Combines TMDB API movie search with OpenAI chat completion
 * Replaces the old vector search with real-time movie data
 */
class TMDBRag {
  constructor() {
    this.chatService = new ChatService();
    this.tmdbService = new TMDBService();
  }

  /**
   * Main RAG function: TMDB Search + Generate
   * @param {string} userMessage - User's question
   * @returns {Promise<string>} - AI generated response with real movie data
   */
  async ragChatbot(userMessage) {
    try {
      console.log(`🤖 Processing with TMDB-RAG: "${userMessage}"`);

      // Step 1: Analyze user query to determine search strategy
      console.log('🔍 Analyzing user query...');
      const searchStrategy = this.analyzeUserQuery(userMessage);

      // Step 2: Search for relevant movies using TMDB API
      console.log(`📚 Searching movies using strategy: ${searchStrategy.type}`);
      const relevantMovies = await this.searchMoviesBasedOnQuery(userMessage, searchStrategy);

      console.log(`🎬 Found ${relevantMovies.length} relevant movies from TMDB`);
      relevantMovies.forEach((movie, index) => {
        console.log(`${index + 1}. "${movie.title}" (${movie.year}) - ${movie.genres}`);
      });

      // Step 3: Generate response using OpenAI with TMDB movie context
      console.log('✨ Generating AI response with TMDB context...');
      const aiResponse = await this.chatService.generateResponse(userMessage, relevantMovies);

      console.log('✅ TMDB-RAG process completed successfully!');
      return aiResponse;

    } catch (error) {
      console.error('❌ TMDB-RAG Error:', error.message);

      // Fallback: Generate response without TMDB context
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
   * Analyze user query to determine best search strategy
   * @param {string} userMessage - User's question
   * @returns {Object} - Search strategy object
   */
  analyzeUserQuery(userMessage) {
    const message = userMessage.toLowerCase();

    // Check for year-specific queries
    const yearMatch = message.match(/202[0-9]|未來|即將|新|最新|upcoming/);
    if (yearMatch) {
      return { type: 'upcoming', reason: 'User asking for future/upcoming movies' };
    }

    // Check for genre-specific queries
    const genreKeywords = {
      '科幻': 'Science Fiction',
      '動作': 'Action',
      '愛情': 'Romance',
      '喜劇': 'Comedy',
      '恐怖': 'Horror',
      '驚悚': 'Thriller',
      '劇情': 'Drama',
      '冒險': 'Adventure'
    };

    for (const [chinese, english] of Object.entries(genreKeywords)) {
      if (message.includes(chinese) || message.includes(english.toLowerCase())) {
        return { type: 'genre', genre: english, reason: `User asking for ${english} movies` };
      }
    }

    // Check for popularity queries
    if (message.includes('熱門') || message.includes('流行') || message.includes('popular')) {
      return { type: 'popular', reason: 'User asking for popular movies' };
    }

    // Default: search by keywords
    return { type: 'search', reason: 'General keyword search' };
  }

  /**
   * Search movies based on query analysis
   * @param {string} userMessage - Original user message
   * @param {Object} strategy - Search strategy object
   * @returns {Promise<Array>} - Array of formatted movie objects
   */
  async searchMoviesBasedOnQuery(userMessage, strategy) {
    try {
      let movies = [];

      switch (strategy.type) {
        case 'upcoming':
          console.log('🔮 Searching upcoming movies (includes 2025!)...');
          const upcomingResult = await this.tmdbService.getUpcomingMovies();
          movies = upcomingResult.results || [];
          break;

        case 'genre':
          console.log(`🎭 Searching by genre: ${strategy.genre}...`);
          const genreResult = await this.tmdbService.getMoviesByGenre(strategy.genre);
          movies = genreResult.results || [];
          break;

        case 'popular':
          console.log('🌟 Searching popular movies...');
          const popularResult = await this.tmdbService.getPopularMovies();
          movies = popularResult.results || [];
          break;

        case 'search':
        default:
          console.log(`🔍 Searching by keywords: "${userMessage}"...`);
          // Extract meaningful keywords from user message
          const keywords = this.extractKeywords(userMessage);
          const searchResult = await this.tmdbService.searchMovies(keywords);
          movies = searchResult.results || [];
          break;
      }

      // Format movies for RAG system and limit to top 5
      return movies.slice(0, 5).map(movie => this.tmdbService.formatMovieForRAG(movie));

    } catch (error) {
      console.error('❌ Error searching movies:', error.message);
      return [];
    }
  }

  /**
   * Extract meaningful keywords from user message
   * @param {string} userMessage - User's message
   * @returns {string} - Cleaned keywords for search
   */
  extractKeywords(userMessage) {
    // Remove common question words and extract meaningful terms
    const stopWords = ['推薦', '什麼', '哪些', '有', '嗎', '呢', '電影', '影片', '片子'];
    let keywords = userMessage;

    stopWords.forEach(word => {
      keywords = keywords.replace(new RegExp(word, 'g'), '');
    });

    return keywords.trim() || userMessage;
  }

  /**
   * Test the TMDB-RAG system with sample queries
   * @returns {Promise<void>}
   */
  async testTMDBRag() {
    console.log('🧪 Testing TMDB-RAG system...\n');

    const testQueries = [
      "2025推薦什麼電影",
      "推薦一些科幻電影",
      "最近有什麼熱門電影",
      "阿凡達"
    ];

    for (const query of testQueries) {
      console.log(`\n📝 Testing: "${query}"`);
      console.log('='.repeat(50));
      const response = await this.ragChatbot(query);
      console.log('🎬 Response:');
      console.log(response.substring(0, 200) + '...\n');
    }
  }
}

/**
 * Simple function interface for server integration
 * @param {string} userMessage - User's question
 * @returns {Promise<string>} - AI response with TMDB context
 */
async function tmdbRagChatbot(userMessage) {
  const rag = new TMDBRag();
  return await rag.ragChatbot(userMessage);
}

module.exports = { TMDBRag, tmdbRagChatbot }; 
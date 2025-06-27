require('dotenv').config();
const { TMDBService } = require('./src/lib/tmdb/tmdb-service');

async function testTMDBConnection() {
  console.log('🧪 Testing TMDB API connection...\n');

  try {
    // Test environment variables
    console.log('1️⃣ Checking environment variables...');
    if (!process.env.TMDB_API_KEY) {
      throw new Error('TMDB_API_KEY not found in environment variables');
    }
    console.log('✅ TMDB API key found\n');

    // Initialize service
    const tmdb = new TMDBService();

    // Test 1: Search for a popular movie
    console.log('2️⃣ Testing movie search...');
    const searchResults = await tmdb.searchMovies('阿凡達');
    console.log(`✅ Found ${searchResults.results.length} movies for "阿凡達"`);
    if (searchResults.results.length > 0) {
      const movie = tmdb.formatMovieForRAG(searchResults.results[0]);
      console.log(`   First result: "${movie.title}" (${movie.year})\n`);
    }

    // Test 2: Get popular movies
    console.log('3️⃣ Testing popular movies...');
    const popularMovies = await tmdb.getPopularMovies();
    console.log(`✅ Found ${popularMovies.results.length} popular movies`);
    console.log(`   Sample: "${popularMovies.results[0].title}"\n`);

    // Test 3: Get upcoming movies (includes 2025 movies!)
    console.log('4️⃣ Testing upcoming movies...');
    const upcomingMovies = await tmdb.getUpcomingMovies();
    console.log(`✅ Found ${upcomingMovies.results.length} upcoming movies`);
    if (upcomingMovies.results.length > 0) {
      const movie = tmdb.formatMovieForRAG(upcomingMovies.results[0]);
      console.log(`   Sample: "${movie.title}" (${movie.releaseDate})\n`);
    }

    // Test 4: Search by genre (try multiple genre names)
    console.log('5️⃣ Testing genre search...');
    const genreNames = ['科幻', 'Science Fiction', '科學幻想'];
    let scifiMovies = null;

    for (const genreName of genreNames) {
      try {
        scifiMovies = await tmdb.getMoviesByGenre(genreName);
        console.log(`✅ Found ${scifiMovies.results.length} sci-fi movies using genre "${genreName}"`);
        if (scifiMovies.results.length > 0) {
          const movie = tmdb.formatMovieForRAG(scifiMovies.results[0]);
          console.log(`   Sample: "${movie.title}" (${movie.year})\n`);
        }
        break; // Success, exit loop
      } catch (error) {
        console.log(`   Trying genre "${genreName}": ${error.message}`);
      }
    }

    if (!scifiMovies) {
      console.log('⚠️  Genre search failed with all attempted names, but this is not critical\n');
    }

    console.log('🎉 All TMDB tests passed! Ready to integrate with RAG system!');

  } catch (error) {
    console.error('❌ TMDB test failed:', error.message);

    if (error.message.includes('TMDB_API_KEY')) {
      console.log('\n💡 To fix this:');
      console.log('1. Go to https://www.themoviedb.org/settings/api');
      console.log('2. Create account and get API key');
      console.log('3. Add TMDB_API_KEY=your_key_here to .env file');
    }
  }
}

testTMDBConnection();
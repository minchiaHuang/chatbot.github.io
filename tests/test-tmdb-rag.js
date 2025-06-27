require('dotenv').config();
const { TMDBRag } = require('./src/lib/rag/tmdb-rag');

async function testTMDBRagIntegration() {
  console.log('🧪 Testing TMDB-RAG Integration...\n');
  console.log('🎯 This will test the integration of TMDB API with RAG system');
  console.log('🔍 Testing the exact queries that previously gave wrong answers\n');

  const rag = new TMDBRag();

  // Test the problematic query that used to return fake movies
  console.log('🎬 Critical Test: The Original Problem Query');
  console.log('='.repeat(60));
  console.log('Query: "2025推薦什麼電影"');
  console.log('Expected: Real 2025 movies, not fake ones');
  console.log('');

  try {
    const response1 = await rag.ragChatbot("2025推薦什麼電影");
    console.log('✅ TMDB-RAG Response:');
    console.log(response1);
    console.log('\n' + '='.repeat(60));
  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  // Test other queries
  const testQueries = [
    {
      query: "推薦一些科幻電影",
      expected: "Should find real sci-fi movies from TMDB"
    },
    {
      query: "最近有什麼熱門電影",
      expected: "Should return currently popular movies"
    },
    {
      query: "阿凡達",
      expected: "Should find Avatar movies"
    }
  ];

  for (const test of testQueries) {
    console.log(`\n📝 Testing: "${test.query}"`);
    console.log(`Expected: ${test.expected}`);
    console.log('-'.repeat(50));

    try {
      const response = await rag.ragChatbot(test.query);
      console.log('🎬 Response:');
      console.log(response.substring(0, 300) + (response.length > 300 ? '...' : ''));
    } catch (error) {
      console.error('❌ Error:', error.message);
    }
  }

  console.log('\n🎉 TMDB-RAG Integration Testing Complete!');
}

testTMDBRagIntegration(); 
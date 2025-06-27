require('dotenv').config();

async function testRAGComponents() {
  console.log('🧪 Testing RAG components step by step...\n');

  try {
    // Test 1: Environment variables
    console.log('1️⃣ Testing environment variables...');
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not found');
    }
    if (!process.env.ASTRA_DB_APPLICATION_TOKEN) {
      throw new Error('ASTRA_DB_APPLICATION_TOKEN not found');
    }
    if (!process.env.ASTRA_DB_API_ENDPOINT) {
      throw new Error('ASTRA_DB_API_ENDPOINT not found');
    }
    console.log('✅ Environment variables OK\n');

    // Test 2: OpenAI connection
    console.log('2️⃣ Testing OpenAI connection...');
    const { OpenAI } = require('openai');
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const testEmbedding = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: 'test'
    });
    console.log('✅ OpenAI connection OK\n');

    // Test 3: Astra DB connection
    console.log('3️⃣ Testing Astra DB connection...');
    const { DataAPIClient } = require('@datastax/astra-db-ts');
    const client = new DataAPIClient(process.env.ASTRA_DB_APPLICATION_TOKEN);
    const db = client.db(process.env.ASTRA_DB_API_ENDPOINT);
    const collection = db.collection('movie_embeddings');

    const count = await collection.countDocuments({}, {upperBound: 1000});
    console.log(`✅ Astra DB OK - ${count} movies found\n`);

    // Test 4: Complete RAG test
    console.log('4️⃣ Testing complete RAG system...');
    const { ragChatbot } = require('./src/lib/rag/complete-rag');
    const response = await ragChatbot('推薦科幻電影');
    console.log('✅ RAG system OK');
    console.log('🎬 Response:', response.substring(0, 200) + '...\n');

    console.log('🎉 All tests passed! Your RAG system is working!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

testRAGComponents(); 
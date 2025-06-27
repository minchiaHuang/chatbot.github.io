require('dotenv').config();
const { DataAPIClient } = require('@datastax/astra-db-ts');

async function testAstraConnection() {
  try {
    // Use environment variables
    const client = new DataAPIClient(process.env.ASTRA_DB_APPLICATION_TOKEN);
    const db = client.db(process.env.ASTRA_DB_API_ENDPOINT);

    console.log('🔗 Testing Astra DB connection...');

    // Test connection
    const collections = await db.listCollections();
    console.log('✅ Connected to AstraDB!');
    console.log('📋 Existing collections:', collections);

  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testAstraConnection();

require('dotenv').config();
const fs = require('fs');
const { DataAPIClient } = require('@datastax/astra-db-ts');

/**
 * Fix collection dimension based on actual embedding data
 */
async function fixCollectionDimension() {
  try {
    console.log('🔧 Fixing collection dimension...');
    
    // Check actual embedding dimension
    const movies = JSON.parse(fs.readFileSync('data/movies-with-embeddings.json', 'utf-8'));
    const actualDimension = movies[0].embedding.length;
    
    console.log(`📊 Actual embedding dimension: ${actualDimension}`);
    console.log(`📋 Total movies: ${movies.length}`);
    
    // Initialize client
    const client = new DataAPIClient(process.env.ASTRA_DB_APPLICATION_TOKEN);
    const db = client.db(process.env.ASTRA_DB_API_ENDPOINT);
    
    // Delete old collection
    console.log('🗑️ Deleting old collection...');
    await db.dropCollection('movie_embeddings');
    
    // Create new collection with correct dimension
    console.log(`🔨 Creating new collection with dimension ${actualDimension}...`);
    const collection = await db.createCollection('movie_embeddings', {
      vector: {
        dimension: actualDimension,
        metric: 'cosine'
      }
    });
    
    console.log('✅ Collection recreated with correct dimension!');
    
    // Verify
    const collections = await db.listCollections();
    console.log('📋 Updated collections:', collections);
    
  } catch (error) {
    console.error('❌ Error fixing collection:', error.message);
  }
}

// Run the fix
fixCollectionDimension();

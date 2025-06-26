require('dotenv').config();
const { DataAPIClient } = require('@datastax/astra-db-ts');

/**
 * Create movie_embeddings collection in Astra DB
 */
async function createMovieCollection() {
  try {
    console.log('🚀 Creating Astra DB movie collection...');

    // Initialize client and database
    const client = new DataAPIClient(process.env.ASTRA_DB_APPLICATION_TOKEN);
    const db = client.db(process.env.ASTRA_DB_API_ENDPOINT);

    const collectionName = 'movie_embeddings';

    // Check if collection already exists
    const existingCollections = await db.listCollections();
    console.log('📋 Existing collections:', existingCollections);

    if (existingCollections.includes(collectionName)) {
      console.log(`✅ Collection "${collectionName}" already exists!`);
      return;
    }

    // Create collection with vector configuration
    console.log(`🔨 Creating collection: ${collectionName}`);

    const collection = await db.createCollection(collectionName, {
      vector: {
        dimension: 1536,          // OpenAI text-embedding-3-small
        metric: 'cosine'          // Cosine similarity for movie recommendations
      }
    });

    console.log('✅ Collection created successfully!');
    console.log('�� Movie collection is ready for data upload');

    // Verify collection was created
    const updatedCollections = await db.listCollections();
    console.log('📋 Updated collections:', updatedCollections);

  } catch (error) {
    console.error('❌ Error creating collection:', error.message);

    // Common troubleshooting tips
    console.log('\n🔧 Troubleshooting tips:');
    console.log('- Check your ASTRA_DB_APPLICATION_TOKEN');
    console.log('- Verify your ASTRA_DB_API_ENDPOINT');
    console.log('- Ensure your database is active');
  }
}

// Run the collection creation
createMovieCollection();

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { DataAPIClient } = require('@datastax/astra-db-ts');

/**
 * Upload movie data with embeddings to Astra DB
 */
async function uploadMoviesToAstra() {
  try {
    console.log('🚀 Starting movie data upload to Astra DB...');
    
    // Initialize client and database
    const client = new DataAPIClient(process.env.ASTRA_DB_APPLICATION_TOKEN);
    const db = client.db(process.env.ASTRA_DB_API_ENDPOINT);
    const collection = db.collection('movie_embeddings');

    // Load movie data with embeddings
    const moviesPath = path.join(__dirname, 'data/movies-with-embeddings.json');
    const movies = JSON.parse(fs.readFileSync(moviesPath, 'utf-8'));
    
    console.log(`📁 Loaded ${movies.length} movies from JSON file`);

    // Process movies in batches (Astra DB handles batches efficiently)
    const batchSize = 20;  // Start with small batches
    let uploadedCount = 0;
    
    for (let i = 0; i < movies.length; i += batchSize) {
      const batch = movies.slice(i, i + batchSize);
      
      console.log(`📤 Uploading batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(movies.length/batchSize)} (${batch.length} movies)...`);
      
      // Transform data for Astra DB format
      const documents = batch.map(movie => ({
        _id: movie.tconst,                    // Use IMDB ID as unique identifier
        title: movie.primaryTitle,
        originalTitle: movie.originalTitle,
        year: parseInt(movie.startYear) || null,
        runtime: parseInt(movie.runtimeMinutes) || null,
        genres: movie.genres,
        type: movie.titleType,
        $vector: movie.embedding              // Vector for similarity search
      }));

      // Insert batch to Astra DB
      try {
        const result = await collection.insertMany(documents);
        uploadedCount += documents.length;
        console.log(`✅ Batch uploaded successfully! Total uploaded: ${uploadedCount}/${movies.length}`);
        
        // Small delay to avoid rate limiting
        if (i + batchSize < movies.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
      } catch (batchError) {
        console.error(`❌ Error uploading batch starting at index ${i}:`, batchError.message);
      }
    }

    console.log(`🎬 Upload complete! ${uploadedCount} movies uploaded to Astra DB`);
    
    // Verify upload by counting documents
    const count = await collection.countDocuments({});
    console.log(`📊 Verification: ${count} documents in collection`);

  } catch (error) {
    console.error('❌ Error uploading movies:', error.message);
  }
}

// Run the upload
uploadMoviesToAstra();

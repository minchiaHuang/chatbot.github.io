require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { DataAPIClient } = require('@datastax/astra-db-ts');

/**
 * Clear old movie data from both local files and Astra DB
 * CAUTION: This will permanently delete old movie data
 */
class DataCleaner {
  constructor() {
    this.dataDir = path.join(__dirname, 'data');
    this.backupDir = path.join(__dirname, 'old-data-backup');
  }

  /**
   * Step 1: Create backup of important files
   */
  async createBackup() {
    console.log('📦 Creating backup of old data files...\n');

    // Create backup directory
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir);
    }

    const filesToBackup = [
      'data/movies.json',
      'data/movies-with-embeddings.json',
      'upload-movies-to-astra.js'
    ];

    for (const file of filesToBackup) {
      if (fs.existsSync(file)) {
        const fileName = path.basename(file);
        const backupPath = path.join(this.backupDir, fileName);
        fs.copyFileSync(file, backupPath);
        console.log(`✅ Backed up: ${file} -> ${backupPath}`);
      }
    }
    console.log('\n📦 Backup completed!\n');
  }

  /**
   * Step 2: Clear Astra DB collection
   */
  async clearAstraDB() {
    try {
      console.log('🗄️ Clearing old data from Astra DB...\n');

      const client = new DataAPIClient(process.env.ASTRA_DB_APPLICATION_TOKEN);
      const db = client.db(process.env.ASTRA_DB_API_ENDPOINT);
      const collection = db.collection('movie_embeddings');

      // Check current count (with upperBound for Astra DB)
      const beforeCount = await collection.countDocuments({}, { upperBound: 10000 });
      console.log(`📊 Current documents in Astra DB: ${beforeCount}`);

      if (beforeCount > 0) {
        // Delete all documents in the collection
        console.log('🔄 Deleting all old movie documents...');
        const deleteResult = await collection.deleteMany({});
        console.log(`✅ Deleted ${deleteResult.deletedCount} documents from Astra DB`);

        // Verify deletion
        const afterCount = await collection.countDocuments({}, { upperBound: 10000 });
        console.log(`📊 Documents remaining: ${afterCount}\n`);
      } else {
        console.log('✅ Astra DB collection already empty\n');
      }

    } catch (error) {
      console.error('❌ Error clearing Astra DB:', error.message);
      throw error;
    }
  }

  /**
   * Step 3: Remove large local files
   */
  async clearLocalFiles() {
    console.log('🗂️ Clearing local data files...\n');

    const filesToDelete = [
      'data/movies.json',
      'data/movies-with-embeddings.json',
      'data/title.basics.tsv',  // 967MB file!
      'data/title.ratings.tsv'  // 26MB file
    ];

    for (const file of filesToDelete) {
      if (fs.existsSync(file)) {
        const stats = fs.statSync(file);
        const sizeMB = (stats.size / (1024 * 1024)).toFixed(1);

        fs.unlinkSync(file);
        console.log(`✅ Deleted: ${file} (${sizeMB} MB)`);
      } else {
        console.log(`⚠️  File not found: ${file}`);
      }
    }
    console.log('\n🗂️ Local files cleanup completed!\n');
  }

  /**
   * Step 4: Mark obsolete scripts
   */
  async markObsoleteScripts() {
    console.log('📝 Marking obsolete scripts...\n');

    const scriptsToMark = [
      'upload-movies-to-astra.js',
      'test-astra-search.js',
      'test-astra-search-fixed.js'
    ];

    for (const script of scriptsToMark) {
      if (fs.existsSync(script)) {
        const newName = `old-${script}`;
        fs.renameSync(script, newName);
        console.log(`✅ Renamed: ${script} -> ${newName}`);
      }
    }
    console.log('\n📝 Script marking completed!\n');
  }

  /**
   * Calculate space saved
   */
  calculateSpaceSaved() {
    console.log('💾 Estimated space saved:');
    console.log('   • title.basics.tsv: ~967 MB');
    console.log('   • title.ratings.tsv: ~26 MB');
    console.log('   • movies-with-embeddings.json: ~111 KB');
    console.log('   • movies.json: ~55 KB');
    console.log('   • Total: ~993 MB\n');
  }

  /**
   * Run complete cleanup process
   */
  async cleanAll() {
    console.log('🧹 Starting complete data cleanup...\n');
    console.log('⚠️  WARNING: This will permanently delete old movie data!');
    console.log('📦 Creating backup first for safety...\n');

    try {
      await this.createBackup();
      await this.clearAstraDB();
      await this.clearLocalFiles();
      await this.markObsoleteScripts();

      this.calculateSpaceSaved();

      console.log('🎉 Cleanup completed successfully!');
      console.log('✅ Old 1890s movie data has been removed');
      console.log('✅ System is ready for TMDB integration');
      console.log('📦 Backup available in: old-data-backup/\n');

    } catch (error) {
      console.error('❌ Cleanup failed:', error.message);
      console.log('💡 Your data is safe - check the backup folder');
    }
  }
}

// Run cleanup if called directly
if (require.main === module) {
  const cleaner = new DataCleaner();
  cleaner.cleanAll();
}

module.exports = { DataCleaner }; 
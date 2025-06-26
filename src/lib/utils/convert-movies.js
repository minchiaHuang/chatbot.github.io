const fs = require('fs');
const path = require('path');
const readline = require('readline');

/**
 * Convert IMDB TSV files to JSON format
 */
class MovieConverter {
  constructor() {
    this.dataDir = path.join(__dirname, '../../../data');
  }

  /**
   * Convert TSV file to JSON with specified limit
   * @param {string} inputFile - Input TSV filename
   * @param {string} outputFile - Output JSON filename
   * @param {number} limit - Maximum number of records to process
   * @returns {Promise} - Promise that resolves when conversion is complete
   */
  async convertTsvToJson(inputFile, outputFile, limit = 200) {
    return new Promise((resolve, reject) => {
      const inputPath = path.join(this.dataDir, inputFile);
      const outputPath = path.join(this.dataDir, outputFile);

      if (!fs.existsSync(inputPath)) {
        reject(new Error(`Input file not found: ${inputPath}`));
        return;
      }

      const input = fs.createReadStream(inputPath);
      const output = [];
      let header = [];
      let count = 0;

      const rl = readline.createInterface({
        input,
        crlfDelay: Infinity
      });

      rl.on('line', (line) => {
        if (count === 0) {
          header = line.split('\t');
        } else if (count <= limit) {
          const row = line.split('\t');
          if (row.length === header.length) {
            const movie = {};
            for (let j = 0; j < header.length; j++) {
              movie[header[j]] = row[j];
            }
            output.push(movie);
          }
        }
        count++;
        if (count > limit) {
          rl.close();
        }
      });

      rl.on('close', () => {
        try {
          fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');
          console.log(`Successfully converted ${output.length} movies to ${outputFile}`);
          resolve(output);
        } catch (error) {
          reject(error);
        }
      });

      rl.on('error', (error) => {
        reject(error);
      });
    });
  }

  /**
   * Convert IMDB basic movie data
   * @param {number} limit - Maximum number of movies to convert
   */
  async convertBasicMovies(limit = 200) {
    return this.convertTsvToJson('title.basics.tsv', 'movies.json', limit);
  }
}

module.exports = { MovieConverter };
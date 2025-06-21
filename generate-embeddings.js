const fs = require('fs');
const { OpenAI } = require('openai');
require('dotenv').config();

const movies = JSON.parse(fs.readFileSync('movies.json', 'utf-8'));
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function main() {
  try {
    const movie = movies[0];
    const text = movie.primaryTitle + ' ' + movie.genres;
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text
    });
    console.log(response.data[0].embedding);
  } catch (err) {
    console.error(err);
  }
}

main();
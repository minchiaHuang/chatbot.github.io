const fs = require('fs');
const readline = require('readline');

const input = fs.createReadStream('title.basics.tsv');
const output = [];
let header = [];

const rl = readline.createInterface({
  input,
  crlfDelay: Infinity
});

let count = 0;

rl.on('line', (line) => {
  if (count === 0) {
    header = line.split('\t');
  } else if (count <= 200) {
    const row = line.split(`\t`);
    if (row.length === header.length) {
      const movie = {};
      for (let j = 0; j < header.length; j++) {
        movie[header[j]] = row[j];
      }
      output.push(movie);
    }
  }
  count++;
  if (count > 200) {
    rl.close();
  }
});

rl.on('close', () => {
  fs.writeFileSync('movies.json', JSON.stringify(output, null, 2), 'utf-8')
  console.log('The first 200 movie have been add to movies.json!')
})
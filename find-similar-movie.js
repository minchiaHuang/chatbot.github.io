// 讀取 movies_with_embeddings.json

// 實作 cosine similarity 函式
function cosineSimilarity(vecA, vecB) {
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

const a = [1, 2, 3];
const b = [4, 5, 6];
console.log(cosineSimilarity(a, b));
// 給一個查詢向量（可以用假的），找出最相似的電影
// 印出最相似電影的標題和相似度
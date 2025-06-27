# 003-lesson-movie-retrieval: RAG 檢索系統

## 檢索的核心概念

RAG 系統的「檢索」階段負責根據用戶問題找到相關的電影。就像一個智能搜尋引擎！

## 檢索流程

```
用戶問題: "推薦一些科幻電影"
    ↓
1. 將問題轉換成向量嵌入
    ↓
2. 計算問題向量 vs 所有電影向量的相似度
    ↓
3. 找出相似度最高的前 N 部電影
    ↓
4. 回傳相關電影資料
```

## 相似度計算

我們使用**餘弦相似度**來比較兩個向量：

- 值越接近 1 = 越相似
- 值越接近 0 = 越不相似
- 值為負數 = 方向相反

```javascript
function cosineSimilarity(vecA, vecB) {
  let dot = 0; // 點積
  let normA = 0; // A 的長度
  let normB = 0; // B 的長度

  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}
```

## 檢索函數架構

```javascript
async function findSimilarMovies(query, topK = 5) {
  // 1. 載入電影資料庫
  // 2. 將查詢轉換成嵌入向量
  // 3. 計算與所有電影的相似度
  // 4. 排序並回傳前 topK 部電影
}
```

## 實際應用範例

**查詢**: "action movies with cars"
**結果**:

- Fast & Furious (相似度: 0.89)
- Mad Max (相似度: 0.85)
- Rush (相似度: 0.82)

這樣 AI 就可以基於這些具體電影來回答用戶的問題！

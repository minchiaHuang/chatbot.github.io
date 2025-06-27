# Lesson 5: 建立 Astra DB 電影集合

## 數據結構分析

根據你的 movies-with-embeddings.json，每個電影物件包含：
```json
{
  "tconst": "tt0000001",           // IMDB ID
  "titleType": "short",            // 類型 
  "primaryTitle": "Carmencita",    // 主要標題
  "originalTitle": "Carmencita",   // 原始標題
  "startYear": "1894",             // 發行年份
  "runtimeMinutes": "1",           // 時長
  "genres": "Documentary,Short",   // 類型
  "embedding": [0.34, 0.50, ...]  // 1536 維向量
}
```

## Astra DB 集合設計

### 集合名稱: `movie_embeddings`

### 向量維度: 1536 (OpenAI text-embedding-3-small)

### 文檔架構:
```javascript
{
  _id: string,              // 使用 tconst 作為唯一 ID
  title: string,            // primaryTitle
  originalTitle: string,    // originalTitle  
  year: number,             // startYear
  runtime: number,          // runtimeMinutes
  genres: string,           // genres
  type: string,             // titleType
  $vector: [1536 floats]    // OpenAI embedding
}
```

## 集合建立步驟

### 1. 向量集合需要指定向量維度
### 2. 使用 createCollection() API
### 3. 設定適當的索引

下一步：我們將建立程式碼來執行這個集合建立操作。

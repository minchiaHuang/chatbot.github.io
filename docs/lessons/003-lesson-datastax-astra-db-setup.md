# Lesson 3: DataStax Astra DB 設置指南

## 什麼是 DataStax Astra DB？

DataStax Astra DB 是一個雲端向量資料庫，特別適合 AI 應用：

### 為什麼使用向量資料庫？

- **傳統資料庫**: 儲存文字、數字 → 精確匹配
- **向量資料庫**: 儲存嵌入向量 → 語義相似搜尋

```pseudocode
Traditional: "Find movies with title = 'Inception'"
Vector DB:   "Find movies similar to 'mind-bending sci-fi thriller'"
```

### Astra DB 的優勢

- 免費層級 (每月 25M 向量操作)
- 自動擴展
- 內建向量搜尋功能
- 與 OpenAI embeddings 兼容

## 設置步驟概覽

### 第一步: 創建 Astra DB 帳戶

```pseudocode
1. 訪問 astra.datastax.com
2. 註冊免費帳戶
3. 選擇 "Vector Database" 選項
```

### 第二步: 創建資料庫

```pseudocode
Database Configuration:
- Database Name: "movie-chatbot"
- Provider: "Google Cloud" (推薦)
- Region: 選擇離你最近的區域
- Keyspace: "movies"
```

### 第三步: 獲取連接資訊

你需要獲取三個重要的值：

```env
ASTRA_DB_APPLICATION_TOKEN=AstraCS:xxxxx...
ASTRA_DB_API_ENDPOINT=https://xxxxx-xxxxx.apps.astra.datastax.com
ASTRA_DB_KEYSPACE=movies
```

### 第四步: 設計向量集合架構

```pseudocode
Collection Name: "movie_embeddings"
Schema:
{
  _id: string,           // Unique movie ID
  title: string,         // Movie title
  genres: string,        // Movie genres
  rating: number,        // IMDB rating
  year: number,          // Release year
  $vector: [1536 floats] // OpenAI embedding vector
}
```

## 環境變數設置

你需要在專案根目錄建立 `.env` 檔案：

```bash
# OpenAI Configuration
OPENAI_API_KEY=sk-xxxxx...

# Astra DB Configuration
ASTRA_DB_APPLICATION_TOKEN=AstraCS:xxxxx...
ASTRA_DB_API_ENDPOINT=https://xxxxx-xxxxx.apps.astra.datastax.com
ASTRA_DB_KEYSPACE=movies
```

## 下一步預覽

設置完成後，我們將：

1. 建立資料庫連接程式碼
2. 上傳電影數據到 Astra DB
3. 實作向量搜尋功能

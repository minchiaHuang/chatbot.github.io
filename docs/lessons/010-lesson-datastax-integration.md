# DataStax Astra DB 整合課程

## 🎯 為什麼使用 DataStax？

你目前的專案使用 JSON 檔案儲存向量，但 DataStax Astra DB 提供：

- **專業向量搜尋**: 比餘弦相似度計算更快
- **可擴展性**: 處理百萬級電影資料
- **雲端託管**: 不需要管理資料庫
- **向量索引**: 自動優化搜尋效能

## 📊 架構比較

### 目前架構（JSON）

```
用戶查詢 → 生成嵌入 → 本地計算相似度 → 返回結果
```

### DataStax 架構

```
用戶查詢 → 生成嵌入 → DataStax 向量搜尋 → 返回結果
```

## 🔧 DataStax 設定步驟

### 1. 環境變數配置

```bash
# .env 檔案
OPENAI_API_KEY=your_openai_key
ASTRA_DB_APPLICATION_TOKEN=your_astra_token
ASTRA_DB_API_ENDPOINT=your_astra_endpoint
ASTRA_DB_NAMESPACE=default_keyspace
```

### 2. 資料庫連線

```javascript
// Basic connection pattern
import { DataAPIClient } from "@datastax/astra-db-ts";

const client = new DataAPIClient(process.env.ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(process.env.ASTRA_DB_API_ENDPOINT, {
  namespace: process.env.ASTRA_DB_NAMESPACE,
});
```

### 3. 集合設定（Collection）

```javascript
// Create collection for movies with vector search
const collection = db.collection("movies", {
  vector: {
    dimension: 1536, // OpenAI text-embedding-3-small dimension
    metric: "cosine", // Similarity metric
  },
});
```

## 📈 遷移計畫

### 階段 1: 準備 DataStax

- [ ] 建立 Astra DB 帳號
- [ ] 設定 API 金鑰
- [ ] 建立向量集合

### 階段 2: 資料遷移

- [ ] 將 IMDB 資料上傳到 DataStax
- [ ] 批次生成向量嵌入
- [ ] 驗證資料完整性

### 階段 3: 程式碼重構

- [ ] 替換 JSON 檔案讀取
- [ ] 實作 DataStax 查詢
- [ ] 更新 RAG 流程

## 🚀 優勢

1. **效能提升**: 向量搜尋速度提升 10-100 倍
2. **擴展性**: 支援百萬級電影資料
3. **專業性**: 企業級資料庫方案
4. **部署友善**: 雲端託管，適合 Vercel

## 🔍 實作重點

- 使用 DataStax 的向量搜尋取代本地餘弦相似度
- 保持 OpenAI 嵌入生成流程
- 優化批次資料處理
- 實作錯誤處理和重試機制

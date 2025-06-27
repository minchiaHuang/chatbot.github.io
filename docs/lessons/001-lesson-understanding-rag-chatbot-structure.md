# Lesson 1: 理解 RAG 聊天機器人專案結構

## 什麼是 RAG？

RAG（Retrieval-Augmented Generation）是一種結合了檢索和生成的 AI 技術：

- **Retrieval（檢索）**: 從知識庫中找到相關資訊
- **Augmented（增強）**: 用找到的資訊增強提示
- **Generation（生成）**: AI 根據增強的提示產生回答

## 你的專案概覽

根據 `package.json`，你的專案是：

```
movie-rag-chatbot - A movie recommendation chatbot using RAG
```

### 主要技術棧

- **後端**: Express.js (Node.js)
- **AI 服務**: OpenAI API
- **向量資料庫**: DataStax Astra DB
- **數據來源**: IMDB 電影資料
- **嵌入**: OpenAI embeddings

### 專案結構分析

```
chatBot/
├── src/
│   ├── server/          # Express 伺服器
│   ├── lib/
│   │   ├── embeddings/  # 向量嵌入處理
│   │   ├── rag/         # RAG 相關功能
│   │   └── utils/       # 工具函數
├── data/                # 電影數據
├── public/              # 前端檔案
└── docs/                # 文件和課程
```

### 關鍵腳本命令

- `npm start` - 啟動伺服器
- `npm run convert-movies` - 轉換電影數據
- `npm run generate-embeddings` - 生成向量嵌入

## RAG 工作流程概念

1. **數據準備**: 將 IMDB 電影數據轉換為可搜尋格式
2. **嵌入生成**: 為每部電影創建向量表示
3. **向量儲存**: 將嵌入存入 Astra DB
4. **查詢處理**: 用戶問題也轉換為向量
5. **相似搜尋**: 在向量空間中找到相關電影
6. **增強生成**: 用找到的電影資訊增強 AI 回答

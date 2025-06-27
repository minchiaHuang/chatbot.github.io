# 專案結構重組課程

## 目前結構問題

你的專案有一些不符合行業標準的問題：

```
❌ 目前結構：
chatBot/
├── 001-lesson-*.md          # 學習檔案混在根目錄
├── 007-exercise-*.js        # 練習檔案混在根目錄
├── db/                      # 資料庫檔案
├── public/                  # 前端檔案
├── server/                  # 後端檔案
└── pages/api/               # Next.js API（但專案是 Express）
```

## 行業標準結構

```
✅ 建議結構：
movie-rag-chatbot/
├── .env.example             # Environment template
├── .gitignore
├── package.json
├── README.md
├── /src                     # Source code
│   ├── /server              # Backend Express app
│   │   ├── app.js           # Main server file
│   │   ├── /routes          # API routes
│   │   ├── /middleware      # Custom middleware
│   │   └── /services        # Business logic
│   ├── /lib                 # Shared utilities
│   │   ├── /embeddings      # Embedding utilities
│   │   ├── /rag             # RAG system logic
│   │   └── /utils           # Helper functions
│   └── /types               # TypeScript types (if using TS)
├── /public                  # Static assets for frontend
├── /data                    # Data files
│   ├── movies.json
│   └── movies_with_embeddings.json
├── /docs                    # Documentation
│   ├── /lessons             # Learning materials
│   └── /exercises           # Practice files
└── /tests                   # Unit tests
```

## 為什麼這樣組織？

### 1. `/src` 資料夾

- 所有原始碼集中管理
- 清楚區分前端/後端/共用程式碼

### 2. `/lib` 資料夾

- 可重用的工具函數
- 按功能模組化（embeddings, rag, utils）

### 3. `/data` 資料夾

- 所有資料檔案統一管理
- 與程式碼分離

### 4. `/docs` 資料夾

- 學習材料和文件分離
- 不會混淆生產程式碼

## 重組步驟

1. 建立新的資料夾結構
2. 移動檔案到正確位置
3. 更新 import 路徑
4. 清理重複程式碼
5. 建立環境設定檔案

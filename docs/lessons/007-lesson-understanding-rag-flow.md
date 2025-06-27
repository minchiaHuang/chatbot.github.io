# Lesson 7: 理解 RAG 查詢流程

## RAG 的 5 個步驟詳解

### 步驟 1: 接收用戶問題
```pseudocode
用戶輸入: "推薦一些科幻電影"
```

### 步驟 2: 將問題轉換成向量
```pseudocode
使用 OpenAI embedding API:
問題 → text-embedding-3-small → [0.1, 0.3, 0.7, ...]
```

### 步驟 3: 在 Astra DB 中搜尋相似電影
```pseudocode
用問題的向量 → 找到最相似的 5 部電影
回傳: [{電影1, 相似度}, {電影2, 相似度}, ...]
```

### 步驟 4: 組合成 OpenAI 提示
```pseudocode
系統提示 + 用戶問題 + 找到的電影資訊 → 完整的提示
```

### 步驟 5: OpenAI 生成個人化回答
```pseudocode
提示 → ChatGPT → "基於你的需求，我推薦這些科幻電影..."
```

## 實作重點

每個步驟都需要：
- 錯誤處理
- 資料格式轉換
- API 呼叫

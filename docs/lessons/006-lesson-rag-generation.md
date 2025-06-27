# 006-lesson-rag-generation: RAG 生成系統

## 生成階段的核心概念

RAG 的「生成」階段將檢索到的電影資料轉換成自然語言回答。

## 完整 RAG 流程

```
用戶: "推薦一些 1990 年代的科幻電影"
    ↓
1. 檢索階段 (已完成!)
   - 轉換問題為向量
   - 找到相關電影: [駭客任務, 魔鬼終結者2, 異形3...]
    ↓
2. 增強階段 (今天學習)
   - 組合用戶問題 + 檢索到的電影資料
   - 創建豐富的上下文
    ↓
3. 生成階段 (今天學習)
   - 發送到 OpenAI API
   - 生成基於實際資料的回答
```

## 提示工程 (Prompt Engineering)

關鍵是建立好的提示模板：

```javascript
const prompt = `
你是一個專業的電影推薦助手。根據以下電影資料庫的資訊來回答用戶問題。

電影資料庫:
${retrievedMovies
  .map(
    (movie) =>
      `- ${movie.primaryTitle} (${movie.startYear}) - 類型: ${movie.genres}`
  )
  .join("\n")}

用戶問題: ${userQuestion}

請基於上述電影資料庫的資訊提供專業建議。
`;
```

## 為什麼這比純 AI 聊天更好？

**❌ 純 AI 聊天問題**:

```
用戶: "推薦科幻電影"
AI: "我推薦《星際大戰》、《駭客任務》..."
    (可能不準確，無法確認電影是否在資料庫中)
```

**✅ RAG 系統優勢**:

```
用戶: "推薦科幻電影"
系統: 檢索資料庫 → 找到實際的科幻電影
AI: "基於你的電影資料庫，我推薦以下科幻電影：
     - Blade Runner (1982) - 賽博朋克經典
     - Matrix (1999) - 革命性的視覺效果..."
    (準確、基於實際資料、可驗證)
```

## 實作架構

```javascript
async function ragChatbot(userQuery) {
  // 1. 檢索相關電影
  const queryEmbedding = await getEmbedding(userQuery);
  const similarMovies = findSimilarMovies(queryEmbedding, 5);

  // 2. 建構提示
  const prompt = buildPrompt(userQuery, similarMovies);

  // 3. 生成回答
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content;
}
```

## 處理不同類型的問題

**推薦類**: "推薦科幻電影"
**資訊類**: "告訴我關於這部電影的資訊"  
**比較類**: "這兩部電影有什麼不同？"
**過濾類**: "1990 年代的恐怖電影有哪些？"

RAG 系統都能根據實際資料庫提供準確回答！

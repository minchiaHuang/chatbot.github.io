# 011 課程：OpenAI 聊天 API 整合

## 🎯 學習目標

學會將 OpenAI Chat Completion API 整合到我們的 RAG 聊天機器人中，讓機器人能夠：

- 接收用戶問題
- 搜尋相關電影
- 生成個人化回應

## 📚 OpenAI Chat Completion 基礎

### 什麼是 Chat Completion？

- **功能**：將文字輸入轉換為智能回應
- **使用**：GPT-3.5、GPT-4 等模型進行對話
- **特色**：可以加入系統提示和上下文

### API 基本結構

```javascript
const response = await openai.chat.completions.create({
  model: "gpt-3.5-turbo",
  messages: [
    { role: "system", content: "你是一個電影推薦助手" },
    { role: "user", content: "推薦一些科幻電影" },
  ],
});
```

## 🔧 RAG 整合流程

### 完整的 RAG 流程：

1. **用戶輸入**：「我想看科幻電影」
2. **生成查詢向量**：將問題轉為向量
3. **搜尋相似電影**：在資料庫中找相關電影
4. **生成回應**：OpenAI 根據找到的電影生成回答

### 系統提示設計

- 告訴 AI 它是電影推薦助手
- 提供電影資料格式說明
- 設定回應風格和語調

## 📋 實作步驟

### 步驟 1：建立 OpenAI 聊天服務

- 建立 `src/lib/openai/chat-service.js`
- 實作 Chat Completion 呼叫
- 設計系統提示

### 步驟 2：整合搜尋和生成

- 連接向量搜尋功能
- 將搜尋結果傳給 OpenAI
- 格式化最終回應

### 步驟 3：更新伺服器端點

- 修改 `src/server/app.js`
- 整合完整 RAG 流程
- 處理錯誤情況

## 🎯 預期結果

完成後，用戶可以：

- 詢問「推薦一些動作電影」
- 機器人找到相關電影
- 生成個人化的推薦回應

## ✅ 準備檢查

- OpenAI API Key 已設定
- 向量搜尋功能正常運作
- 理解 Chat Completion 概念

準備好開始實作了嗎？

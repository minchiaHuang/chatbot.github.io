# Lesson 4: 尋找 Astra DB 連接資訊

## 在 Astra DB 控制台中找到連接資訊

### 步驟 1: 找到你的資料庫

1. 登入 https://astra.datastax.com
2. 你應該會看到你剛建立的資料庫 "movie-chatbot"
3. 點擊資料庫名稱進入詳細頁面

### 步驟 2: 獲取 API Endpoint (ASTRA_DB_API_ENDPOINT)

```pseudocode
在資料庫詳細頁面：
1. 點擊 "Connect" 標籤
2. 選擇 "API" 選項
3. 找到 "API Endpoint"
4. 複製類似這樣的 URL:
   https://12345678-1234-1234-1234-123456789abc-us-east1.apps.astra.datastax.com
```

### 步驟 3: 創建 Application Token (ASTRA_DB_APPLICATION_TOKEN)

```pseudocode
方法一 - 從資料庫頁面：
1. 在 "Connect" 標籤中
2. 點擊 "Generate Token" 或 "Create Token"
3. 選擇 Role: "Database Administrator"
4. 點擊 "Generate Token"
5. 複製以 "AstraCS:" 開頭的 token

方法二 - 從組織設定：
1. 點擊右上角的用戶圖示
2. 選擇 "Organization Settings"
3. 點擊 "Token Management"
4. 點擊 "Create Token"
5. 選擇 "Database Administrator" role
6. 複製生成的 token
```

### 步驟 4: 確認 Keyspace (ASTRA_DB_KEYSPACE)

```pseudocode
在資料庫詳細頁面：
1. 點擊 "CQL Console" 或 "Connect" 標籤
2. 查看是否有 "movies" keyspace
3. 如果沒有，可以創建一個：
   - 在 CQL Console 中執行: CREATE KEYSPACE movies WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};
```

## 常見問題解決

### 找不到 "Connect" 標籤？

- 確保你點擊了資料庫名稱，而不是在主頁面
- 資料庫狀態應該是 "Active" (綠色)

### Token 創建失敗？

- 確保你有 "Database Administrator" 權限
- 嘗試重新整理頁面

### API Endpoint 格式確認

正確格式應該是：

```
https://[DATABASE_ID]-[REGION].apps.astra.datastax.com
```

## 完整的 .env 檔案範例

```bash
# OpenAI API Key (你需要從 OpenAI 獲取)
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxx

# Astra DB Configuration
ASTRA_DB_APPLICATION_TOKEN=AstraCS:xxxxxxxxxxxxxxxx
ASTRA_DB_API_ENDPOINT=https://12345678-1234-1234-1234-123456789abc-us-east1.apps.astra.datastax.com
ASTRA_DB_KEYSPACE=movies
```

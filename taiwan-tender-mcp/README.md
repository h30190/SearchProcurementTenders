# Taiwan Tender MCP Server

這是一個基於 Model Context Protocol (MCP) 的伺服器，專門用於查詢台灣政府的最新標案資訊。

## 版本
`0.0.1`

## 核心特性
- **合法合規**：直接對接 [政府資料開放平台 (data.gov.tw)](https://data.gov.tw/) 的 JSON 檔案，遵循政府資料開放授權條款，無版權爭議。
- **即時篩選 (Program-level Filtering)**：所有的篩選邏輯皆在 Node.js 程式端完成，AI 僅接收精煉後的活動標案，有效節省 Token 並提高精準度。
- **活標案判斷**：自動篩選「招標公告」與「更正公告」，確保使用者看到的標案皆為可投標狀態。
- **跨日去重**：同時抓取今日與昨日的公告，並針對重複案號進行去重，優先保留最新的更正資訊。
- **自動連結生成**：根據案號與機關代碼，自動拼湊出電子採購網的直接查看連結。

## 技術架構
- **Runtime**: Node.js
- **Protocol**: Model Context Protocol (MCP)
- **Data Source**: 政府開放平台「招標公告-當日」(Dataset ID: 30265)
- **Dependencies**: `@modelcontextprotocol/sdk`, `axios`, `zod`

## 篩選邏輯說明
為了確保回傳給 AI 的資料品質，程式會執行以下過濾：
1. **公告類別過濾**：僅保留 `招標公告` 與 `更正公告`。排除決標、無法決標、廢標等無投標價值之資料。
2. **關鍵字比對**：於「標案名稱」中尋找使用者指定的關鍵字。
3. **資料去重**：若今日與昨日檔案中出現相同案號，優先保留「更正公告」。
4. **欄位精簡**：僅回傳案名、機關、預算金額、截止日期與直接連結，捨棄上百個冗餘欄位。

## 安裝與設定

### 1. 編譯專案
```bash
cd taiwan-tender-mcp
npm install
npm run build # 或執行 npx tsc
```

### 2. 加入 AI 客戶端 (如 Claude Desktop)
在您的 MCP 設定檔中加入以下配置：

```json
{
  "mcpServers": {
    "taiwan_tenders": {
      "command": "node",
      "args": [
        "C:/Users/hh/Documents/vscode_projects/SearchProcurementTenders/taiwan-tender-mcp/build/index.js"
      ]
    }
  }
}
```

## 使用範例
您可以對 AI 說：
- 「搜尋近期與 AI 或 系統開發 相關的標案」
- 「幫我找台北市的 裝修 標案」
- 「看看這兩天有沒有 冷氣安裝 的工程」

## 開發者
- **SOP**: 遵循本機開發流程，資料處理優先於 AI 理解。

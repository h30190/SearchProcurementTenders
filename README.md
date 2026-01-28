# Taiwan Tender MCP

![Version](https://img.shields.io/badge/version-v0.0.1-blue.svg)

基於 MCP 協定的台灣標案自動化查詢工具，直接對接政府開放平台資料，提供精確、合規且高效的標案情報。

---

## 核心特色 (Key Features)
- **合規資料源**: 直接對接政府資料開放平台 (data.gov.tw)，遵循開放資料授權，無版權爭議。
- **程式端預篩選**: 在 Node.js 端即時過濾「招標公告」與「更正公告」，確保資料活標性質並節省 AI Token。
- **跨日去重技術**: 合併今日與昨日公告，自動識別並更新更正資訊，提供最完整的標案視野。
- **AI 整合**: 作為 Model Context Protocol (MCP) 伺服器，讓 AI (如 Claude, Gemini) 能直接理解並分析台灣標案趨勢。

## 安裝與快速上手 (Getting Started)

### 前置需求
- [x] Node.js v20+
- [x] TypeScript / npx

### 執行程式
1. 進入 `taiwan-tender-mcp` 目錄執行 `npm install`。
2. 執行 `npm run build` 進行編譯。
3. 將 `build/index.js` 路徑加入您的 AI 客戶端 MCP 設定檔中。

## 開發與貢獻 (Development)
詳細開發流程請參閱 [DEVELOPMENT_SOP.md](./DEVELOPMENT_SOP.md)。

## 授權與宣告 (License & Disclaimer)
- **版權所有**：Copyright (c) 2026 加號設計數位工程有限公司 (HJPLUS.DESIGN Ltd.)。
- **使用規範**：本產品規範詳見 [RELEASE_STANDARDS.md](./RELEASE_STANDARDS.md)。

---
*最後更新: 2026-01-28*

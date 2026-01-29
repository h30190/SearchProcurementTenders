# Taiwan Tender MCP

![Version](https://img.shields.io/badge/version-v1.0.0-blue.svg)

基於 MCP 協定的台灣標案自動化查詢工具，直接對接政府開放平台資料，提供精確、合規且高效的標案情報。

---

## 核心特色 (Key Features)
- **合規資料源**: 串接 PCC-API 取得政府公開標案資料，確保資料來源合法且穩定。
- **程式端預篩選**: 在 Node.js 端即時過濾「招標公告」與「更正公告」，確保資料活標性質並節省 AI Token。
- **智慧去重技術**: 自動識別並過濾重複案號，優先保留最新資訊，提供最準確的標案列表。
- **AI 整合**: 作為 Model Context Protocol (MCP) 伺服器，讓 AI (如 Claude, Gemini) 能直接理解並分析台灣標案趨勢。

## 資料來源與特別感謝 (Data Source & Acknowledgements)
本工具的核心資料串接採用了由 [Openfun 團隊](https://github.com/openfunltd) 開發與維護的 **[PCC-API](https://pcc-api.openfun.app/)**。

我們由衷感謝 Openfun 團隊在台灣政府電子採購開放資料處理上的辛勤付出。他們將龐大且複雜的政府標案 JSON 資料，整理為結構清晰且高效的 API 介面，才使得本 MCP 工具的開發成為可能。

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
- **授權條款**：本專案採用 [MIT License](./LICENSE) 開源授權。
- **版權所有**：Copyright (c) 2026 加號設計數位工程有限公司 (HJPLUS.DESIGN Ltd.)。
- **使用規範**：本產品規範詳見 [RELEASE_STANDARDS.md](./RELEASE_STANDARDS.md)。

---
*最後更新: 2026-01-28*

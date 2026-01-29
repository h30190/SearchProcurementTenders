# Taiwan Tender MCP

![Version](https://img.shields.io/badge/version-v1.0.0-blue.svg)

基於 MCP 協定的台灣標案自動化查詢工具，串接 PCC-API 提供精確、合規且高效的標案情報。

---

## 核心特色 (Key Features)
- **合規資料源**: 串接 [PCC-API](https://pcc-api.openfun.app/) 取得政府公開標案資料，確保資料來源合法且穩定。
- **程式端預篩選**: 在 Node.js 端即時過濾「招標公告」與「更正公告」，確保資料活標性質並節省 AI Token。
- **智慧去重技術**: 自動識別並過濾重複案號，優先保留最新資訊，提供最準確的標案列表。
- **AI 整合**: 作為 Model Context Protocol (MCP) 伺服器，讓 AI (如 Claude, Gemini) 能直接理解並分析台灣標案趨勢。

## 技術架構 (Technical Architecture)
- **Runtime**: Node.js (v20+)
- **Protocol**: Model Context Protocol (MCP)
- **Data Source**: 
  - 主要介面：[pcc-api.openfun.app](https://pcc-api.openfun.app/)
  - 資料基礎：政府電子採購網「招標公告」
- **篩選邏輯**:
  1. **公告類別過濾**：僅保留 `招標公告` 與 `更正公告`。
  2. **關鍵字比對**：於標案名稱中搜尋使用者指定關鍵字。
  3. **資料去重**：針對搜尋結果中相同案號，優先保留日期較新之紀錄。
  4. **欄位精簡**：僅回傳案名、機關、金額、截止日與直接連結。

## 部署與安裝 (Deployment & Setup)

### 1. 環境準備
- 安裝 [Node.js](https://nodejs.org/) (v20 或以上版本)。
- 確認已安裝 `npm` 與 `git`。

### 2. 下載與編譯 (Build)
```bash
git clone [本專案 Git 網址]
cd SearchProcurementTenders/taiwan-tender-mcp
npm install
npm run build
```

### 3. 設定 AI 客戶端 (Configure Client)
本服務設計為本機運行的 MCP Server，請將其加入 AI 客戶端（以 Claude Desktop 為例）。

找到 Claude Desktop 的設定檔 `claude_desktop_config.json`：
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

將以下內容加入 `mcpServers` 區塊（請將路徑修改為您本機的**絕對路徑**）：

```json
{
  "mcpServers": {
    "taiwan_tenders": {
      "command": "node",
      "args": [
        "C:/Users/[使用者名稱]/.../SearchProcurementTenders/taiwan-tender-mcp/build/index.js"
      ]
    }
  }
}
```
*注意：Windows 路徑建議使用正斜線 `/` (例如 `C:/Projects/...`) 或是雙反斜線 `\` 以避免 JSON 格式錯誤。*

## 使用範例 (Usage Examples)
您可以對 AI 說：
- 「搜尋近期與 新建工程 相關的標案」
- 「幫我找台北市的 裝修 標案」

## 資料來源與特別感謝 (Acknowledgements)
本工具的核心資料串接採用了由 [Openfun 團隊](https://github.com/openfunltd) 開發與維護的 **[PCC-API](https://pcc-api.openfun.app/)**。

我們由衷感謝 Openfun 團隊在台灣政府電子採購開放資料處理上的辛勤付出。他們將龐大且複雜的政府標案資料，整理為結構清晰且高效的 API 介面，才使得本 MCP 工具的開發成為可能。

## 關於作者 (About the Author)
- **作者**: 加號設計數位工程有限公司 HAO.H
- **網站**: [加號設計數位工程有限公司](https://hjplus.design)
- **粉絲專頁**: [加號設計數位工程有限公司](https://www.facebook.com/hjplus.design)
- **電子郵件**: [info@hjplusdesign.com](mailto:info@hjplusdesign.com)

我們是設計、建築與製造產業的外部研發夥伴，專門協助缺乏內部技術團隊的公司導入數位工作流程、工具與 AI，自動化你的知識與作業流程，以補足團隊技能升級的能量。 我們專門解決以下情況：

- **數位落差**：公司有設計與製造能量，但缺乏技術整合的工具與流程。
- **技術缺口**：團隊中沒技術人員或團隊，卻需要自動化或資料串接。
- **整合困難**：專案複雜、資料格式多，但缺乏整合經驗。
- **轉型迷惘**：想導入 AI 或 BIM，但不知道從哪開始。
- **研發支援**：需要專案型的數位顧問或工具開發支援。
- **專業顧問**：需要處理複雜幾何分析建模或 BIM 專案顧問。

更多數位轉型諮詢與服務內容歡迎與我們聯絡。

## 授權與宣告 (License & Disclaimer)
- **免責聲明**：本工具僅供參考，資料內容以「政府電子採購網」官方公告為準。使用者在進行投標決定前，應自行核實資料的準確性與時效性，開發者不對因使用本工具資料而產生的任何損失負責。
- **授權條款**：本專案採用 [MIT License](./LICENSE) 開源授權。
- **版權所有**：Copyright (c) 2026 加號設計數位工程有限公司 (HJPLUS.DESIGN Ltd.)。
- **使用規範**：本產品規範詳見 [RELEASE_STANDARDS.md](./RELEASE_STANDARDS.md)。

---
*最後更新: 2026-01-29*
# 專案命名與發布規範 (RELEASE_STANDARDS)

本文件定義 Taiwan Tender MCP 專案的命名與發布規範。

---

## 1. 識別與身分 (Identity)
本專案嚴格遵循加號設計 (HJPLUS) 之識別規範。

- **專案識別碼 (ProjectID)**: `taiwan-tender-mcp`
- **產品名稱 (ProductName)**: Taiwan Tender MCP (台灣標案查詢 MCP)
- **公司名稱 (Company Name)**: HJPLUS.DESIGN Ltd. (加號設計數位工程有限公司)
- **版權所有 (Copyright)**: Copyright (c) 2026 HJPLUS.DESIGN Ltd.

---

## 2. 輸出與路徑規範 (Output & Paths)

- **入口檔案**: `build/index.js`
- **設定檔路徑**: 依據 MCP Client (如 Claude Desktop) 之規範進行配置。
- **資料暫存路徑**: `%TEMP%\taiwan-tender-mcp` (如有實作快取時使用)

---

## 3. 專案開發檢查表 (Checklist)
在進行版本迭代時，必須確認：

- [x] **package.json**: `version` 與 `name` 符合規範。
- [x] **README.md**: 已更新安裝步驟與最新特色。
- [x] **CHANGELOG.md**: 建立符合 SemVer 規範的版次 (目前為 0.0.1)。

---
*最後編輯: 2026-01-28*

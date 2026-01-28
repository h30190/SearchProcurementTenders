# 更新說明 (Changelog)

本文件記錄 Taiwan Tender MCP 的變更細節。

---

## [0.0.1] - 2026-01-28

### 新功能 (Added)
- 初始化 Taiwan Tender MCP 專案。
- 實作對接政府開放平台 (data.gov.tw) 之資料抓取邏輯 (Dataset ID: 30265)。
- 實作 MCP 伺服器架構，註冊 `search_tenders` 工具。
- 實作程式端資料篩選邏輯：僅保留「招標公告」與「更正公告」。
- 實作跨日資料抓取 (今日 + 昨日) 與自動去重功能。
- 實作自動拼湊電子採購網 (web.pcc.gov.tw) 直接連結之功能。

### 品牌與規範 (Branding & Standards)
- 符合 HJPLUS 開發規範，實作標準說明文件體系。

---
*最後編輯: 2026-01-28*

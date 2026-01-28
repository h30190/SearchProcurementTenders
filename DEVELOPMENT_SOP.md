# 開發作業程序 (Development SOP)

本文件定義 Taiwan Tender MCP 的開發流程、環境配置與品質標準。

---

## 1. 開發環境配置 (Environment Setup)
在開始開發前，請確保已安裝以下工具：

- **Node.js**: v20+ (建議使用 nvm)
- **TypeScript**: v5+
- **MCP SDK**: @modelcontextprotocol/sdk

---

## 2. 專案架構 (Project Structure)
本專案遵循 MCP 伺服器標準結構：

- `/taiwan-tender-mcp/src`: 原始碼。
  - `index.ts`: MCP 伺服器進入點與 Tool 註冊。
  - `tender-service.ts`: 資料抓取、篩選與去重核心邏輯。
- `/taiwan-tender-mcp/build`: 編譯後的 JavaScript 檔案。
- `README.md`: 產品介紹與安裝指南。
- `CHANGELOG.md`: 版本異動紀錄。

---

## 3. Git 與提交規範 (Git Workflow)
所有提交必須遵循 [Conventional Commits](https://www.conventionalcommits.org/)：

- `feat`: 新功能 (如增加新的篩選條件)。
- `fix`: 修復 Bug (如政府 API 欄位異動)。
- `docs`: 僅文件異動。
- `refactor`: 代碼重構。

---

## 4. 開發週期指令 (Commands)

### 安裝依賴
```bash
npm install
```

### 編譯 TypeScript
```bash
npm run build # 或是 npx tsc
```

### 偵錯模式 (stdio)
```bash
node build/index.js
```

---

## 5. 品質檢查表 (Quality Checklist)
發布前必須確認：
- [ ] 執行結果中，所有「截止日期」已過期之標案是否已正確被公告類別過濾排除。
- [ ] 連結是否能正確跳轉至 `web.pcc.gov.tw`。
- [ ] 已更新 `CHANGELOG.md` 並同步 `package.json` 版本號。

---
*最後編輯: 2026-01-28*

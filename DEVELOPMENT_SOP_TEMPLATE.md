# 開發作業程序 (Development SOP) - [樣板]

本文件定義 {{ProductName}} 的開發流程、環境配置與品質標準。旨在確保所有開發者遵循一致的作業規範。

---

## 1. 開發環境配置 (Environment Setup)
在開始開發前，請確保已安裝以下工具：

- **Go**: v1.22+
- **Node.js**: v20+ (建議使用 nvm)
- **Wails CLI**: 最新穩定版 (go install github.com/wailsapp/wails/v2/cmd/wails@latest)
- **NSIS**: 用於 Windows 安裝檔製作 (需確保 makensis 在 Path 中)

---

## 2. 專案架構 (Project Structure)
本專案遵循 Wails 標準結構並進行品牌擴充：

- /frontend: 前端視圖 (React/TS/CSS)。
- /build: 建置資源 (Icons, Installer NSI)。
- /scripts: 自動化腳本 (Deploy, Setup)。
- main.go: 應用程式進入點與品牌路徑實作。
- BRAND_STANDARDS.md: [強制規範] 識別碼與命名標準。

---

## 3. Git 與提交規範 (Git Workflow)
所有提交必須遵循 [Conventional Commits](https://www.conventionalcommits.org/)：

- feat: 新功能。
- fix: 修復 Bug。
- docs: 僅文件異動 (如更新此 SOP)。
- style: 不影響程式邏輯的代碼格式異動。
- refactor: 代碼重構。

---

## 4. 開發週期指令 (Commands)

### 啟動開發模式
```bash
wails dev
```

### 生成安裝包 (Windows)
```bash
# 執行標準發布腳本
./scripts/simple_deploy.ps1
```

---

## 5. 品質檢查表 (Quality Checklist)
發布前必須確認：

- [ ] 符合 BRAND_STANDARDS.md 的 ProjectID 與路徑規範。
- [ ] 已更新 CHANGELOG.md。
- [ ] 視窗標題與元數據 (Metadata) 正確無誤。

---
*樣板版本: 1.0.0*  
*最後編輯: {{YYYY-MM-DD}}*

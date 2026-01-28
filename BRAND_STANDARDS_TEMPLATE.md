# HJPLUS.DESIGN 產品開發品牌規範 (BRAND_STANDARDS) - [樣板]

本文件定義了「加號設計數位工程有限公司 (HJPLUS.DESIGN Ltd.)」所有數位產品的命名、安裝路徑與技術架構標準。

---

## 1. 識別碼命名標準 (ProjectID Pattern)

所有專案必須定義一個唯一的 `ProjectID`，用於檔案夾路徑、執行檔名稱與通訊管道。

*   **格式**: `[主體名稱]-[服務類型]-[品牌標籤]`
*   **規則**: 
    *   **僅限 ASCII**: 全小寫英文、數字與連字號 (`-`)。
    *   **禁止中文與空格**: 確保路徑與程序通訊正常。
    *   **持久性**: 一旦定義，不隨版本號改變。
*   **範例**: `contacts-by-ollama-hjplus`, `revit-mcp-hjplus`

---

## 2. 檔案系統路徑標準 (FileSystem Scope)

所有產品必須強制歸類於 `HJPLUS_DESIGN` 命名空間。

### 2.1 資料目錄架構
所有應用程式數據必須存放在：
`%AppData%\Roaming\HJPLUS_DESIGN\{{ProjectID}}\`

| 項目 | 路徑 | 說明 |
| :--- | :--- | :--- |
| **主目錄** | `...\HJPLUS_DESIGN\{{ProjectID}}\` | 專案根目錄 |
| **執行檔** | `...\HJPLUS_DESIGN\{{ProjectID}}\bin\` | (若由安裝程式部署) |
| **WebView2** | `...\HJPLUS_DESIGN\{{ProjectID}}\webview\` | UI 資料 |

---

## 3. 命名與通訊標準 (Naming & Communication)

### 3.1 顯示名稱與識別碼分離
*   **ProjectID**: 用於系統內部（檔名、路徑、Pipes）。
*   **ProductName**: 用於對外顯示（視窗標題、開始功能表）。

### 3.2 執行檔命名規範
*   **名稱**: 必須直接等於 `ProjectID` (例如: `{{ProjectID}}.exe`)。
*   **去版本化**: 檔名中不可包含版本號。版本資訊應嵌入檔案 Metadata 中。

---

## 4. 安裝程式規範 (Installer Design)

*   **安裝等級**: 預設採用 **Admin Level (admin)**，確保安全性。
*   **預設路徑**: `$PROGRAMFILES64\HJPLUS_DESIGN\{{ProjectID}}`。
*   **例外情況**: 輕量化工具可改採 User Level 並安裝於 `$APPDATA`。

### 4.1 存取權限與資料分離原則
| 資料類型 | 存放路徑 | 存取權限 |
| :--- | :--- | :--- |
| **程式主體** | `Program Files` | Read-only |
| **資料庫 (.db)** | `%AppData%` | Read/Write |
| **執行日誌 (.log)** | `%AppData%` | Read/Write |

---

## 5. 快速部署樣板 (Project Template)

### Wails (wails.json)
```json
{
  "name": "{{ProjectID}}",
  "outputfilename": "{{ProjectID}}",
  "info": {
    "companyName": "HJPLUS.DESIGN Ltd.",
    "productName": "{{ProductName}}"
  }
}
```

---

## 6. 桌面程式專屬規範 (Desktop App Extension)

### 6.1 視窗與生命週期管理
*   **單一實例 (Single Instance)**：應檢查避免多開。
*   **視窗持久化**：記錄並恢復視窗位置與大小。

### 6.2 資料與路徑規範
*   **日誌存放**：`...\logs\`。
*   **資料庫存放**：`...\db\`。

---
*樣板版本: 1.4.0*  
*最後更新: {{YYYY-MM-DD}}*

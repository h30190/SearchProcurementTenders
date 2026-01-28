# 專案命名與發布規範 (RELEASE_STANDARDS) - [樣板]

本文件定義 {{ProductName}} 專案的命名與發布規範。本文件為 BRAND_STANDARDS.md 的實作延伸，兩者應保持聯動。

---

## 1. 識別與身分 (Identity)
本專案必須嚴格遵循 [品牌識別碼規範](BRAND_STANDARDS.md#1-識別碼命名標準-projectid-pattern)。

- **專案識別碼 (ProjectID)**: {{project-id-placeholder}}
- **產品名稱 (ProductName)**: {{中文產品名稱}}
- **公司名稱 (Company Name)**: HJPLUS.DESIGN Ltd.
- **版權所有 (Copyright)**: Copyright (c) {{YEAR}} HJPLUS.DESIGN Ltd.

---

## 2. 輸出與路徑規範 (Output & Paths)
詳細實作準則請參閱 [檔案系統路徑標準](BRAND_STANDARDS.md#2-檔案系統路徑標準-filesystem-scope)。

- **執行檔實體檔名**: {{project-id-placeholder}}.exe
  - *規則：禁止包含版本號，詳見 [執行檔命名規範](BRAND_STANDARDS.md#32-執行檔命名規範)。*
- **預設安裝與資料路徑**: %APPDATA%\HJPLUS_DESIGN\{{project-id-placeholder}}

---

## 3. 專案開發檢查表 (Checklist)
在新專案初始化時，請確認以下檔案已同步更新：

- [ ] **wails.json**: name, outputfilename, info.companyName, info.productName。
- [ ] **main.go**: 實作基於 ProjectID 的動態路徑獲取邏輯。
- [ ] **CHANGELOG.md**: 建立符合 SemVer 規範的初始版次。

---
*樣板版本: 1.1.0*  
*最後編輯: {{YYYY-MM-DD}}*  
*引用規範版本: BRAND_STANDARDS v1.3.0+*

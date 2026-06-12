# 💻 Windows 10 互動式復古移植網頁專案

這是一個高品質的 **Windows 10 模擬控制面板系統** 前端專案。本專案以 **React 18 + Vite + Tailwind CSS + TypeScript** 進行實作，並深度參考控制中心設計，將網頁重構為一個現代化、全動態且富有 Fluent Design 毛玻璃質感的系統介面。

---

## ✨ 專案亮點與特色 (Key Features)

1.  **高度還原的 Windows 10 系統主控台風格**：
    *   **主控看板 Chrome**：頂部預留 Windows 10 模擬視窗標題列，含有管理者資料、Ver 系統版本代碼及圓點交互。
    *   **磨砂玻璃質感 (Acrylic Blur)**：全局採用 Fluent 亮麗背景磨砂，具備響應式寬度調整與適中的微軟視窗陰影。
    *   **麵包屑與狀態指針 (Breadcrumb & Status)**：頂端設有實時 Breadcrumb 指引（系統主選單 > 當前應用），右側常駐 Systemstatus 燈號，給訪客置身於實體 OS 控制面板的細緻感受。
2.  **廢除繁雜桌面捷徑，一鍵極速側欄選導導航**：
    *   **預設打開關於我**：網頁載入時，直接省略空蕩的底座桌布與需要多重雙擊圖示的模擬環境，在安全的主視窗中**預設直觀展示「關於我」**。
    *   **Fluent 側邊功能選單 (Sidebar Gallery)**：左方側欄常駐應用快捷切換鈕（關於我、工具、作品、日誌、訪客留言），點擊即毫秒級順暢載入子頁面，相容於滑鼠及手機觸控！
    *   **手機版響應式漢堡選單 (Mobile Navigation)**：小螢幕裝置上，左方側欄會自動重組為彈開式漢堡收折側菜單，保證各平台下極佳的 UX 體驗。
3.  **依據實用概念完整移植的分頁內容**：
    *   `[關於我 (About Me)](src/apps/AboutMe.tsx)`：精美的個人化 avatar 生日與自我介紹，附帶具吸引力的精美漸層技能樹。
    *   `[實用工具軟體 (Tools)](src/apps/Tools.tsx)`：**高度自主研發工具箱**。提供 Base64 加密與解碼編碼器、離線字數與字元統計分析器、 JSON 格式化校對器以及 Windows 10 Fluent 主色調色盤等，皆具有完美的模擬毛玻璃 UI 質感與高互動性！

---

## 🛠️ 技術棧與底層架構 (Tech Stack)

*   **基礎核心**: `React 18` + `TypeScript 5` (模組元件高內聚、類型安全)。
*   **高速編譯**: `Vite` (提供極速開發體驗與高壓縮的靜態資源打包成果)。
*   **樣式渲染**: `Tailwind CSS 3` (提供全響應式流動網格佈局，以及磨砂玻璃 Acrylic 的 `backdrop-blur-md` 實現)。
*   **向量元件**: `Lucide React` (流線型 Windows 10 功能性 icon 物件)。
*   **本地資料流**: `HTML5 LocalStorage` (持久化儲存訪客留言簿卡片)。

---

## 📂 檔案目錄結構

請參考本專案的目錄設計：
*   `[package.json](package.json)`：專案宣告與開發依賴（React, Tailwind, TypeScript, Vite）。
*   `[tsconfig.json](tsconfig.json)`：TypeScript 編譯設置（關閉了 unused 限制，方便開發）。
*   `[vite.config.ts](vite.config.ts)`：Vite 的 React 加載器配置。
*   `[tailwind.config.js](tailwind.config.js)`：自訂 Windows 10 精緻 Fluent 色盤與圓角比例。
*   `[index.html](index.html)`：主頁載入骨架。
*   `[src/main.tsx](src/main.tsx)`：掛載 React App 到 DOM。
*   `[src/types.ts](src/types.ts)`：視窗狀態 (WindowState) 與留言欄的型別。
*   `[src/index.css](src/index.css)`：Tailwind 載入、自訂滾動條與視窗放大淡入特效 CSS。
*   `[src/App.tsx](src/App.tsx)`：**頂層全局系統控制器**，調度桌面、多重視窗狀態、搜尋引擎與工作列。
*   `[src/components/](src/components/)`：系統公用主視覺面板群 (Window、Taskbar、StartMenu、CalendarFlyout、DesktopIcon)。

---

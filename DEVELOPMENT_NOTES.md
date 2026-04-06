# 公文知識庫 開發維護百科 (Development Encyclopedia)

本文件詳盡紀錄系統的技術棧、設計規範、核心邏輯與待辦清單，為本專案的「唯一真理來源」。

---

## 🛠 1. 專案技術棧 (Tech Stack)

| 分類 | 技術 / 套件 | 備註 |
| :--- | :--- | :--- |
| **核心框架** | React 19 (TypeScript) | 使用最新版本，支援 Concurrent 渲染 |
| **建構工具** | Vite 6 | 提供極速的開發開發熱重載 (HMR) |
| **樣式系統** | Tailwind CSS 4 | 使用 `@theme` 變數驅動的現代化樣式 |
| **狀態管理** | Zustand 5 | 輕量化全域狀態 (ArticleStore, UserStore) |
| **後端服務** | Firebase 12 | Firestore (DB), Auth (驗證) |
| **動畫效果** | Motion 12 | 處理頁面切換與解鎖 Modal 動畫 |
| **圖示庫** | Lucide React | 簡潔一致的向量圖示 |

---

## ⚙️ 2. 各項重要參數 (Configuration)

### A. 環境變數 (.env)
所有環境變數需以 `VITE_` 開頭才能在前端讀取：
*   `VITE_FIREBASE_API_KEY`: Firebase 溝通用密鑰。
*   `VITE_FIREBASE_PROJECT_ID`: 決定資料存儲的分區。

### B. 設計規範 (Design System)
樣式定義於 `src/index.css`，主要變數：
*   **品牌色**: `brand-500 (#f97316)` - 活力橘色。
*   **背景色**: `bg-base (#FDFBF7)` - 溫暖淺米色，減輕長時間閱讀壓力。
*   **字體**: `Inter` (英文), `Noto Sans TC` (中文)。
*   **圓角**: 統一使用 `rounded-3xl (1.5rem)` 或 `rounded-[2.5rem]`。

---

## 🔐 3. 核心邏輯紀錄 (Core Logic)

### A. 權限雙重驗證 (RBAC)
1. **驗證層**: `Firebase Auth` 確保帳號密碼正確。
2. **授權層**: 查詢 Firestore `users/{email_id}`。
   *   `admin`: 具備管理員權限 (UserManager)。
   *   `editor`: 僅能管理文章。
*   **開發者後門**: `userStore.ts` 中保留了 `admin@example.com` 的本地登入邏輯，上線前須移除。

### B. 機敏資料保護 (Access Code)
*   **層級**: 全站統一通行碼。
*   **存儲**: Firestore `settings/system -> global_access_code`。
*   **生命週期**: 驗證通過後存於 `sessionStorage`，瀏覽器分頁關閉即失效。

---

## 📂 4. 文件與 Skills 目錄結構
*   `.agents/rules/`: 存放 AI 開發者的行為準則 (AI Instruction Skills)。
*   `docs/skills/`: 存放人類開發者的技術筆記 (Developer Practical Skills)。
    *   `bespoke-layout.md`: 說明如何增加新的視覺特輯區塊。
    *   `firebase-rules.md`: 說明 Firestore 的安全性規則配置。

---

## 📝 5. 待辦事項 (TODO List)

### 🔴 高優先級 (Security & Stability)
- [ ] 移除 `userStore.ts` 中的硬編碼測試帳號。
- [ ] 實作 Firebase Security Rules，限制只有 `role: admin` 能寫入 `users` 集合。
- [ ] 為 `UserManager` 加入 Email 格式檢查。

### 🟡 中優先級 (Feature & UX)
- [ ] 實作「忘記通行碼」的後台重設流程。
- [ ] 增加「用戶操作紀錄」集合，追蹤誰修改了通行碼。
- [ ] 支援存取碼的「各別文章覆寫」功能。

### 🟢 低優先級 (Visuals)
- [ ] 增加機敏文章的「模糊預覽」背景效果。
- [ ] 優化手機版後台的表格顯示。

---

*最後更新時間：2026-04-07*

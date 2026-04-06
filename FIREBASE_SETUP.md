# 🚀 Firebase 雲端資料庫設置指南

本指南將引導您如何在 Google Firebase 上建立並設定專案，以驅動「公文知識庫」的雲端同步功能。

---

## 1. 建立 Firebase 專案
1. 前往 [Firebase 控制台 (Firebase Console)](https://console.firebase.google.com/)。
2. 點擊「**新增專案 (Add Project)**」。
3. 輸入專案名稱（例如：`official-knowledge-base`），依照提示完成專案建立。
   > [!NOTE]
   > 若僅供內部測試，可以不用啟用 Google Analytics 以簡化設定。

---

## 2. 註冊 Web 應用程式並獲取金鑰
1. 在專案首頁，點擊畫面中央的 **Web 圖示 (`</>`)**。
2. 註冊應用程式暱稱（例如：`Web App`），點擊「**註冊應用程式 (Register App)**」。
3. 畫面將出現一段 `firebaseConfig` 程式碼。
4. **請對應填入您專案根目錄下的 `.env` 檔案中**：

| Firebase 欄位 | 對應 .env 變數 |
| :--- | :--- |
| `apiKey` | `VITE_FIREBASE_API_KEY` |
| `authDomain` | `VITE_FIREBASE_AUTH_DOMAIN` |
| `projectId` | `VITE_FIREBASE_PROJECT_ID` |
| `storageBucket` | `VITE_FIREBASE_STORAGE_BUCKET` |
| `messagingSenderId` | `VITE_FIREBASE_MESSAGING_SENDER_ID` |
| `appId` | `VITE_FIREBASE_APP_ID` |

---

## 3. 啟動 Cloud Firestore 資料庫
獲取金鑰後，必須在後台開啟資料庫服務，系統才具備儲存與讀取文章的能力。

1. 在 Firebase 左側選單點擊「**建置 (Build)**」 -> 「**Firestore Database**」。
2. 點擊「**建立資料庫 (Create database)**」。
3. 選擇「**以測試模式啟動 (Start in test mode)**」。
4. 選擇伺服器位置（建議選擇 `asia-east1` 或 `asia-northeast1`）。

### 🔒 資料庫規則 (Security Rules)
若您並非選擇測試模式，或想手動調整權限，請點擊 Firestore 內的「**規則 (Rules)**」標籤，並將規則修改為：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; 
    }
  }
}
```
> [!WARNING]
> `allow read, write: if true;` 僅限於開發與內部測試（任何人都能瀏覽路徑並修改資料）。正式公開上線時，請務必配置正確的權限驗證。

---

## 4. 初始化雲端資料並啟用
1. 建立並填寫好 `.env` 檔案後，重啟網頁專案（`npm run dev`）。
2. 在瀏覽器網址輸入 `http://localhost:3000/admin` 進入後台。
3. 點擊上方出現的 **「初始化雲端資料庫」** 按鈕。
4. 系統將會把預設的優質文章種子一次性上傳至 Cloud Firestore。

🎉 **恭喜！您的知識庫現在已經完全雲端化了。**

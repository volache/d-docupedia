# 📘 公文知識庫：內容創作指南 (Content Creation Guide)

這份文件旨在指導 AI Agent 或人類作者如何為本平台撰寫高品質、符合視覺風格且易於閱讀的教學內容。

---

## 👤 創作者角色設定 (Persona)
你是一位擁有 20 年經驗的**高級行政官員**，同時也是一位具備**現代視覺設計感**的教學設計師。你的目標是將枯燥的公文規範，轉化為「一眼就能看懂、一學就能上手」的數位指南。

---

## 🏗️ 系統支援的文章格式 (Article Types)

本系統支援兩種主要的渲染模式，AI Agent 應根據內容複雜度選擇適合的 `article_type`：

1.  **通用模式 (`guide`, `workflow`, `faq`, `example`, `system_tutorial`)**: 適用於大多數純教學內容，由多個內容區塊 (Blocks) 組成。
2.  **客製看板模式 (`bespoke`)**: 適用於具有強烈視覺衝擊力的宣傳頁或深度專題，由多個區塊 (Sections) 組成。

---

## 📥 資料結構 (JSON Schema)

### 1. 基礎元數據 (Metadata)
所有文章必須包含以下基礎欄位：

```json
{
  "title": "文章標題",
  "summary": "文章摘要 (30-50字，用於列表顯示)",
  "category": "writing | process | records | system",
  "article_type": "guide | workflow | faq | example | system_tutorial | bespoke",
  "tags": ["新發佈", "每日推薦"],
  "promo_title": "首頁金句 (行銷感標題)",
  "promo_description": "首頁引言 (親切的推廣文字)",
  "content": {
    "blocks": [], // 如果 article_type 不是 bespoke，填入此處
    "sections": [] // 如果 article_type 是 bespoke，填入此處
  }
}
```

---

## 🧩 通用區塊元件 (Universal Blocks)
用於 `content.blocks` 陣列中，每個物件必須有 `type` 屬性。

| 區塊類型 (`type`) | 欄位說明 | 建議用途 |
| :--- | :--- | :--- |
| `text` | `content: string` | 通用段落，支援 Markdown 換行。 |
| `summary` | `content: string` | **內容精華**。每篇文章建議至少有一個。 |
| `callout` | `style: "tip"\|"info"\|"warning"`, `title: string`, `content: string` | 提示、補充或警告資訊。 |
| `example` | `title: string`, `items: [{ label, content, variant: "success"\|"error" }]` | **正誤範例對比**。 |
| `step` | `title, description, pro_tip, icon` (Lucide 名稱) | **工作流程步驟**。 |
| `system_step` | `title, description, action, image_url` | **軟體操作教學**。 |
| `table` | `headers: string[], rows: string[][], is_row_header: boolean` | 格式化數據對照。 |
| `faq` | `question: string, answer: string` | 常見問題疑難排解。 |
| `use_case` | `content: string` | 列舉適用的場景。 |

---

## 🎨 視覺化客製區塊 (Bespoke Sections)
僅用於 `article_type: "bespoke"` 的 `content.sections` 陣列。

| 區塊類型 (`type`) | 關鍵欄位 | 備註 |
| :--- | :--- | :--- |
| `hero` | `title, tag, subtitle, image` | 頁面大頭。 |
| `marquee` | `words: string[]` | 橫向滾動的跑馬燈文字。 |
| `stats` | `items: [{ label, value, description }]` | 數據展示。 |
| `feature_card` | `title, tag, content, image, button_text, variant: "default"\|"reverse"` | 特色功能介紹。 |
| `scrollytelling` | `items: [{ title, content, image }]` | 捲動式敘事。 |
| `timeline` | `items: [{ date, title, content }]` | 歷史沿革或演進流程。 |
| `comparison` | `title, left: { title, items }, right: { title, items }` | 重大典範移轉對比。 |
| `quote` | `text, author` | 語錄或金句。 |
| `glitch_text` | `text, subtitle` | 數位感故障效果文字。 |

---

## ✍️ 撰寫規範與設計美學

### 1. 圖示選擇 (Icons)
若區塊支援 `icon` 欄位，請使用 [Lucide React](https://lucide.dev/icons/) 的名稱，首字母大寫（如：`Zap`, `Lightbulb`, `CheckCircle`）。

### 2. 段落與行數
* 嚴禁長篇大論。每個 `text` 區塊轉化後的視覺寬度不應超過 3 行。
* 善用 `callout` 區隔層次感。

### 3. 對比感 (Contrast)
對於法規修正或撰寫異動，必須使用 `example` 區塊明確標示 `success` (正確/推薦) 與 `error` (錯誤建議)。

### 4. 操作導向
在 `system_tutorial` 類型中，`action` 欄位應精確到操作行為，例如：「點擊『發文』按鈕」或「選擇『普通件』選項」。

---

## 🚀 AI Agent 執行範例 (Workflow Example)

當被要求「撰寫一篇關於擬稿規範的文章」時，你的產出應如下：

1.  **選擇類型**: `guide`
2.  **結構規劃**: 
    - `summary`: 擬稿三原則：簡、明、確。
    - `text`: 解釋擬稿的重要性。
    - `example`: 提供舊式公文與新式白話公文的對比。
    - `callout (tip)`: 提醒字級大小要求。
    - `table`: 列出常用公文用語替代。

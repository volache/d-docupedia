import { Article, Category, Activity, FAQ, WorkflowStep } from './index';

/**
 * 假資料：知識庫分類
 * 用於首頁導航與學習中心篩選
 */
export const mockCategories: Category[] = [
  { id: 'c1', name: '公文撰寫', icon: 'PenTool', slug: 'writing' },
  { id: 'c2', name: '行政流程', icon: 'GitMerge', slug: 'process' },
  { id: 'c3', name: '檔案管理', icon: 'Archive', slug: 'records' },
  { id: 'c4', name: '系統操作', icon: 'MonitorPlay', slug: 'system' },
];

/**
 * 假資料：示範文章列表
 * 包含完整內容、標籤與更新日期，供首頁推薦與列表頁使用
 */
export const mockArticles: Article[] = [
  {
    id: '1',
    title: '公文主旨撰寫要點',
    slug: 'subject-writing-tips',
    category: 'writing',
    article_type: 'guide',
    summary: '掌握「動詞＋內容」的核心公式，讓您的公文主旨清晰有力。',
    tags: ['初學者', '公文美學', '溝通效率', '精選'],
    updated_at: '2024-03-20',
    content: {
      blocks: [
        { type: 'summary', content: '良好的公文主旨應控制在 20 字以內，且能讓讀者在 3 秒內理解主辦意圖。' },
        { type: 'text', content: '在行政機關中，公文主旨是資訊傳遞的第一線。使用精確的動詞如「請」、「檢送」、「報請」能立即建立行政關係。' },
        { type: 'callout', style: 'tip', title: '專業小技巧', content: '避免在主旨中使用過多冗贅詞，如「有關...一案，請查照」中的「一案」通常可以省略。' },
        { type: 'example', title: '正誤範例對比', items: [
          { label: '普通', content: '有關本局辦理 113 年度員工滿意度調查事宜，請各單位配合辦理。', variant: 'error' },
          { label: '推薦', content: '檢送 113 年度員工滿意度調查表，請於本（3）月 25 日前查填逕復。', variant: 'success' }
        ]}
      ]
    }
  },
  {
    id: '2',
    title: '公文簽辦標準流程',
    slug: 'official-document-workflow',
    category: 'process',
    article_type: 'workflow',
    summary: '從擬稿到發文的完整生命週期，確保每一進度都符合行政規範。',
    tags: ['標準作業程序', '行政效能', '每日推薦'],
    updated_at: '2024-03-15',
    content: {
      steps: [
        {
          title: '擬稿階段',
          description: '承辦人依據業務需求擬定草案。此階段應確保內容事實正確、引用法令無誤。',
          pro_tip: '使用標準範本可減少 40% 的格式錯誤率。',
          icon: 'FileEdit'
        },
        {
          title: '核稿與會辦',
          description: '送交相關單位會審，確保不與其他政策衝突，並由各級主管層層把關。',
          pro_tip: '會辦單位超過三個時，建議先召開協調會議。',
          icon: 'Users'
        },
        {
          title: '判行',
          description: '由機關長官或其授權人員決定是否執行。這是公文正式產生法律效力的關鍵點。',
          pro_tip: '附件應與本文一併裝訂，方便長官閱覽。',
          icon: 'CheckSquare'
        },
        {
          title: '發文與歸檔',
          description: '文書組進行編號、蓋印並寄送。完成後將正本歸檔妥善保存。',
          pro_tip: '電子交換文件通常在 10 分鐘內送達。',
          icon: 'Send'
        }
      ]
    }
  },
  {
    id: '3',
    title: '電子簽核系統常見問題',
    slug: 'e-sign-faq',
    category: 'system',
    article_type: 'faq',
    summary: '彙整同仁在操作電子簽核系統時最常遇到的障礙與解決方案。',
    tags: ['系統操作', '疑難排解'],
    updated_at: '2024-03-25',
    content: {
      faqs: [
        {
          question: '為何我的自然人憑證無法登入系統？',
          answer: '通常是因為讀卡機驅動程式未更新或瀏覽器元件失效。請先嘗試重新插入讀卡機，或下載最新版「公文 GCA 元件」。'
        },
        {
          question: '如何撤回已經送出的公文？',
          answer: '若下一位簽核者尚未讀取，您可以在「待辦公文」選單中找到該案，點擊「撤回」功能。若下一位已讀取，則需請其退回。'
        },
        {
          question: '附件檔案限制大小是多少？',
          answer: '目前系統限制單一附件不得超過 20MB，總附件大小不得超過 50MB。若超過此限制，建議使用「附件下載連結方式」處置。'
        }
      ]
    }
  },
  {
    id: 'special-master',
    title: '行政轉型全紀錄：從封泥到 AI 的兩千年長征',
    slug: 'administrative-evolution-master',
    category: 'writing',
    article_type: 'bespoke',
    summary: '這是一部敘事性視覺史詩。我們將從漢代的封泥開始，橫跨兩千年，見證行政體系如何轉化為智慧數據。',
    tags: ['特輯', '數位轉型', '視覺故事', '獨家'],
    updated_at: '2024-04-06',
    content: {
      sections: [
        {
          type: 'hero',
          title: "文字的重量：轉型史詩",
          subtitle: "在 AI 與數據的時代，重新定義機關的行政靈魂。",
          image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=2070",
          tag: "Visual Essay Masterpiece"
        },
        {
          type: 'marquee',
          words: ["SPEED", "TRANSPARENCY", "DIGITAL", "HISTORY", "AI", "TRUST", "FUTURE"]
        },
        {
          type: 'stats',
          items: [
            { label: "平均處理時間", value: "0.8d", description: "從漢代馬車傳遞到今日的電子交換，效能提升超過萬倍。" },
            { label: "每年節省成本", value: "$42M", description: "全國機關實現無紙化後，顯著降低的人力與郵寄支出。" },
            { label: "電子交換率", value: "99.2%", description: "台灣行政體系已全面邁向虛擬化與自動化。" }
          ]
        },
        {
          type: 'feature_card',
          title: "AI 輔助分文：效率的奇點",
          content: "過去需要專人逐件判讀的複雜公文，現在透過 AI 可以在 0.5 秒內完成分類並精準投遞。這不是取代人類，而是解放行政人員的創造力，讓專業回歸專業。",
          image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=2070",
          tag: "Tech Innovation",
          button_text: "查看 AI 技術白皮書"
        },
        {
           type: 'scrollytelling',
           items: [
             {
               title: "封泥與簡牘：信譽的起源",
               content: "早在兩千年前，為了保障機關秘密，公務員使用特製粘土覆蓋接縫並蓋上官印。這是人類行政史上最早的身分驗證 (Identity Verification)。",
               image: "https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?auto=format&fit=crop&q=80&w=2070"
             },
             {
               title: "非同步協作：效率的釋放",
               content: "現代數位公文不再受限於紙本的線性流動。多人即時編修、跨部會同步核稿，讓整座機關的智慧在雲端即時同步。",
               image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2070"
             }
           ]
        },
        {
          type: 'timeline',
          items: [
            { date: "漢代", title: "封泥制度", content: "使用泥土封存簡牘，開創行政保密機制。" },
            { date: "1995", title: "網路系統啟蒙", content: "台灣啟動政府網路化，公文開始出現數位登記。" },
            { date: "2024", title: "智慧行政時代", content: "引入大型語言模型輔助校對，處理效率達到分鐘級。" }
          ]
        },
        {
          type: 'comparison',
          title: "典範轉移：行政美學",
          subtitle: "從繁瑣的官樣文章，轉化為直覺、高效的數位體制。",
          left: {
            title: "傳統威權範式",
            items: ["本案經查係屬...", "依據前揭函示辦理...", "祈請 鈞長核示。"]
          },
          right: {
            title: "現代專業範式",
            items: ["1. 建立數據導向決策", "2. 推動跨機關透明協作", "3. 全程數位化追蹤"]
          }
        },
        {
          type: 'quote',
          text: "好的公文不是寫給你看的，<br/>是寫給未來的公務員參考的。",
          author: "數位政務委員 (2025)"
        },
        {
          type: 'glitch_text',
          text: "ADAPT OR OBSOLETE",
          subtitle: "進化，是行政體系唯一的生存之道。"
        },
        {
          type: 'footer',
          text: "全域視覺特輯：致所有在位元中前行的行政人員"
        }
      ]
    }
  }
];

/**
 * 假資料：最近活動記錄
 * 用於首頁或個人中心顯示通知
 */
export const mockRecentActivities: Activity[] = [
  { id: 'a1', title: '您已成功完成閱讀：[2023]行政流程標準化指南', time: '10 分鐘前', type: 'read' },
  { id: 'a2', title: '王小明 分享了「會議記錄撰寫技巧」給您', time: '2 小時前', type: 'share' },
  { id: 'a3', title: '系統自動提醒：年度預算編列規範 已有版本更新', time: '昨天 16:30', type: 'update' },
];

/**
 * 假資料：常見問題 (FAQ)
 * 作為資料庫無回傳時的備份資料
 */
export const mockFaqs: FAQ[] = [
  { id: 'f1', question: '公文的「簽」與「便簽」有何不同？', answer: '「簽」用於機關內部陳報長官核示，通常包含擬辦、事實、說明等項；「便簽」則用於單位間簡單公務聯絡或非正式指示。' },
  { id: 'f2', question: '自然人憑證讀取不到怎麼辦？', answer: '請確認讀卡機燈號是否正常，並重新啟動 HiCOS 元件。建議使用 Chrome 瀏覽器並開啟相關外掛組件。' },
  { id: 'f3', question: '電子發文後附件還可以修改嗎？', answer: '一旦完成發文編號並蓋印後，文件即正式產生效力，內容不可隨意修改。若有重大錯誤，需發布更正函。' }
];

/**
 * 假資料：公文簽辦步驟 (詳盡版)
 * 用於 WorkflowView 頁面展示
 */
export const mockWorkflowSteps: any[] = [
  { 
    step: 1, 
    title: '擬稿階段', 
    desc: '承辦人依據業務需求擬定草案。此階段應確保內容事實正確、引用法令無誤。', 
    tip: '使用標準範本可減少 40% 的格式錯誤率。',
    imgColor: 'bg-blue-50',
    imgPlaceholder: '📝'
  },
  { 
    step: 2, 
    title: '核稿與會辦', 
    desc: '送交相關單位會審，確保不與其他政策衝突，並由各級主管層層把關。', 
    tip: '會辦單位超過三個時，建議先召開協調會議。',
    imgColor: 'bg-amber-50',
    imgPlaceholder: '👥'
  },
  { 
    step: 3, 
    title: '判行', 
    desc: '由機關長官或其授權人員決定是否執行。這是公文正式產生法律效力的關鍵點。', 
    tip: '附件應與本文一併裝訂，方便長官閱覽。',
    imgColor: 'bg-emerald-50',
    imgPlaceholder: '⚖️'
  },
  { 
    step: 4, 
    title: '發文與歸檔', 
    desc: '文書組進行編號、蓋印並寄送。完成後將正本歸檔妥善保存。', 
    tip: '電子交換文件通常在 10 分鐘內送達。',
    imgColor: 'bg-indigo-50',
    imgPlaceholder: '📨'
  }
];

/**
 * 假資料：每日推薦公文用語
 * 原本寫在 Home.tsx 中，現在統一遷移至此
 */
export const mockDictionaryTerm = {
  word: '檢送',
  definition: '用於平行或下級機關。意同「送請」，表示送出文件並請對方查閱。',
  example: '檢送「...草案」乙份，請 鑒核。'
};

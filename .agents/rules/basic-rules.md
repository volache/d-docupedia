---
trigger: always_on
---

將本專案目前使用原生下拉式選單 <select> 的地方改用客製化的 <CustomSelect> 下拉式選單，避免專案各處樣式不一致或無法套用特定的設計規範。使用路徑為 src/components/ui/CustomSelect.tsx。

嚴禁使用原生樣式的 alert()、confirm()、prompt()。請統一使用 src/store/uiStore.ts 中提供的 showAlert、showConfirm、showPrompt 方法，並配合 src/components/ui/CustomModal.tsx 渲染客製化 UI。

import React from 'react';
import { Settings, X, AlertCircle } from 'lucide-react';
import { CustomSelect } from '../../ui/CustomSelect';
import { mockCategories } from '../../../data';
import { Article } from './types';

interface EditorSidebarProps {
  currentArticle: Article;
  updateArticleField: (updates: Partial<Article>) => void;
}

export const EditorSidebar: React.FC<EditorSidebarProps> = ({
  currentArticle,
  updateArticleField
}) => {
  const addTag = (tag: string) => {
    if (tag && !currentArticle.tags.includes(tag)) {
      updateArticleField({ tags: [...currentArticle.tags, tag] });
    }
  };

  const removeTag = (tagToRemove: string) => {
    updateArticleField({ tags: currentArticle.tags.filter((t: string) => t !== tagToRemove) });
  };

  return (
    <aside className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/40 flex flex-col gap-8 sticky top-40 transition-all duration-500">
      <div className="flex items-center gap-2 text-slate-400">
         <Settings size={16} />
         <h4 className="font-black text-slate-900 text-lg uppercase tracking-tight">發佈設定</h4>
      </div>
      <div className="h-px bg-slate-100 w-full" />
     
     <div className="space-y-3">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">網址代稱 (Slug)</label>
        <input 
          type="text" 
          value={currentArticle.slug}
          onChange={e => updateArticleField({ slug: e.target.value })}
          placeholder="url-friendly-slug"
          className="w-full bg-slate-50 p-3 rounded-xl text-xs font-mono outline-none border border-slate-100 focus:bg-white focus:border-brand-200 transition-all"
        />
     </div>

     <div className="space-y-3">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">文章佈局類型</label>
        <CustomSelect 
          value={currentArticle.article_type}
          onChange={val => {
             const type = val as any;
             let newContent = { ...currentArticle.content };
             if (type !== 'bespoke' && !newContent.blocks) newContent.blocks = [];
             if (type === 'bespoke' && !newContent.sections) newContent.sections = [];
             
             updateArticleField({ article_type: type, content: newContent });
          }}
          options={[
            { value: 'guide', label: '行政指南 (Guide)' },
            { value: 'workflow', label: '標準流程 (Workflow)' },
            { value: 'faq', label: '常見問題 (FAQ)' },
            { value: 'example', label: '範例對照 (Example)' },
            { value: 'system_tutorial', label: '系統教學 (Tutorial)' },
            { value: 'bespoke', label: '視覺特輯 (Bespoke)' }
          ]}
        />
     </div>

     <div className="space-y-3">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">文章分類</label>
        <CustomSelect 
          value={currentArticle.category}
          onChange={val => updateArticleField({ category: val })}
          options={mockCategories.map(c => ({ value: c.slug, label: c.name }))}
        />
     </div>

     <div className="space-y-3">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">標籤關鍵字</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {currentArticle.tags.map((tag: string) => (
            <span key={tag} className="bg-slate-100 text-slate-600 px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1">
              {tag}
              <button onClick={() => removeTag(tag)} className="hover:text-red-500"><X size={10} /></button>
            </span>
          ))}
        </div>
        <input 
          type="text" 
          placeholder="輸入標籤後按 Enter..."
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addTag((e.target as HTMLInputElement).value);
              (e.target as HTMLInputElement).value = '';
            }
          }}
          className="w-full bg-slate-50 p-3 rounded-xl text-xs outline-none border border-slate-100 focus:bg-white focus:border-brand-200 transition-all"
        />
     </div>

     <div className="flex gap-3 p-4 bg-brand-50/50 rounded-2xl border border-brand-100">
        <AlertCircle size={18} className="text-brand-500 shrink-0" />
        <p className="text-[10px] text-brand-700 leading-relaxed font-medium">切換佈局會保留已有內容，但預覽時僅會顯示對應類型的資料欄位。</p>
     </div>
    </aside>
  );
};

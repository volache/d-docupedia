import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ExternalLink, Edit2, Eye, Save, X } from 'lucide-react';

interface EditorHeaderProps {
  slug: string;
  isSaving: boolean;
  editTab: 'edit' | 'preview';
  setEditTab: (tab: 'edit' | 'preview') => void;
  handleBackToList: (e?: React.MouseEvent) => void;
  handleSave: () => void;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({
  slug,
  isSaving,
  editTab,
  setEditTab,
  handleBackToList,
  handleSave
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-16 z-40 bg-slate-50/80 backdrop-blur-md py-4 border-b border-transparent transition-all">
      <div className="flex items-center gap-4">
        <button onClick={handleBackToList} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-all bg-white/50 px-3 py-2 rounded-xl hover:bg-white">
          <ChevronLeft size={20} /> 返回列表
        </button>
        <div className="h-6 w-px bg-slate-200 hidden md:block" />
        <Link 
          to={`/article/${slug}`} 
          target="_blank" 
          className="flex items-center gap-2 text-brand-600 hover:text-brand-700 font-bold text-sm bg-white px-3 py-2 rounded-xl shadow-sm border border-brand-100 transition-all hover:-translate-y-0.5"
        >
          <ExternalLink size={16} /> 前台預覽
        </Link>
      </div>
      
      <div className="flex items-center bg-slate-100 p-1 rounded-xl shadow-inner shrink-0">
         <button 
           onClick={() => setEditTab('edit')}
           className={`px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${editTab === 'edit' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
         >
           <Edit2 size={16} /> 編輯模式
         </button>
         <button 
           onClick={() => setEditTab('preview')}
           className={`px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${editTab === 'preview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
         >
           <Eye size={16} /> 即時預覽
         </button>
      </div>

      <div className="flex gap-2">
         <button 
           disabled={isSaving}
           onClick={handleSave}
           className="bg-brand-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-brand-700 shadow-lg shadow-brand-600/20 disabled:opacity-50"
         >
           {isSaving ? <X className="animate-spin" size={18} /> : <Save size={18} />}
           {isSaving ? '儲存中...' : '儲存正式版'}
         </button>
      </div>
    </div>
  );
};

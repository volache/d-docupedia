import React from 'react';
import { motion } from 'motion/react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { mockCategories } from '../../../data';
import { Article } from './types';

interface ArticleListProps {
  articles: Article[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleCreateNew: () => void;
  handleEdit: (article: Article) => void;
  handleDelete: (id: string) => void;
}

export const ArticleList: React.FC<ArticleListProps> = ({
  articles,
  searchQuery,
  setSearchQuery,
  handleCreateNew,
  handleEdit,
  handleDelete
}) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="list" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">文章管理</h2>
          <p className="text-slate-500 text-sm">維護全站知識庫所有教學內容</p>
        </div>
        <button onClick={handleCreateNew} className="bg-brand-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-brand-700 shadow-lg shadow-brand-600/20">
          <Plus size={20} /> 新增指南
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
         <Search size={18} className="text-slate-400 ml-2" />
         <input 
           type="text" 
           placeholder="搜尋文章..." 
           value={searchQuery}
           onChange={e => setSearchQuery(e.target.value)}
           className="flex-1 bg-transparent border-none outline-none text-sm"
         />
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
         <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
               <tr>
                  <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">文章標題</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">知識分類</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">類型</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest text-right">操作</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {articles.map(article => (
                 <tr key={article.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                       <div className="font-bold text-slate-900">{article.title}</div>
                       <div className="text-[10px] text-slate-400 font-mono mt-0.5">{article.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                       <span className="bg-brand-50 text-brand-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                          {mockCategories.find(c => c.slug === article.category)?.name || article.category}
                       </span>
                    </td>
                    <td className="px-6 py-4">
                       <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest bg-slate-100 px-2 py-1 rounded">
                          {article.article_type}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex justify-end gap-2">
                          <button onClick={() => handleEdit(article)} className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all">
                             <Edit2 size={18} />
                          </button>
                          <button onClick={() => handleDelete(article.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                             <Trash2 size={18} />
                          </button>
                       </div>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>
    </motion.div>
  );
};

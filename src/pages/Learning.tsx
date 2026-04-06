import React from 'react';
import { useParams, Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { mockCategories } from '../data';
import { FileText, LayoutGrid, ArrowRight } from 'lucide-react';
import { useArticleStore } from '../store/articleStore';

export const LearningView = () => {
  const { articles } = useArticleStore();
  const { slug } = useParams();
  
  const currentCategory = mockCategories.find(c => c.slug === slug);
  const filteredArticles = slug 
    ? articles.filter(a => a.category === slug)
    : articles;

  return (
    <div className="space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-end justify-between gap-6">
        <div className="space-y-2">
           <h2 className="text-3xl font-black text-slate-900">
             {currentCategory ? `探索：${currentCategory.name}` : '學習中心'}
           </h2>
           <p className="text-slate-500 max-w-md">
             {currentCategory 
               ? `專為「${currentCategory.name}」分類整理的行政工作與公文撰寫指南。` 
               : '瀏覽全站所有收錄的文章，從基礎公文撰寫到系統操作流程一應俱全。'}
           </p>
        </div>
        
        {/* Category Pills/Filter */}
        <div className="flex flex-wrap gap-2">
           <NavLink 
             to="/learning" 
             end
             className={({ isActive }) => `
               px-5 py-2.5 rounded-full text-sm font-bold transition-all border
               ${isActive 
                 ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/10' 
                 : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200'}
             `}
           >
             全部
           </NavLink>
           {mockCategories.map(cat => (
             <NavLink 
               key={cat.id}
               to={`/learning/${cat.slug}`} 
               className={({ isActive }) => `
                 px-5 py-2.5 rounded-full text-sm font-bold transition-all border
                 ${isActive 
                   ? 'bg-brand-600 text-white border-brand-600 shadow-lg shadow-brand-600/10' 
                   : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200'}
               `}
             >
               {cat.name}
             </NavLink>
           ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        <AnimatePresence mode="popLayout">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article, i) => (
              <motion.div
                layout
                key={article.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link 
                  to={`/article/${article.id}`}
                  className="group block bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-brand-900/5 transition-all h-full flex flex-col"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                      <FileText size={24} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 group-hover:text-brand-200 transition-colors">
                      {article.article_type}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-brand-700 transition-colors line-clamp-2 leading-snug flex-1">
                    {article.title}
                  </h3>
                  
                  <p className="text-sm text-slate-500 line-clamp-3 mb-8 leading-relaxed">
                    {article.summary}
                  </p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto">
                    <div className="flex gap-1.5 flex-wrap">
                       {article.tags.slice(0, 2).map(tag => (
                         <span key={tag} className="text-[9px] font-bold bg-slate-100 text-slate-400 px-2.5 py-1 rounded-full uppercase tracking-wider">
                           #{tag}
                         </span>
                       ))}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-brand-600 group-hover:text-white transition-all">
                       <ArrowRight size={18} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="col-span-full py-20 text-center space-y-4"
            >
               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                 <LayoutGrid size={40} />
               </div>
               <div>
                  <h4 className="text-lg font-bold text-slate-800">目前尚無相關文章</h4>
                  <p className="text-slate-500">此分類的教學內容正在撰寫中，敬請期待。</p>
               </div>
               <Link to="/learning" className="text-brand-600 font-bold block hover:underline pt-4">回全部文章</Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

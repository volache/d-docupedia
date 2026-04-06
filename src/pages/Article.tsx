import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { mockCategories, Article } from '../data';
import { BespokeLayout } from '../layouts/BespokeLayout';
import { UnifiedLayout } from '../layouts/UnifiedLayout';
import { ChevronLeft, Calendar, Tag, Share2, Printer } from 'lucide-react';
import { db, isFirebaseEnabled } from '../lib/firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { useArticleStore } from '../store/articleStore';
import { useUiStore } from '../store/uiStore';
import { useTitle } from '../hooks/useTitle';

export const ArticleView = () => {
  const { articles } = useArticleStore();
  const { showAlert } = useUiStore();
  const { slug } = useParams();
  const navigate = useNavigate();
  const article = articles.find(a => a.slug === slug);
  useTitle(article?.title || '載入中...');

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (isFirebaseEnabled && db && article?.id) {
      const trackView = async () => {
        try {
          await updateDoc(doc(db, 'articles', article.id), {
            views: increment(1)
          });
        } catch (e) { /* silent */ }
      };
      trackView();
    }
  }, [article?.id]);

  const handlePrint = () => window.print();
  const handleShare = async () => {
    navigator.clipboard.writeText(window.location.href);
    await showAlert('已複製文章連結至剪貼簿！');
  };

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <h2 className="text-2xl font-bold mb-4">找不到該文章</h2>
        <button onClick={() => navigate('/')} className="text-brand-600 hover:underline">返回首頁</button>
      </div>
    );
  }

  const category = mockCategories.find(c => c.slug === article.category);

  const renderLayout = () => {
    if (article.article_type === 'bespoke') {
      return <BespokeLayout content={article.content} />;
    }
    return <UnifiedLayout content={article.content} />;
  };

  if (article.article_type === 'bespoke') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="article-bespoke">
        <Link to="/" className="fixed top-6 left-6 z-[100] bg-black/20 backdrop-blur-md p-3 rounded-full hover:bg-black/40 transition-all text-white border border-white/10 flex items-center gap-2 pr-6 shadow-2xl">
           <ChevronLeft size={20} />
           <span className="text-sm font-bold uppercase tracking-widest">返回首頁</span>
        </Link>
        {renderLayout()}
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-20"
    >
      <header className="max-w-4xl mx-auto mb-12">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-brand-600 transition-colors mb-8 group">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          返回列表
        </Link>
        
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="bg-brand-100 text-brand-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {category?.name || article.category}
          </span>
          <div className="flex items-center gap-1.5 text-slate-400 text-sm">
            <Calendar size={14} />
            最後更新於 {article.updated_at}
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
          {article.title}
        </h1>
        
        <p className="text-xl text-slate-500 leading-relaxed mb-8 max-w-3xl">
          {article.summary}
        </p>

        <div className="flex items-center justify-between pt-8 border-t border-slate-100">
          <div className="flex gap-2">
            {article.tags.map(tag => (
              <span key={tag} className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-xl text-sm font-medium">
                #{tag}
              </span>
            ))}
          </div>
          <div className="flex gap-4 print:hidden">
            <button 
              onClick={handleShare}
              className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
            >
              <Share2 size={20} />
            </button>
            <button 
              onClick={handlePrint}
              className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
            >
              <Printer size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        {renderLayout()}
      </main>
    </motion.div>
  );
};

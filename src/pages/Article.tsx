import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { mockCategories, Article } from '../data';
import { BespokeLayout } from '../layouts/BespokeLayout';
import { UnifiedLayout } from '../layouts/UnifiedLayout';
import { ChevronLeft, Calendar, Tag, Share2, Printer, Lock, Key, AlertCircle } from 'lucide-react';
import { db, isFirebaseEnabled } from '../lib/firebase';
import { doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { useArticleStore } from '../store/articleStore';
import { useUiStore } from '../store/uiStore';
import { useTitle } from '../hooks/useTitle';

const AccessCodePrompt = ({ onUnlock, error }: { onUnlock: (code: string) => void, error: boolean }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUnlock(input);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md mx-auto py-20 px-8 text-center bg-white rounded-[3rem] border border-slate-200 shadow-2xl shadow-slate-200/50 my-10"
    >
      <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-amber-200/50">
        <Lock size={40} />
      </div>
      <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">內部機敏資料保護</h2>
      <p className="text-slate-500 mb-8 leading-relaxed font-medium">此內容僅供內部同仁查閱。請輸入單位核發之「全域通行碼」以解鎖閱讀權限。</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative group">
          <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500" size={18} />
          <input 
            type="password" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="請輸入通行碼..."
            className={`w-full pl-12 pr-6 py-4 bg-slate-50 border ${error ? 'border-red-300' : 'border-transparent'} focus:bg-white focus:border-brand-200 focus:ring-4 focus:ring-brand-50 rounded-2xl outline-none transition-all text-center font-bold tracking-widest`}
          />
        </div>
        {error && (
          <div className="flex items-center justify-center gap-2 text-red-500 text-xs font-bold animate-pulse">
            <AlertCircle size={14} />
            通行碼錯誤，請重新輸入
          </div>
        )}
        <button 
          type="submit"
          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98]"
        >
          驗證並解鎖
        </button>
      </form>
    </motion.div>
  );
};

export const ArticleView = () => {
  const { articles } = useArticleStore();
  const { showAlert } = useUiStore();
  const { slug } = useParams();
  const navigate = useNavigate();
  const article = articles.find(a => a.slug === slug);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlockError, setUnlockError] = useState(false);
  const [isCheckingCode, setIsCheckingCode] = useState(true);

  useTitle(article?.title || '載入中...');

  useEffect(() => {
    // 檢查 Session 是否已解鎖
    const sessionUnlocked = sessionStorage.getItem('kb_internal_unlocked') === 'true';
    if (sessionUnlocked) {
      setIsUnlocked(true);
    }
    setIsCheckingCode(false);
  }, []);

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

  const handleUnlock = async (inputCode: string) => {
    setUnlockError(false);
    if (!db) return;

    try {
      const settingsDoc = await getDoc(doc(db, 'settings', 'system'));
      if (settingsDoc.exists()) {
        const correctCode = settingsDoc.data().global_access_code;
        if (inputCode === correctCode) {
          setIsUnlocked(true);
          sessionStorage.setItem('kb_internal_unlocked', 'true');
        } else {
          setUnlockError(true);
        }
      }
    } catch (error) {
      console.error("Unlock error:", error);
    }
  };

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

  const showContent = !article.is_internal || isUnlocked;

  if (article.article_type === 'bespoke') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="article-bespoke">
        <Link to="/" className="fixed top-6 left-6 z-[100] bg-black/20 backdrop-blur-md p-3 rounded-full hover:bg-black/40 transition-all text-white border border-white/10 flex items-center gap-2 pr-6 shadow-2xl">
           <ChevronLeft size={20} />
           <span className="text-sm font-bold uppercase tracking-widest">返回首頁</span>
        </Link>
        {!isCheckingCode && !showContent ? (
          <div className="min-h-screen flex items-center justify-center bg-slate-950 px-6">
            <AccessCodePrompt onUnlock={handleUnlock} error={unlockError} />
          </div>
        ) : (
          renderLayout()
        )}
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
          {article.is_internal && (
            <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
              <Lock size={10} /> 內部機敏
            </span>
          )}
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
        {!isCheckingCode && !showContent ? (
          <AccessCodePrompt onUnlock={handleUnlock} error={unlockError} />
        ) : (
          renderLayout()
        )}
      </main>
    </motion.div>
  );
};

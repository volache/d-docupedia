import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lightbulb, ArrowRight, BookOpen, Clock, TrendingUp, HelpCircle, ChevronRight, CheckCircle, FileText, PenTool, GitMerge, Archive, MonitorPlay, Zap, Info, ExternalLink, Star } from 'lucide-react';
import { mockCategories, mockDictionaryTerm } from '../data';
import { db, isFirebaseEnabled } from '../lib/firebase';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { useArticleStore } from '../store/articleStore';
import { useUiStore } from '../store/uiStore';

const iconMap: Record<string, any> = {
  PenTool,
  GitMerge,
  Archive,
  MonitorPlay
};

export const HomeView = () => {
  const { articles } = useArticleStore();
  const { showAlert } = useUiStore();
  const [randomTerm, setRandomTerm] = useState(mockDictionaryTerm);

  // 1. 每日小知識 (Hero Card) - 優先抓取標籤含有「每日推薦」的文章
  const heroArticle = useMemo(() => {
    return articles.find(a => a.tags.includes('每日推薦')) || articles[0];
  }, [articles]);

  // 2. 精選主題 (Featured Topics) - 基於標籤或特定屬性篩選
  const featuredTopics = useMemo(() => {
    return articles.filter(a => a.tags.includes('精選') || a.tags.includes('初學者')).slice(0, 3);
  }, [articles]);

  // 3. 推薦閱讀 (Recommended Reading) - 根據更新時間或類型排序
  const recommendedGuides = useMemo(() => {
    return [...articles].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()).slice(0, 5);
  }, [articles]);

  // 4. 內容覆蓋率計算 (基於分類填充度)
  const coverageRate = useMemo(() => {
    const totalCategories = mockCategories.length;
    const filledCategories = mockCategories.filter(cat => articles.some(a => a.category === cat.slug)).length;
    return Math.round((filledCategories / totalCategories) * 100);
  }, [articles]);

  useEffect(() => {
    const fetchRandomTerm = async () => {
      if (!isFirebaseEnabled || !db) return;
      try {
        const q = query(collection(db, 'dictionary'), limit(10));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const terms = snapshot.docs.map(doc => doc.data());
          const random = terms[Math.floor(Math.random() * terms.length)];
          setRandomTerm(random as any);
        }
      } catch (error) {
        console.error("Dictionary fetch error:", error);
      }
    };
    fetchRandomTerm();
  }, []);

  const hour = new Date().getHours();
  let greeting = '早安';
  if (hour >= 12 && hour < 18) greeting = '午安';
  if (hour >= 18) greeting = '晚安';

  const subGreetings = [
    '精準用詞，掌握規範，讓公文處理事半功倍。',
    '公文不是枷鎖，而是行政溝通的精煉藝術。',
    '今天想了解哪方面的公文知識？我們已為您準備好最新指南。',
    '由淺入深掌握公文心法，行政效能從此與眾不同。',
    '公文知識庫是您在行政汪洋中的指南針，點擊開始探索。'
  ];
  const subGreeting = useMemo(() => subGreetings[Math.floor(Math.random() * subGreetings.length)], []);

  return (
    <div className="space-y-12 pb-12">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row gap-8 items-start"
      >
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{greeting}！歡迎來到公文知識庫</h1>
          <p className="text-slate-500">{subGreeting}</p>
        </div>
      </motion.div>

      {/* Hero & Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Featured Card */}
        <div className="lg:col-span-2">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-[#E8C5A8] to-[#D9A077] text-brand-900 p-8 sm:p-10 rounded-[2.5rem] relative overflow-hidden h-full flex flex-col justify-center shadow-2xl shadow-brand-900/10"
          >
            {/* Animated Background SVG */}
            <motion.div 
              className="absolute right-[-10%] top-[-10%] w-2/3 h-full opacity-10 pointer-events-none"
              animate={{ 
                x: [0, 60],
                y: [0, -40],
                rotate: [0, 8],
                scale: [1, 1.05]
              }}
              transition={{ 
                duration: 40, 
                repeat: Infinity, 
                repeatType: "mirror",
                ease: "easeInOut" 
              }}
            >
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-brand-900">
                <motion.path 
                  animate={{
                    d: [
                      "M45.7,-76.1C58.9,-69.3,69.2,-55.4,77.2,-40.5C85.2,-25.6,90.9,-9.8,88.7,5.2C86.5,20.2,76.4,34.4,65.3,46.5C54.2,58.6,42.1,68.6,28.1,74.3C14.1,80,-1.8,81.4,-16.8,78.2C-31.8,75,-45.9,67.2,-57.4,56.1C-68.9,45,-77.8,30.6,-82.1,14.8C-86.4,-1,-86.1,-18.2,-79.5,-33.1C-72.9,-48,-60,-60.6,-45.4,-66.8C-30.8,-73,-15.4,-72.8,0.8,-74C17,-75.2,34,-77.8,45.7,-76.1Z",
                      "M35.6,-61.7C48.2,-54.6,58.6,-43.8,66.4,-31.2C74.3,-18.6,79.5,-4.2,77.8,9.2C76.1,22.7,67.5,35.2,56.8,45.8C46.1,56.4,33.3,65,19.2,70C5,75.1,-10.5,76.6,-25,72.6C-39.5,68.7,-53,59.3,-62.4,47C-71.8,34.7,-77.2,19.6,-78,4C-78.7,-11.6,-74.8,-27.7,-65.8,-40.6C-56.7,-53.4,-42.4,-63,-28.4,-68.8C-14.4,-74.5,-0.7,-76.5,14.6,-74.6C23,-73.6,30.3,-68.8,35.6,-61.7Z"
                    ]
                  }}
                  transition={{
                    duration: 35,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut"
                  }}
                  transform="translate(100 100) scale(1.15)" 
                />
              </svg>
            </motion.div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/30 backdrop-blur-md px-4 py-2 rounded-full text-brand-900 text-sm font-bold mb-6">
                <Lightbulb size={18} className="text-white" />
                每日公文小知識
              </div>
              <h2 className="text-3xl sm:text-5xl font-black mb-6 leading-tight">
                {heroArticle?.promo_title || heroArticle?.title || '主旨撰寫要有力，動詞＋內容最清晰。'}
              </h2>
              <p className="text-brand-900/80 text-xl mb-10 max-w-md leading-relaxed">
                {heroArticle?.promo_description || heroArticle?.summary || '良好的主旨應讓人一眼看出目的。'}
              </p>
              <Link 
                to={heroArticle ? `/article/${heroArticle.id}` : '/learning'}
                className="bg-brand-900 text-white px-8 py-4 rounded-full font-bold hover:bg-brand-800 transition-all shadow-lg hover:shadow-brand-900/20 inline-flex items-center gap-2"
              >
                開始今日學習
                <ArrowRight size={20} />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Knowledge Base Stats */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 h-full flex flex-col shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-xl font-bold text-slate-800">知識庫概覽</h3>
              <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center">
                <Info size={20} />
              </div>
            </div>
            
            <div className="space-y-6 flex-1">
              <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-brand-600">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">收錄文章</p>
                    <p className="font-bold text-slate-800 text-lg">{articles.length} 篇指南</p>
                  </div>
                </div>
              </div>
              
              <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-600">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">資料來源</p>
                    <p className="font-bold text-slate-800 text-lg">雲端即時同步</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100">
              <div className="flex justify-between text-sm mb-3">
                <div className="group relative cursor-help">
                  <span className="font-bold text-slate-500 border-b border-dotted border-slate-300">內容覆蓋率</span>
                  <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-slate-900 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    基於現有四大分類（撰寫、流程、檔案、系統）的文章分布比例。
                  </div>
                </div>
                <span className="font-black text-brand-600">{coverageRate}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 p-1">
                <div className="bg-brand-600 h-1 rounded-full shadow-[0_0_8px_rgba(234,88,12,0.4)] transition-all duration-1000" style={{ width: `${coverageRate}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Topics Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Star size={24} className="text-amber-400 fill-amber-400" />
            精選主題
          </h3>
          <Link to="/learning" className="text-slate-400 text-sm font-medium hover:text-brand-600 flex items-center gap-1">
            查看更多 <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredTopics.length > 0 ? featuredTopics.map((topic, i) => (
            <motion.div key={topic.id} whileHover={{ y: -5 }}>
              <Link 
                to={`/article/${topic.id}`}
                className="block bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-brand-900/5 transition-all group"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600">
                    <Zap size={24} />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded">FEATURED</span>
                </div>
                <h4 className="font-black text-slate-900 text-xl mb-3 group-hover:text-brand-600 transition-colors">{topic.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">{topic.summary}</p>
                <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                   <div className="flex gap-2">
                      {topic.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[10px] font-bold text-slate-400">#{tag}</span>
                      ))}
                   </div>
                   <div className="text-brand-600 group-hover:translate-x-1 transition-transform">
                      <ArrowRight size={18} />
                   </div>
                </div>
              </Link>
            </motion.div>
          )) : (
            <div className="col-span-3 py-10 text-center text-slate-400 italic bg-slate-50 rounded-[2rem]">
              暫無精選主題，請至後台為文章添加「精選」標籤。
            </div>
          )}
        </div>
      </section>

      {/* Category Grid Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-slate-900">知識分類</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {mockCategories.map((cat, i) => {
            const Icon = iconMap[cat.icon] || FileText;
            return (
              <motion.div 
                key={cat.id}
                whileHover={{ y: -5 }}
              >
                <Link 
                  to={`/learning/${cat.slug}`}
                  className="block bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-brand-900/5 transition-all text-center cursor-pointer group"
                >
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mx-auto mb-4 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                    <Icon size={28} />
                  </div>
                  <h4 className="font-bold text-slate-800">{cat.name}</h4>
                  <p className="text-xs text-slate-400 mt-1">詳閱規範</p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Recommended Guides & dictionary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-3">
             <div className="w-1.5 h-6 bg-brand-500 rounded-full" />
             推薦閱讀指南
          </h3>
          <div className="space-y-4">
            {recommendedGuides.map((article) => (
              <motion.div key={article.id} whileHover={{ x: 5 }}>
                <Link 
                  to={`/article/${article.id}`} 
                  className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group"
                >
                  <div className="w-12 h-12 bg-orange-50 text-brand-600 rounded-xl flex items-center justify-center shrink-0">
                    <FileText size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-slate-800 truncate group-hover:text-brand-700">{article.title}</h5>
                    <p className="text-xs text-slate-500 mt-0.5 capitalize">{article.article_type.replace('_', ' ')}</p>
                  </div>
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-brand-400" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
          <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-3">
             <div className="w-1.5 h-6 bg-slate-800 rounded-full" />
             公文用語小辭典
          </h3>
          <div className="flex-1 bg-slate-50 rounded-3xl p-8 flex flex-col justify-center text-center relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Zap size={100} />
             </div>
             <div className="relative z-10 p-4">
                <span className="bg-brand-100 text-brand-800 px-3 py-1 rounded-full text-xs font-bold mb-4 inline-block tracking-widest uppercase">今日推薦用語</span>
                <h4 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">「{randomTerm.word}」</h4>
                <p className="text-slate-500 leading-relaxed max-w-[200px] mx-auto text-sm">
                  {randomTerm.definition}
                </p>
                {randomTerm.example && (
                  <div className="mt-4 p-3 bg-white/50 rounded-xl text-[10px] text-slate-400 font-medium italic">
                    例：{randomTerm.example}
                  </div>
                )}
                <Link to="/learning" className="mt-6 text-brand-600 font-bold text-sm flex items-center gap-1 mx-auto hover:underline">
                  查看更多字典內容 <ArrowRight size={16} />
                </Link>
             </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
              <a href="http://192.168.116.16/IFDPortal_HUN/login.aspx" target="_blank" rel="noopener noreferrer" className="bg-slate-50 p-4 rounded-2xl text-slate-600 text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors">
                <ExternalLink size={14} /> 系統登入
              </a>
              <button 
                onClick={() => showAlert('元件下載功能即將開放！')} 
                className="bg-slate-50 p-4 rounded-2xl text-slate-600 text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors"
              >
                <ExternalLink size={14} /> 元件下載
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

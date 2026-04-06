import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Users, Eye, TrendingUp, ArrowUpRight, ArrowDownRight, Calendar, CheckCircle, Clock, ChevronRight } from 'lucide-react';
import { mockArticles, Article, mockCategories } from '../../data';
import { db, isFirebaseEnabled } from '../../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useArticleStore } from '../../store/articleStore';
import { CustomSelect } from '../../components/ui/CustomSelect';
import { Link } from 'react-router-dom';
import { useUiStore } from '../../store/uiStore';

export const AdminDashboard = () => {
  const { articles } = useArticleStore();
  const { showConfirm, showAlert } = useUiStore();
  const [chartTimeRange, setChartTimeRange] = useState('week');
  const handleSeedData = async () => {
    if (!db || !(await showConfirm('此操作將會把現有的模擬資料上傳至 Firestore。確定繼續？'))) return;
    
    try {
      for (const article of mockArticles) {
        await setDoc(doc(db, 'articles', article.id), { ...article, views: 0 });
      }
      await showAlert('資料初始化完成！');
      window.location.reload();
    } catch (error) {
      console.error("Seed Error:", error);
      await showAlert('初始化失敗');
    }
  };

  // Calculation for category distribution
  const categoryStats = mockCategories.map(cat => ({
    name: cat.name,
    count: articles.filter(a => a.category === cat.slug).length,
    percentage: Math.round((articles.filter(a => a.category === cat.slug).length / articles.length) * 100) || 0
  }));

  const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);
  const topArticles = [...articles].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 4);

  const stats = [
    { label: '文章總數', value: articles.length.toString(), icon: BookOpen, color: 'bg-blue-500', trend: '+2', trendUp: true },
    { label: '累積閱讀', value: totalViews.toLocaleString(), icon: Eye, color: 'bg-emerald-500', trend: '+15%', trendUp: true },
    { label: '學員滿意度', value: '4.9', icon: CheckCircle, color: 'bg-orange-500', trend: '+0.1', trendUp: true },
    { label: '昨日訪問', value: '84', icon: Users, color: 'bg-purple-500', trend: '-5%', trendUp: false },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">控制台概覽</h2>
          <p className="text-slate-500">歡迎回來，這是目前的知識平台營運數據</p>
        </div>
        {isFirebaseEnabled && (
          <button 
            onClick={handleSeedData}
            className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shadow-sm"
          >
            初始化雲端資料庫
          </button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group"
          >
            <div className="flex items-start justify-between relative z-10">
              <div className={`p-3 rounded-2xl ${stat.color} text-white shadow-lg shadow-current/10`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                {stat.trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.trend}
              </div>
            </div>
            <div className="mt-6 relative z-10">
              <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
              <h4 className="text-3xl font-black text-slate-900 mt-1">{stat.value}</h4>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Distribution - Custom SVG Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-slate-900">學員活躍度趨勢</h3>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-bold">Past 7 Days</p>
              </div>
              <CustomSelect 
                value={chartTimeRange}
                onChange={setChartTimeRange}
                options={[
                  { value: 'week', label: '最近一週' },
                  { value: 'month', label: '最近一個月' }
                ]}
                size="sm"
              />
           </div>
           
           <div className="h-64 relative mt-10">
              {/* Simple CSS/SVG chart */}
              <div className="absolute inset-0 flex items-end justify-between px-4">
                 {[40, 65, 45, 90, 75, 40, 60].map((h, i) => (
                   <div key={i} className="w-12 flex flex-col items-center gap-3">
                      <div className="w-full relative group">
                         <motion.div 
                           initial={{ height: 0 }}
                           animate={{ height: `${h}%` }}
                           transition={{ duration: 1, delay: i * 0.1 }}
                           className="w-1.5 mx-auto bg-slate-100 rounded-full bg-gradient-to-t from-brand-50 to-brand-500/20 group-hover:from-brand-100 group-hover:to-brand-600/40 transition-all cursor-pointer overflow-hidden"
                         >
                            <div className="absolute bottom-0 left-0 w-full bg-brand-600 rounded-full" style={{ height: '2px' }} />
                         </motion.div>
                         {/* Tooltip */}
                         <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
                            {h} 訪客
                         </div>
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                         {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]}
                      </span>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Category Breakdown */}
        <div className="lg:col-span-1 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col">
           <h3 className="text-xl font-bold text-slate-900 mb-8">知識類別分佈</h3>
           <div className="space-y-6 flex-1">
              {categoryStats.map((cat, i) => (
                <div key={cat.name} className="space-y-2">
                   <div className="flex justify-between items-end">
                      <span className="text-sm font-black text-slate-700">{cat.name}</span>
                      <span className="text-xs font-bold text-slate-400">{cat.percentage}%</span>
                   </div>
                   <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${cat.percentage}%` }}
                        transition={{ duration: 1.5, delay: i * 0.1 }}
                        className={`h-full ${i === 0 ? 'bg-blue-500' : i === 1 ? 'bg-orange-500' : 'bg-brand-500'}`}
                      />
                   </div>
                </div>
              ))}
           </div>
           
           <div className="mt-10 p-5 bg-slate-900 rounded-3xl text-white relative overflow-hidden group cursor-pointer">
              <div className="relative z-10 flex items-center justify-between">
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">推薦行動</p>
                    <p className="font-bold text-sm mt-1">擴展檔案管理分類</p>
                 </div>
                 <ArrowUpRight size={20} className="text-brand-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
           </div>
        </div>
      </div>

      {/* Top Articles Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
         <div className="p-8 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">熱門閱讀指南</h3>
            <Link to="/admin/articles" className="text-slate-400 hover:text-brand-600 text-sm font-bold flex items-center gap-1">
               完整報告 <ChevronRight size={18} />
            </Link>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-slate-50/50">
                     <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">文章標題</th>
                     <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">分類</th>
                     <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">閱讀次數</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {topArticles.map((article) => (
                    <tr key={article.id} className="hover:bg-slate-50/50 transition-all group">
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-slate-50 text-brand-600 rounded-xl flex items-center justify-center shrink-0">
                                <FileText size={20} />
                             </div>
                             <span className="font-bold text-slate-800 group-hover:text-brand-700 transition-colors">{article.title}</span>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                             {mockCategories.find(c => c.slug === article.category)?.name || article.category}
                          </span>
                       </td>
                       <td className="px-8 py-6 text-right font-black text-slate-900">
                          {article.views || 0}
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

const FileText = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M14.5 2H6a2 2 0 0-2h12a2 0 0 2 2z" />
    <polyline points="14 2 8 20" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

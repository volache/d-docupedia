import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { Routes, Route, Link, NavLink, useLocation, Navigate } from 'react-router-dom';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Home, BookOpen, HelpCircle, Search, Settings, Menu, X, FileText, User, Users, Lock, LogIn } from 'lucide-react';
import { Article } from './data';
import { db, isFirebaseEnabled } from './lib/firebase';
import { useArticleStore } from './store/articleStore';
import { useUserStore, User as UserType } from './store/userStore';

// Lazy loading components
const HomeView = lazy(() => import('./pages/Home').then(m => ({ default: m.HomeView })));
const ArticleView = lazy(() => import('./pages/Article').then(m => ({ default: m.ArticleView })));
const LearningView = lazy(() => import('./pages/Learning').then(m => ({ default: m.LearningView })));
const FaqView = lazy(() => import('./pages/Faq').then(m => ({ default: m.FaqView })));
const AdminLayout = lazy(() => import('./layouts/AdminLayout').then(m => ({ default: m.AdminLayout })));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const ArticleManager = lazy(() => import('./pages/admin/ArticleManager').then(m => ({ default: m.ArticleManager })));
const DictionaryManager = lazy(() => import('./pages/admin/DictionaryManager').then(m => ({ default: m.DictionaryManager })));
const FaqManager = lazy(() => import('./pages/admin/FaqManager').then(m => ({ default: m.FaqManager })));
const UserManager = lazy(() => import('./pages/admin/UserManager').then(m => ({ default: m.UserManager })));
import { CustomModal } from './components/ui/CustomModal';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-40 min-h-[60vh]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin"></div>
      <p className="text-slate-400 font-bold text-sm tracking-widest animate-pulse">正在載入模組...</p>
    </div>
  </div>
);

const UserManagerPlaceholder = () => (
  <div className="p-12 text-center bg-white rounded-[3rem] border border-slate-200 shadow-sm">
    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
      <Users size={40} />
    </div>
    <h2 className="text-2xl font-bold text-slate-900 mb-2">用戶管理系統</h2>
    <p className="text-slate-500 mb-8 max-w-md mx-auto">此模組正在開發中。未來將提供權限分配、學員進度追蹤與組織架構管理功能。</p>
    <div className="inline-flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl text-slate-600 font-bold text-xs uppercase tracking-widest">
      Coming Soon
    </div>
  </div>
);

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoging, setIsLoging] = useState(false);
  const { login } = useUserStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoging(true);
    
    const success = await login(email, password);
    if (success) {
      setIsLoging(false);
    } else {
      setError('帳號或密碼錯誤 (admin@example.com / 123456)');
      setIsLoging(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 p-10 border border-slate-100">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-brand-600/20">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-900">系統管理登入</h2>
          <p className="text-slate-400 text-sm mt-2">開發者模式：請輸入預設帳密</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">電子郵件</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 border border-transparent focus:bg-white focus:border-brand-200 focus:ring-4 focus:ring-brand-50 rounded-2xl outline-none transition-all"
              placeholder="admin@example.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">密碼</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 border border-transparent focus:bg-white focus:border-brand-200 focus:ring-4 focus:ring-brand-50 rounded-2xl outline-none transition-all"
              placeholder="123456"
            />
          </div>
          
          {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

          <button 
            type="submit" 
            disabled={isLoging}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50"
          >
            {isLoging ? '登入中...' : '進入後台'}
            <LogIn size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { articles, loading, setArticles, setLoading } = useArticleStore();
  const { user, isAuthenticated, isLoading, logout, initialize } = useUserStore();
  
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  // 初始化 Auth 狀態
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Firestore 資料同步 (不依賴 Auth)
  useEffect(() => {
    if (!isFirebaseEnabled || !db) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(collection(db, 'articles'), orderBy('updated_at', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const firestoreArticles = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        })) as Article[];
        setArticles(firestoreArticles);
      }
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setArticles, setLoading]);

  const filteredArticles = articles.filter(a => 
    a.title.includes(searchQuery) || a.summary.includes(searchQuery)
  );

  const featuredArticles = useMemo(() => {
    return articles.filter(a => a.tags.includes('精選') || a.tags.includes('初學者')).slice(0, 3);
  }, [articles]);

  const navigation = [
    { id: 'home', name: '首頁', icon: Home, path: '/' },
    { id: 'learning', name: '學習中心', icon: BookOpen, path: '/learning' },
    { id: 'faq', name: '常見問題', icon: HelpCircle, path: '/faq' },
  ];

  const isBespokeArticle = useMemo(() => {
    if (location.pathname.startsWith('/article/')) {
      const slug = location.pathname.split('/')[2];
      const article = articles.find(a => a.slug === slug);
      return article?.article_type === 'bespoke';
    }
    return false;
  }, [location.pathname, articles]);

  const handleLogout = () => {
    logout();
  };

  if (isLoading) return <LoadingSpinner />;

  if (isAdminPath) {
    if (!isAuthenticated) return <AdminLogin />;

    return (
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/admin" element={<AdminLayout onLogout={handleLogout} />}>
            <Route index element={<AdminDashboard />} />
            <Route path="articles" element={<ArticleManager />} />
            <Route path="dictionary" element={<DictionaryManager />} />
            <Route path="faqs" element={<FaqManager />} />
            <Route path="analytics" element={<div className="p-20 text-center text-slate-400">數據分析模組開發中</div>} />
            <Route path="users" element={<UserManager />} />
          </Route>
        </Routes>
        <CustomModal />
      </Suspense>
    );
  }

  if (isBespokeArticle) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/article/:slug" element={<ArticleView />} />
          </Routes>
        </Suspense>
        <CustomModal />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-base flex">
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-bg-sidebar border-r border-slate-200/50 flex flex-col transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-sm">
            <BookOpen size={24} />
          </div>
          <div>
            <h1 className="font-bold text-brand-900 text-lg leading-tight">公文知識庫</h1>
            <p className="text-xs text-slate-500">數位行政導師</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => `
                  w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all
                  ${isActive 
                    ? 'bg-brand-100/50 text-brand-800 shadow-sm border border-brand-200/50' 
                    : 'text-slate-600 hover:bg-white/50 hover:text-slate-900'}
                `}
              >
                <Icon size={20} className={location.pathname === item.path ? 'text-brand-600' : 'text-slate-400'} />
                {item.name}
              </NavLink>
            );
          })}

          <div className="pt-6 pb-2 px-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">精選主題</span>
          </div>

          {featuredArticles.length > 0 ? featuredArticles.map(article => (
            <Link 
              key={article.id} 
              to={`/article/${article.slug}`}
              className="flex items-center gap-3 px-4 py-2 text-sm text-slate-500 hover:text-brand-600 transition-colors"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              <span className="truncate">{article.title}</span>
            </Link>
          )) : (
            <div className="px-4 py-2 text-xs text-slate-400 italic">暫無精選</div>
          )}
        </nav>

        <div className="px-4 pb-6 pt-4 border-t border-slate-200/50 space-y-1">
          <Link to="/admin" className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-brand-800 hover:bg-white/50 transition-colors">
            <Settings size={18} />
            系統管理
          </Link>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-bg-base/80 backdrop-blur-md border-b border-slate-200/50 px-4 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <button 
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            
            <div className="hidden sm:flex relative max-w-md w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500" size={18} />
              <input 
                type="text" 
                placeholder="搜尋關鍵字..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-transparent focus:bg-white focus:border-brand-200 focus:ring-4 focus:ring-brand-50 rounded-2xl text-sm transition-all outline-none"
              />
              
              {searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                  <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">搜尋結果 ({filteredArticles.length})</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {filteredArticles.length > 0 ? (
                      filteredArticles.map(article => (
                        <Link 
                          key={article.id}
                          to={`/article/${article.slug}`}
                          onClick={() => setSearchQuery('')}
                          className="flex items-start gap-3 p-4 hover:bg-brand-50 transition-colors border-b border-slate-50 last:border-0 group"
                        >
                          <div className="w-8 h-8 bg-brand-100 text-brand-600 rounded-lg flex items-center justify-center shrink-0">
                            <FileText size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800 group-hover:text-brand-700">{article.title}</p>
                            <p className="text-xs text-slate-500 line-clamp-1">{article.summary}</p>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="p-8 text-center text-slate-400 text-sm">找不到相符的文章</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="hidden md:block text-right mr-2">
               <p className="text-sm font-bold text-slate-900">{user?.name || '學員模式'}</p>
               <p className="text-[10px] text-slate-500 uppercase tracking-widest">{user?.role === 'admin' ? 'Admin' : 'Guest'} Mode</p>
             </div>
            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center overflow-hidden">
              {user?.avatar ? <img src={user.avatar} alt="avatar" /> : <User size={20} />}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-x-hidden p-4 sm:p-8">
          {loading ? (
             <div className="flex items-center justify-center py-40">
               <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
             </div>
          ) : (
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<HomeView />} />
                <Route path="/article/:slug" element={<ArticleView />} />
                <Route path="/learning" element={<LearningView />} />
                <Route path="/learning/:slug" element={<LearningView />} />
                <Route path="/faq" element={<FaqView />} />
              </Routes>
            </Suspense>
          )}
        </div>
      </main>
      <CustomModal />
    </div>
  );
}

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Settings, Home, BarChart3, Users, LogOut, Book, MessageCircleQuestion } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';

export const AdminSidebar = () => {
  const navigate = useNavigate();
  const { showConfirm } = useUiStore();
  
  const handleLogout = async () => {
    if (await showConfirm('確定要安全登出嗎？')) {
      navigate('/');
    }
  };
  const menuItems = [
    { id: 'dashboard', name: '控制台', icon: LayoutDashboard, path: '/admin' },
    { id: 'articles', name: '文章管理', icon: BookOpen, path: '/admin/articles' },
    { id: 'dictionary', name: '術語字典', icon: Book, path: '/admin/dictionary' },
    { id: 'faqs', name: '常見問題', icon: MessageCircleQuestion, path: '/admin/faqs' },
    { id: 'analytics', name: '數據統計', icon: BarChart3, path: '/admin/analytics' },
    { id: 'users', name: '用戶管理', icon: Users, path: '/admin/users' },
  ];

  return (
    <aside className="w-64 bg-slate-900 h-screen sticky top-0 flex flex-col text-slate-300">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white font-bold">
          <Settings size={18} />
        </div>
        <div>
          <h1 className="font-bold text-white text-base leading-tight">管理後台</h1>
          <p className="text-[10px] text-slate-500">v1.2.0-STABLE</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                ${isActive 
                  ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' 
                  : 'hover:bg-white/5 hover:text-white'}
              `}
            >
              <Icon size={18} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-1">
        <NavLink to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-white/5 hover:text-white transition-all">
          <Home size={18} />
          返回前台
        </NavLink>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-400/10 transition-all">
          <LogOut size={18} />
          安全登出
        </button>
      </div>
    </aside>
  );
};

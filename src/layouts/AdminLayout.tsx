import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '../pages/admin/AdminSidebar';
import { Bell, Search, User } from 'lucide-react';
import { useUiStore } from '../store/uiStore';

export const AdminLayout = () => {
  const { showAlert } = useUiStore();
  return (
    <div className="flex bg-slate-50 min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-200 bg-white sticky top-0 z-50 flex items-center justify-between px-8">
          <div className="flex items-center gap-4 flex-1">
             <div className="relative max-w-sm w-full group">
               <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500" />
               <input 
                 type="text" 
                 placeholder="搜尋後台功能或指南..." 
                 className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-transparent focus:bg-white focus:border-brand-200 focus:ring-4 focus:ring-brand-50 rounded-2xl text-sm transition-all outline-none"
               />
             </div>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => showAlert('目前沒有新通知')} className="relative text-slate-400 hover:text-slate-600 transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white">0</span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
               <div className="text-right">
                 <p className="text-sm font-bold text-slate-900 leading-none">系統管理員</p>
                 <p className="text-[10px] text-slate-500 mt-1">Super Admin</p>
               </div>
               <div className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm">
                 AD
               </div>
            </div>
          </div>
        </header>

        <main className="p-8 mt-0 w-full max-w-[1600px] mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

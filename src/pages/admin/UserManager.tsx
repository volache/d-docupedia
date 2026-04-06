import React, { useState, useEffect } from 'react';
import { Users, Shield, Key, Mail, Trash2, UserPlus, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { db, auth } from '../../lib/firebase';
import { collection, query, onSnapshot, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { useUiStore } from '../../store/uiStore';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor';
  createdAt: any;
}

export const UserManager = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'editor'>('editor');
  const [globalCode, setGlobalCode] = useState('');
  const [isSavingCode, setIsSavingCode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const { showConfirm, showAlert } = useUiStore();

  // 載入管理員列表
  useEffect(() => {
    if (!db) return;
    
    const q = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AdminUser[];
      setAdmins(userList);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 載入全域存取碼
  useEffect(() => {
    if (!db) return;
    
    const fetchSettings = async () => {
      const settingsDoc = await getDoc(doc(db, 'settings', 'system'));
      if (settingsDoc.exists()) {
        setGlobalCode(settingsDoc.data().global_access_code || '');
      }
    };
    fetchSettings();
  }, []);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !db) return;

    try {
      await setDoc(doc(db, 'users', newEmail.replace(/\./g, '_')), {
        email: newEmail,
        name: newEmail.split('@')[0],
        role: newRole,
        createdAt: new Date()
      });
      setNewEmail('');
      await showAlert(`已成功授權 ${newEmail} 為${newRole === 'admin' ? '管理員' : '編輯者'}`);
    } catch (error) {
      console.error("Error adding admin:", error);
      await showAlert('授權失敗，請檢查權限或網路連線。');
    }
  };

  const handleDeleteAdmin = async (id: string, email: string) => {
    if (await showConfirm(`確定要取消 ${email} 的管理權限嗎？`)) {
      try {
        await deleteDoc(doc(db, 'users', id));
        await showAlert('權限已成功撤銷。');
      } catch (error) {
        console.error("Error deleting admin:", error);
        await showAlert('操作失敗，請稍後再試。');
      }
    }
  };

  const handleSaveGlobalCode = async () => {
    if (!db) return;
    setIsSavingCode(true);
    try {
      await setDoc(doc(db, 'settings', 'system'), {
        global_access_code: globalCode,
        updatedAt: new Date()
      }, { merge: true });
      await showAlert('全域安全通行碼已更新成功！');
    } catch (error) {
      console.error("Error saving global code:", error);
      await showAlert('通行碼儲存失敗，請檢查權限。');
    } finally {
      setIsSavingCode(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">用戶權限與安全中心</h2>
        <p className="text-slate-500 font-medium">管理後台編輯權限與全站機敏資料通行碼</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 全域安全設定 */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                <Shield size={20} />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">安全通行碼</h3>
            </div>
            
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              設定用於「內部公文」的統一存取碼。同仁輸入正確後即可閱覽機敏內容。
            </p>

            <div className="space-y-4">
              <div className="relative group">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500" size={18} />
                <input 
                  type="text" 
                  value={globalCode}
                  onChange={(e) => setGlobalCode(e.target.value)}
                  placeholder="輸入全域通行碼..."
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent focus:bg-white focus:border-brand-200 focus:ring-4 focus:ring-brand-50 rounded-2xl text-sm transition-all outline-none font-mono tracking-widest"
                />
              </div>
              <button 
                onClick={handleSaveGlobalCode}
                disabled={isSavingCode}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50"
              >
                <Save size={18} />
                {isSavingCode ? '儲存中...' : '儲存全域碼'}
              </button>
            </div>

            <div className="mt-6 flex gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
               <AlertCircle size={18} className="text-amber-500 shrink-0" />
               <p className="text-[10px] text-amber-700 leading-relaxed font-medium">注意：修改全域碼後，之前已解鎖的同仁 Session 將失效，需重新輸入新碼。</p>
            </div>
          </div>
        </div>

        {/* 編輯權限管理 */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-100 text-brand-600 rounded-xl flex items-center justify-center">
                  <Users size={20} />
                </div>
                <h3 className="font-bold text-slate-900 text-lg">後台管理員名單</h3>
              </div>
              
              <div className="text-[10px] bg-slate-100 px-3 py-1 rounded-full font-bold text-slate-500 uppercase tracking-widest">
                {admins.length} Members
              </div>
            </div>

            {/* 新增管理員 */}
            <form onSubmit={handleAddAdmin} className="flex flex-col sm:flex-row gap-3 mb-8">
              <div className="flex-1 relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500" size={18} />
                <input 
                  type="email" 
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="輸入同仁 Email 進行授權..."
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-transparent focus:bg-white focus:border-brand-200 focus:ring-4 focus:ring-brand-50 rounded-2xl text-sm transition-all outline-none"
                />
              </div>
              <select 
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as any)}
                className="bg-slate-50 px-4 py-3.5 rounded-2xl border border-transparent outline-none text-sm font-bold text-slate-600 focus:bg-white focus:border-brand-200"
              >
                <option value="editor">編輯者 (Editor)</option>
                <option value="admin">管理員 (Admin)</option>
              </select>
              <button 
                type="submit"
                className="bg-brand-600 text-white px-6 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand-700 transition-all shadow-lg shadow-brand-600/20"
              >
                <UserPlus size={18} />
                <span className="hidden sm:inline">新增授權</span>
              </button>
            </form>

            {/* 列表 */}
            <div className="flex-1 overflow-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-50">
                    <th className="text-left py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">用戶資訊</th>
                    <th className="text-left py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">角色權限</th>
                    <th className="text-right py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {isLoading ? (
                    <tr>
                      <td colSpan={3} className="py-20 text-center">
                        <div className="w-6 h-6 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto"></div>
                      </td>
                    </tr>
                  ) : admins.length > 0 ? (
                    admins.map((admin) => (
                      <tr key={admin.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold border border-slate-200 uppercase">
                              {admin.name[0]}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">{admin.name}</p>
                              <p className="text-xs text-slate-500">{admin.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            admin.role === 'admin' 
                              ? 'bg-purple-100 text-purple-600' 
                              : 'bg-blue-100 text-blue-600'
                          }`}>
                            {admin.role}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button 
                            onClick={() => handleDeleteAdmin(admin.id, admin.email)}
                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-20 text-center text-slate-400 italic text-sm">
                        尚未有管理員授權紀錄
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit2, Trash2, Search, ChevronLeft, Save, X, Book, Loader2, Tag, AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';
import { db, isFirebaseEnabled } from '../../lib/firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { useUiStore } from '../../store/uiStore';

interface Term {
  id: string;
  word: string;
  definition: string;
  example: string;
  category: 'phrase' | 'legal' | 'punctuation' | 'correction';
  incorrect_usage?: string;
  tags: string[];
}

const CATEGORIES = [
  { id: 'phrase', name: '常用用語', icon: <Book size={14} />, color: 'bg-blue-50 text-blue-700 border-blue-100' },
  { id: 'legal', name: '法律名詞', icon: <Tag size={14} />, color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  { id: 'punctuation', name: '標點符號', icon: <AlertCircle size={14} />, color: 'bg-amber-50 text-amber-700 border-amber-100' },
  { id: 'correction', name: '易錯校正', icon: <X size={14} />, color: 'bg-red-50 text-red-700 border-red-100' },
];

export const DictionaryManager = () => {
  const { showConfirm, showAlert } = useUiStore();
  const [terms, setTerms] = useState<Term[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTerm, setCurrentTerm] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(isFirebaseEnabled);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isFirebaseEnabled || !db) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'dictionary'), orderBy('word', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Term[];
      setTerms(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredTerms = terms.filter(t => 
    t.word.includes(searchQuery) || t.definition.includes(searchQuery)
  );

  const handleEdit = (term: Term) => {
    setCurrentTerm({ 
      ...term, 
      tags: term.tags || [],
      category: term.category || 'phrase'
    });
    setIsEditing(true);
  };

  const handleCreate = () => {
    setCurrentTerm({ 
      word: '', 
      definition: '', 
      example: '', 
      category: 'phrase', 
      incorrect_usage: '', 
      tags: [] 
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (await showConfirm('確定要刪除這個術語嗎？')) {
      if (isFirebaseEnabled && db) {
        try {
          await deleteDoc(doc(db, 'dictionary', id));
        } catch (error) {
          await showAlert('刪除失敗');
        }
      } else {
        setTerms(prev => prev.filter(t => t.id !== id));
      }
    }
  };

  const handleBackToList = async () => {
    if (await showConfirm('確定要放棄未儲存的變更嗎？')) {
      setIsEditing(false);
      setCurrentTerm(null);
    }
  };

  const handleSave = async () => {
    if (!currentTerm.word) {
      await showAlert('請輸入術語名稱');
      return;
    }
    setIsSaving(true);
    
    if (isFirebaseEnabled && db) {
      try {
        if (currentTerm.id) {
          const { id, ...data } = currentTerm;
          await updateDoc(doc(db, 'dictionary', id), data);
        } else {
          await addDoc(collection(db, 'dictionary'), currentTerm);
        }
        setIsEditing(false);
        setCurrentTerm(null);
      } catch (error) {
        await showAlert('儲存失敗');
      }
    } else {
      const newTerm = { ...currentTerm, id: currentTerm.id || Date.now().toString() };
      if (currentTerm.id) {
        setTerms(prev => prev.map(t => t.id === currentTerm.id ? newTerm : t));
      } else {
        setTerms(prev => [newTerm, ...prev]);
      }
      setIsEditing(false);
      setCurrentTerm(null);
    }
    setIsSaving(false);
  };

  if (loading) {
     return (
       <div className="flex flex-col items-center justify-center py-40 gap-4">
         <Loader2 className="animate-spin text-brand-600" size={32} />
         <p className="text-slate-400 font-bold text-sm animate-pulse">正在載入小辭典...</p>
       </div>
     );
  }

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {!isEditing ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="list" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">術語字典管理</h2>
                <p className="text-slate-500 text-sm">維護公文用語解析與易錯字校正庫</p>
              </div>
              <button onClick={handleCreate} className="bg-brand-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-brand-700 shadow-lg shadow-brand-600/20">
                <Plus size={20} /> 新增術語
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
               <Search size={18} className="text-slate-400 ml-2" />
               <input 
                 type="text" 
                 placeholder="搜尋關鍵字或解析內容..." 
                 value={searchQuery}
                 onChange={e => setSearchQuery(e.target.value)}
                 className="flex-1 bg-transparent border-none outline-none text-sm"
               />
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
               <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                     <tr>
                        <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">用語/分類</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">白話解析</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest text-right">操作</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {filteredTerms.map(term => (
                       <tr key={term.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-4">
                             <div className="font-bold text-slate-900 mb-1">{term.word}</div>
                             <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${CATEGORIES.find(c => c.id === term.category)?.color}`}>
                                {CATEGORIES.find(c => c.id === term.category)?.icon}
                                {CATEGORIES.find(c => c.id === term.category)?.name}
                             </div>
                          </td>
                          <td className="px-6 py-4">
                             <div className="text-sm text-slate-600 max-w-sm line-clamp-2 leading-relaxed">{term.definition}</div>
                          </td>
                          <td className="px-6 py-4 text-right">
                             <div className="flex justify-end gap-2">
                                <button onClick={() => handleEdit(term)} className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all">
                                   <Edit2 size={18} />
                                </button>
                                <button onClick={() => handleDelete(term.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                                   <Trash2 size={18} />
                                </button>
                             </div>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
               {filteredTerms.length === 0 && (
                 <div className="py-20 text-center text-slate-400 font-medium">沒有找到符合搜尋條件的術語</div>
               )}
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} key="edit" className="space-y-6">
            <div className="flex items-center justify-between">
              <button onClick={handleBackToList} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors">
                <ChevronLeft size={20} /> 返回列表
              </button>
              <div className="flex gap-3">
                 <button 
                   disabled={isSaving}
                   onClick={handleSave}
                   className="bg-brand-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-brand-700 shadow-lg shadow-brand-600/20 disabled:opacity-50 transition-all"
                 >
                   {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                   {isSaving ? '儲存中...' : '儲存正式版'}
                 </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 space-y-6">
                  <section className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
                     <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">術語/用語名稱</label>
                        <input 
                          type="text" 
                          value={currentTerm.word}
                          onChange={e => setCurrentTerm({...currentTerm, word: e.target.value})}
                          placeholder="例如：檢送、鑒核..."
                          className="w-full text-2xl font-black bg-slate-50 border-none rounded-2xl p-4 focus:bg-white focus:ring-4 focus:ring-brand-50 outline-none transition-all"
                        />
                     </div>

                     <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">白話專業解析</label>
                        <textarea 
                          rows={4}
                          value={currentTerm.definition}
                          onChange={e => setCurrentTerm({...currentTerm, definition: e.target.value})}
                          placeholder="請輸入簡單明瞭的術語定義..."
                          className="w-full text-sm bg-slate-50 border-none rounded-2xl p-4 focus:bg-white focus:ring-4 focus:ring-brand-50 outline-none transition-all resize-none"
                        />
                     </div>

                     <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest block flex items-center gap-2">
                           <CheckCircle2 size={14} className="text-emerald-500" /> 推薦範例用法
                        </label>
                        <textarea 
                          rows={2}
                          value={currentTerm.example}
                          onChange={e => setCurrentTerm({...currentTerm, example: e.target.value})}
                          placeholder="例如：檢送「113年度工作計畫」乙份，請 鑒核。"
                          className="w-full text-sm bg-slate-50 border-none rounded-2xl p-4 focus:bg-white focus:ring-4 focus:ring-brand-50 outline-none transition-all resize-none"
                        />
                     </div>

                     {currentTerm.category === 'correction' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2 p-6 bg-red-50/50 rounded-[1.5rem] border border-red-100">
                           <label className="text-xs font-black text-red-400 uppercase tracking-widest block flex items-center gap-2">
                              <X size={14} /> 錯誤/混淆用法 (Don't use)
                           </label>
                           <input 
                             type="text" 
                             value={currentTerm.incorrect_usage}
                             onChange={e => setCurrentTerm({...currentTerm, incorrect_usage: e.target.value})}
                             placeholder="例如：剪送 (音同字錯)"
                             className="w-full text-sm bg-white border-none rounded-xl p-3 focus:ring-4 focus:ring-red-100 outline-none transition-all"
                           />
                        </motion.div>
                     )}
                  </section>
               </div>

               <div className="lg:col-span-1 space-y-6">
                  <aside className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-8 sticky top-6">
                     <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-4 text-lg">分類屬性</h4>
                     
                     <div className="space-y-3">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest block">詞條類別</label>
                        <div className="grid grid-cols-1 gap-2">
                           {CATEGORIES.map(cat => (
                              <button 
                                key={cat.id}
                                onClick={() => setCurrentTerm({...currentTerm, category: cat.id})}
                                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${currentTerm.category === cat.id ? 'bg-brand-50 border-brand-200 text-brand-900' : 'bg-white border-slate-50 text-slate-400 hover:bg-slate-50'}`}
                              >
                                 <div className={`p-2 rounded-lg ${currentTerm.category === cat.id ? 'bg-white shadow-sm' : 'bg-slate-50'}`}>{cat.icon}</div>
                                 <span className="text-xs font-bold">{cat.name}</span>
                              </button>
                           ))}
                        </div>
                     </div>

                     <div className="flex gap-3 p-4 bg-brand-50/50 rounded-2xl border border-brand-100 mt-4">
                        <HelpCircle size={18} className="text-brand-500 shrink-0" />
                        <p className="text-[10px] text-brand-700 leading-relaxed font-medium">
                           類別會影響術語在辭典頁面的分組與顯示方式。
                        </p>
                     </div>
                  </aside>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

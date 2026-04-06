import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit2, Trash2, Search, ChevronLeft, Save, X, HelpCircle, Loader2, MessageSquare, AlertCircle } from 'lucide-react';
import { db, isFirebaseEnabled } from '../../lib/firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { mockFaqs as defaultFaqs } from '../../data';
import { useUiStore } from '../../store/uiStore';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

export const FaqManager = () => {
  const { showConfirm, showAlert } = useUiStore();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentFaq, setCurrentTerm] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(isFirebaseEnabled);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isFirebaseEnabled || !db) {
      // 如果沒有 Firebase，使用 data.ts 的預設資料
      const initialFaqs = defaultFaqs.map((f, index) => ({
        ...f,
        category: 'general',
        order: index
      })) as FAQ[];
      setFaqs(initialFaqs);
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'faqs'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        // 如果資料庫是空的，可以考慮初始化預設資料
        setFaqs([]);
      } else {
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FAQ[];
        setFaqs(docs);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredFaqs = faqs.filter(f => 
    f.question.includes(searchQuery) || f.answer.includes(searchQuery)
  );

  const handleEdit = (faq: FAQ) => {
    setCurrentTerm({ ...faq });
    setIsEditing(true);
  };

  const handleCreate = () => {
    setCurrentTerm({ 
      question: '', 
      answer: '', 
      category: 'general',
      order: faqs.length
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (await showConfirm('確定要刪除這個問題嗎？')) {
      if (isFirebaseEnabled && db) {
        try {
          await deleteDoc(doc(db, 'faqs', id));
        } catch (error) {
          await showAlert('刪除失敗');
        }
      } else {
        setFaqs(prev => prev.filter(f => f.id !== id));
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
    if (!currentFaq.question || !currentFaq.answer) {
      await showAlert('請填寫問題與解答');
      return;
    }
    setIsSaving(true);
    
    if (isFirebaseEnabled && db) {
      try {
        if (currentFaq.id) {
          const { id, ...data } = currentFaq;
          await updateDoc(doc(db, 'faqs', id), data);
        } else {
          await addDoc(collection(db, 'faqs'), currentFaq);
        }
        setIsEditing(false);
        setCurrentTerm(null);
      } catch (error) {
        await showAlert('儲存失敗');
      }
    } else {
      const newFaq = { ...currentFaq, id: currentFaq.id || Date.now().toString() };
      if (currentFaq.id) {
        setFaqs(prev => prev.map(f => f.id === currentFaq.id ? newFaq : f));
      } else {
        setFaqs(prev => [...prev, newFaq]);
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
         <p className="text-slate-400 font-bold text-sm animate-pulse">正在載入常見問題...</p>
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
                <h2 className="text-2xl font-bold text-slate-900">常見問題管理</h2>
                <p className="text-slate-500 text-sm">維護全站通用的常見疑難排解解答</p>
              </div>
              <button onClick={handleCreate} className="bg-brand-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-brand-700 shadow-lg shadow-brand-600/20">
                <Plus size={20} /> 新增問題
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
               <Search size={18} className="text-slate-400 ml-2" />
               <input 
                 type="text" 
                 placeholder="搜尋問題或解答內容..." 
                 value={searchQuery}
                 onChange={e => setSearchQuery(e.target.value)}
                 className="flex-1 bg-transparent border-none outline-none text-sm"
               />
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
               <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                     <tr>
                        <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest w-1/3">問題</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">解答摘要</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest text-right">操作</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {filteredFaqs.map(faq => (
                       <tr key={faq.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-4">
                             <div className="font-bold text-slate-900 line-clamp-2">{faq.question}</div>
                          </td>
                          <td className="px-6 py-4">
                             <div className="text-sm text-slate-500 line-clamp-2">{faq.answer}</div>
                          </td>
                          <td className="px-6 py-4 text-right">
                             <div className="flex justify-end gap-2">
                                <button onClick={() => handleEdit(faq)} className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all">
                                   <Edit2 size={18} />
                                </button>
                                <button onClick={() => handleDelete(faq.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                                   <Trash2 size={18} />
                                </button>
                             </div>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
               {filteredFaqs.length === 0 && (
                 <div className="py-20 text-center text-slate-400 font-medium">尚未建立常見問題</div>
               )}
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} key="edit" className="space-y-6">
            <div className="flex items-center justify-between">
              <button onClick={handleBackToList} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors">
                <ChevronLeft size={20} /> 返回列表
              </button>
              <button 
                disabled={isSaving}
                onClick={handleSave}
                className="bg-brand-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-brand-700 shadow-lg shadow-brand-600/20 disabled:opacity-50 transition-all"
              >
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                儲存問題
              </button>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-8">
               <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest block flex items-center gap-2">
                    <HelpCircle size={14} /> 問題標題 (Question)
                  </label>
                  <input 
                    type="text" 
                    value={currentFaq.question}
                    onChange={e => setCurrentTerm({...currentFaq, question: e.target.value})}
                    placeholder="請輸入同仁常詢問的問題..."
                    className="w-full text-xl font-bold bg-slate-50 border-none rounded-2xl p-4 focus:bg-white focus:ring-4 focus:ring-brand-50 outline-none transition-all"
                  />
               </div>

               <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest block flex items-center gap-2">
                    <MessageSquare size={14} /> 詳細解答 (Answer)
                  </label>
                  <textarea 
                    rows={8}
                    value={currentFaq.answer}
                    onChange={e => setCurrentTerm({...currentFaq, answer: e.target.value})}
                    placeholder="請輸入詳細且專業的解答內容..."
                    className="w-full text-sm bg-slate-50 border-none rounded-2xl p-4 focus:bg-white focus:ring-4 focus:ring-brand-50 outline-none transition-all resize-none"
                  />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">顯示排序 (Order)</label>
                    <input 
                      type="number" 
                      value={currentFaq.order}
                      onChange={e => setCurrentTerm({...currentFaq, order: parseInt(e.target.value)})}
                      className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm focus:bg-white outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-brand-50/50 rounded-2xl border border-brand-100 h-fit self-end">
                    <AlertCircle size={18} className="text-brand-500 shrink-0" />
                    <p className="text-[10px] text-brand-700 leading-relaxed font-medium">數字越小，該問題將會排在越前面顯示。</p>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

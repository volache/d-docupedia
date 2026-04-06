import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Loader2, HelpCircle } from 'lucide-react';
import { mockFaqs as defaultFaqs } from '../data';
import { Card } from '../components/ui';
import { db, isFirebaseEnabled } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export const FaqView = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [loading, setLoading] = useState(isFirebaseEnabled);

  useEffect(() => {
    if (!isFirebaseEnabled || !db) {
      const initialFaqs = (defaultFaqs || []).map(f => ({
        id: f.id,
        question: f.question,
        answer: f.answer
      })) as FAQ[];
      setFaqs(initialFaqs);
      if (initialFaqs.length > 0) setOpenId(initialFaqs[0].id);
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'faqs'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        const initialFaqs = (defaultFaqs || []).map(f => ({
          id: f.id,
          question: f.question,
          answer: f.answer
        })) as FAQ[];
        setFaqs(initialFaqs);
        if (initialFaqs.length > 0) setOpenId(initialFaqs[0].id);
      } else {
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FAQ[];
        setFaqs(docs);
        if (docs.length > 0) setOpenId(docs[0].id);
      }
      setLoading(false);
    }, (error) => {
      console.error("FAQ fetch error:", error);
      setFaqs(defaultFaqs as any);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="animate-spin text-brand-600" size={32} />
        <p className="text-slate-400 font-bold text-sm">正在載入常見問題...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-12 text-center">
        <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-brand-600">
          <HelpCircle size={32} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">常見疑難排解</h1>
        <p className="text-slate-500">這裡彙整了同仁在使用系統或撰寫公文時最常遇到的問題。</p>
      </div>

      <div className="space-y-4">
        {faqs.length > 0 ? faqs.map((faq) => (
          <Card key={faq.id} className="rounded-2xl transition-all duration-200 hover:shadow-md border border-slate-100 overflow-hidden">
            <button
              onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
              className={`w-full flex items-center justify-between p-6 text-left transition-colors ${openId === faq.id ? 'bg-slate-50/50' : 'bg-white'}`}
            >
              <span className={`font-bold text-lg ${openId === faq.id ? 'text-brand-700' : 'text-slate-800'}`}>{faq.question}</span>
              <motion.div
                animate={{ rotate: openId === faq.id ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className={`shrink-0 ml-4 ${openId === faq.id ? 'text-brand-500' : 'text-slate-300'}`}
              >
                <ChevronDown size={20} />
              </motion.div>
            </button>
            <AnimatePresence>
              {openId === faq.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden bg-white"
                >
                  <div className="p-6 pt-2 text-slate-600 leading-relaxed border-t border-slate-50 whitespace-pre-wrap">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        )) : (
          <div className="text-center py-20 text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">
            目前尚無常見問題資料
          </div>
        )}
      </div>

      <div className="mt-12 p-8 bg-slate-900 rounded-[2.5rem] text-white relative overflow-hidden group text-center">
         <div className="relative z-10">
            <h4 className="text-xl font-bold mb-2">還有其他問題嗎？</h4>
            <p className="text-slate-400 text-sm mb-6">如果您在知識庫中找不到答案，歡迎直接聯繫系統維護單位。</p>
            <button className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold text-sm hover:bg-brand-50 transition-colors">
               聯繫管理員
            </button>
         </div>
      </div>
    </div>
  );
};

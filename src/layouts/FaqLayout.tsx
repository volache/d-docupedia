import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, HelpCircle } from 'lucide-react';

export const FaqLayout = ({ content }: { content: any }) => {
  const [openId, setOpenId] = useState<number | null>(0);

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {content.faqs.map((faq: any, i: number) => {
        const isOpen = openId === i;
        return (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden transition-shadow hover:shadow-sm">
            <button 
              onClick={() => setOpenId(isOpen ? null : i)}
              className="w-full px-6 py-5 flex items-center justify-between text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-slate-800 text-white rounded-lg flex items-center justify-center shrink-0">
                  <HelpCircle size={18} />
                </div>
                <h4 className="font-bold text-slate-800 group-hover:text-brand-700 transition-colors">{faq.question}</h4>
              </div>
              <div className="bg-slate-50 p-1 rounded-full text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-500 transition-colors">
                {isOpen ? <Minus size={20} /> : <Plus size={20} />}
              </div>
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <div className="px-6 pb-6 pt-2 pl-[4.5rem]">
                     <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mb-4" />
                     <p className="text-slate-600 leading-relaxed text-lg">{faq.answer}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

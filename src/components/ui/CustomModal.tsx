import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, HelpCircle, Info, X, Check } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';

export const CustomModal = () => {
  const { modal, closeModal } = useUiStore();
  const [promptValue, setPromptValue] = useState('');

  useEffect(() => {
    if (modal?.type === 'prompt') {
      setPromptValue(modal.defaultValue || '');
    }
  }, [modal]);

  if (!modal) return null;

  const getIcon = () => {
    switch (modal.type) {
      case 'alert': return <Info className="text-blue-500" size={32} />;
      case 'confirm': return <HelpCircle className="text-amber-500" size={32} />;
      case 'prompt': return <AlertCircle className="text-brand-500" size={32} />;
      default: return <Info className="text-blue-500" size={32} />;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden"
        >
          <div className="p-8 text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
              modal.type === 'alert' ? 'bg-blue-50' : 
              modal.type === 'confirm' ? 'bg-amber-50' : 'bg-brand-50'
            }`}>
              {getIcon()}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">系統提示</h3>
            <p className="text-slate-500 leading-relaxed">{modal.message}</p>
            
            {modal.type === 'prompt' && (
              <input 
                autoFocus
                type="text"
                value={promptValue}
                onChange={(e) => setPromptValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && modal.onConfirm(promptValue)}
                className="mt-6 w-full p-4 bg-slate-50 border border-transparent focus:bg-white focus:border-brand-200 focus:ring-4 focus:ring-brand-50 rounded-2xl text-sm outline-none transition-all font-bold text-slate-700"
              />
            )}
          </div>
          
          <div className="p-4 bg-slate-50 flex gap-3">
            {modal.type !== 'alert' && (
              <button 
                onClick={() => modal.onCancel()}
                className="flex-1 py-4 px-6 rounded-2xl bg-white border border-slate-200 text-slate-500 font-bold hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
              >
                取消
              </button>
            )}
            <button 
              onClick={() => modal.onConfirm(promptValue)}
              className="flex-1 py-4 px-6 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2"
            >
              確定
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

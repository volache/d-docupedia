import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  className?: string;
  size?: 'sm' | 'md';
}

export const CustomSelect = ({ value, onChange, options, className = '', size = 'md' }: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sizeClasses = size === 'sm' 
    ? 'px-3 py-2 text-[10px] uppercase tracking-widest' 
    : 'px-4 py-3 text-sm';

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div 
        className={`flex items-center justify-between bg-white rounded-xl font-bold border cursor-pointer hover:border-brand-300 transition-all shadow-sm ${sizeClasses} ${isOpen ? 'border-brand-500 ring-4 ring-brand-500/10' : 'border-slate-200'}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate text-slate-800">{selectedOption?.label}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
           <ChevronDown size={size === 'sm' ? 12 : 16} className="text-slate-400" />
        </motion.div>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] rounded-xl overflow-hidden z-50 p-1"
          >
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {options.map((option) => (
                <div 
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all text-sm font-bold
                    ${option.value === value ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  {option.label}
                  {option.value === value && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <Check size={14} className="text-brand-600" />
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

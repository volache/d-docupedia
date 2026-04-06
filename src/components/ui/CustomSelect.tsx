import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

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
    ? 'px-3 py-1.5 text-xs' 
    : 'px-4 py-3 text-sm';

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div 
        className={`flex items-center justify-between bg-white rounded-xl font-bold border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors shadow-sm ${sizeClasses}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">{selectedOption?.label}</span>
        <ChevronDown size={size === 'sm' ? 14 : 16} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-100 shadow-xl rounded-xl overflow-hidden z-50">
          <div className="max-h-60 overflow-y-auto py-1">
            {options.map((option) => (
              <div 
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between px-3 py-2 cursor-pointer transition-colors text-sm font-medium
                  ${option.value === value ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                {option.label}
                {option.value === value && <Check size={14} />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

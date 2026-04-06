import React from 'react';
import { motion } from 'motion/react';
import { Lightbulb, Info, AlertTriangle, CheckCircle, ArrowRight, Download } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Summary Block
export const SummaryBox = ({ content }: { content: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-brand-50 border-l-4 border-brand-500 p-6 rounded-r-2xl my-8"
  >
    <div className="flex gap-4">
      <div className="bg-brand-500/10 p-2 rounded-lg h-fit">
        <Lightbulb className="text-brand-600" size={24} />
      </div>
      <div>
        <h4 className="font-bold text-brand-900 mb-1">內容精華</h4>
        <p className="text-brand-800/80 leading-relaxed">{content}</p>
      </div>
    </div>
  </motion.div>
);

// Callout Block
export const Callout = ({ type = 'tip', title, content }: { type?: 'tip' | 'warning' | 'info', title?: string, content: string }) => {
  const styles = {
    tip: { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: <CheckCircle className="text-emerald-600" />, text: 'text-emerald-900', title: title || '專業建議' },
    warning: { bg: 'bg-amber-50', border: 'border-amber-200', icon: <AlertTriangle className="text-amber-600" />, text: 'text-amber-900', title: title || '注意事項' },
    info: { bg: 'bg-blue-50', border: 'border-blue-200', icon: <Info className="text-blue-600" />, text: 'text-blue-900', title: title || '補充說明' }
  };
  const config = styles[type];

  return (
    <div className={cn("p-5 rounded-2xl border flex gap-4 my-6", config.bg, config.border)}>
      <div className="mt-0.5">{config.icon}</div>
      <div>
        <h5 className={cn("font-bold mb-1", config.text)}>{config.title}</h5>
        <p className={cn("text-sm opacity-90 leading-relaxed", config.text)}>{content}</p>
      </div>
    </div>
  );
};

// Example Block (Compare)
export const ExampleBlock = ({ title, items }: { title: string, items: any[] }) => (
  <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden my-8 shadow-sm">
    <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
      <h4 className="font-bold text-slate-800">{title}</h4>
      <div className="flex gap-2">
        <div className="w-3 h-3 rounded-full bg-slate-200" />
        <div className="w-3 h-3 rounded-full bg-slate-200" />
      </div>
    </div>
    <div className="p-6 space-y-4">
      {items.map((item, i) => (
        <div key={i} className={cn(
          "p-4 rounded-xl border flex flex-col gap-2",
          item.variant === 'success' ? "bg-emerald-50/50 border-emerald-100" : "bg-red-50/50 border-red-100"
        )}>
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-[10px] uppercase font-bold px-1.5 py-0.5 rounded shadow-sm",
              item.variant === 'success' ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
            )}>
              {item.label}
            </span>
          </div>
          <p className="text-slate-700 font-medium">{item.content}</p>
        </div>
      ))}
    </div>
  </div>
);

// Workflow Step Card
export const StepItem = ({ step, title, description, pro_tip, icon, index }: any) => (
  <motion.div 
    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className={cn(
      "flex flex-col md:flex-row gap-8 items-center py-12 border-b border-slate-100 last:border-0",
      index % 2 !== 0 && "md:flex-row-reverse"
    )}
  >
    <div className="flex-1 space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-5xl font-black text-slate-200/60 leading-none">0{index + 1}</span>
        <h3 className="text-2xl font-bold text-slate-900">{title}</h3>
      </div>
      <p className="text-slate-600 text-lg leading-relaxed">{description}</p>
      {pro_tip && (
        <div className="inline-flex items-start gap-2 bg-brand-100/50 p-3 rounded-xl border border-brand-200/50 max-w-sm">
          <Lightbulb size={18} className="text-brand-600 shrink-0 mt-0.5" />
          <p className="text-sm text-brand-900 leading-tight"><span className="font-bold">PRO TIP:</span> {pro_tip}</p>
        </div>
      )}
    </div>
    <div className="flex-1 w-full max-w-sm aspect-video bg-white rounded-3xl shadow-xl shadow-brand-900/5 border border-slate-100 flex items-center justify-center group cursor-pointer hover:-translate-y-1 transition-all">
       <div className="w-20 h-20 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 group-hover:scale-110 transition-transform">
         {/* Icon would be rendered here via Lucide dynamic mapping if needed, or static placeholder */}
         <Lightbulb size={40} />
       </div>
    </div>
  </motion.div>
);

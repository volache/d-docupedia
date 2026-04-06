import React from 'react';
import { motion } from 'motion/react';
import { Lightbulb, FileText, CheckCircle, Send, ArrowRight } from 'lucide-react';
import { mockWorkflowSteps } from '../data';
import { Callout } from '../components/ui';

export const WorkflowView = () => {
  return (
    <div className="max-w-5xl mx-auto py-8">
      {/* Header */}
      <div className="mb-16 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-sm font-medium mb-6">
          <FileText size={16} />
          <span>標準作業流程 (SOP)</span>
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">
          公文生命週期指南
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          透過我們精心策劃的視覺指南，掌握官方文件處理的藝術。每一個步驟都為了清晰與效率而設計。
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-24">
        {mockWorkflowSteps.map((step, index) => {
          const isEven = index % 2 === 0;
          return (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              key={step.step} 
              className={`flex flex-col md:flex-row gap-12 lg:gap-24 items-center ${isEven ? '' : 'md:flex-row-reverse'}`}
            >
              {/* Text Content */}
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 text-slate-600 text-sm font-bold tracking-wider">
                  <CheckCircle size={14} />
                  STEP {step.step}
                </div>
                <h2 className="text-3xl font-bold text-brand-900">{step.title}</h2>
                <p className="text-slate-600 text-lg leading-relaxed">
                  {step.desc}
                </p>
                
                <Callout icon={<Lightbulb className="text-blue-500" size={20} />} variant="tip">
                  <span className="font-semibold text-blue-900 block mb-1">Pro-tip</span>
                  <span className="italic text-blue-800/80">"{step.tip}"</span>
                </Callout>
              </div>

              {/* Visual Placeholder */}
              <div className="flex-1 w-full">
                <div className={`aspect-square max-h-[400px] rounded-[2.5rem] ${step.imgColor} flex items-center justify-center relative overflow-hidden shadow-xl shadow-slate-200/50`}>
                  {/* Decorative elements */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent mix-blend-overlay"></div>
                  <span className="text-8xl filter drop-shadow-md">{step.imgPlaceholder}</span>
                  
                  {/* Floating badge example */}
                  {index === 1 && (
                    <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-sm flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <span className="text-sm font-medium text-slate-700">Focus: Precision</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* CTA */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="mt-32 bg-slate-100 rounded-[3rem] p-12 text-center relative overflow-hidden"
      >
        <div className="relative z-10 max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold text-slate-900 mb-4">準備好開始您的第一份草稿了嗎？</h3>
          <p className="text-slate-600 mb-8 text-lg">
            公文小學伴提供超過 100 種符合政府標準的模板，讓您的工作效率提升 50%。
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="px-8 py-4 bg-brand-700 text-white rounded-full font-medium hover:bg-brand-800 transition-colors flex items-center gap-2">
              瀏覽模板庫
              <ArrowRight size={18} />
            </button>
            <button className="px-8 py-4 bg-white text-slate-700 rounded-full font-medium hover:bg-slate-50 transition-colors border border-slate-200">
              參加迷你課程
            </button>
          </div>
        </div>
        {/* Decorative background shapes */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-brand-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute left-0 bottom-0 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
      </motion.div>
    </div>
  );
};

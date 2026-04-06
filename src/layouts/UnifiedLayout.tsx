import React from 'react';
import { SummaryBox, Callout, ExampleBlock, StepItem, TableBlock } from '../components/article/ArticleBlocks';
import { ChevronRight, HelpCircle, CheckCircle } from 'lucide-react';

export const UnifiedLayout = ({ content }: { content: any }) => {
  if (!content) return <div className="text-center py-20 text-slate-400">目前尚無內容</div>;

  // Render unified blocks
  const renderBlocks = (blocks: any[]) => {
    return blocks.map((block: any, i: number) => {
      switch (block.type) {
        case 'summary':
          return <SummaryBox key={i} content={block.content} />;
        case 'text':
          return (
            <div key={i} className="max-w-3xl mx-auto py-4">
              <p className="text-slate-700 text-lg leading-relaxed whitespace-pre-wrap">{block.content}</p>
            </div>
          );
        case 'callout':
          return (
            <div key={i} className="max-w-3xl mx-auto py-2">
               <Callout type={block.style || 'info'} title={block.title} content={block.content} />
            </div>
          );
        case 'example':
          return (
            <div key={i} className="max-w-3xl mx-auto py-6">
              <ExampleBlock title={block.title} items={block.items} />
            </div>
          );
        case 'step':
        case 'workflow_step':
          return (
            <div key={i} className="max-w-5xl mx-auto">
               <StepItem 
                index={i} 
                title={block.title} 
                description={block.description} 
                pro_tip={block.pro_tip} 
                icon={block.icon || 'Zap'} 
               />
            </div>
          );
        case 'faq':
          return (
            <div key={i} className="max-w-3xl mx-auto bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mb-4">
               <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                     <HelpCircle size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2 truncate">{block.question}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{block.answer}</p>
                  </div>
               </div>
            </div>
          );
        case 'use_case':
          return (
            <div key={i} className="max-w-3xl mx-auto flex items-start gap-3 bg-slate-50 p-4 rounded-xl mb-3">
               <CheckCircle size={18} className="text-brand-500 mt-1 shrink-0" />
               <p className="text-slate-700 font-medium text-sm">{block.content}</p>
            </div>
          );
        case 'system_step':
          return (
             <div key={i} className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 py-10 items-center border-b border-slate-50">
                <div className="space-y-4">
                   <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black bg-slate-900 text-white px-2 py-1 rounded">STEP {i + 1}</span>
                      <h3 className="text-2xl font-black text-slate-900">{block.title}</h3>
                   </div>
                   <p className="text-slate-500 leading-relaxed font-medium">{block.description}</p>
                   {block.action && (
                      <div className="bg-brand-50 text-brand-700 p-4 rounded-2xl flex items-center gap-3 border border-brand-100">
                         <ChevronRight size={18} className="text-brand-500" />
                         <span className="text-sm font-bold">{block.action}</span>
                      </div>
                   )}
                </div>
                {block.image_url && (
                   <div className="bg-slate-100 rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200 border-8 border-white">
                      <img src={block.image_url} alt={block.title} className="w-full h-auto object-cover" />
                   </div>
                )}
             </div>
          );
        case 'table':
          return <TableBlock key={i} headers={block.headers} rows={block.rows} hasRowHeader={block.is_row_header} />;
        default: return null;
      }
    });
  };

  // Compatibility Layer: Merge legacy structures into a single blocks array if blocks doesn't exist
  let blocks = content.blocks || [];
  
  if (!content.blocks) {
    if (content.steps && content.steps.length > 0) {
      const isSystemTutorial = content.steps.some((s: any) => s.action);
      blocks = [...blocks, ...content.steps.map((s: any) => ({ ...s, type: isSystemTutorial ? 'system_step' : 'step' }))];
    }
    if (content.faqs) blocks = [...blocks, ...content.faqs.map((f: any) => ({ ...f, type: 'faq' }))];
    if (content.use_cases) blocks = [...blocks, ...content.use_cases.map((u: string) => ({ content: u, type: 'use_case' }))];
  }

  return (
    <div className="pb-20 space-y-4">
      {renderBlocks(blocks)}
    </div>
  );
};

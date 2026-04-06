import React from 'react';
import { motion } from 'motion/react';
import { Trash2, FileText, Lightbulb, MessageSquare, GripHorizontal, Layout, List, HelpCircle, MousePointer, CheckCircle, Plus, ImageIcon, X } from 'lucide-react';
import { CustomSelect } from '../../ui/CustomSelect';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Article } from './types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface UniversalEditorProps {
  currentArticle: Article;
  updateBlock: (index: number, field: string, value: any) => void;
  removeListItem: (listField: string, index: number) => void;
  addBlock: (type: string) => void;
  updateBlockMultiple: (blockIdx: number, updates: Record<string, any>) => void;
}

export const UniversalEditor: React.FC<UniversalEditorProps> = ({
  currentArticle,
  updateBlock,
  removeListItem,
  addBlock,
  updateBlockMultiple
}) => {
  const blocks = currentArticle.content.blocks || [];

  return (
    <div className="space-y-6">
      {blocks.map((block: any, idx: number) => (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} key={idx} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 group relative">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest bg-brand-50 px-2 py-0.5 rounded border border-brand-100">
                {block.type.replace('_', ' ')} BLOCK
              </span>
            </div>
            <div className="flex items-center gap-2">
               <button onClick={() => removeListItem('blocks', idx)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
             {/* Text & Summary */}
             {(block.type === 'text' || block.type === 'summary') && (
                <textarea 
                  rows={4}
                  placeholder={block.type === 'summary' ? "內容精華摘要..." : "輸入內文內容..."}
                  value={block.content}
                  onChange={e => updateBlock(idx, 'content', e.target.value)}
                  className="w-full text-sm bg-slate-50 border-none rounded-xl p-4 focus:bg-white focus:ring-2 focus:ring-slate-100 outline-none resize-none transition-all"
                />
             )}

             {/* Callout */}
             {block.type === 'callout' && (
               <div className="grid grid-cols-1 gap-4">
                  <div className="grid grid-cols-3 gap-4">
                    <CustomSelect 
                      value={block.style || 'tip'}
                      onChange={val => updateBlock(idx, 'style', val)}
                      options={[{ value: 'tip', label: '建議 (TIP)' }, { value: 'info', label: '資訊 (INFO)' }, { value: 'warning', label: '警告 (WARN)' }]}
                      size="sm"
                    />
                    <input placeholder="標題 (選填)" value={block.title} onChange={e => updateBlock(idx, 'title', e.target.value)} className="col-span-2 bg-slate-50 border-none rounded-lg p-2 text-xs font-bold" />
                  </div>
                  <textarea rows={3} placeholder="提示內容..." value={block.content} onChange={e => updateBlock(idx, 'content', e.target.value)} className="w-full text-sm bg-slate-50 border-none rounded-xl p-4 focus:bg-white outline-none resize-none" />
               </div>
             )}

             {/* Example */}
             {block.type === 'example' && (
               <div className="space-y-4">
                  <input placeholder="對照範例標題" value={block.title} onChange={e => updateBlock(idx, 'title', e.target.value)} className="w-full bg-slate-50 border-none rounded-lg p-2 text-sm font-bold" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(block.items || []).map((item: any, itemIdx: number) => (
                      <div key={itemIdx} className={`p-4 rounded-2xl border ${item.variant === 'success' ? 'bg-emerald-50/30 border-emerald-100' : 'bg-red-50/30 border-red-100'}`}>
                        <div className="flex items-center justify-between mb-2">
                           <span className={`text-[10px] font-black px-2 py-0.5 rounded text-white ${item.variant === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}>{item.label}</span>
                        </div>
                        <textarea rows={3} value={item.content} onChange={e => {
                          const newItems = [...block.items];
                          newItems[itemIdx] = { ...item, content: e.target.value };
                          updateBlock(idx, 'items', newItems);
                        }} className="w-full text-xs bg-white/50 border-none rounded-lg p-2 focus:bg-white outline-none resize-none" />
                      </div>
                    ))}
                  </div>
               </div>
             )}

             {/* Step / Workflow */}
             {block.type === 'step' && (
               <div className="grid grid-cols-1 gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input placeholder="步驟標題" value={block.title} onChange={e => updateBlock(idx, 'title', e.target.value)} className="w-full font-bold bg-slate-50 border-none rounded-xl p-3 text-sm" />
                    <input placeholder="圖示名稱 (Lucide)" value={block.icon} onChange={e => updateBlock(idx, 'icon', e.target.value)} className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm" />
                  </div>
                  <textarea rows={2} placeholder="流程細節說明..." value={block.description} onChange={e => updateBlock(idx, 'description', e.target.value)} className="w-full text-sm bg-slate-50 border-none rounded-xl p-3 focus:bg-white outline-none" />
                  <input placeholder="專業建議 Pro Tip" value={block.pro_tip} onChange={e => updateBlock(idx, 'pro_tip', e.target.value)} className="w-full bg-brand-50 border border-brand-100 text-brand-700 p-3 rounded-xl text-xs font-bold" />
               </div>
             )}

             {/* System Step / Tutorial */}
             {block.type === 'system_step' && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                     <input placeholder="教學步驟標題" value={block.title} onChange={e => updateBlock(idx, 'title', e.target.value)} className="w-full font-bold bg-slate-50 border-none rounded-xl p-3 text-sm" />
                     <textarea rows={2} placeholder="功能操作描述..." value={block.description} onChange={e => updateBlock(idx, 'description', e.target.value)} className="w-full text-sm bg-slate-50 border-none rounded-xl p-3 focus:bg-white outline-none" />
                     <div className="bg-slate-900 p-3 rounded-xl flex items-center gap-3">
                        <MousePointer size={16} className="text-brand-400" />
                        <input placeholder="操作指令 (如: 點擊確定)" value={block.action} onChange={e => updateBlock(idx, 'action', e.target.value)} className="flex-1 bg-transparent border-none text-xs font-bold text-white outline-none" />
                     </div>
                  </div>
                  <div className="space-y-4">
                     <div className="h-32 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-slate-300 gap-2">
                        {block.image_url ? <img src={block.image_url} className="w-full h-full object-cover rounded-2xl" /> : <ImageIcon size={24} />}
                     </div>
                     <input placeholder="預覽圖片 URL" value={block.image_url} onChange={e => updateBlock(idx, 'image_url', e.target.value)} className="w-full bg-slate-50 border-none rounded-xl p-3 text-xs" />
                  </div>
               </div>
             )}

             {/* FAQ */}
             {block.type === 'faq' && (
               <div className="grid grid-cols-1 gap-4">
                  <input placeholder="問題內容" value={block.question} onChange={e => updateBlock(idx, 'question', e.target.value)} className="w-full font-bold bg-slate-50 border-none rounded-xl p-3 text-sm focus:bg-white outline-none transition-all" />
                  <textarea rows={3} placeholder="詳細回答..." value={block.answer} onChange={e => updateBlock(idx, 'answer', e.target.value)} className="w-full text-sm bg-slate-50 border-none rounded-xl p-3 focus:bg-white outline-none resize-none transition-all" />
               </div>
             )}

             {/* Use Case */}
             {block.type === 'use_case' && (
               <div className="flex gap-3 bg-slate-50 p-4 rounded-xl items-center">
                  <CheckCircle size={18} className="text-brand-500" />
                  <input placeholder="內容摘要或適用場景..." value={block.content} onChange={e => updateBlock(idx, 'content', e.target.value)} className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-slate-700" />
               </div>
             )}

             {/* Table */}
             {block.type === 'table' && (
               <div className="space-y-6">
                  <div className="sticky top-0 z-20 flex flex-wrap justify-between items-center bg-white/90 backdrop-blur-md p-5 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-100 flex-shrink-0 mb-4 transition-all hover:bg-white hover:shadow-2xl">
                    <div className="flex items-center gap-8">
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                            <GripHorizontal size={18} />
                         </div>
                         <span className="text-xs font-black text-slate-900 uppercase tracking-widest">表格數據設定</span>
                       </div>
                       <label className="flex items-center gap-2 cursor-pointer group">
                          <div 
                            onClick={() => updateBlock(idx, 'is_row_header', !block.is_row_header)}
                            className={cn(
                              "w-12 h-6 rounded-full transition-all relative border-2",
                              block.is_row_header ? "bg-brand-500 border-brand-400" : "bg-slate-100 border-slate-200"
                            )}
                          >
                             <div className={cn(
                               "absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-sm",
                               block.is_row_header ? "left-6" : "left-1"
                             )} />
                          </div>
                          <span className="text-[10px] font-black text-slate-500 uppercase group-hover:text-brand-600 transition-colors">開啟首端標題 (Row Header)</span>
                       </label>
                    </div>
                    <div className="flex gap-2">
                       <button 
                         onClick={() => {
                           const currentHeaders = block.headers || [];
                           const newHeaders = [...currentHeaders, `標題 ${currentHeaders.length + 1}`];
                           const newRows = (block.rows || []).map((r: any) => [...(r || []), '']);
                           updateBlockMultiple(idx, { headers: newHeaders, rows: newRows });
                         }}
                         className="flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-600 rounded-xl text-[10px] font-black border border-brand-100 hover:bg-brand-600 hover:text-white transition-all"
                       >
                         <Plus size={14} /> 新增欄 (COLUMN)
                       </button>
                       <button 
                         onClick={() => {
                           const colCount = (block.headers || []).length || 1;
                           const newRows = [...(block.rows || []), Array(colCount).fill('')];
                           updateBlock(idx, 'rows', newRows);
                         }}
                         className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
                       >
                         <Plus size={14} /> 新增列 (ROW)
                       </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-[2.5rem] border border-slate-100 bg-slate-50/30 p-8">
                     <table className="w-full border-separate border-spacing-4 min-w-[700px]">
                        <thead>
                           <tr>
                              {(block.headers || []).map((header: string, hIdx: number) => (
                                <th key={hIdx} className="relative group/th min-w-[180px]">
                                   <div className="flex flex-col gap-1.5">
                                      <span className="text-[9px] font-black text-slate-400 uppercase ml-2 mb-1 tracking-widest flex items-center gap-1">
                                         <Layout size={10} /> COLUMN {hIdx + 1}
                                      </span>
                                      <input 
                                        value={header}
                                        onChange={e => {
                                          const newHeaders = [...block.headers];
                                          newHeaders[hIdx] = e.target.value;
                                          updateBlock(idx, 'headers', newHeaders);
                                        }}
                                        className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-4 text-xs font-black uppercase text-slate-700 shadow-sm focus:ring-4 focus:ring-brand-500/10 outline-none transition-all placeholder:text-slate-300"
                                      />
                                   </div>
                                   <button 
                                     onClick={() => {
                                        const newHeaders = block.headers.filter((_: any, i: number) => i !== hIdx);
                                        const newRows = block.rows.map((r: any) => r.filter((_: any, i: number) => i !== hIdx));
                                        updateBlock(idx, 'headers', newHeaders);
                                        updateBlock(idx, 'rows', newRows);
                                     }}
                                     className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/th:opacity-100 transition-opacity shadow-lg shadow-red-500/20 z-10"
                                   >
                                     <X size={12} />
                                   </button>
                                </th>
                              ))}
                           </tr>
                        </thead>
                        <tbody>
                           {(block.rows || []).map((row: string[], rIdx: number) => (
                             <tr key={rIdx} className="group/tr relative">
                                {row.map((cell: string, cIdx: number) => (
                                  <td key={cIdx} className="relative">
                                     <textarea 
                                       rows={2}
                                       placeholder="輸入內容..."
                                       value={cell}
                                       onChange={e => {
                                          const newRows = [...block.rows];
                                          newRows[rIdx][cIdx] = e.target.value;
                                          updateBlock(idx, 'rows', newRows);
                                       }}
                                       className={cn(
                                         "w-full rounded-xl px-4 py-3 text-sm focus:ring-4 outline-none resize-none transition-all",
                                         block.is_row_header && cIdx === 0 
                                           ? "bg-brand-50/50 border-2 border-brand-100/50 font-black text-brand-900 focus:bg-white focus:ring-brand-500/10" 
                                           : "bg-slate-50 border border-slate-100 text-slate-600 focus:bg-white focus:ring-slate-100"
                                       )}
                                     />
                                  </td>
                                ))}
                                <div className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover/tr:opacity-100 transition-opacity">
                                   <button 
                                     onClick={() => {
                                       const newRows = block.rows.filter((_: any, i: number) => i !== rIdx);
                                       updateBlock(idx, 'rows', newRows);
                                     }}
                                     className="p-2 text-slate-300 hover:text-red-500 bg-white shadow-sm border border-slate-100 rounded-lg hover:shadow-md transition-all"
                                   >
                                     <Trash2 size={14} />
                                   </button>
                                </div>
                             </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
             )}
          </div>
        </motion.div>
      ))}

      <div className="p-8 border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50/50">
         <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 text-center">Add Universal Content Block</h4>
         <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-9 gap-3">
            {[
              { type: 'text', label: '文字', icon: <FileText size={16} /> },
              { type: 'summary', label: '摘要', icon: <Lightbulb size={16} /> },
              { type: 'callout', label: '提示', icon: <MessageSquare size={16} /> },
              { type: 'table', label: '表格', icon: <GripHorizontal size={16} /> },
              { type: 'example', label: '對照', icon: <Layout size={16} /> },
              { type: 'step', label: '流程', icon: <List size={16} /> },
              { type: 'faq', label: '問答', icon: <HelpCircle size={16} /> },
              { type: 'system_step', label: '教學', icon: <MousePointer size={16} /> },
              { type: 'use_case', label: '場景', icon: <CheckCircle size={16} /> }
            ].map(btn => (
              <button 
                key={btn.type}
                onClick={() => addBlock(btn.type)}
                className="flex flex-col items-center gap-2 p-4 bg-white hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50 border border-slate-200 rounded-2xl text-slate-400 transition-all font-black text-[10px] uppercase tracking-widest shadow-sm"
              >
                {btn.icon}
                {btn.label}
              </button>
            ))}
         </div>
      </div>
    </div>
  );
};

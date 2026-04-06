import React from 'react';
import { motion } from 'motion/react';
import { Trash2, Zap, ArrowRight, FileText, Layout, MousePointer, Calendar, GripVertical, MessageSquare, Type, ChevronLeft, X } from 'lucide-react';
import { Article } from './types';

interface BespokeEditorProps {
  currentArticle: Article;
  updateListItem: (listField: string, index: number, field: string, value: any) => void;
  removeListItem: (listField: string, index: number) => void;
  addBespokeSection: (type: string) => void;
}

export const BespokeEditor: React.FC<BespokeEditorProps> = ({
  currentArticle,
  updateListItem,
  removeListItem,
  addBespokeSection
}) => {
  const sections = currentArticle.content.sections || [];

  return (
    <div className="space-y-6">
      {sections.map((section: any, idx: number) => (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-[10px] font-black uppercase tracking-widest border border-brand-100">
                {section.type} SECTION
              </div>
              <span className="text-slate-400 text-xs font-medium">#{idx + 1}</span>
            </div>
            <div className="flex items-center gap-2">
               <button onClick={() => removeListItem('sections', idx)} className="p-2 text-slate-300 hover:text-red-500 rounded-xl transition-all"><Trash2 size={16} /></button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
             {section.type === 'hero' && (
               <>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Main Title</label>
                       <input value={section.title} onChange={e => updateListItem('sections', idx, 'title', e.target.value)} className="w-full bg-slate-50 border-none rounded-xl p-3 text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-100 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Top Tag</label>
                       <input value={section.tag} onChange={e => updateListItem('sections', idx, 'tag', e.target.value)} className="w-full bg-slate-50 border-none rounded-xl p-3 text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-100 outline-none transition-all" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Subtitle</label>
                    <textarea value={section.subtitle} onChange={e => updateListItem('sections', idx, 'subtitle', e.target.value)} className="w-full bg-slate-50 border-none rounded-xl p-3 text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-100 outline-none h-20 transition-all" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Image URL</label>
                    <input value={section.image} onChange={e => updateListItem('sections', idx, 'image', e.target.value)} className="w-full bg-slate-50 border-none rounded-xl p-3 text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-100 outline-none transition-all" />
                 </div>
               </>
             )}

             {section.type === 'marquee' && (
               <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Scrolling Words (Comma separated)</label>
                  <input 
                    value={(section.words || []).join(', ')} 
                    onChange={e => updateListItem('sections', idx, 'words', e.target.value.split(',').map((s: string) => s.trim()))} 
                    className="w-full bg-slate-50 border-none rounded-xl p-3 text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-100 outline-none transition-all" 
                  />
               </div>
             )}

             {(section.type === 'stats' || section.type === 'scrollytelling' || section.type === 'timeline') && (
               <div className="space-y-4">
                  {(section.items || []).map((item: any, itemIdx: number) => (
                    <div key={itemIdx} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-3">
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-slate-400">ITEM #{itemIdx + 1}</span>
                          <button onClick={() => {
                            const newItems = section.items.filter((_: any, i: number) => i !== itemIdx);
                            updateListItem('sections', idx, 'items', newItems);
                          }} className="text-slate-300 hover:text-red-400"><X size={14} /></button>
                       </div>
                       <div className="grid grid-cols-2 gap-3">
                          {section.type === 'stats' && (
                             <>
                               <input placeholder="Label" value={item.label} onChange={e => {
                                  const newItems = [...section.items];
                                  newItems[itemIdx] = { ...item, label: e.target.value };
                                  updateListItem('sections', idx, 'items', newItems);
                               }} className="bg-white border border-slate-100 rounded-lg p-2 text-xs text-slate-900" />
                               <input placeholder="Value" value={item.value} onChange={e => {
                                  const newItems = [...section.items];
                                  newItems[itemIdx] = { ...item, value: e.target.value };
                                  updateListItem('sections', idx, 'items', newItems);
                               }} className="bg-white border border-slate-100 rounded-lg p-2 text-xs text-slate-900" />
                             </>
                          )}
                          {(section.type === 'scrollytelling' || section.type === 'timeline') && (
                             <>
                               <input placeholder={section.type === 'timeline' ? "Date" : "Title"} value={section.type === 'timeline' ? item.date : item.title} onChange={e => {
                                  const newItems = [...section.items];
                                  newItems[itemIdx] = { ...item, [section.type === 'timeline' ? 'date' : 'title']: e.target.value };
                                  updateListItem('sections', idx, 'items', newItems);
                               }} className="bg-white border border-slate-100 rounded-lg p-2 text-xs text-slate-900" />
                               <input placeholder="Image URL" value={item.image} onChange={e => {
                                  const newItems = [...section.items];
                                  newItems[itemIdx] = { ...item, image: e.target.value };
                                  updateListItem('sections', idx, 'items', newItems);
                               }} className="bg-white border border-slate-100 rounded-lg p-2 text-xs text-slate-900" />
                             </>
                          )}
                       </div>
                       <textarea 
                         placeholder={section.type === 'timeline' ? 'Event Description' : 'Content'} 
                         value={item.content} 
                         onChange={e => {
                            const newItems = [...section.items];
                            newItems[itemIdx] = { ...item, content: e.target.value };
                            updateListItem('sections', idx, 'items', newItems);
                         }} 
                         className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-900 h-16" 
                       />
                       {section.type === 'timeline' && (
                          <input placeholder="Title" value={item.title} onChange={e => {
                            const newItems = [...section.items];
                            newItems[itemIdx] = { ...item, title: e.target.value };
                            updateListItem('sections', idx, 'items', newItems);
                          }} className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-900" />
                       )}
                    </div>
                  ))}
                  <button 
                    onClick={() => {
                      const defaultItem = section.type === 'stats' ? { label: '', value: '', description: '' } : 
                                         section.type === 'timeline' ? { date: '', title: '', content: '' } :
                                         { title: '', content: '', image: '' };
                      updateListItem('sections', idx, 'items', [...(section.items || []), defaultItem]);
                    }}
                    className="w-full py-2 border-2 border-dashed border-slate-100 rounded-xl text-[10px] font-black uppercase text-slate-400 tracking-widest hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50 transition-all"
                  >
                    + Add Item
                  </button>
               </div>
             )}

             {section.type === 'quote' && (
               <>
                 <textarea placeholder="Quote Text (HTML supported)" value={section.text} onChange={e => updateListItem('sections', idx, 'text', e.target.value)} className="w-full bg-slate-50 border-none rounded-xl p-3 text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-100 outline-none h-24 transition-all" />
                 <input placeholder="Author" value={section.author} onChange={e => updateListItem('sections', idx, 'author', e.target.value)} className="w-full bg-slate-50 border-none rounded-xl p-3 text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-100 outline-none transition-all" />
               </>
             )}

             {section.type === 'glitch_text' && (
               <>
                 <input placeholder="Main Text" value={section.text} onChange={e => updateListItem('sections', idx, 'text', e.target.value)} className="w-full bg-slate-50 border-none rounded-xl p-3 text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-100 outline-none font-black transition-all" />
                 <input placeholder="Subtitle" value={section.subtitle} onChange={e => updateListItem('sections', idx, 'subtitle', e.target.value)} className="w-full bg-slate-50 border-none rounded-xl p-3 text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-100 outline-none transition-all" />
               </>
             )}

             {section.type === 'comparison' && (
               <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input placeholder="Title" value={section.title} onChange={e => updateListItem('sections', idx, 'title', e.target.value)} className="bg-slate-50 border-none rounded-lg p-2 text-xs text-slate-900" />
                    <input placeholder="Subtitle" value={section.subtitle} onChange={e => updateListItem('sections', idx, 'subtitle', e.target.value)} className="bg-slate-50 border-none rounded-lg p-2 text-xs text-slate-900" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <input value={section.left.title} onChange={e => updateListItem('sections', idx, 'left', { ...section.left, title: e.target.value })} className="w-full bg-red-50 border border-red-100 rounded-lg p-2 text-[10px] font-black text-red-600" />
                        <textarea 
                          placeholder="Items (One per line)" 
                          value={section.left.items.join('\n')} 
                          onChange={e => updateListItem('sections', idx, 'left', { ...section.left, items: e.target.value.split('\n') })} 
                          className="w-full bg-slate-50 border-none rounded-lg p-2 text-xs text-slate-900 h-32" 
                        />
                     </div>
                     <div className="space-y-2">
                        <input value={section.right.title} onChange={e => updateListItem('sections', idx, 'right', { ...section.right, title: e.target.value })} className="w-full bg-emerald-50 border border-emerald-100 rounded-lg p-2 text-[10px] font-black text-emerald-600" />
                        <textarea 
                          placeholder="Items (One per line)" 
                          value={section.right.items.join('\n')} 
                          onChange={e => updateListItem('sections', idx, 'right', { ...section.right, items: e.target.value.split('\n') })} 
                          className="w-full bg-slate-50 border-none rounded-lg p-2 text-xs text-slate-900 h-32" 
                        />
                     </div>
                  </div>
               </div>
             )}

             {section.type === 'feature_card' && (
               <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input placeholder="Title" value={section.title} onChange={e => updateListItem('sections', idx, 'title', e.target.value)} className="bg-slate-50 border-none rounded-lg p-2 text-xs text-slate-900 font-bold" />
                    <input placeholder="Tag" value={section.tag} onChange={e => updateListItem('sections', idx, 'tag', e.target.value)} className="bg-slate-50 border-none rounded-lg p-2 text-xs text-slate-900" />
                  </div>
                  <textarea placeholder="Content Body" value={section.content} onChange={e => updateListItem('sections', idx, 'content', e.target.value)} className="w-full bg-slate-50 border-none rounded-lg p-2 text-xs text-slate-900 h-24" />
                  <div className="grid grid-cols-2 gap-4">
                    <input placeholder="Image URL" value={section.image} onChange={e => updateListItem('sections', idx, 'image', e.target.value)} className="bg-slate-50 border-none rounded-lg p-2 text-xs text-slate-900" />
                    <input placeholder="Button Text" value={section.button_text} onChange={e => updateListItem('sections', idx, 'button_text', e.target.value)} className="bg-slate-50 border-none rounded-lg p-2 text-xs text-slate-900" />
                  </div>
               </div>
             )}

             {section.type === 'footer' && (
               <input placeholder="Footer Text" value={section.text} onChange={e => updateListItem('sections', idx, 'text', e.target.value)} className="w-full bg-slate-50 border-none rounded-xl p-3 text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-100 outline-none transition-all" />
             )}
          </div>
        </motion.div>
      ))}

      <div className="p-8 border-2 border-dashed border-slate-100 rounded-[2.5rem] bg-slate-50/30">
         <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 text-center">Add Bespoke Section Block</h4>
         <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {[
              { type: 'hero', icon: <Zap size={16} /> },
              { type: 'marquee', icon: <ArrowRight size={16} /> },
              { type: 'stats', icon: <FileText size={16} /> },
              { type: 'feature_card', icon: <Layout size={16} /> },
              { type: 'scrollytelling', icon: <MousePointer size={16} /> },
              { type: 'timeline', icon: <Calendar size={16} /> },
              { type: 'comparison', icon: <GripVertical size={16} /> },
              { type: 'quote', icon: <MessageSquare size={16} /> },
              { type: 'glitch_text', icon: <Type size={16} /> },
              { type: 'footer', icon: <ChevronLeft size={16} /> }
            ].map(btn => (
              <button 
                key={btn.type}
                onClick={() => addBespokeSection(btn.type)}
                className="flex flex-col items-center gap-2 p-4 bg-white hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50 border border-slate-200 rounded-2xl text-slate-500 transition-all font-black text-[10px] uppercase tracking-widest shadow-sm"
              >
                {btn.icon}
                {btn.type.replace('_', ' ')}
              </button>
            ))}
         </div>
      </div>
    </div>
  );
};

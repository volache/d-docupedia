import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit2, Trash2, Search, ChevronLeft, Save, X, Eye, FileText, List, Layout, Type, MoreVertical, GripVertical, AlertCircle, Calendar, MousePointer, Image as ImageIcon, MessageSquare, CheckCircle, Info, AlertTriangle, ArrowRight, Lightbulb, HelpCircle, GripHorizontal, Settings, Zap } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { mockCategories, Article } from '../../data';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
import { db, isFirebaseEnabled } from '../../lib/firebase';
import { updateDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { BespokeLayout } from '../../layouts/BespokeLayout';
import { UnifiedLayout } from '../../layouts/UnifiedLayout';
import { useArticleStore } from '../../store/articleStore';
import { CustomSelect } from '../../components/ui/CustomSelect';
import { useUiStore } from '../../store/uiStore';

export const ArticleManager = () => {
  const { articles, addArticle, updateArticle, deleteArticle } = useArticleStore();
  const { showConfirm, showAlert } = useUiStore();
  const [isEditing, setIsEditing] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [editTab, setEditTab] = useState<'edit' | 'preview'>('edit');

  const filteredArticles = articles.filter(a => 
    a.title.includes(searchQuery) || a.summary.includes(searchQuery)
  );

  const handleEdit = (article: any) => {
    setCurrentArticle({ 
      ...article, 
      slug: article.slug || article.title.toLowerCase().replace(/\s+/g, '-'),
      tags: article.tags || [],
      content: article.content || { sections: [], steps: [], faqs: [], use_cases: [], description: '', blocks: [] } 
    });
    setIsEditing(true);
    setEditTab('edit');
  };

  const handleCreateNew = () => {
    const newId = Date.now().toString();
    const newArticle = {
      id: newId,
      title: '新文章標題',
      slug: 'new-article-' + newId,
      summary: '請輸入簡短摘要...',
      category: 'writing',
      article_type: 'guide',
      tags: ['新發佈'],
      content: { blocks: [] },
      updated_at: new Date().toISOString().split('T')[0]
    };
    setCurrentArticle(newArticle);
    setIsEditing(true);
    setEditTab('edit');
  };

  const handleDelete = async (id: string) => {
    if (await showConfirm('確定要刪除這篇文章嗎？此動作無法復原。')) {
      if (isFirebaseEnabled && db) {
        try {
          await deleteDoc(doc(db, 'articles', id));
          // Firebase 刪除後本地狀態更新由 listener 處理或手動更新
          deleteArticle(id);
        } catch (error) {
          await showAlert("刪除失敗");
        }
      } else {
        deleteArticle(id);
      }
    }
  };

  const handleBackToList = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (await showConfirm('確定要離開嗎？未儲存的變更將會遺失。')) {
      setIsEditing(false);
      setCurrentArticle(null);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const dataToSave = {
      ...currentArticle,
      updated_at: new Date().toISOString().split('T')[0]
    };

    if (isFirebaseEnabled && db) {
       try {
         const { id, ...data } = dataToSave;
         if (articles.find(a => a.id === id)) {
           await updateDoc(doc(db, 'articles', id), data);
           updateArticle(dataToSave);
         } else {
           await setDoc(doc(db, 'articles', id), { ...data, views: 0 });
           addArticle({ ...dataToSave, views: 0 });
         }
         setIsEditing(false);
       } catch (error) {
         await showAlert("儲存失敗");
       }
    } else {
      if (articles.find(a => a.id === dataToSave.id)) {
        updateArticle(dataToSave);
      } else {
        addArticle(dataToSave);
      }
      setIsEditing(false);
    }
    setIsSaving(false);
    setCurrentArticle(null);
  };

  // Helper functions for content updates
  const updateContentField = (field: string, value: any) => {
    setCurrentArticle((prev: any) => ({
      ...prev,
      content: { ...prev.content, [field]: value }
    }));
  };

  const updateListItem = (listField: string, index: number, field: string, value: any) => {
    setCurrentArticle((prev: any) => {
      const newList = [...(prev.content[listField] || [])];
      newList[index] = { ...newList[index], [field]: value };
      return {
        ...prev,
        content: { ...prev.content, [listField]: newList }
      };
    });
  };

  const addListItem = (listField: string, defaultValue: any) => {
    setCurrentArticle((prev: any) => ({
      ...prev,
      content: { 
        ...prev.content, 
        [listField]: [...(prev.content[listField] || []), defaultValue] 
      }
    }));
  };

  const removeListItem = (listField: string, index: number) => {
    setCurrentArticle((prev: any) => ({
      ...prev,
      content: { 
        ...prev.content, 
        [listField]: (prev.content[listField] || []).filter((_: any, i: number) => i !== index)
      }
    }));
  };

  // Universal Block Helpers
  const addBlock = (type: string) => {
    let newBlock: any = { type };
    if (type === 'text' || type === 'summary') newBlock.content = '';
    if (type === 'callout') { newBlock.style = 'tip'; newBlock.title = ''; newBlock.content = ''; }
    if (type === 'example') { newBlock.title = ''; newBlock.items = [{ label: '正確', content: '', variant: 'success' }, { label: '錯誤', content: '', variant: 'error' }]; }
    if (type === 'step') { newBlock.title = ''; newBlock.description = ''; newBlock.pro_tip = ''; newBlock.icon = 'Zap'; }
    if (type === 'system_step') { newBlock.title = ''; newBlock.description = ''; newBlock.action = ''; newBlock.image_url = ''; }
    if (type === 'faq') { newBlock.question = ''; newBlock.answer = ''; }
    if (type === 'use_case') { newBlock.content = ''; }
    if (type === 'table') { newBlock.headers = ['標題 1', '標題 2']; newBlock.rows = [['', '']]; }
    
    addListItem('blocks', newBlock);
  };

  const updateBlock = (index: number, field: string, value: any) => {
    updateListItem('blocks', index, field, value);
  };

  const updateBlockMultiple = (blockIdx: number, updates: Record<string, any>) => {
    setCurrentArticle((prev: any) => {
      const newBlocks = [...(prev.content.blocks || [])];
      newBlocks[blockIdx] = { ...newBlocks[blockIdx], ...updates };
      return {
        ...prev,
        content: { ...prev.content, blocks: newBlocks }
      };
    });
  };

  // Bespoke Section Helpers
  const addBespokeSection = (type: string) => {
    let newSection: any = { type };
    if (type === 'hero') { newSection.title = ''; newSection.subtitle = ''; newSection.image = ''; newSection.tag = ''; }
    if (type === 'marquee') { newSection.words = ['DATA', 'DIGITAL', 'FUTURE']; }
    if (type === 'stats') { newSection.items = [{ label: '', value: '', description: '' }]; }
    if (type === 'feature_card') { newSection.title = ''; newSection.content = ''; newSection.image = ''; newSection.tag = ''; newSection.button_text = ''; }
    if (type === 'scrollytelling') { newSection.items = [{ title: '', content: '', image: '' }]; }
    if (type === 'timeline') { newSection.items = [{ date: '', title: '', content: '' }]; }
    if (type === 'quote') { newSection.text = ''; newSection.author = ''; }
    if (type === 'glitch_text') { newSection.text = ''; newSection.subtitle = ''; }
    if (type === 'comparison') { 
      newSection.title = ''; 
      newSection.subtitle = ''; 
      newSection.left = { title: 'Old Paradigm', items: [''] }; 
      newSection.right = { title: 'Modern Approach', items: [''] }; 
    }
    if (type === 'footer') { newSection.text = ''; }
    
    addListItem('sections', newSection);
  };

  const renderBespokeEditor = () => (
    <div className="space-y-6">
      {(currentArticle.content.sections || []).map((section: any, idx: number) => (
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
                         value={section.type === 'timeline' ? item.content : item.content} 
                         onChange={e => {
                            const newItems = [...section.items];
                            newItems[itemIdx] = { ...item, content: e.target.value };
                            updateListItem('sections', idx, 'items', newItems);
                         }} 
                         className="w-full bg-white border border-slate-100 rounded-lg p-2 text-xs text-slate-900 h-16" 
                       />
                       {section.type === 'timeline' && (
                          <input placeholder="Title" value={item.title} onChange={e => {
                            const newItems = [...section.items];
                            newItems[itemIdx] = { ...item, title: e.target.value };
                            updateListItem('sections', idx, 'items', newItems);
                          }} className="w-full bg-white border border-slate-100 rounded-lg p-2 text-xs text-slate-900" />
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
                  <CustomSelect 
                    value={section.variant || 'default'}
                    onChange={val => updateListItem('sections', idx, 'variant', val)}
                    options={[
                      { value: 'default', label: 'Default (Image Left)' },
                      { value: 'reverse', label: 'Reverse (Image Right)' }
                    ]}
                    size="sm"
                  />
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

  const renderUniversalEditor = () => (
    <div className="space-y-6">
      {(currentArticle.content.blocks || []).map((block: any, idx: number) => (
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
                  {/* Softer Table Config Bar */}
                  <div className="flex flex-wrap justify-between items-center bg-white p-5 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-100 flex-shrink-0">
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

  const renderEditor = () => {
    if (currentArticle.article_type === 'bespoke') return renderBespokeEditor();
    return renderUniversalEditor();
  };

  const addTag = (tag: string) => {
    if (tag && !currentArticle.tags.includes(tag)) {
      setCurrentArticle({ ...currentArticle, tags: [...currentArticle.tags, tag] });
    }
  };

  const removeTag = (tagToRemove: string) => {
    setCurrentArticle({ ...currentArticle, tags: currentArticle.tags.filter((t: string) => t !== tagToRemove) });
  };

  const renderPreview = () => {
     if (!currentArticle || !currentArticle.content) return null;
     if (currentArticle.article_type === 'bespoke') {
        return <BespokeLayout content={currentArticle.content} />;
     }
     return <UnifiedLayout content={currentArticle.content} />;
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {!isEditing ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="list" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">文章管理</h2>
                <p className="text-slate-500 text-sm">維護全站知識庫所有教學內容</p>
              </div>
              <button onClick={handleCreateNew} className="bg-brand-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-brand-700 shadow-lg shadow-brand-600/20">
                <Plus size={20} /> 新增指南
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
               <Search size={18} className="text-slate-400 ml-2" />
               <input 
                 type="text" 
                 placeholder="搜尋文章..." 
                 value={searchQuery}
                 onChange={e => setSearchQuery(e.target.value)}
                 className="flex-1 bg-transparent border-none outline-none text-sm"
               />
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
               <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                     <tr>
                        <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">文章標題</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">知識分類</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">類型</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest text-right">操作</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {filteredArticles.map(article => (
                       <tr key={article.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-4">
                             <div className="font-bold text-slate-900">{article.title}</div>
                             <div className="text-[10px] text-slate-400 font-mono mt-0.5">{article.slug}</div>
                          </td>
                          <td className="px-6 py-4">
                             <span className="bg-brand-50 text-brand-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                {mockCategories.find(c => c.slug === article.category)?.name || article.category}
                             </span>
                          </td>
                          <td className="px-6 py-4">
                             <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest bg-slate-100 px-2 py-1 rounded">
                                {article.article_type}
                             </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                             <div className="flex justify-end gap-2">
                                <button onClick={() => handleEdit(article)} className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all">
                                   <Edit2 size={18} />
                                </button>
                                <button onClick={() => handleDelete(article.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                                   <Trash2 size={18} />
                                </button>
                             </div>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} key="edit" className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-16 z-40 bg-slate-50/80 backdrop-blur-md py-4 border-b border-transparent transition-all">
              <button onClick={handleBackToList} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-all bg-white/50 px-3 py-2 rounded-xl hover:bg-white">
                <ChevronLeft size={20} /> 返回列表
              </button>
              
              <div className="flex items-center bg-slate-100 p-1 rounded-xl shadow-inner shrink-0">
                 <button 
                   onClick={() => setEditTab('edit')}
                   className={`px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${editTab === 'edit' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                   <Edit2 size={16} /> 編輯模式
                 </button>
                 <button 
                   onClick={() => setEditTab('preview')}
                   className={`px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${editTab === 'preview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                   <Eye size={16} /> 即時預覽
                 </button>
              </div>

              <div className="flex gap-2">
                 <button 
                   disabled={isSaving}
                   onClick={handleSave}
                   className="bg-brand-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-brand-700 shadow-lg shadow-brand-600/20 disabled:opacity-50"
                 >
                   {isSaving ? <X className="animate-spin" size={18} /> : <Save size={18} />}
                   {isSaving ? '儲存中...' : '儲存正式版'}
                 </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {editTab === 'edit' ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="editor" className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                       <section className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
                          <h4 className="flex items-center gap-2 font-bold text-slate-400 text-xs uppercase tracking-widest"><Type size={14} /> 基礎資訊</h4>
                          <input 
                            type="text" 
                            placeholder="文章標題"
                            value={currentArticle.title}
                            onChange={e => setCurrentArticle({...currentArticle, title: e.target.value})}
                            className="w-full text-2xl font-black bg-slate-50 border-none rounded-2xl p-4 focus:bg-white focus:ring-4 focus:ring-brand-50 outline-none transition-all placeholder:text-slate-200"
                          />
                          <textarea 
                            rows={2}
                            placeholder="簡短摘要描述..."
                            value={currentArticle.summary}
                            onChange={e => setCurrentArticle({...currentArticle, summary: e.target.value})}
                            className="w-full text-sm bg-slate-50 border-none rounded-2xl p-4 focus:bg-white focus:ring-4 focus:ring-brand-50 outline-none transition-all resize-none placeholder:text-slate-200"
                          />
                       </section>

                       <section className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
                          <h4 className="flex items-center gap-2 font-bold text-slate-400 text-xs uppercase tracking-widest"><Zap size={14} /> 行銷包裝 (首頁 Hero 專用)</h4>
                          <div className="space-y-4">
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">首頁推廣金句 (Promo Title)</label>
                              <input 
                                type="text" 
                                placeholder="例如：主旨撰寫要有力，「動詞＋內容」最清晰。"
                                value={currentArticle.promo_title || ''}
                                onChange={e => setCurrentArticle({...currentArticle, promo_title: e.target.value})}
                                className="w-full text-lg font-bold bg-slate-50 border-none rounded-xl p-4 focus:bg-white focus:ring-4 focus:ring-brand-50 outline-none transition-all"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">首頁推廣引言 (Promo Description)</label>
                              <textarea 
                                rows={2}
                                placeholder="描述為何這篇文章值得在首頁推薦..."
                                value={currentArticle.promo_description || ''}
                                onChange={e => setCurrentArticle({...currentArticle, promo_description: e.target.value})}
                                className="w-full text-sm bg-slate-50 border-none rounded-xl p-4 focus:bg-white focus:ring-4 focus:ring-brand-50 outline-none transition-all resize-none"
                              />
                            </div>
                          </div>
                       </section>

                       <section className="space-y-4">
                          <div className="flex items-center justify-between px-2">
                             <h4 className="flex items-center gap-2 font-bold text-slate-400 text-xs uppercase tracking-widest">
                               {currentArticle.article_type === 'guide' ? <Layout size={14} /> : <List size={14} />} 
                               內容架構模組 (專屬：{currentArticle.article_type.toUpperCase()})
                             </h4>
                          </div>

                          <div className="space-y-4">
                            {renderEditor()}
                          </div>
                       </section>
                    </div>

                     <div className="lg:col-span-1">
                        <aside className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/40 flex flex-col gap-8 sticky top-40 transition-all duration-500">
                           <div className="flex items-center gap-2 text-slate-400">
                              <Settings size={16} />
                              <h4 className="font-black text-slate-900 text-lg uppercase tracking-tight">發佈設定</h4>
                           </div>
                           <div className="h-px bg-slate-100 w-full" />
                          
                          <div className="space-y-3">
                             <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">網址代稱 (Slug)</label>
                             <input 
                               type="text" 
                               value={currentArticle.slug}
                               onChange={e => setCurrentArticle({...currentArticle, slug: e.target.value})}
                               placeholder="url-friendly-slug"
                               className="w-full bg-slate-50 p-3 rounded-xl text-xs font-mono outline-none border border-slate-100 focus:bg-white focus:border-brand-200 transition-all"
                             />
                          </div>

                          <div className="space-y-3">
                             <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">文章佈局類型</label>
                             <CustomSelect 
                               value={currentArticle.article_type}
                               onChange={val => {
                                  const type = val as any;
                                  let newContent = { ...currentArticle.content };
                                  if (type !== 'bespoke' && !newContent.blocks) newContent.blocks = [];
                                  if (type === 'bespoke' && !newContent.sections) newContent.sections = [];
                                  
                                  setCurrentArticle({...currentArticle, article_type: type, content: newContent});
                               }}
                               options={[
                                 { value: 'guide', label: '行政指南 (Guide)' },
                                 { value: 'workflow', label: '標準流程 (Workflow)' },
                                 { value: 'faq', label: '常見問題 (FAQ)' },
                                 { value: 'example', label: '範例對照 (Example)' },
                                 { value: 'system_tutorial', label: '系統教學 (Tutorial)' },
                                 { value: 'bespoke', label: '視覺特輯 (Bespoke)' }
                               ]}
                             />
                          </div>

                          <div className="space-y-3">
                             <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">文章分類</label>
                             <CustomSelect 
                               value={currentArticle.category}
                               onChange={val => setCurrentArticle({...currentArticle, category: val})}
                               options={mockCategories.map(c => ({ value: c.slug, label: c.name }))}
                             />
                          </div>

                          <div className="space-y-3">
                             <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">標籤關鍵字</label>
                             <div className="flex flex-wrap gap-2 mb-2">
                               {currentArticle.tags.map((tag: string) => (
                                 <span key={tag} className="bg-slate-100 text-slate-600 px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1">
                                   {tag}
                                   <button onClick={() => removeTag(tag)} className="hover:text-red-500"><X size={10} /></button>
                                 </span>
                               ))}
                             </div>
                             <input 
                               type="text" 
                               placeholder="輸入標籤後按 Enter..."
                               onKeyDown={e => {
                                 if (e.key === 'Enter') {
                                   e.preventDefault();
                                   addTag((e.target as HTMLInputElement).value);
                                   (e.target as HTMLInputElement).value = '';
                                 }
                               }}
                               className="w-full bg-slate-50 p-3 rounded-xl text-xs outline-none border border-slate-100 focus:bg-white focus:border-brand-200 transition-all"
                             />
                          </div>

                          <div className="flex gap-3 p-4 bg-brand-50/50 rounded-2xl border border-brand-100">
                             <AlertCircle size={18} className="text-brand-500 shrink-0" />
                             <p className="text-[10px] text-brand-700 leading-relaxed font-medium">切換佈局會保留已有內容，但預覽時僅會顯示對應類型的資料欄位。</p>
                          </div>
                       </aside>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} key="preview" className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden p-8 sm:p-12 min-h-[600px]">
                   <div className="max-w-4xl mx-auto">
                      <div className="flex flex-wrap items-center gap-3 mb-6">
                        <span className="bg-brand-100 text-brand-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          PREVIEW
                        </span>
                        <div className="flex items-center gap-1.5 text-slate-400 text-xs uppercase font-bold tracking-widest">
                          <Calendar size={14} /> {currentArticle.updated_at}
                        </div>
                      </div>
                      <h1 className="text-4xl font-black text-slate-900 mb-6">{currentArticle.title}</h1>
                      <p className="text-lg text-slate-500 mb-10 pb-8 border-b border-slate-100">{currentArticle.summary}</p>
                      
                      {renderPreview()}
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


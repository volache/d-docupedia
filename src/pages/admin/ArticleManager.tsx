import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit2, Trash2, Search, ChevronLeft, Save, X, Eye, FileText, List, Layout, Type, MoreVertical, GripVertical, AlertCircle, Calendar, MousePointer, Image as ImageIcon, MessageSquare, CheckCircle, Info, AlertTriangle, ArrowRight, Lightbulb, Zap } from 'lucide-react';
import { mockCategories, Article } from '../../data';
import { db, isFirebaseEnabled } from '../../lib/firebase';
import { updateDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { GuideLayout } from '../../layouts/GuideLayout';
import { WorkflowLayout } from '../../layouts/WorkflowLayout';
import { FaqLayout } from '../../layouts/FaqLayout';
import { ExampleLayout } from '../../layouts/ExampleLayout';
import { SystemTutorialLayout } from '../../layouts/SystemTutorialLayout';
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
    setCurrentArticle({ 
      ...currentArticle, 
      content: { ...currentArticle.content, [field]: value } 
    });
  };

  const updateListItem = (listField: string, index: number, field: string, value: any) => {
    const newList = [...(currentArticle.content[listField] || [])];
    newList[index] = { ...newList[index], [field]: value };
    updateContentField(listField, newList);
  };

  const addListItem = (listField: string, defaultValue: any) => {
    const newList = [...(currentArticle.content[listField] || []), defaultValue];
    updateContentField(listField, newList);
  };

  const removeListItem = (listField: string, index: number) => {
    const newList = currentArticle.content[listField].filter((_: any, i: number) => i !== index);
    updateContentField(listField, newList);
  };

  // Guide Block Helpers
  const addGuideBlock = (type: 'text' | 'callout' | 'example' | 'summary') => {
    let newBlock: any = { type };
    if (type === 'text' || type === 'summary') newBlock.content = '';
    if (type === 'callout') { newBlock.style = 'tip'; newBlock.title = ''; newBlock.content = ''; }
    if (type === 'example') { newBlock.title = ''; newBlock.items = [{ label: '正確', content: '', variant: 'success' }, { label: '錯誤', content: '', variant: 'error' }]; }
    
    addListItem('blocks', newBlock);
  };

  const updateGuideBlock = (index: number, field: string, value: any) => {
    updateListItem('blocks', index, field, value);
  };

  const renderGuideEditor = () => (
    <div className="space-y-6">
      {(currentArticle.content.blocks || []).map((block: any, idx: number) => (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 group relative">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded">
                {block.type} BLOCK
              </span>
            </div>
            <button onClick={() => removeListItem('blocks', idx)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
          </div>

          {block.type === 'text' || block.type === 'summary' ? (
            <textarea 
              rows={4}
              placeholder={block.type === 'summary' ? "內容精華摘要..." : "輸入內文內容，支援 Markdown..."}
              value={block.content}
              onChange={e => updateGuideBlock(idx, 'content', e.target.value)}
              className="w-full text-sm bg-slate-50 border-none rounded-xl p-4 focus:bg-white outline-none resize-none transition-all"
            />
          ) : block.type === 'callout' ? (
            <div className="space-y-3">
              <div className="flex gap-4">
                <CustomSelect 
                  value={block.style}
                  onChange={val => updateGuideBlock(idx, 'style', val)}
                  options={[
                    { value: 'tip', label: 'TIP (建議)' },
                    { value: 'info', label: 'INFO (說明)' },
                    { value: 'warning', label: 'WARNING (警告)' }
                  ]}
                  size="sm"
                />
                <input 
                  type="text" 
                  placeholder="標題 (可不填)"
                  value={block.title}
                  onChange={e => updateGuideBlock(idx, 'title', e.target.value)}
                  className="flex-1 bg-slate-50 border-none rounded-lg p-2 text-xs focus:bg-white outline-none font-bold"
                />
              </div>
              <textarea 
                rows={3}
                placeholder="重點提示內容..."
                value={block.content}
                onChange={e => updateGuideBlock(idx, 'content', e.target.value)}
                className="w-full text-sm bg-slate-50 border-none rounded-xl p-4 focus:bg-white outline-none resize-none transition-all"
              />
            </div>
          ) : block.type === 'example' ? (
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="對比範例標題"
                value={block.title}
                onChange={e => updateGuideBlock(idx, 'title', e.target.value)}
                className="w-full bg-slate-50 border-none rounded-lg p-2 text-sm focus:bg-white outline-none font-bold"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {block.items.map((item: any, itemIdx: number) => (
                  <div key={itemIdx} className={`p-4 rounded-2xl border ${item.variant === 'success' ? 'bg-emerald-50/30 border-emerald-100' : 'bg-red-50/30 border-red-100'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded text-white ${item.variant === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}>
                        {item.label}
                      </span>
                    </div>
                    <textarea 
                      rows={3}
                      value={item.content}
                      onChange={e => {
                        const newItems = [...block.items];
                        newItems[itemIdx] = { ...item, content: e.target.value };
                        updateGuideBlock(idx, 'items', newItems);
                      }}
                      className="w-full text-xs bg-white/50 border-none rounded-lg p-2 focus:bg-white outline-none resize-none transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </motion.div>
      ))}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { type: 'text', label: '純文字區塊', icon: <FileText size={16} /> },
          { type: 'summary', label: '精華摘要', icon: <Lightbulb size={16} /> },
          { type: 'callout', label: '重點提示', icon: <MessageSquare size={16} /> },
          { type: 'example', label: '正誤範例', icon: <CheckCircle size={16} /> }
        ].map(btn => (
          <button 
            key={btn.type}
            onClick={() => addGuideBlock(btn.type as any)}
            className="p-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50 transition-all flex flex-col items-center gap-2"
          >
            {btn.icon}
            <span className="text-[10px] font-black uppercase tracking-widest">{btn.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderWorkflowEditor = () => (
    <div className="space-y-4">
      {(currentArticle.content.steps || []).map((step: any, idx: number) => (
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-xs shadow-md shadow-slate-900/10">{idx + 1}</div>
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">流程步驟 Milestone</span>
            </div>
            <button onClick={() => removeListItem('steps', idx)} className="text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="步驟標題"
              value={step.title}
              onChange={e => updateListItem('steps', idx, 'title', e.target.value)}
              className="w-full font-bold bg-slate-50 border-none rounded-xl p-3 text-sm focus:bg-white outline-none transition-all"
            />
            <input 
              type="text" 
              placeholder="圖片 URL (選填)"
              value={step.image_url}
              onChange={e => updateListItem('steps', idx, 'image_url', e.target.value)}
              className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm focus:bg-white outline-none transition-all"
            />
          </div>
          <textarea 
            rows={2}
            placeholder="操作說明細節..."
            value={step.description}
            onChange={e => updateListItem('steps', idx, 'description', e.target.value)}
            className="w-full text-sm bg-slate-50 border-none rounded-xl p-3 focus:bg-white outline-none resize-none transition-all"
          />
          <div className="flex items-center gap-2 bg-brand-50 p-3 rounded-xl border border-brand-100">
            <Lightbulb size={14} className="text-brand-500" />
            <input 
              type="text" 
              placeholder="專業建議 (Pro Tip)..."
              value={step.pro_tip}
              onChange={e => updateListItem('steps', idx, 'pro_tip', e.target.value)}
              className="flex-1 bg-transparent border-none text-xs font-bold text-brand-700 outline-none placeholder:text-brand-300"
            />
          </div>
        </motion.div>
      ))}
      <button onClick={() => addListItem('steps', { title: '', description: '', pro_tip: '', image_url: '' })} className="w-full py-4 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 font-bold hover:border-brand-300 hover:text-brand-500 transition-all flex items-center justify-center gap-2">
        <Plus size={18} /> 新增流程步驟
      </button>
    </div>
  );

  const renderTutorialEditor = () => (
    <div className="space-y-4">
      {(currentArticle.content.steps || []).map((step: any, idx: number) => (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">操作步驟 #{idx + 1}</span>
            <button onClick={() => removeListItem('steps', idx)} className="text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>
          </div>
          <div className="flex gap-4">
            <div className="flex-1 space-y-4">
              <input 
                type="text" 
                placeholder="步驟標題"
                value={step.title}
                onChange={e => updateListItem('steps', idx, 'title', e.target.value)}
                className="w-full font-bold bg-slate-50 border-none rounded-xl p-3 text-sm focus:bg-white outline-none transition-all"
              />
              <textarea 
                rows={2}
                placeholder="步驟詳細描述..."
                value={step.description}
                onChange={e => updateListItem('steps', idx, 'description', e.target.value)}
                className="w-full text-sm bg-slate-50 border-none rounded-xl p-3 focus:bg-white outline-none resize-none transition-all"
              />
            </div>
            <div className="w-32 h-32 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-slate-300 gap-2 text-[10px] font-bold">
               {step.image_url ? <img src={step.image_url} className="w-full h-full object-cover rounded-2xl" /> : <><ImageIcon size={24} /> 媒體預覽</>}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-slate-900 p-3 rounded-xl border border-slate-800">
              <MousePointer size={16} className="text-brand-400" />
              <input 
                type="text" 
                placeholder="點擊位置 (如: 點擊「儲存」按鈕)"
                value={step.action}
                onChange={e => updateListItem('steps', idx, 'action', e.target.value)}
                className="flex-1 bg-transparent border-none text-xs font-bold text-white outline-none placeholder:text-slate-500"
              />
            </div>
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <ImageIcon size={16} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="截圖/影片 URL"
                value={step.image_url}
                onChange={e => updateListItem('steps', idx, 'image_url', e.target.value)}
                className="flex-1 bg-transparent border-none text-xs font-bold text-slate-600 outline-none placeholder:text-slate-300"
              />
            </div>
          </div>
        </motion.div>
      ))}
      <button onClick={() => addListItem('steps', { title: '', description: '', action: '', image_url: '' })} className="w-full py-4 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 font-bold hover:border-brand-300 hover:text-brand-500 transition-all flex items-center justify-center gap-2">
        <Plus size={18} /> 新增教學步驟
      </button>
    </div>
  );

  const renderEditor = () => {
    switch (currentArticle.article_type) {
      case 'guide': return renderGuideEditor();
      case 'workflow': return renderWorkflowEditor();
      case 'system_tutorial': return renderTutorialEditor();
      case 'faq':
        return (
          <div className="space-y-4">
            {(currentArticle.content.faqs || []).map((faq: any, idx: number) => (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">常見問題 Q&A #{idx + 1}</span>
                  <button onClick={() => removeListItem('faqs', idx)} className="text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>
                </div>
                <input 
                  type="text" 
                  placeholder="輸入問題內容..."
                  value={faq.question}
                  onChange={e => updateListItem('faqs', idx, 'question', e.target.value)}
                  className="w-full font-bold bg-slate-50 border-none rounded-xl p-3 text-sm focus:bg-white outline-none transition-all"
                />
                <textarea 
                  rows={3}
                  placeholder="輸入詳細解答..."
                  value={faq.answer}
                  onChange={e => updateListItem('faqs', idx, 'answer', e.target.value)}
                  className="w-full text-sm bg-slate-50 border-none rounded-xl p-3 focus:bg-white outline-none resize-none transition-all"
                />
              </motion.div>
            ))}
            <button onClick={() => addListItem('faqs', { question: '', answer: '' })} className="w-full py-4 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 font-bold hover:border-brand-300 hover:text-brand-500 transition-all flex items-center justify-center gap-2">
              <Plus size={18} /> 新增問答項目
            </button>
          </div>
        );
      case 'example':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">範例使用說明</label>
              <textarea 
                rows={4}
                placeholder="描述此範例的用途與重要性..."
                value={currentArticle.content.description}
                onChange={e => updateContentField('description', e.target.value)}
                className="w-full text-sm bg-slate-50 border-none rounded-xl p-4 focus:bg-white outline-none resize-none transition-all"
              />
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">適用場景 (Use Cases)</label>
                <button onClick={() => addListItem('use_cases', '')} className="text-brand-600 font-bold text-xs flex items-center gap-1 hover:bg-brand-50 px-2 py-1 rounded-lg transition-all">
                  <Plus size={14} /> 新增場景
                </button>
              </div>
              <div className="space-y-2">
                {(currentArticle.content.use_cases || []).map((uc: string, idx: number) => (
                  <div key={idx} className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="例如：對外正式公文簽辦時..."
                      value={uc}
                      onChange={e => {
                        const newList = [...currentArticle.content.use_cases];
                        newList[idx] = e.target.value;
                        updateContentField('use_cases', newList);
                      }}
                      className="flex-1 text-sm bg-slate-50 border-none rounded-xl p-3 focus:bg-white outline-none transition-all"
                    />
                    <button onClick={() => removeListItem('use_cases', idx)} className="text-slate-300 hover:text-red-500 p-2"><X size={16} /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default: return null;
    }
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
     switch (currentArticle.article_type) {
        case 'guide': return <GuideLayout content={currentArticle.content} />;
        case 'workflow': return <WorkflowLayout content={currentArticle.content} />;
        case 'faq': return <FaqLayout content={currentArticle.content} />;
        case 'example': return <ExampleLayout content={currentArticle.content} />;
        case 'system_tutorial': return <SystemTutorialLayout content={currentArticle.content} />;
        default: return <div className="text-center py-20 text-slate-400">目前類型的預覽尚未實作</div>;
     }
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-50">
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

                    <div className="lg:col-span-1 space-y-6">
                       <aside className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-8 sticky top-6">
                          <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-4 text-lg">發佈設定</h4>
                          
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
                                  if (type === 'guide' && !newContent.blocks) newContent.blocks = [];
                                  if (type === 'workflow' && !newContent.steps) newContent.steps = [];
                                  if (type === 'faq' && !newContent.faqs) newContent.faqs = [];
                                  if (type === 'example' && !newContent.use_cases) { newContent.use_cases = []; newContent.description = ''; }
                                  if (type === 'system_tutorial' && !newContent.steps) newContent.steps = [];
                                  
                                  setCurrentArticle({...currentArticle, article_type: type, content: newContent});
                               }}
                               options={[
                                 { value: 'guide', label: '行政指南 (Guide)' },
                                 { value: 'workflow', label: '標準流程 (Workflow)' },
                                 { value: 'faq', label: '常見問題 (FAQ)' },
                                 { value: 'example', label: '範例對照 (Example)' },
                                 { value: 'system_tutorial', label: '系統教學 (Tutorial)' }
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


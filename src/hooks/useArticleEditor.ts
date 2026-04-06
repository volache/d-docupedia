import { useState } from 'react';
import { db, isFirebaseEnabled } from '../lib/firebase';
import { updateDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { useArticleStore } from '../store/articleStore';
import { useUiStore } from '../store/uiStore';
import { Article, ArticleContentBlock, BespokeSection } from '../components/admin/article-editor/types';

export const useArticleEditor = () => {
  const { articles, addArticle, updateArticle, deleteArticle } = useArticleStore();
  const { showConfirm, showAlert } = useUiStore();
  const [isEditing, setIsEditing] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [editTab, setEditTab] = useState<'edit' | 'preview'>('edit');

  const filteredArticles = articles.filter(a => 
    a.title.includes(searchQuery) || a.summary.includes(searchQuery)
  );

  const handleEdit = (article: Article) => {
    setCurrentArticle({ 
      ...article, 
      slug: article.slug || article.title.toLowerCase().replace(/\s+/g, '-'),
      tags: article.tags || [],
      content: {
        blocks: article.content.blocks || [],
        sections: article.content.sections || []
      }
    });
    setIsEditing(true);
    setEditTab('edit');
  };

  const handleCreateNew = () => {
    const newId = Date.now().toString();
    const newArticle: Article = {
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
    if (!currentArticle) return;
    setIsSaving(true);
    const dataToSave = {
      ...currentArticle,
      updated_at: new Date().toISOString().split('T')[0]
    };

    if (isFirebaseEnabled && db) {
       try {
         const { id, ...data } = dataToSave;
         if (articles.find(a => a.id === id)) {
           await updateDoc(doc(db, 'articles', id), data as any);
           // 不需要手動 updateArticle(dataToSave)，由 onSnapshot 處理
         } else {
           await setDoc(doc(db, 'articles', id), { ...data, views: 0 } as any);
           // 不需要手動 addArticle(...)，由 onSnapshot 處理
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

  const updateArticleField = (updates: Partial<Article>) => {
    setCurrentArticle(prev => prev ? { ...prev, ...updates } : null);
  };

  const updateContentField = (field: string, value: any) => {
    setCurrentArticle((prev: any) => {
      if (!prev) return null;
      return {
        ...prev,
        content: { ...prev.content, [field]: value }
      };
    });
  };

  const updateListItem = (listField: string, index: number, field: string, value: any) => {
    setCurrentArticle((prev: any) => {
      if (!prev) return null;
      const newList = [...(prev.content[listField] || [])];
      newList[index] = { ...newList[index], [field]: value };
      return {
        ...prev,
        content: { ...prev.content, [listField]: newList }
      };
    });
  };

  const addListItem = (listField: string, defaultValue: any) => {
    setCurrentArticle((prev: any) => {
      if (!prev) return null;
      return {
        ...prev,
        content: { 
          ...prev.content, 
          [listField]: [...(prev.content[listField] || []), defaultValue] 
        }
      };
    });
  };

  const removeListItem = (listField: string, index: number) => {
    setCurrentArticle((prev: any) => {
      if (!prev) return null;
      return {
        ...prev,
        content: { 
          ...prev.content, 
          [listField]: (prev.content[listField] || []).filter((_: any, i: number) => i !== index)
        }
      };
    });
  };

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
      if (!prev) return null;
      const newBlocks = [...(prev.content.blocks || [])];
      newBlocks[blockIdx] = { ...newBlocks[blockIdx], ...updates };
      return {
        ...prev,
        content: { ...prev.content, blocks: newBlocks }
      };
    });
  };

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

  return {
    articles,
    filteredArticles,
    isEditing,
    currentArticle,
    searchQuery,
    isSaving,
    editTab,
    setSearchQuery,
    setEditTab,
    handleEdit,
    handleCreateNew,
    handleDelete,
    handleBackToList,
    handleSave,
    updateArticleField,
    updateContentField,
    updateListItem,
    addListItem,
    removeListItem,
    addBlock,
    updateBlock,
    updateBlockMultiple,
    addBespokeSection
  };
};

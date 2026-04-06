import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Type, Layout, List, Calendar, Zap } from 'lucide-react';
import { useTitle } from '../../hooks/useTitle';
import { useArticleEditor } from '../../hooks/useArticleEditor';
import { ArticleList } from '../../components/admin/article-editor/ArticleList';
import { EditorHeader } from '../../components/admin/article-editor/EditorHeader';
import { EditorSidebar } from '../../components/admin/article-editor/EditorSidebar';
import { UniversalEditor } from '../../components/admin/article-editor/UniversalEditor';
import { BespokeEditor } from '../../components/admin/article-editor/BespokeEditor';
import { BespokeLayout } from '../../layouts/BespokeLayout';
import { UnifiedLayout } from '../../layouts/UnifiedLayout';

export const ArticleManager = () => {
  useTitle('文章管理');
  const {
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
    updateListItem,
    removeListItem,
    addBlock,
    updateBlock,
    updateBlockMultiple,
    addBespokeSection
  } = useArticleEditor();

  const renderEditor = () => {
    if (!currentArticle) return null;
    if (currentArticle.article_type === 'bespoke') {
      return (
        <BespokeEditor
          currentArticle={currentArticle}
          updateListItem={updateListItem}
          removeListItem={removeListItem}
          addBespokeSection={addBespokeSection}
        />
      );
    }
    return (
      <UniversalEditor
        currentArticle={currentArticle}
        updateBlock={updateBlock}
        removeListItem={removeListItem}
        addBlock={addBlock}
        updateBlockMultiple={updateBlockMultiple}
      />
    );
  };

  const renderPreview = () => {
    if (!currentArticle || !currentArticle.content) return null;
    if (currentArticle.article_type === 'bespoke') {
      return <BespokeLayout content={currentArticle.content as any} />;
    }
    return <UnifiedLayout content={currentArticle.content as any} />;
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {!isEditing ? (
          <ArticleList
            articles={filteredArticles}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleCreateNew={handleCreateNew}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        ) : currentArticle && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} key="edit" className="space-y-6">
            <EditorHeader
              slug={currentArticle.slug}
              isSaving={isSaving}
              editTab={editTab}
              setEditTab={setEditTab}
              handleBackToList={handleBackToList}
              handleSave={handleSave}
            />

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
                          onChange={e => updateArticleField({ title: e.target.value })}
                          className="w-full text-2xl font-black bg-slate-50 border-none rounded-2xl p-4 focus:bg-white focus:ring-4 focus:ring-brand-50 outline-none transition-all placeholder:text-slate-200"
                        />
                        <textarea
                          rows={2}
                          placeholder="簡短摘要描述..."
                          value={currentArticle.summary}
                          onChange={e => updateArticleField({ summary: e.target.value })}
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
                              onChange={e => updateArticleField({ promo_title: e.target.value })}
                              className="w-full text-lg font-bold bg-slate-50 border-none rounded-xl p-4 focus:bg-white focus:ring-4 focus:ring-brand-50 outline-none transition-all"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">首頁推廣引言 (Promo Description)</label>
                            <textarea
                              rows={2}
                              placeholder="描述為何這篇文章值得在首頁推薦..."
                              value={currentArticle.promo_description || ''}
                              onChange={e => updateArticleField({ promo_description: e.target.value })}
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
                      <EditorSidebar
                        currentArticle={currentArticle}
                        updateArticleField={updateArticleField}
                      />
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

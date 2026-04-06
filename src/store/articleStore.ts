import { create } from 'zustand'
import { Article, mockArticles } from '../data'

interface ArticleState {
  articles: Article[]
  loading: boolean
  setArticles: (articles: Article[]) => void
  setLoading: (loading: boolean) => void
  addArticle: (article: Article) => void
  updateArticle: (article: Article) => void
  deleteArticle: (id: string) => void
}

export const useArticleStore = create<ArticleState>((set) => ({
  articles: mockArticles,
  loading: false,
  setArticles: (articles) => set({ articles }),
  setLoading: (loading) => set({ loading }),
  addArticle: (article) => set((state) => ({ 
    articles: [article, ...state.articles] 
  })),
  updateArticle: (article) => set((state) => ({
    articles: state.articles.map((a) => (a.id === article.id ? article : a))
  })),
  deleteArticle: (id) => set((state) => ({
    articles: state.articles.filter((a) => a.id !== id)
  })),
}))

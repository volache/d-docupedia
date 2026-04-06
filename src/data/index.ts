export type ArticleType = 'guide' | 'workflow' | 'faq' | 'example' | 'system_tutorial' | 'bespoke';

export interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  article_type: ArticleType;
  summary: string;
  content: any;
  tags: string[];
  updated_at: string;
  promo_title?: string;
  promo_description?: string;
  views?: number;
  is_internal?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  slug: string;
}

export interface Activity {
  id: string;
  title: string;
  time: string;
  type: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface WorkflowStep {
  id: string;
  title: string;
  description: string;
}

// 匯出假資料供外部組件使用
export * from './mockData';

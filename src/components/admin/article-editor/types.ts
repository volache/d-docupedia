export interface ArticleContentBlock {
  type: string;
  content?: string;
  style?: string;
  title?: string;
  items?: any[];
  description?: string;
  pro_tip?: string;
  icon?: string;
  action?: string;
  image_url?: string;
  question?: string;
  answer?: string;
  headers?: string[];
  rows?: string[][];
  is_row_header?: boolean;
}

export interface BespokeSection {
  type: string;
  title?: string;
  subtitle?: string;
  image?: string;
  tag?: string;
  words?: string[];
  items?: any[];
  text?: string;
  author?: string;
  left?: { title: string; items: string[] };
  right?: { title: string; items: string[] };
  variant?: string;
  button_text?: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  article_type: 'guide' | 'workflow' | 'faq' | 'example' | 'system_tutorial' | 'bespoke';
  tags: string[];
  content: {
    blocks?: ArticleContentBlock[];
    sections?: BespokeSection[];
  };
  updated_at: string;
  views?: number;
  promo_title?: string;
  promo_description?: string;
}

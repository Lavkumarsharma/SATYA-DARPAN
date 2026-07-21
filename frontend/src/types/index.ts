// ─── Core Domain Types ────────────────────────────────────────────────────────

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'editor' | 'author';
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  icon: string;
  articleCount?: number;
}

export interface Tag {
  _id: string;
  name: string;
  slug: string;
}

export interface Media {
  _id: string;
  url: string;
  publicId?: string;
  width?: number;
  height?: number;
  alt?: string;
  caption?: string;
  mimeType?: string;
}

export interface Reference {
  _id: string;
  type: 'official' | 'news' | 'research' | 'social' | 'other';
  title: string;
  url: string;
  description?: string;
  publishedDate?: string;
  source?: string;
}

export interface Comment {
  _id: string;
  article: string;
  name: string;
  email: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  parentComment?: string;
  replies?: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: Media;
  content: TiptapDoc;
  category: Category;
  tags: Tag[];
  author: User;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  pinned: boolean;
  trending: boolean;
  editorsPick: boolean;
  isFactCheck: boolean;
  factCheckVerdict?: 'true' | 'false' | 'misleading' | 'unverified' | 'partly-true';
  factCheckClaim?: string;
  references: Reference[];
  readingTime: number;
  viewCount: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: Media;
}

// ─── Tiptap JSON Types ────────────────────────────────────────────────────────

export interface TiptapMark {
  type: string;
  attrs?: Record<string, unknown>;
}

export interface TiptapNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  marks?: TiptapMark[];
  text?: string;
}

export interface TiptapDoc {
  type: 'doc';
  content: TiptapNode[];
}

// ─── Block Attribute Types ────────────────────────────────────────────────────

export interface TimelineItem {
  date: string;
  title: string;
  description: string;
  category?: string;
  color?: string;
}

export interface TimelineAttrs {
  items: TimelineItem[];
  title?: string;
}

export interface StatItem {
  value: string;
  label: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: string;
}

export interface StatisticsAttrs {
  stats: StatItem[];
  title?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQAttrs {
  items: FAQItem[];
  title?: string;
}

export interface PollOption {
  text: string;
  votes?: number;
}

export interface PollAttrs {
  question: string;
  options: PollOption[];
  totalVotes?: number;
}

export interface ComparisonRow {
  label: string;
  left: string;
  right: string;
}

export interface ComparisonAttrs {
  leftHeader: string;
  rightHeader: string;
  rows: ComparisonRow[];
}

export interface FactBoxAttrs {
  title: string;
  content: string;
  color?: string;
  icon?: string;
}

export interface SourceCardAttrs {
  title: string;
  url: string;
  description?: string;
  source?: string;
  favicon?: string;
}

export interface CalloutAttrs {
  type: 'info' | 'warning' | 'error' | 'success' | 'tip';
  title?: string;
  content: string;
}

export interface SpoilerAttrs {
  title?: string;
  content: string;
}

export interface AudioAttrs {
  src: string;
  title?: string;
  artist?: string;
}

export interface MapAttrs {
  embedUrl: string;
  title?: string;
  height?: number;
}

export interface VideoAttrs {
  src?: string;
  youtubeId?: string;
  title?: string;
  caption?: string;
}

export interface GalleryAttrs {
  images: Array<{ url: string; alt?: string; caption?: string }>;
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface SearchFilters {
  q?: string;
  category?: string;
  year?: string;
  tags?: string;
  sort?: 'latest' | 'oldest' | 'popular';
  page?: number;
  limit?: number;
}

export interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

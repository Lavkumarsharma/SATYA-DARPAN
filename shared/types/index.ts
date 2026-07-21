// Shared TypeScript types for सत्यदर्पण platform
// Used by both frontend and admin applications

// ========================
// API Response Types
// ========================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ========================
// User Types
// ========================

export type UserRole = 'admin' | 'editor' | 'author' | 'viewer';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    linkedin?: string;
  };
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  user: User;
}

// ========================
// Category Types
// ========================

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  image?: {
    url: string;
    publicId: string;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
  articleCount: number;
  createdAt: string;
  updatedAt: string;
}

// ========================
// Tag Types
// ========================

export interface Tag {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  articleCount: number;
}

// ========================
// Media Types
// ========================

export type MediaResourceType = 'image' | 'video' | 'raw';

export interface Media {
  _id: string;
  name: string;
  originalName: string;
  publicId: string;
  url: string;
  resourceType: MediaResourceType;
  format: string;
  size: number;
  width?: number;
  height?: number;
  duration?: number;
  folder: string;
  tags: string[];
  alt?: string;
  caption?: string;
  uploadedBy?: string | User;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

// ========================
// Reference Types
// ========================

export type ReferenceType =
  | 'official'
  | 'news'
  | 'research'
  | 'book'
  | 'court'
  | 'government'
  | 'other';

export interface Reference {
  _id?: string;
  title: string;
  url?: string;
  type: ReferenceType;
  description?: string;
}

// ========================
// Article Types
// ========================

export type ArticleStatus = 'draft' | 'published' | 'archived';

export interface ArticleSeo {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  keywords?: string[];
  canonicalUrl?: string;
  schema?: Record<string, unknown>;
}

export interface Article {
  _id: string;
  title: string;
  slug: string;
  content: TiptapDoc;
  excerpt?: string;
  coverImage?: {
    url: string;
    publicId: string;
    alt?: string;
  };
  author: string | User;
  category?: string | Category;
  tags: string[] | Tag[];
  status: ArticleStatus;
  featured: boolean;
  trending: boolean;
  editorsPick: boolean;
  factCheck: boolean;
  readingTime: number;
  views: number;
  seo?: ArticleSeo;
  references: Reference[];
  publishedAt?: string;
  scheduledAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ========================
// Comment Types
// ========================

export type CommentStatus = 'pending' | 'approved' | 'rejected' | 'spam';

export interface Comment {
  _id: string;
  article: string | Article;
  author: {
    name: string;
    email: string;
    avatar?: string;
  };
  content: string;
  parent?: string | Comment;
  replies: string[] | Comment[];
  status: CommentStatus;
  pinned: boolean;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

// ========================
// Revision History Types
// ========================

export interface Revision {
  _id: string;
  article: string;
  content: TiptapDoc;
  title: string;
  savedBy: string | User;
  version: number;
  note?: string;
  createdAt: string;
}

// ========================
// Newsletter Types
// ========================

export interface NewsletterSubscriber {
  _id: string;
  email: string;
  name?: string;
  status: 'active' | 'unsubscribed';
  subscribedAt: string;
  unsubscribedAt?: string;
}

// ========================
// Analytics Types
// ========================

export interface DashboardStats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  totalViews: number;
  totalComments: number;
  pendingComments: number;
  totalSubscribers: number;
  mediaCount: number;
}

export interface ViewsTrend {
  date: string;
  views: number;
  uniqueVisitors: number;
}

export interface TopArticle {
  _id: string;
  title: string;
  slug: string;
  views: number;
  coverImage?: { url: string };
}

// ========================
// Tiptap Document Types
// ========================

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

// ========================
// Block-specific Attribute Types
// ========================

export interface TimelineItem {
  id: string;
  date: string;
  title: string;
  description?: string;
  color?: string;
}

export interface StatItem {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes?: number;
}

export interface ComparisonRow {
  label: string;
  a: string;
  b: string;
}

export interface SourceCardAttrs {
  title: string;
  url: string;
  description?: string;
  type?: ReferenceType;
  publishedDate?: string;
  favicon?: string;
}

export interface CalloutAttrs {
  type: 'info' | 'warning' | 'error' | 'success';
  title?: string;
}

export interface FactBoxAttrs {
  title: string;
  icon?: string;
  color?: string;
}

// ========================
// Search Types
// ========================

export interface SearchFilters {
  query?: string;
  category?: string;
  tags?: string[];
  year?: number;
  state?: string;
  author?: string;
  sort?: 'latest' | 'oldest' | 'popular' | 'relevance';
  page?: number;
  limit?: number;
}

export interface SearchResult {
  articles: Article[];
  total: number;
  facets?: {
    categories: { _id: string; name: string; count: number }[];
    tags: { _id: string; name: string; count: number }[];
    years: { year: number; count: number }[];
  };
}

// ========================
// TOC Types
// ========================

export interface TOCHeading {
  id: string;
  text: string;
  level: 1 | 2 | 3;
}

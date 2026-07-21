import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// For Client Components
export const apiClient = axios.create({
  baseURL: API_URL,
});

// For Server Components (Next.js fetch cache)
export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    cache: 'no-store',
    ...options,
  });
  
  if (!res.ok) {
    throw new Error(`API returned an error: ${res.status}`);
  }
  
  const json = await res.json();
  return json.data;
}

export async function getPublishedArticles(page = 1, limit = 12) {
  return fetchAPI(`/articles?page=${page}&limit=${limit}`);
}

export async function getArticleBySlug(slug: string) {
  return fetchAPI(`/articles/${slug}`);
}

export async function getFeaturedArticles() {
  return fetchAPI('/articles/featured');
}

export async function getTrendingArticles() {
  return fetchAPI('/articles/trending');
}

export async function getCategories() {
  return fetchAPI('/categories');
}

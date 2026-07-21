import { format, formatDistanceToNow, parseISO } from 'date-fns';

/**
 * Merges class names, filtering falsy values.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Format a date string as "January 7, 2026"
 */
export function formatDate(date: string | Date): string {
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, 'MMMM d, yyyy');
  } catch {
    return '';
  }
}

/**
 * Format relative date as "2 hours ago"
 */
export function formatRelativeDate(date: string | Date): string {
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(d, { addSuffix: true });
  } catch {
    return '';
  }
}

/**
 * Format a number as "12.5K", "1.2M", etc.
 */
export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

/**
 * Generate a short excerpt from plain text
 */
export function generateExcerpt(text: string, maxLength = 160): string {
  if (!text) return '';
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLength) return clean;
  return clean.slice(0, maxLength).replace(/\s+\S*$/, '') + '…';
}

/**
 * Slugify a string for anchor IDs
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Verdict badge color mapping for fact checks
 */
export const verdictConfig: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  true: { label: 'TRUE', color: '#16a34a', bg: '#dcfce7' },
  false: { label: 'FALSE', color: '#dc2626', bg: '#fee2e2' },
  misleading: { label: 'MISLEADING', color: '#d97706', bg: '#fef3c7' },
  unverified: { label: 'UNVERIFIED', color: '#6b7280', bg: '#f3f4f6' },
  'partly-true': { label: 'PARTLY TRUE', color: '#2563eb', bg: '#dbeafe' },
};

/**
 * Category color/icon defaults mapping
 */
export const categoryDefaults: Record<string, { color: string; icon: string }> =
  {
    politics: { color: '#4f46e5', icon: '🏛️' },
    economy: { color: '#059669', icon: '📊' },
    judiciary: { color: '#7c3aed', icon: '⚖️' },
    defence: { color: '#dc2626', icon: '🛡️' },
    foreign: { color: '#0891b2', icon: '🌍' },
    environment: { color: '#16a34a', icon: '🌿' },
    health: { color: '#db2777', icon: '🏥' },
    education: { color: '#d97706', icon: '📚' },
    technology: { color: '#6d28d9', icon: '💻' },
    social: { color: '#be185d', icon: '🤝' },
    media: { color: '#1d4ed8', icon: '📰' },
    election: { color: '#b45309', icon: '🗳️' },
    corruption: { color: '#991b1b', icon: '🔍' },
    human_rights: { color: '#9333ea', icon: '✊' },
    factcheck: { color: '#0f766e', icon: '✅' },
  };

/**
 * Resolves a media URL from backend dynamically to ensure it works on other PCs
 */
export function resolveImageUrl(url: string | undefined | null): string {
  if (!url) return '/indian_rupee_bg.png';
  
  // If the URL contains localhost:5000, dynamically rewrite to point to the current active backend base URL
  if (url.includes('localhost:5000')) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://satya-darpan.onrender.com/api';
    const backendBase = API_URL.replace('/api', '');
    return url.replace(/https?:\/\/localhost:5000/, backendBase);
  }
  
  // If it starts with a relative API path
  if (url.startsWith('/api/')) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://satya-darpan.onrender.com/api';
    const backendBase = API_URL.replace('/api', '');
    return `${backendBase}${url}`;
  }
  
  return url;
}

import { TiptapDoc, TiptapNode, HeadingItem } from '@/types';
import { slugify } from './utils';

/**
 * Recursively extract plain text from a Tiptap node tree
 */
function extractText(nodes: TiptapNode[]): string {
  return nodes
    .map((node) => {
      if (node.type === 'text') return node.text || '';
      if (node.content) return extractText(node.content);
      return '';
    })
    .join(' ');
}

/**
 * Extract all H2 and H3 headings from Tiptap JSON for the Table of Contents
 */
export function extractHeadings(doc: TiptapDoc | null | undefined): HeadingItem[] {
  if (!doc?.content) return [];
  const headings: HeadingItem[] = [];

  for (const node of doc.content) {
    if (node.type === 'heading' && node.attrs) {
      const level = node.attrs.level as number;
      if (level === 2 || level === 3) {
        const text = node.content ? extractText(node.content) : '';
        const id = slugify(text);
        headings.push({ id, text, level });
      }
    }
  }

  return headings;
}

/**
 * Extract all plain text from a Tiptap document (for SEO meta description)
 */
export function getBlockText(doc: TiptapDoc | null | undefined): string {
  if (!doc?.content) return '';
  return extractText(doc.content).replace(/\s+/g, ' ').trim();
}

/**
 * Calculate estimated reading time from Tiptap JSON (200 wpm)
 */
export function calculateReadingTime(doc: TiptapDoc | null | undefined): number {
  if (!doc?.content) return 1;
  const text = getBlockText(doc);
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

/**
 * Count total word count in a Tiptap document
 */
export function countWords(doc: TiptapDoc | null | undefined): number {
  if (!doc?.content) return 0;
  const text = getBlockText(doc);
  return text.split(/\s+/).filter(Boolean).length;
}

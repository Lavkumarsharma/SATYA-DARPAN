'use client';
import { useMemo } from 'react';
import { generateHTML } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import Link from '@tiptap/extension-link';

export default function BlockRenderer({ content }: { content: any }) {
  const html = useMemo(() => {
    if (!content || typeof content !== 'object') return '';
    try {
      return generateHTML(content, [
        StarterKit,
        Highlight.configure({ multicolor: true }),
        Image.configure({
          HTMLAttributes: {
            class: 'w-full rounded-2xl my-10 border border-border/50 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.2)] transition-all duration-700',
          },
        }),
        Youtube.configure({
          HTMLAttributes: {
            class: 'w-full aspect-video rounded-2xl my-10 border border-border shadow-2xl',
          },
        }),
        Link.configure({
          HTMLAttributes: {
            class: 'text-accent font-semibold underline decoration-accent/30 underline-offset-4 hover:decoration-accent transition-colors cursor-pointer',
          },
        }),
      ]);
    } catch (e) {
      console.error('Failed to generate HTML from blocks', e);
      return '';
    }
  }, [content]);

  return (
    <div 
      className="prose prose-lg dark:prose-invert max-w-none 
                 prose-headings:font-playfair prose-headings:font-bold prose-headings:tracking-tight 
                 prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-4 prose-h2:border-b prose-h2:border-border/50
                 prose-p:font-inter prose-p:leading-relaxed prose-p:text-text-muted/90
                 prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:bg-surface prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-text
                 prose-strong:text-text prose-strong:font-semibold
                 prose-ul:list-disc prose-ol:list-decimal prose-li:my-2
                 marker:text-accent"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, X, Clock, Eye, FileText, ArrowRight, Loader2 } from 'lucide-react';
import { resolveImageUrl } from '@/lib/utils';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://satya-darpan.onrender.com/api';

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const json = await res.json();
          setResults(json.data || []);
        }
      } catch (err) {
        console.error('Search query error:', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 px-4 bg-background/90 backdrop-blur-xl animate-in fade-in duration-200">
      {/* Backdrop overlay click to close */}
      <div className="absolute inset-0 z-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-3xl bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Header */}
        <div className="p-4 sm:p-6 border-b border-border flex items-center gap-3 bg-background/50">
          <Search className="w-5 h-5 text-accent flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="खोजें: Jantar Mantar, PM CARES Fund, Electoral Bonds..."
            className="w-full bg-transparent text-text text-base sm:text-lg font-medium outline-none placeholder:text-text-muted/60"
          />
          {loading && <Loader2 className="w-5 h-5 text-accent animate-spin flex-shrink-0" />}
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-text-muted hover:text-text hover:bg-surface transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-bold text-text-muted bg-surface border border-border rounded hover:text-text transition-colors ml-2 hidden sm:block"
          >
            ESC
          </button>
        </div>

        {/* Popular Tags / Quick Suggestions */}
        {!query && (
          <div className="p-6 border-b border-border/50 bg-background/20">
            <span className="text-[10px] font-black uppercase tracking-wider text-text-muted block mb-3">Popular Searches:</span>
            <div className="flex flex-wrap gap-2">
              {['Jantar Mantar', 'PM CARES Fund', 'Electoral Bonds', 'Adani Group', 'Fact Check'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="px-3 py-1.5 bg-surface border border-border rounded-full text-xs font-medium text-text-muted hover:border-accent hover:text-accent transition-all"
                >
                  🔍 {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {query && results.length === 0 && !loading ? (
            <div className="text-center py-12 text-text-muted">
              <FileText className="w-12 h-12 text-border mx-auto mb-3 opacity-50" />
              <p className="text-sm">"{query}" के लिए कोई परिणाम नहीं मिला।</p>
              <p className="text-xs text-text-muted/60 mt-1">अन्य कीवर्ड से पुनः प्रयास करें।</p>
            </div>
          ) : (
            results.map((item: any, i: number) => (
              <Link
                key={item._id || i}
                href={`/article/${item.slug}`}
                onClick={onClose}
                className="group flex items-start gap-4 p-4 rounded-xl border border-border bg-background/50 hover:bg-surface hover:border-accent/40 transition-all duration-200"
              >
                {item.coverImage?.url && (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden flex-shrink-0 border border-border">
                    <img
                      src={resolveImageUrl(item.coverImage.url)}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold uppercase rounded">
                      {item.category?.name || 'Investigation'}
                    </span>
                    {item.publishedAt && (
                      <span className="text-[10px] text-text-muted flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(item.publishedAt).toLocaleDateString('hi-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-bold font-playfair text-text group-hover:text-accent transition-colors line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-text-muted line-clamp-2 mt-1 leading-relaxed">
                    {item.excerpt}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-accent group-hover:translate-x-1 transition-all self-center flex-shrink-0" />
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

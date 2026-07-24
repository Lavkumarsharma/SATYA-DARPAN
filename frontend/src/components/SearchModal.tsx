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

// Fail-safe articles list so search ALWAYS works even if backend is offline/slow
const FALLBACK_ARTICLES = [
  {
    _id: 'jantar-mantar-student-protest-lathi-charge-dharmendra-pradhan-neet',
    slug: 'jantar-mantar-student-protest-lathi-charge-dharmendra-pradhan-neet',
    title: 'Jantar Mantar Chalo: Dharmendra Pradhan Ke Istife Aur NEET Bhrashtachar Par Chhatro Par Police Lathi Charge Ka Poora Sach',
    excerpt: '20 July ko Jantar Mantar par NEET-UG rigging aur UGC-NET paper leak ke khilaf rashtriya chhatra andolan par lathi charge, 118 police, 80+ chhatra ghayal, 5 FIR aur Sansad March ki OSINT jaanch.',
    category: { name: 'OSINT Investigation' },
    publishedAt: new Date('2026-07-20').toISOString(),
  },
  {
    _id: 'pm-cares-fund-osint-investigation-rti-cag-audit-reality',
    slug: 'pm-cares-fund-osint-investigation-rti-cag-audit-reality',
    title: 'PM CARES Fund Ka Khulasa: CAG Audit Se Chhoot, RTI Se Inkaar Aur ₹2,000 Crore Ventilator Kharid Ka Sach',
    excerpt: 'Supreme Court ruling CPIL v. UOI, SARC & Associates audit report, RTI Section 2(h) non-disclosure, FCRA exemption aur ventilator failure data ki 4-page sachai forensic investigation.',
    category: { name: 'Expose' },
    publishedAt: new Date('2026-07-21').toISOString(),
  },
  {
    _id: 'electoral-bonds-scam-truth',
    slug: 'electoral-bonds-scam-truth',
    title: 'Electoral Bonds Scam: ₹1.85 Lakh Crore Ka Sach',
    excerpt: 'Supreme Court ke faisle ke baad Electoral Bonds scheme ke khatme se jo data saamne aaya hai, wo ek khatraanak sach chhupa raha tha.',
    category: { name: 'Bhrashtachar' },
    publishedAt: new Date('2024-03-15').toISOString(),
  },
  {
    _id: 'adani-hindenburg-full-truth',
    slug: 'adani-hindenburg-full-truth',
    title: 'Adani Group aur Hindenburg Report: Poora Sach Jo Media Ne Chhupaaya',
    excerpt: 'January 2023 mein Hindenburg Research ne Adani Group par ek badi report publish ki. LIC aur SBI ka paisa khatrey mein tha.',
    category: { name: 'Expose' },
    publishedAt: new Date('2024-02-10').toISOString(),
  },
  {
    _id: 'fact-check-india-5th-economy-reality',
    slug: 'fact-check-india-5th-economy-reality',
    title: 'Fact Check: "India 5th Largest Economy" — Kya Yeh Aam Admi Ki Jeb Mein Bhi Dikhta Hai?',
    excerpt: 'Government baar baar kehti hai India 5th largest economy ban gaya. Lekin GDP growth se common man ka kya fayda?',
    category: { name: 'Fact Check' },
    publishedAt: new Date('2024-04-01').toISOString(),
  },
];

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
    const q = query.trim().toLowerCase();
    if (!q) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      let fetchedResults: any[] = [];

      // 1. Try Backend Search API
      try {
        const res = await fetch(`${API_URL}/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const json = await res.json();
          if (json.data && Array.isArray(json.data) && json.data.length > 0) {
            fetchedResults = json.data;
          }
        }
      } catch (err) {
        console.warn('Backend search API unreachable, falling back to direct articles fetch & local filter');
      }

      // Helper for bilingual search term expansion (Hindi <-> English)
      const TRANSLITERATIONS = [
        { en: ['jantar mantar', 'protest', 'lathi charge', 'dharmendra pradhan', 'neet'], hi: ['जंतर मंतर', 'प्रदर्शन', 'लाठीचार्ज', 'धर्मेंद्र प्रधान', 'नीट'] },
        { en: ['pm cares', 'pm cares fund', 'cag', 'rti', 'ventilator'], hi: ['पीएम केयर्स', 'पीएम केअर', 'सीएजी', 'आरटीआई', 'वेंटिलेटर'] },
        { en: ['electoral bonds', 'bond', 'bjp', 'supreme court'], hi: ['इलेक्टोरल बॉन्ड्स', 'चुनावी बॉन्ड', 'सुप्रीम कोर्ट'] },
        { en: ['adani', 'hindenburg', 'lic', 'sbi'], hi: ['अडानी', 'हिंडनबर्ग', 'एलआईसी', 'एसबीआई'] },
        { en: ['economy', 'gdp', 'unemployment'], hi: ['अर्थव्यवस्था', 'जीडीपी', 'बेरोजगारी'] },
      ];

      const searchTerms = new Set<string>([q]);
      for (const group of TRANSLITERATIONS) {
        const matchEn = group.en.some(t => q.includes(t) || t.includes(q));
        const matchHi = group.hi.some(t => q.includes(t) || t.includes(q));
        if (matchEn || matchHi) {
          group.en.forEach(t => searchTerms.add(t));
          group.hi.forEach(t => searchTerms.add(t));
        }
      }

      const matchItem = (item: any) => {
        const title = (item.title || '').toLowerCase();
        const excerpt = (item.excerpt || '').toLowerCase();
        const cat = (item.category?.name || item.category || '').toLowerCase();
        return Array.from(searchTerms).some(term => title.includes(term) || excerpt.includes(term) || cat.includes(term));
      };

      // 2. If search API returned no results or failed, try fetching published articles from /articles
      if (fetchedResults.length === 0) {
        try {
          const res = await fetch(`${API_URL}/articles?limit=100`);
          if (res.ok) {
            const json = await res.json();
            const allArticles = json.data || [];
            fetchedResults = allArticles.filter(matchItem);
          }
        } catch (err) {
          console.warn('Backend articles API error:', err);
        }
      }

      // 3. Fail-safe local match from FALLBACK_ARTICLES if still empty
      if (fetchedResults.length === 0) {
        fetchedResults = FALLBACK_ARTICLES.filter(matchItem);
      }

      setResults(fetchedResults);
      setLoading(false);
    }, 250);

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
                key={item._id || item.slug || i}
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
                      {item.category?.name || item.category || 'Investigation'}
                    </span>
                    {item.publishedAt && (
                      <span className="text-[10px] text-text-muted flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(item.publishedAt).toLocaleDateString('hi-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-bold font-playfair text-text group-hover:text-accent transition-colors line-clamp-2">
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

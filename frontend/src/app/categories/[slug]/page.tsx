export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { Calendar, Eye, ChevronLeft } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function getCategoryArticles(slug: string) {
  try {
    const res = await fetch(`${API_URL}/articles?category=${slug}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data?.length > 0) return { articles: data.data, category: { name: slug, slug } };
    }
  } catch {}
  // Fallback
  return {
    category: { name: slug.charAt(0).toUpperCase() + slug.slice(1), slug },
    articles: [],
  };
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const { articles, category } = await getCategoryArticles(params.slug);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Back */}
        <Link href="/categories" className="flex items-center gap-2 text-text-muted hover:text-accent text-xs uppercase tracking-widest font-bold mb-10 transition-colors">
          <ChevronLeft className="w-4 h-4" /> All Categories
        </Link>

        <div className="border-l-2 border-accent pl-6 mb-12">
          <p className="text-accent text-xs font-black uppercase tracking-widest mb-2">Category</p>
          <h1 className="text-4xl md:text-5xl font-playfair font-black text-text">{category.name}</h1>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-24 border border-border rounded bg-surface">
            <p className="text-text-muted text-lg">इस श्रेणी में अभी कोई लेख उपलब्ध नहीं है।</p>
            <p className="text-text-muted text-sm mt-2">Admin panel से नई रिपोर्ट जोड़ें।</p>
          </div>
        ) : (
          <div className="space-y-6">
            {articles.map((art: any) => (
              <Link
                key={art._id}
                href={`/article/${art.slug}`}
                className="group block bg-surface border border-border rounded p-6 hover:border-accent/40 transition-all duration-300"
              >
                <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted mb-3">
                  {art.publishedAt && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(art.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" /> {(art.views || 0).toLocaleString('en-IN')} views
                  </span>
                </div>
                <h2 className="text-xl font-playfair font-black text-text group-hover:text-accent transition-colors mb-2">{art.title}</h2>
                {art.excerpt && <p className="text-sm text-text-muted leading-relaxed line-clamp-2">{art.excerpt}</p>}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

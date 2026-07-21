export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { CheckCircle, Calendar, Eye } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const MOCK_FACT_CHECKS = [
  {
    _id: 'fc1', slug: 'fact-check-india-5th-economy-reality',
    title: 'Fact Check: "India 5th Largest Economy" — Kya Yeh Aam Admi Ki Jeb Mein Bhi Dikhta Hai?',
    excerpt: 'Government baar baar kehti hai India 5th largest economy ban gaya. Lekin GDP growth se common man ka kya fayda?',
    verdict: 'PARTLY TRUE', verdictColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    publishedAt: '2024-04-01', views: 7340,
  },
  {
    _id: 'fc2', slug: 'electoral-bonds-scam-truth',
    title: 'Electoral Bonds: Kya Yeh Sach Mein Transparency Ka Zariya Tha?',
    excerpt: 'Sarkar ka dawa tha ki electoral bonds se chanda transparent ho jayega. Lekin SC judgment ne kya kaha?',
    verdict: 'FALSE', verdictColor: 'text-red-400 bg-red-500/10 border-red-500/20',
    publishedAt: '2024-03-15', views: 14520,
  },
];

async function getFactChecks() {
  try {
    const res = await fetch(`${API_URL}/articles/fact-checks`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data?.length > 0) return data.data;
    }
  } catch {}
  return MOCK_FACT_CHECKS;
}

export const metadata = {
  title: 'Fact Checks | SatyaDarpan',
  description: 'Independent fact-checking of political and economic claims',
};

export default async function FactChecksPage() {
  const articles = await getFactChecks();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="border-l-2 border-accent pl-6 mb-14">
          <div className="flex items-center gap-2 text-accent text-xs font-black uppercase tracking-widest mb-3">
            <CheckCircle className="w-4 h-4" />
            Independent Verification
          </div>
          <h1 className="text-4xl md:text-5xl font-playfair font-black text-text leading-tight">
            Fact Check
          </h1>
          <p className="text-text-muted mt-4 max-w-xl text-sm leading-relaxed">
            सरकारी दावों, नेताओं के बयानों और मीडिया रिपोर्टों की तथ्यात्मक पड़ताल।
            हर दावे को सरकारी दस्तावेज़ों और आधिकारिक डेटा से जांचा जाता है।
          </p>
        </div>

        {/* Verdict legend */}
        <div className="flex flex-wrap gap-3 mb-10">
          {[
            { label: 'TRUE', cls: 'text-green-400 bg-green-500/10 border border-green-500/20' },
            { label: 'PARTLY TRUE', cls: 'text-amber-400 bg-amber-500/10 border border-amber-500/20' },
            { label: 'FALSE', cls: 'text-red-400 bg-red-500/10 border border-red-500/20' },
            { label: 'MISLEADING', cls: 'text-orange-400 bg-orange-500/10 border border-orange-500/20' },
          ].map(v => (
            <span key={v.label} className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded ${v.cls}`}>{v.label}</span>
          ))}
        </div>

        {/* Articles */}
        <div className="space-y-5">
          {articles.map((art: any) => (
            <Link
              key={art._id}
              href={`/article/${art.slug}`}
              className="group block bg-surface border border-border rounded p-6 hover:border-accent/40 transition-all duration-300"
            >
              <div className="flex flex-wrap items-center gap-3 mb-3">
                {art.verdict && (
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded border ${art.verdictColor || 'text-text-muted bg-surface border-border'}`}>
                    {art.verdict}
                  </span>
                )}
                <span className="flex items-center gap-1 text-xs text-text-muted">
                  <Calendar className="w-3 h-3" />
                  {art.publishedAt ? new Date(art.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                </span>
                <span className="flex items-center gap-1 text-xs text-text-muted">
                  <Eye className="w-3 h-3" /> {(art.views || 0).toLocaleString('en-IN')}
                </span>
              </div>
              <h2 className="text-lg font-playfair font-black text-text group-hover:text-accent transition-colors mb-2 leading-snug">
                {art.title}
              </h2>
              {art.excerpt && <p className="text-sm text-text-muted line-clamp-2 leading-relaxed">{art.excerpt}</p>}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { Layers, ChevronRight } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://satya-darpan.onrender.com/api';

const MOCK_CATEGORIES = [
  { _id: '1', name: 'Bhrashtachar', slug: 'bhrashtachar', description: 'भ्रष्टाचार और घोटालों का पर्दाफाश', articleCount: 12 },
  { _id: '2', name: 'Expose', slug: 'expose', description: 'बड़े खुलासे और जांच रिपोर्ट', articleCount: 8 },
  { _id: '3', name: 'Fact Check', slug: 'fact-check', description: 'तथ्यों की पड़ताल और सत्य-जांच', articleCount: 15 },
  { _id: '4', name: 'Economy', slug: 'economy', description: 'अर्थव्यवस्था और रोजगार की हकीकत', articleCount: 9 },
  { _id: '5', name: 'Media', slug: 'media', description: 'मीडिया की भूमिका और पत्रकारिता की स्वतंत्रता', articleCount: 6 },
  { _id: '6', name: 'Politics', slug: 'politics', description: 'राजनीतिक विश्लेषण और नीतियों का असर', articleCount: 11 },
];

async function getCategories() {
  try {
    const res = await fetch(`${API_URL}/categories`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data?.length > 0) return data.data;
    }
  } catch {}
  return MOCK_CATEGORIES;
}

export const metadata = {
  title: 'Categories | SatyaDarpan',
  description: 'Browse all investigation categories on SatyaDarpan',
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-14 border-l-2 border-accent pl-6">
          <div className="flex items-center gap-2 text-accent text-xs font-black uppercase tracking-widest mb-3">
            <Layers className="w-4 h-4" />
            All Categories
          </div>
          <h1 className="text-4xl md:text-5xl font-playfair font-black text-text leading-tight">
            विषय-वार खोजें
          </h1>
          <p className="text-text-muted mt-4 max-w-xl">
            हर विषय पर हमारी गहन पड़ताल और दस्तावेज़ी साक्ष्य।
            जो सरकार और मीडिया नहीं दिखाती, वो हम दिखाते हैं।
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat: any, i: number) => (
            <Link
              key={cat._id || i}
              href={`/categories/${cat.slug}`}
              className="group relative bg-surface border border-border rounded p-6 hover:border-accent/40 transition-all duration-300 hover:bg-surface/80"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-l" />
              <div className="flex items-start justify-between mb-4">
                <span className="text-xs font-black uppercase tracking-widest text-accent bg-accent/10 px-2 py-1 rounded">
                  {cat.articleCount || '—'} articles
                </span>
                <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-accent group-hover:translate-x-1 transition-all duration-200" />
              </div>
              <h2 className="text-xl font-playfair font-black text-text mb-2 group-hover:text-accent transition-colors">
                {cat.name}
              </h2>
              <p className="text-sm text-text-muted leading-relaxed">
                {cat.description || `${cat.name} से जुड़ी सभी रिपोर्ट और खुलासे।`}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

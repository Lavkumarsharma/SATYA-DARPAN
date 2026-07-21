export const dynamic = 'force-dynamic';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, Eye, ChevronLeft, Share2, BookOpen, ExternalLink } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://satya-darpan.onrender.com/api';

// The 3 seeded articles as fallback when DB not connected
const MOCK_ARTICLES: Record<string, any> = {
  'electoral-bonds-scam-truth': {
    title: 'Electoral Bonds Scam: ₹1.85 Lakh Crore Ka Sach',
    excerpt: 'Supreme Court ke faisle ke baad Electoral Bonds scheme ke khatme se jo data saamne aaya hai, wo ek khatraanak sach chhupa raha tha.',
    status: 'published',
    publishedAt: '2024-03-15T00:00:00Z',
    readingTime: 8,
    views: 14520,
    category: { name: 'Bhrashtachar' },
    author: { name: 'SatyaDarpan Admin' },
    tags: [{ name: 'BJP' }, { name: 'Electoral Bonds' }, { name: 'Black Money' }],
    references: [
      { title: 'Supreme Court Judgment on Electoral Bonds', url: 'https://main.sci.gov.in', type: 'court' },
      { title: 'SBI Electoral Bond Data Disclosure', url: 'https://eci.gov.in', type: 'government' },
      { title: 'ADR Report on Electoral Bonds', url: 'https://adrindia.org', type: 'research' },
    ],
    content: {
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '📌 Supreme Court ka Aishtihasik Faisla' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'February 2024 mein Supreme Court of India ne Electoral Bonds scheme ko unconstitutional karaar diya. Court ne kaha ki yeh scheme voters ke "right to know" ka ullanghan karti hai aur democratic process ko nuksaan pahunchati hai.' }] },
        { type: 'blockquote', content: [{ type: 'paragraph', content: [{ type: 'text', text: '"Electoral Bonds scheme violates Article 19(1)(a) of the Constitution. Citizens have the right to know who is funding political parties." — Chief Justice D.Y. Chandrachud' }] }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '💰 Kitna Paisa Kahan Gaya?' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'SBI dwara Supreme Court ko diye gaye data ke mutabik, 2018 se 2024 ke beech ₹16,518 crore ke bonds purchase hue. Inme se sirf BJP ko ₹6,566 crore (47.5%) mile — baki sab parties milake baaki amount.' }] },
        { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'Party-wise Breakdown (Top Receivers):' }] },
        { type: 'paragraph', content: [{ type: 'text', text: '1. BJP: ₹6,566 Crore\n2. TMC: ₹1,609 Crore\n3. Congress: ₹1,421 Crore\n4. BRS: ₹1,214 Crore' }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '🔍 ED Raids aur Electoral Bonds ka Connection' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Investigation mein ek chaunka dene wala pattern saamne aaya. Kai companies ne ED ya Income Tax raids ke BAAD Electoral Bonds purchase kiye. Is pattern ko "extortion through institutions" kaha ja raha hai.' }] },
        { type: 'blockquote', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Himachal Pradesh ke Nahan mein Future Gaming ne ₹1,368 crore ke bonds diye — wahi company jis par Income Tax aur ED ka shikar chal raha tha.' }] }] },
      ],
    },
  },
  'adani-hindenburg-full-truth': {
    title: 'Adani Group aur Hindenburg Report: Poora Sach Jo Media Ne Chhupaaya',
    excerpt: 'January 2023 mein Hindenburg Research ne Adani Group par ek badi report publish ki. LIC aur SBI ka paisa khatrey mein tha.',
    status: 'published',
    publishedAt: '2024-02-10T00:00:00Z',
    readingTime: 10,
    views: 9870,
    category: { name: 'Expose' },
    author: { name: 'SatyaDarpan Admin' },
    tags: [{ name: 'PM Modi' }, { name: 'Black Money' }, { name: 'BJP' }],
    references: [
      { title: 'Hindenburg Research Report on Adani', url: 'https://hindenburgresearch.com', type: 'research' },
      { title: 'Supreme Court Order on Adani Investigation', url: 'https://main.sci.gov.in', type: 'court' },
    ],
    content: {
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '🚨 Hindenburg Report: 88 Sawal Jinka Jawab Nahi Mila' }] },
        { type: 'paragraph', content: [{ type: 'text', text: '24 January 2023 ko US-based short-seller Hindenburg Research ne ek 106-page ki report publish ki jisme Adani Group par stock manipulation, accounting fraud, aur shell companies ke gambheer aarop lagaye gaye.' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Report ke baad Adani Group ki market cap mein sirf 10 dino mein ₹12 lakh crore ki girawat aayi. LIC jisme aam Indians ka paisa hai, usne ₹56,000 crore se zyada ka nuksaan jhela.' }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '🏦 LIC aur SBI Ka Common Log Ka Paisa Kahan Gaya?' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'LIC, jo aam Indians ke life insurance ka paisa manage karta hai, usne Adani Group mein ₹74,000 crore se zyada invest kiya tha. Stocks crash hone par LIC ke policyholders ka paisa seedha affect hua.' }] },
        { type: 'blockquote', content: [{ type: 'paragraph', content: [{ type: 'text', text: '"Government-owned institutions were used to prop up a private conglomerate with close ties to the ruling party. This is a textbook case of crony capitalism." — JPC Demand by Opposition' }] }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '⚖️ SEBI Ki Jaanch: Nakaam ya Janbujh Anjaani?' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Supreme Court ne SEBI ko Adani Group ke khilaf jaanch karne ka aadesh diya. SEBI ki report mein kaha gaya ki unhe koi conclusive evidence nahi mila. Lekin opposition aur experts ka kehna hai ki SEBI ne sirf surface-level jaanch ki.' }] },
      ],
    },
  },
  'fact-check-india-5th-economy-reality': {
    title: 'Fact Check: "India 5th Largest Economy" — Kya Yeh Aam Admi Ki Jeb Mein Bhi Dikhta Hai?',
    excerpt: 'Government baar baar kehti hai India 5th largest economy ban gaya. Lekin GDP growth se common man ka kya fayda?',
    status: 'published',
    publishedAt: '2024-04-01T00:00:00Z',
    readingTime: 6,
    views: 7340,
    category: { name: 'Fact Check' },
    author: { name: 'SatyaDarpan Admin' },
    tags: [{ name: 'PM Modi' }, { name: 'Congress' }],
    references: [
      { title: 'World Bank GDP Rankings 2023', url: 'https://data.worldbank.org', type: 'research' },
      { title: 'CMIE Unemployment Data', url: 'https://cmie.com', type: 'research' },
      { title: 'Oxfam India Inequality Report 2024', url: 'https://oxfamindia.org', type: 'research' },
    ],
    content: {
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '✅ Claim: India 5th Largest Economy Ban Gaya' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Sach: Haan, lekin adhura sach. 2023 mein India ne UK ko peeche chhodkar world ki 5th largest economy banni ki position haasil ki (nominal GDP ke hisab se). Yeh ek hakeekat hai. Lekin GDP ranking ka matlab per capita income se bilkul alag hai.' }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '📊 Asli Aankde Jo Sarkar Nahi Bolti' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Per Capita GDP (2023):\n🇮🇳 India: $2,601 (rank 139 in world)\n🇺🇸 USA: $80,035\n🇬🇧 UK: $46,371\n🇨🇳 China: $12,720\n\nMatalab: India 5th badi economy hai, lekin 139th ameer country hai.' }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '💼 Unemployment ka Sach' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'CMIE ke data ke mutabik:\n• Urban Youth Unemployment (15-29 years): 16.5%\n• Graduate Unemployment: 42.3% (ILO Report 2024)\n• Real wage growth (2014-2024): Near zero after inflation adjustment' }] },
        { type: 'blockquote', content: [{ type: 'paragraph', content: [{ type: 'text', text: '"India\'s GDP growth benefits are captured by the top 10% of the population. The bottom 50% has seen negligible real income growth in the past decade." — Oxfam India Report 2024' }] }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '⚖️ Verdict' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'PARTLY TRUE — MOSTLY MISLEADING. India ka 5th largest economy banna ek fakhr ki baat hai, lekin jab tak yeh growth aam aadmi ki jeb mein nahi pahuchti, yeh sirf ek marketing claim hai.' }] },
      ],
    },
  },
};

// Recursive Tiptap JSON → HTML renderer
function renderNode(node: any): string {
  if (!node) return '';

  if (node.type === 'text') {
    let text = node.text || '';
    // Apply marks
    if (node.marks) {
      for (const mark of node.marks) {
        if (mark.type === 'bold') text = `<strong>${text}</strong>`;
        else if (mark.type === 'italic') text = `<em>${text}</em>`;
        else if (mark.type === 'underline') text = `<u>${text}</u>`;
        else if (mark.type === 'strike') text = `<s>${text}</s>`;
        else if (mark.type === 'code') text = `<code class="bg-surface border border-border px-1.5 py-0.5 rounded text-sm font-mono text-accent">${text}</code>`;
        else if (mark.type === 'highlight') {
          const color = mark.attrs?.color || '#fef08a';
          if (color === '#ef4444' || color.includes('ef4444')) text = `<mark class="bg-red-500/20 text-red-600 dark:text-red-400 px-0.5 rounded">${text}</mark>`;
          else if (color === '#f59e0b' || color.includes('f59e0b')) text = `<mark class="bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 px-0.5 rounded">${text}</mark>`;
          else text = `<mark class="bg-yellow-300/30 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-200 px-0.5 rounded">${text}</mark>`;
        }
        else if (mark.type === 'link') text = `<a href="${mark.attrs?.href || '#'}" target="_blank" rel="noopener noreferrer" class="text-accent underline underline-offset-2 hover:text-accent/80">${text}</a>`;
      }
    }
    // Preserve newlines
    return text.replace(/\n/g, '<br />');
  }

  const children = (node.content || []).map(renderNode).join('');

  switch (node.type) {
    case 'doc': return children;
    case 'paragraph': return `<p class="text-text leading-8 text-lg mb-5">${children || '<br />'}</p>`;
    case 'heading': {
      const level = node.attrs?.level || 2;
      const classes: Record<number, string> = {
        1: 'text-4xl font-playfair font-bold text-text mt-12 mb-6 pb-3 border-b border-border',
        2: 'text-3xl font-playfair font-bold text-text mt-10 mb-5',
        3: 'text-2xl font-playfair font-semibold text-text mt-8 mb-4',
        4: 'text-xl font-bold text-text mt-6 mb-3',
      };
      return `<h${level} class="${classes[level] || classes[2]}">${children}</h${level}>`;
    }
    case 'blockquote':
      return `<blockquote class="my-8 pl-6 border-l-4 border-accent bg-accent/5 py-4 pr-4 rounded-r-xl">${children}</blockquote>`;
    case 'bulletList':
      return `<ul class="list-disc pl-6 space-y-2 mb-5 text-text text-lg">${children}</ul>`;
    case 'orderedList':
      return `<ol class="list-decimal pl-6 space-y-2 mb-5 text-text text-lg">${children}</ol>`;
    case 'listItem':
      return `<li class="leading-7">${children}</li>`;
    case 'codeBlock':
      return `<pre class="bg-surface border border-border rounded-xl p-5 overflow-x-auto mb-5"><code class="text-sm font-mono text-text">${children}</code></pre>`;
    case 'horizontalRule':
      return `<hr class="my-10 border-border" />`;
    case 'image':
      return `<figure class="my-8"><img src="${node.attrs?.src || ''}" alt="${node.attrs?.alt || ''}" class="w-full rounded-xl border border-border shadow-lg" />${node.attrs?.title ? `<figcaption class="text-center text-sm text-text-muted mt-3 italic">${node.attrs.title}</figcaption>` : ''}</figure>`;
    case 'youtube':
      return `<div class="my-8 aspect-video rounded-xl overflow-hidden border border-border shadow-lg"><iframe src="https://www.youtube.com/embed/${node.attrs?.src?.split('v=')[1] || ''}" class="w-full h-full" allowfullscreen frameborder="0"></iframe></div>`;
    default:
      return children;
  }
}

async function getArticle(slug: string) {
  // Try the /slug/:slug endpoint first
  try {
    const res = await fetch(`${API_URL}/articles/slug/${slug}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data) return data.data;
    }
  } catch (err) {
    // fall through
  }
  // Try the /:slug endpoint as fallback
  try {
    const res = await fetch(`${API_URL}/articles/${slug}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data) return data.data;
    }
  } catch (err) {
    // fall through
  }
  // Return mock data if API not available
  return MOCK_ARTICLES[slug] || null;
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug);
  if (!article) return { title: 'Article Not Found' };
  return {
    title: article.seo?.metaTitle || article.title,
    description: article.seo?.metaDescription || article.excerpt,
    keywords: article.seo?.keywords?.join(', '),
  };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug);
  if (!article) return notFound();

  const html = renderNode(article.content);

  const refTypeLabel: Record<string, string> = {
    court: '⚖️ Court',
    government: '🏛️ Government',
    research: '📄 Research',
    news: '📰 News',
    book: '📚 Book',
    other: '🔗 Source',
    official: '🏛️ Official',
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Article Body + Sidebar */}
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col xl:flex-row gap-12">
        {/* Main Content */}
        <article className="flex-1 max-w-3xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-text-muted mb-6">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <span>/</span>
            {article.category && (
              <>
                <Link href={`/categories/${article.category.slug || ''}`} className="hover:text-accent transition-colors capitalize">
                  {article.category.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-text truncate max-w-xs">{article.title}</span>
          </div>

          {/* Category Badge */}
          {article.category && (
            <span className="inline-block px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest rounded mb-4">
              {article.category.name}
            </span>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-playfair font-black text-text leading-relaxed mb-6">
            {article.title}
          </h1>

          {/* Excerpt */}
          {article.excerpt && (
            <p className="text-lg text-text-muted leading-relaxed border-l-2 border-accent pl-5 mb-8">
              {article.excerpt}
            </p>
          )}

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-6 text-xs text-text-muted border-y border-border/80 py-4 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center text-accent font-bold text-sm">
                {(article.author?.name || 'A').charAt(0)}
              </div>
              <span className="font-semibold text-text">{article.author?.name || 'SatyaDarpan'}</span>
            </div>
            {article.publishedAt && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(article.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} | {new Date(article.publishedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {article.readingTime || 5} min read
            </div>
            <div className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              {(article.views || 0).toLocaleString('en-IN')} views
            </div>
            {article.factCheck && (
              <span className="px-2.5 py-0.5 bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-bold rounded">
                Fact Checked
              </span>
            )}
          </div>

          {/* Cover Image */}
          {article.coverImage?.url && (
            <div className="mb-10">
              <img
                src={article.coverImage.url}
                alt={article.coverImage.alt || article.title}
                className="w-full rounded border border-border shadow-xl"
              />
            </div>
          )}

          {/* Rendered Content */}
          <div
            className="prose-container"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-12 pt-6 border-t border-border">
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag: any, i: number) => (
                  <Link
                    key={i}
                    href={`/tag/${tag.slug || ''}`}
                    className="px-3 py-1.5 bg-surface border border-border rounded-full text-sm text-text-muted hover:border-accent/50 hover:text-accent transition-colors"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* References */}
          {article.references && article.references.length > 0 && (
            <div className="mt-10 bg-surface border border-border rounded-2xl p-6">
              <h3 className="text-lg font-playfair font-bold text-text mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-accent" />
                Sources & References
              </h3>
              <div className="space-y-3">
                {article.references.map((ref: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 py-2 border-b border-border/50 last:border-0">
                    <span className="text-xs font-medium text-text-muted bg-background border border-border px-2 py-0.5 rounded mt-0.5 whitespace-nowrap">
                      {refTypeLabel[ref.type] || '🔗 Source'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text">{ref.title}</p>
                      {ref.url && (
                        <a href={ref.url} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-accent hover:underline flex items-center gap-1 mt-0.5">
                          {ref.url} <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {ref.description && <p className="text-xs text-text-muted mt-1">{ref.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-10 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-text-muted hover:text-accent transition-colors font-medium">
              <ChevronLeft className="w-4 h-4" /> Back to Investigations
            </Link>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="hidden xl:block w-72 flex-shrink-0 space-y-6 self-start sticky top-6">
          <div className="bg-surface border border-border rounded-2xl p-5">
            <h3 className="font-playfair font-bold text-text mb-4">More Investigations</h3>
            <div className="space-y-4">
              {Object.entries(MOCK_ARTICLES)
                .filter(([slug]) => slug !== params.slug)
                .map(([slug, art]) => (
                  <Link key={slug} href={`/article/${slug}`} className="block group">
                    <p className="text-sm font-medium text-text group-hover:text-accent transition-colors line-clamp-2 leading-snug">
                      {art.title}
                    </p>
                    <p className="text-xs text-text-muted mt-1 flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {art.views.toLocaleString('en-IN')} views
                    </p>
                  </Link>
                ))}
            </div>
          </div>

          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5">
            <p className="text-sm font-bold text-red-500 mb-2">⚠️ Disclaimer</p>
            <p className="text-xs text-text-muted leading-relaxed">
              All information published on SatyaDarpan is based on publicly available documents, court records, and verified sources. We are committed to factual, evidence-based journalism protected under Article 19(1)(a) of the Constitution of India.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

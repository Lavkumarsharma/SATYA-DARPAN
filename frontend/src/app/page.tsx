'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { 
  ChevronRight, ShieldAlert, Eye, Clock, FileText, Lock, Fingerprint, X,
  AlertTriangle, FileCheck2, Search, ArrowRight, Database, Users, TrendingUp
} from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ─── Fallback / mock data ──────────────────────────────────────────────────
const FALLBACK_HERO = {
  badge: 'Independent Public Interest Journalism',
  title: 'सत्यदर्पण: सत्ता, सांठगांठ और सार्वजनिक हित के छिपे दस्तावेज़।',
  description: 'हम देश के सामने वह सच्चाई रख रहे हैं जिसे मुख्यधारा के चैनल हमेशा छुपाते हैं। प्रमाणों के साथ बड़े खुलासे:',
  highlights: [
    'इलेक्टोरल बॉन्ड्स का सच: कैसे कंपनियों पर जांच एजेंसियों (ED-CBI) का दबाव बनाकर करोड़ों का चंदा वसूला गया।',
    'टीवी मीडिया की फंडिंग का सच: बड़े न्यूज़ चैनलों के मालिक वही कॉर्पोरेट घराने हैं जिन्हें सरकार से सीधे बड़े ठेके और फायदे मिलते हैं।',
  ],
};

const FALLBACK_COMPARISONS = [
  { topic: 'Jantar Mantar Protest (July 20)', officialNarrative: 'Illegal assembly by unguided student unions attempting to march towards Parliament. Mild force and water cannons used strictly to maintain public security and prevent traffic congestion.', investigativeFinding: 'Peaceful student and youth protest on unemployment. Leaked police memos reveal signal jammers were pre-planned 12 hours prior to cut communications, and water cannons were fired without warning or provocation.', evidence: 'Delhi Police Internal Order No. SPB-2026-902, local cellular traffic log dropouts, raw stream recordings.' },
  { topic: 'Electoral Bonds Allocation', officialNarrative: 'चुनावी चंदे में पारदर्शिता लाने और काले धन को समाप्त करने के उद्देश्य से शुरू किया गया एक सुधारक कदम।', investigativeFinding: 'दस्तावेज़ों और ऑडिट ट्रेल से स्पष्ट है कि यह वित्तीय लाभ और अनुबंधों के बदले राजनीतिक दलों को चंदा देने का माध्यम बना।', evidence: 'SBI official transaction logs, Supreme Court judgment paper, Election Commission disclosures.' },
  { topic: 'Industrial Oligopoly & Monopolies', officialNarrative: 'देश में इंफ्रास्ट्रक्चर के तेज़ विकास और राष्ट्रीय चैंपियंस को बढ़ावा देने के लिए आवश्यक कदम।', investigativeFinding: 'अहम इंफ्रास्ट्रक्चर सेक्टर्स बिना पारदर्शी प्रतिस्पर्धा के चुनिंदा उद्योग समूहों को सौंप दिए गए।', evidence: 'DRI investigation reports, Mauritius company registry filings, CAG audit notes.' },
  { topic: 'Economic Growth vs Unemployment', officialNarrative: 'विश्व की पांचवीं सबसे बड़ी अर्थव्यवस्था बनने और तीव्र जीडीपी दर से सभी नागरिकों के उत्थान का दावा।', investigativeFinding: 'जीडीपी विकास दर का लाभ केवल शीर्ष 1% आबादी तक सीमित रहा है।', evidence: 'Ministry of Statistics (MOSPI) reports, CMIE labour indicators, Reserve Bank of India bulletins.' },
];

const FALLBACK_VAULT = [
  { id: 'DOC-2026-001', title: 'Jantar Mantar Mobile Jammer & Crowd Suppression Internal Police Directives', category: 'नागरिक अधिकार हनन', date: 'July 20, 2026', size: '2.4 MB', status: 'TOP SECRET' },
  { id: 'DOC-2024-001', title: 'Electoral Bonds Complete Donor-Receiver Matching Ledger', category: 'वित्तीय अनियमितता', date: 'March 2024', size: '4.2 MB', status: 'VERIFIED EVIDENCE' },
  { id: 'DOC-2024-002', title: 'Censored Press Freedom Index Report (MoIB Internal Copy)', category: 'सेंसरशिप', date: 'May 2024', size: '1.8 MB', status: 'TOP SECRET' },
  { id: 'DOC-2024-003', title: 'Pegasus Surveillance Target List - Indian Journalists & Activists', category: 'निगरानी', date: 'Jan 2024', size: '820 KB', status: 'EXPOSED' },
  { id: 'DOC-2024-004', title: 'PM Cares Fund Audits & Secret Direct Investment Accounts', category: 'वित्तीय अनियमितता', date: 'April 2024', size: '12.4 MB', status: 'HIGH RISK' },
];

const FALLBACK_ARTICLES = [
  { slug: 'jantar-mantar-protest-police-action-censorship-truth', title: 'Jantar Mantar Protest: Peaceful Protesters Par Police Action Aur Media Censorship Ka Poora Sach', category: 'Expose', coverImage: { url: 'http://localhost:5000/api/media/file/6a5f3c4429d9e96bb9703e7b' }, excerpt: '20 July 2026 ko Jantar Mantar par berozgari ke khilaf peaceful student protest par police ne excessive water cannons aur force use kiya. Mainstream media ne ise violent dikhaya, par sachai kuch aur hai.', publishedAt: '2026-07-21' },
  { slug: 'electoral-bonds-scam-truth', title: 'इलेक्टोरल बॉन्ड्स विश्लेषण: चुनावी चंदे और नीतिगत समझौतों का पूरा सच', category: 'वित्तीय अनियमितता', coverImage: { url: '/indian_rupee_bg.png' }, excerpt: 'सुप्रीम कोर्ट के ऐतिहासिक फैसले के बाद जारी डेटा का गहन विश्लेषण।', publishedAt: '2024-03-15' },
  { slug: 'adani-hindenburg-full-truth', title: 'औद्योगिक एकाधिकार और सार्वजनिक धन: हिंडनबर्ग रिपोर्ट के वित्तीय साक्ष्य', category: 'विशेष खुलासे', coverImage: { url: '/indian_constitution.png' }, excerpt: 'मॉरीशस और अन्य टैक्स हैवन्स के माध्यम से संदिग्ध वित्तीय लेन-देन।', publishedAt: '2024-02-10' },
  { slug: 'fact-check-india-5th-economy-reality', title: 'आर्थिक वास्तविकता: जीडीपी के विकास दावों और बेरोजगारी दर की तुलनात्मक समीक्षा', category: 'तथ्य जांच', coverImage: { url: '/indian_constitution.png' }, excerpt: 'आधिकारिक आर्थिक दावों के विपरीत NSO और RBI के आंकड़ों का विश्लेषण।', publishedAt: '2024-04-01' },
];
// ──────────────────────────────────────────────────────────────────────────

async function fetchSection(key: string) {
  try {
    const res = await fetch(`${API}/sections/${key}`, { cache: 'no-store' });
    if (res.ok) { const d = await res.json(); return d.data?.data; }
  } catch {}
  return null;
}

export default function Home() {
  const [activeCompareTab, setActiveCompareTab] = useState(0);
  const [whistleblowerSuccess, setWhistleblowerSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [inspectingFile, setInspectingFile] = useState<any>(null);

  // Dynamic CMS content state
  const [hero, setHero] = useState<any>(FALLBACK_HERO);
  const [comparisons, setComparisons] = useState<any[]>(FALLBACK_COMPARISONS);
  const [leakedFiles, setLeakedFiles] = useState<any[]>(FALLBACK_VAULT);
  const [articles, setArticles] = useState<any[]>(FALLBACK_ARTICLES);

  useEffect(() => {
    // Fetch all sections + articles in parallel
    Promise.all([
      fetchSection('homepage_hero'),
      fetchSection('homepage_comparisons'),
      fetchSection('vault_documents'),
      fetch(`${API}/articles?limit=3`).then(r => r.ok ? r.json() : null).catch(() => null),
    ]).then(([heroData, comparisonsData, vaultData, articlesRes]) => {
      if (heroData) setHero(heroData);
      if (comparisonsData && Array.isArray(comparisonsData) && comparisonsData.length > 0) setComparisons(comparisonsData);
      if (vaultData && Array.isArray(vaultData) && vaultData.length > 0) setLeakedFiles(vaultData);
      if (articlesRes?.data?.length > 0) setArticles(articlesRes.data);
    });
  }, []);

  const filteredFiles = leakedFiles.filter(file =>
    file.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Safe tab index
  const safeTab = Math.min(activeCompareTab, comparisons.length - 1);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">

      {/* ── HERO SECTION ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[80vh] flex items-center justify-center pt-20 pb-12 px-6">
        <div className="absolute inset-0 bg-surface z-0 opacity-20">
          <img src="/indian_rupee_bg.png" alt="Investigative Background" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-background/40 z-10" />

        <div className="relative z-20 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-8 text-left">
            <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded bg-accent/10 border border-red-500/20 text-accent text-xs font-black tracking-widest uppercase">
              <ShieldAlert className="w-4 h-4" />
              {hero.badge}
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-playfair font-black text-white leading-relaxed tracking-tight py-2">
              {hero.title}
            </h1>

            <p className="text-base md:text-lg text-text-muted max-w-2xl leading-relaxed border-l border-accent pl-6">
              {hero.description}
              <span className="mt-4 block space-y-3 text-sm md:text-base">
                {(hero.highlights || []).map((hl: string, i: number) => (
                  <span key={i} className="block">• {hl}</span>
                ))}
              </span>
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-4">
              <a href="#evidence-vault" className="group flex items-center gap-3 px-8 py-3.5 text-sm font-bold text-white bg-accent rounded hover:bg-accent/90 transition-all duration-300 shadow-[0_4px_20px_rgba(239,68,68,0.25)]">
                Access Leaked Files
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#media-vs-reality" className="flex items-center gap-2 text-sm font-semibold text-text hover:text-accent transition-colors">
                Explore Comparative Ledger
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Constitution Image */}
          <div className="flex-1 relative w-full max-w-lg lg:max-w-none">
            <div className="relative border border-border bg-surface p-4 rounded shadow-2xl backdrop-blur-md">
              <div className="absolute top-2 left-2 z-30 bg-accent text-white text-[10px] font-black tracking-widest px-2.5 py-1 uppercase rounded-sm">
                Documentary Proof
              </div>
              <img 
                src={hero.image ? (hero.image.startsWith('/api/') ? `http://localhost:5000${hero.image}` : hero.image) : "/indian_constitution.png"} 
                alt="Law and Constitution evidence files" 
                className="rounded object-contain w-full h-[450px] transition-all duration-500" 
              />
              <div className="mt-4 border-t border-border/50 pt-4 flex items-center justify-between text-xs text-text-muted">
                <span className="flex items-center gap-1.5"><Fingerprint className="w-4 h-4 text-accent" /> Verified RTI Archive</span>
                <span className="font-mono text-accent bg-red-500/10 px-2 py-0.5 rounded">STATUS: DECLASSIFIED</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── NARRATIVE VS REALITY ─────────────────────────────────────────── */}
      <section id="media-vs-reality" className="py-24 px-6 max-w-7xl mx-auto relative z-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-accent font-black tracking-wider text-xs uppercase bg-accent/10 px-3 py-1 rounded">Editorial Review</span>
          <h2 className="text-3xl md:text-5xl font-playfair font-black text-text mt-4 mb-4">
            आधिकारिक नैरेटिव बनाम जमीनी हकीकत
          </h2>
          <p className="text-text-muted text-sm max-w-xl mx-auto">
            मुख्यधारा के विमर्श (mainstream narratives) की तुलना आधिकारिक वित्तीय डेटा, जन-अभिलेखों और वास्तविक साक्ष्यों से करें।
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar selector */}
          <div className="lg:col-span-4 space-y-3">
            {comparisons.map((c, i) => (
              <button key={i} onClick={() => setActiveCompareTab(i)} className={`w-full text-left p-5 rounded border transition-all duration-300 ${activeCompareTab === i ? 'bg-surface border-red-500 shadow-lg shadow-red-500/5' : 'border-border bg-background hover:bg-surface/50'}`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-text text-base">{c.topic}</span>
                  <ChevronRight className={`w-4 h-4 text-accent transition-transform ${activeCompareTab === i ? 'rotate-90' : ''}`} />
                </div>
              </button>
            ))}
          </div>

          {/* Details panel */}
          <div className="lg:col-span-8 bg-surface border border-border rounded p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Database className="w-48 h-48" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4 border-r-0 md:border-r border-border md:pr-8">
                <div className="flex items-center gap-2 text-amber-500 font-bold text-xs tracking-wider uppercase">
                  <AlertTriangle className="w-4 h-4" /> Official / Mainstream Narrative
                </div>
                <div className="text-xl font-black text-text-muted font-playfair">दावा (The Narrative)</div>
                <p className="text-sm text-text-muted leading-relaxed bg-amber-500/5 p-4 rounded border-l border-amber-500">
                  {comparisons[safeTab]?.officialNarrative}
                </p>
              </div>
              <div className="space-y-4 md:pl-4">
                <div className="flex items-center gap-2 text-red-500 font-bold text-xs tracking-wider uppercase">
                  <Eye className="w-4 h-4 animate-pulse" /> Independent Finding
                </div>
                <div className="text-xl font-black text-text font-playfair">सच्चाई (The Findings)</div>
                <p className="text-sm text-text leading-relaxed">{comparisons[safeTab]?.investigativeFinding}</p>
                <div className="pt-4 mt-4 border-t border-border/50">
                  <span className="text-[10px] font-black uppercase text-accent tracking-widest block mb-2">Verified Sources:</span>
                  <div className="text-xs font-mono text-text bg-background border border-border p-2 rounded">
                    {comparisons[safeTab]?.evidence}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── RECENT ARTICLES (Dynamic from DB) ────────────────────────────── */}
      <section className="py-24 px-6 max-w-7xl mx-auto relative z-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-border pb-6">
          <div>
            <span className="text-accent font-black tracking-wider text-xs uppercase bg-accent/10 px-3 py-1 rounded">Highlights</span>
            <h2 className="text-3xl md:text-5xl font-playfair font-black text-text mt-4 mb-3 flex items-center gap-4">
              <Eye className="w-8 h-8 text-accent animate-pulse" />
              मुख्य अन्वेषण और हालिया खुलासे
            </h2>
            <p className="text-text-muted text-sm">वे दस्तावेज़, वित्तीय साक्ष्य और तथ्य जिन्हें जनता के सामने लाना आवश्यक है।</p>
          </div>
          <Link href="/timeline" className="hidden md:flex items-center gap-2 text-accent font-bold hover:underline underline-offset-4 text-sm">
            View the Investigation Timeline <TrendingUp className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article: any, i: number) => (
            <Link key={i} href={`/article/${article.slug}`} className="group flex flex-col bg-surface rounded border border-border overflow-hidden hover:border-accent/50 hover:shadow-2xl hover:shadow-accent/5 transition-all duration-300">
              <div className="relative h-56 overflow-hidden">
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors z-10" />
                <img
                  src={article.coverImage?.url || '/indian_rupee_bg.png'}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-3 py-1 bg-background/90 backdrop-blur-sm text-text text-[10px] font-black uppercase tracking-wider rounded border border-border">
                    {article.category?.name || article.category || ''}
                  </span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <h3 className="text-lg font-bold font-playfair text-text leading-snug group-hover:text-accent transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-text-muted text-xs leading-relaxed line-clamp-3">{article.excerpt}</p>
                </div>
                <div className="flex items-center justify-between pt-4 mt-6 border-t border-border/50 text-[10px] font-black text-text-muted uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                  </span>
                  <span className="text-accent group-hover:translate-x-1 transition-transform flex items-center">
                    Read Report <ChevronRight className="w-3 h-3 ml-1" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── EVIDENCE VAULT (Dynamic from DB) ─────────────────────────────── */}
      <section id="evidence-vault" className="py-24 bg-surface/40 border-y border-border px-6 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-accent font-black tracking-wider text-xs uppercase bg-red-500/10 px-3 py-1 rounded">RTI & Archive Vault</span>
              <h2 className="text-3xl md:text-5xl font-playfair font-black text-text mt-4 mb-2">
                सार्वजनिक हित के दस्तावेज़ और साक्ष्य
              </h2>
              <p className="text-text-muted text-sm">प्रमाणित शोध पत्रों और सरकारी जांच रिपोर्टों का संग्रह।</p>
            </div>
            <div className="relative w-full max-w-sm">
              <input
                type="text"
                placeholder="Search archive..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-background border border-border focus:border-accent text-text text-sm rounded px-4 py-3 pl-10 focus:ring-0 transition-colors"
              />
              <Search className="absolute left-3 top-3.5 w-4 h-4 text-text-muted" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredFiles.length > 0 ? filteredFiles.map((file, i) => (
              <div key={i} className="group flex flex-col justify-between bg-surface border border-border hover:border-red-500/40 rounded p-6 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono text-accent bg-red-500/10 px-2.5 py-1 rounded font-bold uppercase tracking-wider">{file.status}</span>
                    <FileText className="w-6 h-6 text-text-muted group-hover:text-accent transition-colors" />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-text-muted uppercase tracking-widest block mb-1">{file.id}</span>
                    <h3 className="text-base font-bold font-playfair text-text leading-snug group-hover:text-accent transition-colors line-clamp-3">{file.title}</h3>
                  </div>
                </div>
                <div className="pt-6 mt-6 border-t border-border/50 flex items-center justify-between text-xs font-medium text-text-muted">
                  <span className="font-mono">{file.size}</span>
                  <button 
                    onClick={() => setInspectingFile(file)}
                    className="flex items-center gap-1 text-accent font-bold group-hover:translate-x-1 transition-transform"
                  >
                    Inspect File <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center py-12 text-text-muted text-sm">
                No matching records found in database.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── WHISTLEBLOWER PORTAL ──────────────────────────────────────────── */}
      <section className="py-24 px-6 max-w-7xl mx-auto relative z-20">
        <div className="border border-border bg-gradient-to-b from-surface to-background/50 rounded p-8 md:p-12 flex flex-col lg:flex-row items-center gap-12 overflow-hidden relative">
          <div className="absolute top-0 left-0 p-8 opacity-5 pointer-events-none">
            <Lock className="w-64 h-64" />
          </div>

          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 py-1 px-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-black tracking-widest uppercase rounded">
              <Fingerprint className="w-3.5 h-3.5" /> Secure Data Drop Box
            </div>
            <h2 className="text-3xl md:text-5xl font-playfair font-black text-text leading-tight">
              सार्वजनिक हित में जानकारी साझा करें
            </h2>
            <p className="text-text-muted text-sm leading-relaxed">
              यदि आपके पास किसी प्रशासनिक भ्रष्टाचार, जन-विरोधी नीतियों या संस्थागत अनियमितताओं से जुड़े दस्तावेज़, ऑडिट रिपोर्ट या साक्ष्य हैं, तो आप उन्हें यहाँ सुरक्षित रूप से साझा कर सकते हैं।
            </p>
            <div className="flex flex-wrap items-center gap-6 text-xs text-text-muted font-mono">
              <span className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-emerald-500" /> AES-256 Encrypted</span>
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-emerald-500" /> Peer-reviewed Integrity</span>
            </div>
          </div>

          <div className="w-full max-w-md bg-surface border border-border p-8 rounded shadow-2xl relative z-10">
            {whistleblowerSuccess ? (
              <div className="text-center space-y-4 py-8">
                <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded flex items-center justify-center mx-auto">
                  <FileCheck2 className="w-6 h-6 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-text">Security Ledger Created</h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  The data has been transmitted securely. Your verification token is <code className="bg-background px-1.5 py-0.5 rounded text-accent font-mono text-xs">SD-998A-E972</code>. Keep this token confidential.
                </p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setWhistleblowerSuccess(true); }} className="space-y-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-text-muted mb-2">Subject / Document Category</label>
                  <input required type="text" placeholder="e.g. Audit reports, transaction ledgers" className="w-full bg-background border border-border focus:border-accent text-text text-sm rounded px-4 py-3 focus:ring-0 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-text-muted mb-2">Message or Explanatory Note</label>
                  <textarea required rows={4} placeholder="Please explain what this evidence highlights. Avoid including any identifying details about yourself." className="w-full bg-background border border-border focus:border-accent text-text text-sm rounded px-4 py-3 focus:ring-0 transition-colors resize-none" />
                </div>
                <button type="submit" className="w-full py-4 text-sm font-bold text-white bg-accent hover:bg-accent/90 rounded transition-all duration-300 shadow-lg shadow-accent/20 flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4" /> Submit Encrypted Data
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── FILE INSPECTION MODAL ────────────────────────────────────────── */}
      {inspectingFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-[#0f0f13] border border-border rounded-lg max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative flex flex-col">
            {/* Modal Header */}
            <div className="border-b border-border p-6 flex justify-between items-start bg-surface/30">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-accent bg-red-500/10 px-2.5 py-1 rounded font-bold uppercase tracking-wider">
                    {inspectingFile.status}
                  </span>
                  <span className="text-xs font-mono text-text-muted">{inspectingFile.id}</span>
                </div>
                <h3 className="text-xl font-bold font-playfair text-text mt-2 pr-8">{inspectingFile.title}</h3>
              </div>
              <button 
                onClick={() => setInspectingFile(null)} 
                className="text-text-muted hover:text-text p-2 rounded-full hover:bg-white/5 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 space-y-6 flex-1">
              {/* File Metadata Overview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded bg-surface/50 border border-border/40 text-sm">
                <div>
                  <span className="text-xs text-text-muted block">Classification</span>
                  <span className="font-bold text-accent">{inspectingFile.status}</span>
                </div>
                <div>
                  <span className="text-xs text-text-muted block">File Size</span>
                  <span className="font-bold text-text">{inspectingFile.size}</span>
                </div>
                <div>
                  <span className="text-xs text-text-muted block">Archived On</span>
                  <span className="font-bold text-text">{inspectingFile.date}</span>
                </div>
                <div>
                  <span className="text-xs text-text-muted block">Format</span>
                  <span className="font-mono text-text">PDF / RAW DATA</span>
                </div>
              </div>

              {/* Leaked Content Preview */}
              <div className="border border-border/60 rounded bg-black/60 p-5 font-mono text-xs text-text-muted/90 relative overflow-hidden min-h-[300px]">
                {/* Watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 select-none">
                  <span className="text-red-600 font-bold border-4 border-red-600 text-6xl px-8 py-4 rotate-12 uppercase">
                    DECLASSIFIED
                  </span>
                </div>
                
                {/* File specific content */}
                {inspectingFile.content ? (
                  <div className="space-y-4">
                    <div className="text-accent border-b border-accent/20 pb-2 flex justify-between">
                      <span>[{inspectingFile.category || 'SECURE DOCUMENT'} - RAW TRANSCRIPT]</span>
                      <span>STATUS: {inspectingFile.status || 'DECLASSIFIED'}</span>
                    </div>
                    <div className="space-y-3 leading-relaxed">
                      <p className="text-white font-serif text-sm border-l-2 border-accent pl-4 py-2 font-bold">
                        "{inspectingFile.title}"
                      </p>
                      <div className="text-[11px] leading-relaxed font-mono whitespace-pre-wrap bg-surface/20 p-4 rounded border border-border/20 text-white max-h-[300px] overflow-y-auto">
                        {inspectingFile.content}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {inspectingFile.id === 'DOC-2024-001' && (
                      <div className="space-y-4">
                        <div className="text-accent border-b border-accent/20 pb-2 flex justify-between">
                          <span>[DONOR-RECEIVER MATCHING LEDGER - EXTRACT]</span>
                          <span>MATCH: CONFIRMED</span>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse min-w-[500px]">
                            <thead>
                              <tr className="border-b border-border/40 text-text">
                                <th className="py-2">Bond No</th>
                                <th className="py-2">Purchased By (Donor Company)</th>
                                <th className="py-2">Value (INR)</th>
                                <th className="py-2">Party Received</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b border-border/20 text-white">
                                <td className="py-2">EB-98745</td>
                                <td>MEGHA ENGINEERING & INFRASTRUC.</td>
                                <td>1,40,00,00,000</td>
                                <td>BJP (Bhartiya Janata Party)</td>
                              </tr>
                              <tr className="border-b border-border/20 text-white">
                                <td className="py-2">EB-10298</td>
                                <td>QWIK SUPPLY CHAIN PVT LTD</td>
                                <td>3,60,00,00,000</td>
                                <td>BJP (Bhartiya Janata Party)</td>
                              </tr>
                              <tr className="border-b border-border/20 text-white">
                                <td className="py-2">EB-44582</td>
                                <td>FUTURE GAMING & HOTEL SERVICES</td>
                                <td>5,00,00,00,000</td>
                                <td>AITC (Trinamool Congress)</td>
                              </tr>
                              <tr className="border-b border-border/20 text-white">
                                <td className="py-2">EB-72810</td>
                                <td>YASHODA SUPER SPECIALITY HOSP.</td>
                                <td>1,62,00,00,000</td>
                                <td>BRS (Bharat Rashtra Samithi)</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <p className="text-[10px] text-yellow-500 mt-4 leading-relaxed">
                          * Note: SBI unique alphanumeric numbers match perfectly between donor and party ledger, establishing a direct correlation between corporate contract wins and bond purchases.
                        </p>
                      </div>
                    )}

                    {inspectingFile.id === 'DOC-2024-002' && (
                      <div className="space-y-4">
                        <div className="text-accent border-b border-accent/20 pb-2 flex justify-between">
                          <span>[INTERNAL MINISTERIAL MEMO - CONFIDENTIAL]</span>
                          <span>LEVEL 5 SENSORSHIP</span>
                        </div>
                        <p className="text-white font-serif text-sm border-l-2 border-red-500 pl-4 py-2">
                          "Subject: Suppression of Coverage Regarding Local Protest Movements"
                        </p>
                        <div className="space-y-2 text-xs leading-relaxed">
                          <p>Date: May 12, 2024</p>
                          <p>From: Joint Secretary, MoIB</p>
                          <p>To: Directors of Digital News & Broadcast Platforms</p>
                          <p className="mt-4">
                            1. You are hereby directed to suppress all live feeds of the ongoing farmer demonstrations in Region 4.
                          </p>
                          <p>
                            2. Any discussion linking corporate land acquisitions to state subsidies must be framed strictly as policy recommendations.
                          </p>
                          <p>
                            3. Non-compliance will result in immediate suspension of broadcast license under Section 69A of the IT Act.
                          </p>
                        </div>
                      </div>
                    )}

                    {inspectingFile.id === 'DOC-2024-003' && (
                      <div className="space-y-4">
                        <div className="text-accent border-b border-accent/20 pb-2 flex justify-between">
                          <span>[PEGASUS SURVEILLANCE INTERCEPT REGISTER]</span>
                          <span>INFECTION TYPE: ZERO-CLICK</span>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse min-w-[500px]">
                            <thead>
                              <tr className="border-b border-border/40 text-text">
                                <th className="py-2">Target ID</th>
                                <th className="py-2">Profession / Role</th>
                                <th className="py-2">Device OS</th>
                                <th className="py-2">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b border-border/20 text-white">
                                <td className="py-2">IND-JRN-402</td>
                                <td>Senior Editor, Satyadarpan</td>
                                <td>iOS 16.4.1 (iPhone 13)</td>
                                <td className="text-red-500 font-bold">ACTIVE INFECTION</td>
                              </tr>
                              <tr className="border-b border-border/20 text-white">
                                <td className="py-2">IND-ACT-108</td>
                                <td>Human Rights Lawyer, Delhi</td>
                                <td>Android 13 (Galaxy S22)</td>
                                <td className="text-red-500 font-bold">ACTIVE INFECTION</td>
                              </tr>
                              <tr className="border-b border-border/20 text-white">
                                <td className="py-2">IND-POL-076</td>
                                <td>Opposition MP, Member of Finance Committee</td>
                                <td>iOS 15.7 (iPhone 11)</td>
                                <td className="text-red-500 font-bold">PAYLOAD DETECTED</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <p className="text-[10px] text-yellow-500 mt-4 leading-relaxed">
                          * Zero-click payloads were deployed using WhatsApp vulnerabilities. Call logs, WhatsApp messages, and microphone recordings were fetched every 4 hours from the server.
                        </p>
                      </div>
                    )}

                    {inspectingFile.id === 'DOC-2024-004' && (
                      <div className="space-y-4">
                        <div className="text-accent border-b border-accent/20 pb-2 flex justify-between">
                          <span>[PM CARES FUND FINANCIAL AUDIT MEMORANDUM]</span>
                          <span>DISCREPANCY DETECTED</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div className="p-3 bg-surface/30 rounded border border-border/30">
                            <span className="text-[10px] block text-text-muted">Total Collections (2020-2023)</span>
                            <span className="text-white text-base font-bold">₹10,990.23 Crore</span>
                          </div>
                          <div className="p-3 bg-surface/30 rounded border border-border/30">
                            <span className="text-[10px] block text-text-muted">Documented Expenditure</span>
                            <span className="text-white text-base font-bold">₹3,250.00 Crore</span>
                          </div>
                        </div>
                        <p className="text-white font-mono text-[11px] leading-relaxed">
                          Audit Note 4b: A total sum of ₹7,740.23 Crore remains classified under "unspecified reserves". Transaction logs indicate the diversion of these funds from SBI Escrow Accounts into private commercial papers without board oversight. Request for clarification from the PMO was rejected citing "Not a public authority" status under Section 2(h) of the RTI Act.
                        </p>
                      </div>
                    )}

                    {!['DOC-2024-001', 'DOC-2024-002', 'DOC-2024-003', 'DOC-2024-004'].includes(inspectingFile.id) && (
                      <div className="space-y-4">
                        <div className="text-accent border-b border-accent/20 pb-2 flex justify-between">
                          <span>[{inspectingFile.category || 'SECURE DOCUMENT'} - RAW TRANSCRIPT]</span>
                          <span>STATUS: {inspectingFile.status || 'DECLASSIFIED'}</span>
                        </div>
                        <div className="space-y-3 leading-relaxed">
                          <p className="text-white font-serif text-sm border-l-2 border-accent pl-4 py-2 font-bold">
                            "{inspectingFile.title}"
                          </p>
                          <p className="text-[11px] leading-relaxed">
                            SECURE RECORD ENTRY DETAILS:<br />
                            Archive Date: {inspectingFile.date || 'Classified'}<br />
                            File Signature: SHA-256 / {inspectingFile.id || 'N/A'}<br />
                            Report Size: {inspectingFile.size || 'Unknown'}
                          </p>
                          <div className="border-t border-border/20 pt-3 mt-3">
                            <p className="text-white/80 font-mono text-[10px] leading-relaxed uppercase tracking-wider">
                              [CLASSIFIED ANALYSIS REPORT SUMMARY]
                            </p>
                            <p className="mt-2 text-[10.5px] leading-relaxed italic text-text-muted">
                              "This document contains verified audit logs, testimonies, or institutional evidence verifying systemic corruption in connection with the title. Access to this declassified register has been granted under public interest regulations."
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-border p-6 flex justify-between items-center bg-surface/30">
              <span className="text-xs text-text-muted flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-accent" /> Secure connection. Declassified access logs.
              </span>
              <button 
                onClick={() => setInspectingFile(null)} 
                className="px-6 py-2.5 text-sm font-bold text-white bg-accent rounded hover:bg-accent/90 transition-colors"
              >
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

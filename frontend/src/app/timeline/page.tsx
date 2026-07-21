export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { Calendar, Eye, Clock } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://satya-darpan.onrender.com/api';

const MOCK_EVENTS = [
  {
    date: '15 March 2024',
    title: 'Electoral Bonds Scam: Supreme Court Judgment',
    description: 'Supreme Court of India calls the Electoral Bonds scheme unconstitutional and orders SBI to submit all donor records to ECI.',
    category: 'Supreme Court',
    link: '/article/electoral-bonds-scam-truth',
  },
  {
    date: '10 February 2024',
    title: 'LIC and SBI Exposure in Conglomerates Investigation',
    description: 'Investigating how public funds from LIC and SBI were systematically redirected to high-risk equity positions inside monopoly conglomerates.',
    category: 'Expose',
    link: '/article/adani-hindenburg-full-truth',
  },
  {
    date: '01 April 2024',
    title: 'Economic Real Wage Deflation Audit',
    description: 'Fact-checking economic statistics related to graduate youth unemployment reaching historical highs in urban districts.',
    category: 'Economy',
    link: '/article/fact-check-india-5th-economy-reality',
  }
];

async function getTimelineEvents() {
  try {
    const res = await fetch(`${API_URL}/articles?sort=publishedAt`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data?.length > 0) {
        return data.data.map((art: any) => ({
          date: new Date(art.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
          title: art.title,
          description: art.excerpt || '',
          category: art.category?.name || 'Investigation',
          link: `/article/${art.slug}`
        }));
      }
    }
  } catch {}
  return MOCK_EVENTS;
}

export const metadata = {
  title: 'Timeline | SatyaDarpan',
  description: 'Chronological timeline of investigations and exposes',
};

export default async function TimelinePage() {
  const events = await getTimelineEvents();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="border-l-2 border-accent pl-6 mb-16">
          <span className="text-accent font-black tracking-wider text-xs uppercase bg-accent/10 px-3 py-1 rounded">Chronology of Truth</span>
          <h1 className="text-4xl md:text-5xl font-playfair font-black text-text mt-4 mb-4">घटनाक्रम</h1>
          <p className="text-text-muted text-sm max-w-xl">
            देश की महत्वपूर्ण घटनाओं, खुलासों और सरकार की पॉलिसियों से जुड़ी कड़ियों का एक व्यवस्थित समय-क्रम।
          </p>
        </div>

        {/* Timeline body */}
        <div className="relative border-l-2 border-border/80 ml-4 space-y-12">
          {events.map((ev: any, i: number) => (
            <div key={i} className="relative pl-8 group">
              {/* Dot */}
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 border-accent bg-background group-hover:bg-accent transition-colors duration-300" />
              
              {/* Event Block */}
              <div className="bg-surface border border-border rounded p-6 hover:border-accent/40 transition-all duration-300">
                <span className="text-xs font-bold text-accent uppercase tracking-widest">{ev.category}</span>
                <div className="flex items-center gap-1.5 text-xs text-text-muted mt-1.5 mb-3">
                  <Calendar className="w-3.5 h-3.5" />
                  {ev.date}
                </div>
                <h2 className="text-lg font-playfair font-black text-text mb-2 group-hover:text-accent transition-colors">
                  {ev.title}
                </h2>
                <p className="text-sm text-text-muted leading-relaxed mb-4">
                  {ev.description}
                </p>
                {ev.link && (
                  <Link href={ev.link} className="text-xs font-bold text-accent hover:underline uppercase tracking-wider">
                    पूरा सच पढ़ें →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

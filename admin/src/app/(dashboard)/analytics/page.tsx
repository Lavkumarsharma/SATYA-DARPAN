'use client';
import { Eye, FileText, MessageSquare, TrendingUp, Users, BarChart2, ArrowUpRight } from 'lucide-react';

const stats = [
  { label: 'Total Views', value: '31,730', icon: Eye, change: '+12.5%', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { label: 'Published Articles', value: '3', icon: FileText, change: '+3 this month', color: 'text-green-500', bg: 'bg-green-500/10' },
  { label: 'Comments', value: '3', icon: MessageSquare, change: 'Pending: 2', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  { label: 'Trending Now', value: '2', icon: TrendingUp, change: 'Articles trending', color: 'text-accent', bg: 'bg-accent/10' },
];

const topArticles = [
  { title: 'Electoral Bonds Scam: ₹1.85 Lakh Crore Ka Sach', views: 14520, change: '+8.2%' },
  { title: 'Adani Group aur Hindenburg Report', views: 9870, change: '+4.1%' },
  { title: 'Fact Check: India 5th Largest Economy', views: 7340, change: '+15.6%' },
];

export default function AnalyticsPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-playfair font-bold text-text">Analytics</h1>
        <p className="text-sm text-text-muted mt-1">Platform performance overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="bg-surface border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <span className="text-xs text-green-500 font-medium flex items-center gap-1"><ArrowUpRight className="w-3 h-3" />{stat.change}</span>
            </div>
            <div className="text-2xl font-bold text-text">{stat.value}</div>
            <div className="text-sm text-text-muted mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-text mb-4 flex items-center gap-2"><BarChart2 className="w-5 h-5 text-accent" /> Top Articles by Views</h3>
          <div className="space-y-4">
            {topArticles.map((a, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-2xl font-bold text-text-muted/30 w-8">0{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text truncate">{a.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-background rounded-full h-1.5">
                      <div className="bg-accent h-1.5 rounded-full" style={{ width: `${(a.views / 14520) * 100}%` }} />
                    </div>
                    <span className="text-xs text-text-muted whitespace-nowrap">{a.views.toLocaleString()} views</span>
                  </div>
                </div>
                <span className="text-xs text-green-500 font-medium">{a.change}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-text mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-accent" /> Audience Overview</h3>
          <div className="space-y-3">
            {[['New Visitors', '68%', 'bg-blue-500'], ['Returning Visitors', '32%', 'bg-accent'], ['Mobile Users', '74%', 'bg-green-500'], ['Desktop Users', '26%', 'bg-yellow-500']].map(([label, pct, color]) => (
              <div key={label as string} className="flex items-center gap-3">
                <span className="text-sm text-text-muted w-36">{label as string}</span>
                <div className="flex-1 bg-background rounded-full h-2">
                  <div className={`${color as string} h-2 rounded-full`} style={{ width: pct as string }} />
                </div>
                <span className="text-sm font-medium text-text w-10 text-right">{pct as string}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-xs text-text-muted">📍 Top Cities: Delhi, Mumbai, Bangalore, Lucknow, Patna</p>
          </div>
        </div>
      </div>
    </div>
  );
}

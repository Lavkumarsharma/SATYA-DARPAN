'use client';
import { useEffect, useState } from 'react';
import { FileText, Eye, MessageSquare, Users, Image as ImageIcon } from 'lucide-react';
import api from '@/lib/api';

interface DashboardStats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  totalViews: number;
  totalComments: number;
  pendingComments: number;
  totalSubscribers: number;
  mediaCount: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/analytics/dashboard');
        setStats(data.data);
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="animate-pulse flex space-x-4">Loading stats...</div>;
  }

  const statCards = [
    { title: 'Total Articles', value: stats?.totalArticles || 0, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Total Views', value: stats?.totalViews || 0, icon: Eye, color: 'text-green-500', bg: 'bg-green-500/10' },
    { title: 'Pending Comments', value: stats?.pendingComments || 0, icon: MessageSquare, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { title: 'Subscribers', value: stats?.totalSubscribers || 0, icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-surface border border-border p-6 rounded-2xl flex items-center gap-4">
            <div className={`p-4 rounded-xl ${stat.bg}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-text-muted">{stat.title}</p>
              <h3 className="text-2xl font-bold text-text">{stat.value.toLocaleString()}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface border border-border p-6 rounded-2xl min-h-[300px]">
          <h3 className="text-lg font-semibold text-text mb-4">Traffic Overview</h3>
          <div className="flex items-center justify-center h-48 text-text-muted">
            Chart integration coming soon (Recharts)
          </div>
        </div>
        <div className="bg-surface border border-border p-6 rounded-2xl min-h-[300px]">
          <h3 className="text-lg font-semibold text-text mb-4">Recent Articles</h3>
          <div className="flex items-center justify-center h-48 text-text-muted">
            Table integration coming soon
          </div>
        </div>
      </div>
    </div>
  );
}

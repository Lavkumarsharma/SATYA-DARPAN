'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, Search } from 'lucide-react';
import api from '@/lib/api';
import Badge from '@/components/ui/Badge';
import { toast } from 'react-hot-toast';

export default function ArticlesPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchArticles = async () => {
    try {
      // Temporary mock data fallback if API fails
      const mockData = [
        { _id: '1', title: 'The Truth Behind the Shadows', status: 'published', author: { name: 'Admin' }, createdAt: new Date().toISOString(), views: 1245 },
        { _id: '2', title: 'Undocumented Funds Explained', status: 'draft', author: { name: 'Admin' }, createdAt: new Date().toISOString(), views: 0 },
      ];

      try {
        const { data } = await api.get('/articles/admin/all');
        setArticles(data.data?.length > 0 ? data.data : mockData);
      } catch (err) {
        console.warn('Backend not reachable, using mock data');
        setArticles(mockData);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this investigation?')) return;
    try {
      await api.delete(`/articles/${id}`);
      toast.success('Deleted successfully');
      fetchArticles();
    } catch (err) {
      toast.error('Failed to delete. Backend might not be connected.');
      setArticles(articles.filter(a => a._id !== id)); // Optimistic UI update
    }
  };

  const filteredArticles = articles.filter(a => a.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-text">Investigations</h1>
          <p className="text-sm text-text-muted mt-1">Manage all your editorial content and evidence.</p>
        </div>
        <Link 
          href="/articles/create" 
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-medium shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Investigation
        </Link>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
        {/* Toolbar */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-background/50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search investigations..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm text-text focus:outline-none focus:border-accent transition-colors"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-text">
            <thead className="bg-background/80 text-text-muted uppercase text-xs font-semibold border-b border-border">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-text-muted">Loading investigations...</td>
                </tr>
              ) : filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-text-muted">No investigations found.</td>
                </tr>
              ) : (
                filteredArticles.map((article) => (
                  <tr key={article._id} className="hover:bg-background/50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-text max-w-md truncate">
                      {article.title}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={article.status === 'published' ? 'success' : 'warning'}>
                        {article.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-text-muted">
                      {article.author?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 text-text-muted">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a href={`http://localhost:3000/article/${article.slug || article._id}`} target="_blank" className="p-2 text-text-muted hover:text-accent rounded-lg hover:bg-accent/10 transition-colors" title="View on Site">
                          <Eye className="w-4 h-4" />
                        </a>
                        <Link href={`/articles/edit/${article._id}`} className="p-2 text-text-muted hover:text-blue-500 rounded-lg hover:bg-blue-500/10 transition-colors" title="Edit">
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(article._id)} className="p-2 text-text-muted hover:text-red-500 rounded-lg hover:bg-red-500/10 transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

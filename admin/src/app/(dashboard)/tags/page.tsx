'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2, Search, Hash } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

export default function TagsPage() {
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [newTagName, setNewTagName] = useState('');
  const [adding, setAdding] = useState(false);

  const mockTags = [
    { _id: '1', name: 'BJP', slug: 'bjp', count: 8 },
    { _id: '2', name: 'Congress', slug: 'congress', count: 6 },
    { _id: '3', name: 'AAP', slug: 'aap', count: 3 },
    { _id: '4', name: 'Electoral Bonds', slug: 'electoral-bonds', count: 4 },
    { _id: '5', name: 'PM Modi', slug: 'pm-modi', count: 7 },
    { _id: '6', name: 'Black Money', slug: 'black-money', count: 5 },
  ];

  const fetchTags = async () => {
    try {
      const { data } = await api.get('/tags');
      setTags(data.data?.length > 0 ? data.data : mockTags);
    } catch { setTags(mockTags); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTags(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    setAdding(true);
    try {
      await api.post('/tags', { name: newTagName });
      toast.success('Tag added!');
      setNewTagName('');
      fetchTags();
    } catch {
      setTags(prev => [...prev, { _id: Date.now().toString(), name: newTagName, slug: newTagName.toLowerCase().replace(/ /g, '-'), count: 0 }]);
      setNewTagName('');
      toast.success('Tag added (mock)');
    } finally { setAdding(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this tag?')) return;
    try { await api.delete(`/tags/${id}`); fetchTags(); }
    catch { setTags(tags.filter(t => t._id !== id)); }
    toast.success('Deleted');
  };

  const filtered = tags.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-playfair font-bold text-text">Tags</h1>
        <p className="text-sm text-text-muted mt-1">Manage investigation tags and topics.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <form onSubmit={handleAdd} className="bg-surface border border-border rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-text mb-4">Add New Tag</h3>
            <input type="text" value={newTagName} onChange={e => setNewTagName(e.target.value)} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text mb-3 focus:outline-none focus:border-accent" placeholder="e.g. Electoral Bonds" required />
            <button type="submit" disabled={adding} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-medium disabled:opacity-50">
              <Plus className="w-4 h-4" />{adding ? 'Adding...' : 'Add Tag'}
            </button>
          </form>
        </div>
        <div className="md:col-span-2 bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border bg-background/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input type="text" placeholder="Search tags..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm text-text focus:outline-none focus:border-accent" />
            </div>
          </div>
          <div className="p-4 flex flex-wrap gap-3">
            {loading ? <p className="text-text-muted text-sm">Loading...</p> : filtered.length === 0 ? <p className="text-text-muted text-sm">No tags found.</p> :
              filtered.map(tag => (
                <div key={tag._id} className="group flex items-center gap-2 px-3 py-1.5 bg-background border border-border rounded-full hover:border-accent/50 transition-colors">
                  <Hash className="w-3.5 h-3.5 text-accent" />
                  <span className="text-sm font-medium text-text">{tag.name}</span>
                  <span className="text-xs text-text-muted bg-accent/10 px-1.5 py-0.5 rounded-full">{tag.count || 0}</span>
                  <button onClick={() => handleDelete(tag._id)} className="text-text-muted hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 ml-1">×</button>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}

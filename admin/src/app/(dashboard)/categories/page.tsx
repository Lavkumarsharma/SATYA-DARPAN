'use client';
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [adding, setAdding] = useState(false);

  const fetchCategories = async () => {
    try {
      const mockData = [
        { _id: '1', name: 'Corruption', slug: 'corruption', count: 12 },
        { _id: '2', name: 'Fact Check', slug: 'fact-check', count: 8 },
        { _id: '3', name: 'Exposé', slug: 'expose', count: 4 },
      ];
      try {
        const { data } = await api.get('/categories');
        setCategories(data.data?.length > 0 ? data.data : mockData);
      } catch (err) {
        setCategories(mockData);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setAdding(true);
    try {
      await api.post('/categories', { name: newCategoryName });
      toast.success('Category added');
      setNewCategoryName('');
      fetchCategories();
    } catch (err) {
      toast.error('Failed to add category. Backend might not be connected.');
      // Optimistic UI for mock
      setCategories([...categories, { _id: Date.now().toString(), name: newCategoryName, slug: newCategoryName.toLowerCase().replace(/ /g, '-'), count: 0 }]);
      setNewCategoryName('');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Deleted');
      fetchCategories();
    } catch (err) {
      toast.error('Failed to delete.');
      setCategories(categories.filter(c => c._id !== id));
    }
  };

  const filteredCategories = categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-playfair font-bold text-text">Categories</h1>
        <p className="text-sm text-text-muted mt-1">Organize your investigations into topics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Add Form */}
        <div className="md:col-span-1">
          <form onSubmit={handleAddCategory} className="bg-surface border border-border rounded-xl p-6 shadow-sm sticky top-6">
            <h3 className="text-lg font-bold text-text mb-4">Add New Category</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1">Name</label>
                <input 
                  type="text" 
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-accent text-text"
                  placeholder="e.g. Political Scams"
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={adding}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-medium disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                {adding ? 'Adding...' : 'Add Category'}
              </button>
            </div>
          </form>
        </div>

        {/* Categories Table */}
        <div className="md:col-span-2 bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border flex items-center bg-background/50">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input 
                type="text" 
                placeholder="Search categories..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm text-text focus:outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-text">
              <thead className="bg-background/80 text-text-muted uppercase text-xs font-semibold border-b border-border">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Slug</th>
                  <th className="px-6 py-4 text-center">Articles</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-text-muted">Loading categories...</td>
                  </tr>
                ) : filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-text-muted">No categories found.</td>
                  </tr>
                ) : (
                  filteredCategories.map((cat) => (
                    <tr key={cat._id} className="hover:bg-background/50 transition-colors group">
                      <td className="px-6 py-4 font-bold text-text">{cat.name}</td>
                      <td className="px-6 py-4 text-text-muted font-mono text-xs">{cat.slug}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-accent/10 text-accent font-bold text-xs">
                          {cat.count || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-text-muted hover:text-blue-500 rounded-lg hover:bg-blue-500/10 transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(cat._id)} className="p-2 text-text-muted hover:text-red-500 rounded-lg hover:bg-red-500/10 transition-colors">
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
    </div>
  );
}

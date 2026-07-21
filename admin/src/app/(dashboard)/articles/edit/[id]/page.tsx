'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdvancedEditor from '@/components/editor/Editor';
import ImageUploader from '@/components/ui/ImageUploader';
import { Save, ArrowLeft, Globe, FileText, Trash2, ImageIcon, Tag } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState<any>({ type: 'doc', content: [] });
  const [categoryId, setCategoryId] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [isFactCheck, setIsFactCheck] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState('draft');
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articleRes, catRes] = await Promise.all([
          api.get(`/articles/admin/${id}`),
          api.get('/categories'),
        ]);

        const a = articleRes.data.data;
        setTitle(a.title || '');
        setExcerpt(a.excerpt || '');
        setContent(a.content || { type: 'doc', content: [] });
        setCategoryId(a.category?._id || a.category || '');
        setCoverImageUrl(a.coverImage?.url || '');
        setIsFactCheck(!!a.factCheck);
        setIsFeatured(!!a.featured);
        setStatus(a.status || 'draft');

        if (catRes.data.success) setCategories(catRes.data.data || []);
      } catch (err) {
        toast.error('Failed to load article.');
        router.push('/articles');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSave = async (newStatus: 'draft' | 'published') => {
    if (!title.trim()) { toast.error('Title is required'); return; }
    setSaving(true);
    try {
      const payload: any = {
        title,
        excerpt,
        content,
        status: newStatus,
        factCheck: isFactCheck,
        featured: isFeatured,
        ...(categoryId && { category: categoryId }),
        ...(coverImageUrl && { coverImage: { url: coverImageUrl, alt: title } }),
        ...(newStatus === 'published' && !status.includes('published') && { publishedAt: new Date().toISOString() }),
      };

      await api.put(`/articles/${id}`, payload);
      toast.success(newStatus === 'published' ? 'Published! Live on website now.' : 'Saved as draft.');
      router.push('/articles');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this investigation permanently? This cannot be undone.')) return;
    try {
      await api.delete(`/articles/${id}`);
      toast.success('Investigation deleted.');
      router.push('/articles');
    } catch {
      toast.error('Failed to delete.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-text-muted animate-pulse">Loading investigation...</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Sticky header */}
      <div className="flex items-center justify-between sticky top-0 z-20 bg-background/95 backdrop-blur-sm py-4 border-b border-border">
        <div className="flex items-center gap-4">
          <Link href="/articles" className="p-2 bg-surface border border-border rounded-lg text-text-muted hover:text-text transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-text font-playfair">Edit Investigation</h1>
            <p className="text-xs text-text-muted">
              Status: <span className={`font-bold ${status === 'published' ? 'text-emerald-500' : 'text-amber-500'}`}>{status}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-3 py-2 text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500/10 transition-colors text-sm"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
          <button
            onClick={() => handleSave('draft')}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-surface border border-border text-text rounded-lg hover:bg-background transition-colors text-sm font-medium"
          >
            <FileText className="w-4 h-4" />
            Save Draft
          </button>
          <button
            onClick={() => handleSave('published')}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors text-sm font-bold shadow-lg shadow-accent/20"
          >
            <Globe className="w-4 h-4" />
            {saving ? 'Saving...' : 'Publish Now'}
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter article title..."
          className="w-full text-3xl font-playfair font-bold bg-transparent border-none outline-none text-text placeholder:text-text-muted/40"
        />
      </div>

      {/* Excerpt */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <label className="block text-xs font-black uppercase tracking-wider text-text-muted mb-3">Article Summary / Excerpt</label>
        <textarea
          rows={2}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="A short compelling summary shown in article cards on the homepage..."
          className="w-full bg-background border border-border focus:border-accent text-text text-sm rounded px-3 py-2 focus:ring-0 transition-colors resize-none"
        />
      </div>

      {/* Cover Image */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <label className="block text-xs font-black uppercase tracking-wider text-text-muted mb-3 flex items-center gap-2">
          Cover Image URL
        </label>
        <ImageUploader 
          currentImage={coverImageUrl} 
          onUploadSuccess={(url) => setCoverImageUrl(url)}
          enableCrop={true}
          aspectRatio={16/9}
        />
        <div className="mt-4">
          <label className="block text-xs text-text-muted mb-2">Or paste URL directly</label>
          <input
            type="url"
            value={coverImageUrl}
            onChange={(e) => setCoverImageUrl(e.target.value)}
            placeholder="https://your-image-url.com/image.jpg"
            className="w-full bg-background border border-border focus:border-accent text-text text-sm rounded px-3 py-2 focus:ring-0 transition-colors"
          />
        </div>
      </div>

      {/* Metadata */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <label className="block text-xs font-black uppercase tracking-wider text-text-muted mb-4">Article Metadata</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-text-muted mb-1 flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-background border border-border focus:border-accent text-text text-sm rounded px-3 py-2 focus:ring-0"
            >
              <option value="">Select category...</option>
              {categories.map((c: any) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-3 justify-end">
            <div onClick={() => setIsFactCheck(!isFactCheck)} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-10 h-5 rounded-full transition-colors relative ${isFactCheck ? 'bg-accent' : 'bg-border'}`}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${isFactCheck ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
              <span className="text-sm text-text-muted group-hover:text-text select-none">Mark as Fact Check</span>
            </div>
            <div onClick={() => setIsFeatured(!isFeatured)} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-10 h-5 rounded-full transition-colors relative ${isFeatured ? 'bg-accent' : 'bg-border'}`}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${isFeatured ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
              <span className="text-sm text-text-muted group-hover:text-text select-none">Feature on Homepage</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rich Text Editor */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <h3 className="text-sm font-black uppercase tracking-wider text-text-muted mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4" /> Article Body
          <span className="text-[10px] normal-case font-normal text-text-muted ml-2">
            (Bold, Italic, Underline, Color, Highlight, Headings, Links, Images, Lists — all supported)
          </span>
        </h3>
        <AdvancedEditor content={content} onChange={setContent} />
      </div>
    </div>
  );
}

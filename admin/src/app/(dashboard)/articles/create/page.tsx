'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import ImageUploader from '@/components/ui/ImageUploader';
import { Save, ArrowLeft, Image as ImageIcon, Globe, FileText, Tag, Hash } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

const AdvancedEditor = dynamic(() => import('@/components/editor/Editor'), {
  ssr: false,
  loading: () => (
    <div className="border border-border rounded-xl bg-background min-h-[500px] flex items-center justify-center text-text-muted animate-pulse">
      Loading editor...
    </div>
  ),
});

export default function CreateArticlePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState<any>({ type: 'doc', content: [] });
  const [categoryId, setCategoryId] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [isFactCheck, setIsFactCheck] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/categories').then(({ data }) => {
      if (data.success) setCategories(data.data || []);
    }).catch(() => {});
  }, []);

  const handleSave = async (status: 'draft' | 'published') => {
    if (!title.trim()) { toast.error('Title is required'); return; }
    setLoading(true);
    try {
      const payload: any = {
        title,
        excerpt,
        content,
        status,
        factCheck: isFactCheck,
        featured: isFeatured,
        ...(categoryId && { category: categoryId }),
        ...(coverImageUrl && { coverImage: { url: coverImageUrl, alt: title } }),
        ...(status === 'published' && { publishedAt: new Date().toISOString() }),
      };

      const { data } = await api.post('/articles', payload);
      toast.success(status === 'published' ? 'Investigation published! Now live on website.' : 'Saved as draft.');
      router.push('/articles');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save. Make sure you are logged in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top header bar */}
      <div className="flex items-center justify-between sticky top-0 z-20 bg-background/95 backdrop-blur-sm py-4 border-b border-border">
        <div className="flex items-center gap-4">
          <Link href="/articles" className="p-2 bg-surface border border-border rounded-lg text-text-muted hover:text-text transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-text font-playfair">New Investigation</h1>
            <p className="text-xs text-text-muted">Create a detailed report with evidence</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSave('draft')}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-surface border border-border text-text rounded-lg hover:bg-background transition-colors text-sm font-medium"
          >
            <FileText className="w-4 h-4" />
            Save Draft
          </button>
          <button
            onClick={() => handleSave('published')}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors text-sm font-bold shadow-lg shadow-accent/20"
          >
            <Globe className="w-4 h-4" />
            {loading ? 'Publishing...' : 'Publish Now'}
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a compelling investigative title..."
          className="w-full text-3xl font-playfair font-bold bg-transparent border-none outline-none text-text placeholder:text-text-muted/40"
        />
      </div>

      {/* Excerpt / Summary */}
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

      {/* Cover Image URL */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <label className="block text-xs font-black uppercase tracking-wider text-text-muted mb-3 flex items-center gap-2">
          <ImageIcon className="w-4 h-4" /> Cover Image
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

      {/* Metadata: Category, Tags, Flags */}
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
            <div
              onClick={() => setIsFactCheck(!isFactCheck)}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className={`w-10 h-5 rounded-full transition-colors relative ${isFactCheck ? 'bg-accent' : 'bg-border'}`}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${isFactCheck ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
              <span className="text-sm text-text-muted group-hover:text-text select-none">Mark as Fact Check</span>
            </div>

            <div
              onClick={() => setIsFeatured(!isFeatured)}
              className="flex items-center gap-3 cursor-pointer group"
            >
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

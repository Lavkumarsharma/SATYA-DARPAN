'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Upload, Trash2, Search, Image as ImageIcon, Video, FileText, Copy, Check, X, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import Badge from '@/components/ui/Badge';

type MediaItem = {
  _id: string;
  name: string;
  url: string;
  resourceType: 'image' | 'video' | 'raw';
  mimetype: string;
  size: number;
  folder: string;
  createdAt: string;
};

export default function MediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [isDragging, setIsDragging] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async () => {
    try {
      const { data } = await api.get('/media');
      setMedia(data.data || []);
    } catch (err) {
      // Show empty state if backend not ready
      setMedia([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMedia(); }, []);

  const handleUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadProgress(0);

    const fileArray = Array.from(files);
    let uploaded = 0;

    for (const file of fileArray) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', file.name);

      try {
        await api.post('/media/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (e) => {
            if (e.total) setUploadProgress(Math.round((e.loaded / e.total) * 100));
          },
        });
        uploaded++;
        toast.success(`Uploaded: ${file.name}`);
      } catch (err: any) {
        toast.error(`Failed: ${file.name} — ${err?.response?.data?.message || 'Server error'}`);
      }
    }

    setUploadProgress(0);
    setUploading(false);
    fetchMedia();
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) handleUpload(e.dataTransfer.files);
  }, []);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const handleDelete = async (item: MediaItem) => {
    if (!confirm(`Delete "${item.name}"?`)) return;
    try {
      await api.delete(`/media/${item._id}`);
      toast.success('Deleted');
      setSelectedItem(null);
      fetchMedia();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success('URL copied!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getIcon = (type: string) => {
    if (type === 'image') return <ImageIcon className="w-4 h-4" />;
    if (type === 'video') return <Video className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  const filtered = media.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || m.resourceType === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-text">Media Library</h1>
          <p className="text-sm text-text-muted mt-1">Upload and manage images, videos, and documents. All files stored in MongoDB.</p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-medium shadow-sm"
        >
          <Upload className="w-4 h-4" /> Upload Files
        </button>
        <input ref={fileInputRef} type="file" multiple accept="image/*,video/*,application/pdf" className="hidden" onChange={e => e.target.files && handleUpload(e.target.files)} />
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-accent bg-accent/10 scale-[1.01]'
            : 'border-border hover:border-accent/50 hover:bg-accent/5'
        }`}
      >
        {uploading ? (
          <div className="space-y-3">
            <Loader2 className="w-10 h-10 text-accent mx-auto animate-spin" />
            <p className="text-text font-medium">Uploading to MongoDB...</p>
            <div className="max-w-xs mx-auto bg-background rounded-full h-2">
              <div className="bg-accent h-2 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
            </div>
            <p className="text-text-muted text-sm">{uploadProgress}%</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto">
              <Upload className="w-7 h-7 text-accent" />
            </div>
            <div>
              <p className="text-text font-semibold text-lg">Drop files here or click to upload</p>
              <p className="text-text-muted text-sm mt-1">Supports images, videos, PDFs • Max 200MB per file</p>
              <p className="text-accent text-xs font-medium mt-1">📦 Files stored directly in MongoDB — no Cloudinary needed</p>
            </div>
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search media..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-lg text-sm text-text focus:outline-none focus:border-accent transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {[
            { key: 'all', label: 'All', icon: null },
            { key: 'image', label: 'Images', icon: <ImageIcon className="w-3.5 h-3.5" /> },
            { key: 'video', label: 'Videos', icon: <Video className="w-3.5 h-3.5" /> },
            { key: 'raw', label: 'Files', icon: <FileText className="w-3.5 h-3.5" /> },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f.key ? 'bg-accent text-white' : 'bg-surface border border-border text-text-muted hover:text-text'
              }`}
            >
              {f.icon}{f.label}
            </button>
          ))}
        </div>
        <div className="text-sm text-text-muted self-center ml-auto">{filtered.length} items</div>
      </div>

      <div className="flex gap-6">
        {/* Media Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="aspect-square bg-surface border border-border rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-text-muted">
              <Upload className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No media found</p>
              <p className="text-sm mt-1">Upload your first file using the zone above</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filtered.map(item => (
                <div
                  key={item._id}
                  onClick={() => setSelectedItem(item)}
                  className={`group relative aspect-square rounded-xl border overflow-hidden cursor-pointer transition-all ${
                    selectedItem?._id === item._id
                      ? 'border-accent ring-2 ring-accent/30 scale-[1.02]'
                      : 'border-border hover:border-accent/50 hover:scale-[1.01]'
                  }`}
                >
                  {item.resourceType === 'image' ? (
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-full object-cover bg-surface"
                      loading="lazy"
                    />
                  ) : item.resourceType === 'video' ? (
                    <div className="w-full h-full bg-surface flex flex-col items-center justify-center gap-2">
                      <Video className="w-10 h-10 text-accent/70" />
                      <span className="text-xs text-text-muted text-center px-2 truncate w-full text-center">
                        {item.name}
                      </span>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-surface flex flex-col items-center justify-center gap-2">
                      <FileText className="w-10 h-10 text-accent/70" />
                      <span className="text-xs text-text-muted px-2 truncate w-full text-center">{item.name}</span>
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={e => { e.stopPropagation(); copyUrl(item.url, item._id); }}
                      className="p-2 bg-surface rounded-lg border border-border hover:border-accent text-text hover:text-accent transition-colors"
                      title="Copy URL"
                    >
                      {copiedId === item._id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); handleDelete(item); }}
                      className="p-2 bg-surface rounded-lg border border-border hover:border-red-500 text-text hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selectedItem && (
          <div className="w-72 flex-shrink-0 bg-surface border border-border rounded-xl p-5 space-y-4 self-start sticky top-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-text">File Details</h3>
              <button onClick={() => setSelectedItem(null)} className="text-text-muted hover:text-text transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Preview */}
            <div className="aspect-video bg-background rounded-lg overflow-hidden border border-border flex items-center justify-center">
              {selectedItem.resourceType === 'image' ? (
                <img src={selectedItem.url} alt={selectedItem.name} className="w-full h-full object-contain" />
              ) : selectedItem.resourceType === 'video' ? (
                <video src={selectedItem.url} controls className="w-full h-full" />
              ) : (
                <FileText className="w-12 h-12 text-accent/50" />
              )}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-text-muted w-16 flex-shrink-0">Name</span>
                <span className="text-text font-medium truncate">{selectedItem.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-text-muted w-16 flex-shrink-0">Type</span>
                <Badge variant={selectedItem.resourceType === 'image' ? 'info' : selectedItem.resourceType === 'video' ? 'success' : 'default'}>
                  {selectedItem.resourceType}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-text-muted w-16 flex-shrink-0">Size</span>
                <span className="text-text">{formatSize(selectedItem.size)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-text-muted w-16 flex-shrink-0">Storage</span>
                <span className="text-green-500 font-medium text-xs">🟢 MongoDB</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-text-muted w-16 flex-shrink-0">Date</span>
                <span className="text-text">{new Date(selectedItem.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-text-muted">Direct URL</label>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={selectedItem.url}
                  className="flex-1 px-2 py-1.5 bg-background border border-border rounded-lg text-xs text-text-muted focus:outline-none font-mono"
                />
                <button
                  onClick={() => copyUrl(selectedItem.url, selectedItem._id)}
                  className="p-1.5 bg-accent/10 border border-accent/20 rounded-lg text-accent hover:bg-accent/20 transition-colors"
                >
                  {copiedId === selectedItem._id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              onClick={() => handleDelete(selectedItem)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-500 border border-red-500/20 hover:bg-red-500/10 rounded-lg transition-colors font-medium"
            >
              <Trash2 className="w-4 h-4" /> Delete File
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

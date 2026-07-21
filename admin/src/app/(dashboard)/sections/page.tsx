'use client';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Sliders, Save, Plus, Trash2, HelpCircle } from 'lucide-react';
import api from '@/lib/api';
import ImageUploader from '@/components/ui/ImageUploader';

export default function SectionCmsPage() {
  const [sections, setSections] = useState<any[]>([]);
  const [selectedKey, setSelectedKey] = useState<string>('homepage_hero');
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  
  // Local form states matching database keys
  const [formData, setFormData] = useState<any>(null);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/sections`, { credentials: 'include' });
      const json = await res.json();
      const sectionData = json.data || [];
      setSections(sectionData);
      
      const active = sectionData.find((s: any) => s.key === selectedKey);
      if (active) {
        setFormData(JSON.parse(JSON.stringify(active.data)));
      }
    } catch (err: any) {
      console.error('Fetch sections error:', err);
      toast.error(`Error: ${err?.message || 'Failed to load sections'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, [selectedKey]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const active = sections.find((s: any) => s.key === selectedKey);
      if (!active) return;

      await api.put(`/sections/${selectedKey}`, {
        title: active.title,
        data: formData
      });
      toast.success('Section updated successfully!');
      fetchSections();
    } catch (err: any) {
      toast.error('Failed to save changes. Make sure backend is running.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="text-text-muted animate-pulse">Loading CMS layout...</div>
      </div>
    );
  }

  // Active section metadata helper
  const activeSection = sections.find((s: any) => s.key === selectedKey);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-playfair font-black text-text flex items-center gap-3">
            <Sliders className="w-8 h-8 text-accent" />
            Website Section CMS
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Edit and customize the headline, comparison ledgers, leaked documents, and pages content in real-time.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-3 text-sm font-bold text-white bg-accent hover:bg-accent/90 rounded shadow-lg shadow-accent/20 transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Section'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Navigation Tabs (Left list) */}
        <div className="lg:col-span-3 space-y-2">
          {sections.map((sec) => (
            <button
              key={sec.key}
              onClick={() => {
                setSelectedKey(sec.key);
                setFormData(null);
              }}
              className={`w-full text-left px-4 py-3 rounded border text-sm font-bold transition-all ${
                selectedKey === sec.key
                  ? 'border-accent bg-accent/5 text-accent shadow'
                  : 'border-border bg-surface text-text-muted hover:text-text'
              }`}
            >
              {sec.title}
              <span className="block text-[10px] font-normal text-text-muted mt-0.5 font-mono">{sec.key}</span>
            </button>
          ))}
        </div>

        {/* Editing Workspace Panel */}
        <div className="lg:col-span-9 bg-surface border border-border rounded-xl p-6 md:p-8 space-y-6">
          <div className="border-b border-border pb-4">
            <h2 className="text-xl font-bold text-text">{activeSection?.title}</h2>
            <p className="text-xs text-text-muted font-mono mt-0.5">Edit config values under d:/सत्यदर्पण/backend/database</p>
          </div>

          {formData && (
            <div className="space-y-6">
              
              {/* RENDER FORM FIELDS DYNAMICALLY BASED ON KEY */}

              {/* 1. HOMEPAGE HERO */}
              {selectedKey === 'homepage_hero' && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Hero Image</label>
                    <ImageUploader 
                      aspectRatio={4 / 3}
                      currentImage={formData.image || '/indian_constitution.png'}
                      onUploadSuccess={(url) => setFormData({ ...formData, image: url })}
                      enableCrop={true}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Category Badge</label>
                    <input 
                      type="text" 
                      value={formData.badge || ''}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      className="w-full bg-background border border-border focus:border-accent text-text text-sm rounded px-4 py-3 focus:ring-0 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Primary Title</label>
                    <input 
                      type="text" 
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-background border border-border focus:border-accent text-text text-sm rounded px-4 py-3 focus:ring-0 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Lead Paragraph Description</label>
                    <textarea 
                      rows={3}
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-background border border-border focus:border-accent text-text text-sm rounded px-4 py-3 focus:ring-0 transition-colors resize-none"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-text-muted">Highlights Bullet points</label>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, highlights: [...(formData.highlights || []), ''] })}
                        className="text-xs text-accent hover:underline flex items-center gap-1 font-bold"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Bullet
                      </button>
                    </div>
                    <div className="space-y-3">
                      {formData.highlights?.map((hl: string, idx: number) => (
                        <div key={idx} className="flex gap-3">
                          <input 
                            type="text" 
                            value={hl}
                            onChange={(e) => {
                              const updated = [...formData.highlights];
                              updated[idx] = e.target.value;
                              setFormData({ ...formData, highlights: updated });
                            }}
                            className="flex-1 bg-background border border-border focus:border-accent text-text text-sm rounded px-4 py-3 focus:ring-0 transition-colors"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = formData.highlights.filter((_: any, i: number) => i !== idx);
                              setFormData({ ...formData, highlights: updated });
                            }}
                            className="p-3 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 2. HOMEPAGE COMPARISONS (Narrative vs Reality) */}
              {selectedKey === 'homepage_comparisons' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-muted uppercase">Comparison Topics</span>
                    <button
                      type="button"
                      onClick={() => setFormData([...formData, { topic: 'New Topic', officialNarrative: '', investigativeFinding: '', evidence: '' }])}
                      className="text-xs text-accent hover:underline flex items-center gap-1 font-bold"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Topic Comparison
                    </button>
                  </div>
                  
                  {Array.isArray(formData) && formData.map((comp: any, idx: number) => (
                    <div key={idx} className="p-5 border border-border bg-background rounded-lg space-y-4 relative">
                      <div className="absolute top-4 right-4">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = formData.filter((_: any, i: number) => i !== idx);
                            setFormData(updated);
                          }}
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                          title="Delete Comparison Block"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="w-3/4">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1">Topic Header</label>
                        <input 
                          type="text" 
                          value={comp.topic || ''}
                          onChange={(e) => {
                            const updated = [...formData];
                            updated[idx].topic = e.target.value;
                            setFormData(updated);
                          }}
                          className="w-full bg-surface border border-border focus:border-accent text-text text-sm font-bold rounded px-3 py-2 focus:ring-0 transition-colors"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-amber-500 mb-1">Official / Mainstream Narrative</label>
                          <textarea 
                            rows={3}
                            value={comp.officialNarrative || ''}
                            onChange={(e) => {
                              const updated = [...formData];
                              updated[idx].officialNarrative = e.target.value;
                              setFormData(updated);
                            }}
                            className="w-full bg-surface border border-border focus:border-accent text-text text-sm rounded px-3 py-2 focus:ring-0 transition-colors resize-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-red-500 mb-1">Verified Finding / Truth</label>
                          <textarea 
                            rows={3}
                            value={comp.investigativeFinding || ''}
                            onChange={(e) => {
                              const updated = [...formData];
                              updated[idx].investigativeFinding = e.target.value;
                              setFormData(updated);
                            }}
                            className="w-full bg-surface border border-border focus:border-accent text-text text-sm rounded px-3 py-2 focus:ring-0 transition-colors resize-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1">Evidence Sources (Comma separated)</label>
                        <input 
                          type="text" 
                          value={comp.evidence || ''}
                          onChange={(e) => {
                            const updated = [...formData];
                            updated[idx].evidence = e.target.value;
                            setFormData(updated);
                          }}
                          className="w-full bg-surface border border-border focus:border-accent text-text text-xs rounded px-3 py-2 focus:ring-0 transition-colors"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 3. VAULT DOCUMENTS */}
              {selectedKey === 'vault_documents' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-muted uppercase">Vault Documents</span>
                    <button
                      type="button"
                      onClick={() => setFormData([...formData, { id: `DOC-2024-00${formData.length + 1}`, title: '', category: 'वित्तीय अनियमितता', date: 'March 2024', size: '1.2 MB', status: 'VERIFIED' }])}
                      className="text-xs text-accent hover:underline flex items-center gap-1 font-bold"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Document
                    </button>
                  </div>

                  {Array.isArray(formData) && formData.map((doc: any, idx: number) => (
                    <div key={idx} className="p-4 border border-border bg-background rounded-lg grid grid-cols-1 sm:grid-cols-12 gap-4 relative">
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formData.filter((_: any, i: number) => i !== idx);
                          setFormData(updated);
                        }}
                        className="absolute top-2 right-2 text-red-500 p-2 hover:bg-red-500/10 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1">Doc ID</label>
                        <input 
                          type="text" 
                          value={doc.id || ''}
                          onChange={(e) => {
                            const updated = [...formData];
                            updated[idx].id = e.target.value;
                            setFormData(updated);
                          }}
                          className="w-full bg-surface border border-border focus:border-accent text-text text-xs rounded px-2 py-1.5 focus:ring-0 font-mono"
                        />
                      </div>

                      <div className="sm:col-span-6">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1">Document Title</label>
                        <input 
                          type="text" 
                          value={doc.title || ''}
                          onChange={(e) => {
                            const updated = [...formData];
                            updated[idx].title = e.target.value;
                            setFormData(updated);
                          }}
                          className="w-full bg-surface border border-border focus:border-accent text-text text-xs rounded px-2 py-1.5 focus:ring-0"
                        />
                      </div>

                      <div className="sm:col-span-4">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1">Category (Hindi)</label>
                        <input 
                          type="text" 
                          value={doc.category || ''}
                          onChange={(e) => {
                            const updated = [...formData];
                            updated[idx].category = e.target.value;
                            setFormData(updated);
                          }}
                          className="w-full bg-surface border border-border focus:border-accent text-text text-xs rounded px-2 py-1.5 focus:ring-0"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1">Publish Date</label>
                        <input 
                          type="text" 
                          value={doc.date || ''}
                          onChange={(e) => {
                            const updated = [...formData];
                            updated[idx].date = e.target.value;
                            setFormData(updated);
                          }}
                          className="w-full bg-surface border border-border focus:border-accent text-text text-xs rounded px-2 py-1.5 focus:ring-0"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1">File Size</label>
                        <input 
                          type="text" 
                          value={doc.size || ''}
                          onChange={(e) => {
                            const updated = [...formData];
                            updated[idx].size = e.target.value;
                            setFormData(updated);
                          }}
                          className="w-full bg-surface border border-border focus:border-accent text-text text-xs rounded px-2 py-1.5 focus:ring-0 font-mono"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1">Risk / Status Tag</label>
                        <input 
                          type="text" 
                          value={doc.status || ''}
                          onChange={(e) => {
                            const updated = [...formData];
                            updated[idx].status = e.target.value;
                            setFormData(updated);
                          }}
                          className="w-full bg-surface border border-border focus:border-accent text-text text-xs rounded px-2 py-1.5 focus:ring-0"
                        />
                      </div>

                      <div className="sm:col-span-12">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1">Declassified Preview Content (Raw text / ledger data)</label>
                        <textarea 
                          rows={3}
                          value={doc.content || ''}
                          onChange={(e) => {
                            const updated = [...formData];
                            updated[idx].content = e.target.value;
                            setFormData(updated);
                          }}
                          className="w-full bg-surface border border-border focus:border-accent text-text text-xs rounded px-3 py-2 focus:ring-0 font-mono resize-none"
                          placeholder="Enter declassified document logs, tables, or transcript text..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 4. ABOUT PAGE CONFIG */}
              {selectedKey === 'about_page' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Main Heading Badge</label>
                      <input 
                        type="text" 
                        value={formData.badge || ''}
                        onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                        className="w-full bg-background border border-border focus:border-accent text-text text-sm rounded px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Main Title</label>
                      <input 
                        type="text" 
                        value={formData.title || ''}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full bg-background border border-border focus:border-accent text-text text-sm rounded px-3 py-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Page Subtitle / Lead Paragraph</label>
                    <textarea 
                      rows={2}
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-background border border-border focus:border-accent text-text text-sm rounded px-3 py-2 resize-none"
                    />
                  </div>

                  <div className="border-t border-border pt-4 space-y-4">
                    <h3 className="text-sm font-bold text-accent">Mission Details Section</h3>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Section Header</label>
                      <input 
                        type="text" 
                        value={formData.missionTitle || ''}
                        onChange={(e) => setFormData({ ...formData, missionTitle: e.target.value })}
                        className="w-full bg-background border border-border focus:border-accent text-text text-sm rounded px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Mission Paragraph 1</label>
                      <textarea 
                        rows={3}
                        value={formData.missionParagraphs?.[0] || ''}
                        onChange={(e) => {
                          const updated = [...(formData.missionParagraphs || [])];
                          updated[0] = e.target.value;
                          setFormData({ ...formData, missionParagraphs: updated });
                        }}
                        className="w-full bg-background border border-border focus:border-accent text-text text-sm rounded px-3 py-2 resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Mission Paragraph 2</label>
                      <textarea 
                        rows={3}
                        value={formData.missionParagraphs?.[1] || ''}
                        onChange={(e) => {
                          const updated = [...(formData.missionParagraphs || [])];
                          updated[1] = e.target.value;
                          setFormData({ ...formData, missionParagraphs: updated });
                        }}
                        className="w-full bg-background border border-border focus:border-accent text-text text-sm rounded px-3 py-2 resize-none"
                      />
                    </div>
                  </div>

                  <div className="border-t border-border pt-4 space-y-4">
                    <h3 className="text-sm font-bold text-accent">Public Interest Section</h3>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Section Header</label>
                      <input 
                        type="text" 
                        value={formData.publicInterestTitle || ''}
                        onChange={(e) => setFormData({ ...formData, publicInterestTitle: e.target.value })}
                        className="w-full bg-background border border-border focus:border-accent text-text text-sm rounded px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Content Text</label>
                      <textarea 
                        rows={4}
                        value={formData.publicInterestText || ''}
                        onChange={(e) => setFormData({ ...formData, publicInterestText: e.target.value })}
                        className="w-full bg-background border border-border focus:border-accent text-text text-sm rounded px-3 py-2 resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';
import { useState, useEffect } from 'react';
import { MessageSquare, Send, User, Clock, CheckCircle2 } from 'lucide-react';

interface CommentsSectionProps {
  articleId: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://satya-darpan.onrender.com/api';

export default function CommentsSection({ articleId }: CommentsSectionProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/comments/article/${articleId}`, { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        setComments(json.data || []);
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (articleId) {
      fetchComments();
    }
  }, [articleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    setSubmitting(true);
    setSuccessMsg('');

    try {
      const res = await fetch(`${API_URL}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId,
          name,
          email,
          content,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        setSuccessMsg('आपका कमेंट सफलतापूर्वक पोस्ट हो गया है!');
        setContent('');
        // Add new comment locally if returned
        if (json.data) {
          setComments((prev) => [json.data, ...prev]);
        } else {
          fetchComments();
        }
      } else {
        alert('कमेंट पोस्ट करने में विफल। कृपया पुनः प्रयास करें।');
      }
    } catch (err) {
      console.error('Comment submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-16 pt-10 border-t border-border">
      <h3 className="text-2xl font-playfair font-black text-text mb-8 flex items-center gap-3">
        <MessageSquare className="w-6 h-6 text-accent" />
        पाठकों की प्रतिक्रियाएं & टिप्पणियां ({comments.length})
      </h3>

      {/* Comment Form */}
      <div className="bg-surface border border-border rounded-xl p-6 md:p-8 mb-12 shadow-lg">
        <h4 className="text-base font-bold text-text mb-4">अपनी टिप्पणी साझा करें</h4>

        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm font-medium rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">आपका नाम *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="उदा. राहुल शर्मा"
                className="w-full bg-background border border-border focus:border-accent text-text text-sm rounded px-4 py-2.5 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">ईमेल (ऐच्छिक)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rahul@example.com"
                className="w-full bg-background border border-border focus:border-accent text-text text-sm rounded px-4 py-2.5 outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">आपकी टिप्पणी *</label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="इस अन्वेषण और साक्ष्यों पर अपने विचार व्यक्त करें..."
              className="w-full bg-background border border-border focus:border-accent text-text text-sm rounded px-4 py-3 outline-none transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white font-bold rounded text-sm hover:bg-accent/90 transition-all shadow-md shadow-accent/20 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {submitting ? 'पोस्ट हो रहा है...' : 'टिप्पणी पोस्ट करें'}
          </button>
        </form>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-text-muted text-sm animate-pulse">टिप्पणियां लोड हो रही हैं...</div>
        ) : comments.length > 0 ? (
          comments.map((comment: any, i: number) => (
            <div key={i} className="bg-surface/50 border border-border rounded-xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/30 text-accent font-bold flex items-center justify-center text-base">
                    {(comment.author?.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-text">{comment.author?.name || 'Anonymous Reader'}</h5>
                    <span className="text-[10px] text-text-muted flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString('hi-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'}
                    </span>
                  </div>
                </div>
                {comment.pinned && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded">
                    Pinned
                  </span>
                )}
              </div>

              <p className="text-sm text-text leading-relaxed pl-13 font-inter">
                {comment.content}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-text-muted text-sm border border-dashed border-border rounded-xl">
            अभी तक कोई टिप्पणी नहीं की गई है। पहली टिप्पणी पोस्ट करें!
          </div>
        )}
      </div>
    </section>
  );
}

'use client';
import { useState } from 'react';
import { CheckCircle, XCircle, Trash2 } from 'lucide-react';
import Badge from '@/components/ui/Badge';

const mockComments = [
  { _id: '1', author: 'Ramesh Kumar', email: 'ramesh@gmail.com', body: 'Bahut important information share ki hai aapne. Electoral bonds ka sach sab ke samne aana chahiye tha.', article: 'Electoral Bonds Scam', status: 'pending', createdAt: new Date().toISOString() },
  { _id: '2', author: 'Priya Sharma', email: 'priya@outlook.com', body: 'Adani case mein SEBI ki investigation clearly inadequate thi. JPC honi chahiye thi.', article: 'Adani Hindenburg Report', status: 'approved', createdAt: new Date().toISOString() },
  { _id: '3', author: 'Anonymous', email: 'anon@pm.me', body: 'GDP 5th rank aur per capita 139th — yahi asli fark hai jo media nahi dikhata.', article: 'Fact Check: India Economy', status: 'pending', createdAt: new Date().toISOString() },
];

export default function CommentsPage() {
  const [comments, setComments] = useState(mockComments);
  const [filter, setFilter] = useState('all');

  const handleApprove = (id: string) => setComments(c => c.map(x => x._id === id ? { ...x, status: 'approved' } : x));
  const handleReject = (id: string) => setComments(c => c.map(x => x._id === id ? { ...x, status: 'rejected' } : x));
  const handleDelete = (id: string) => setComments(c => c.filter(x => x._id !== id));

  const filtered = filter === 'all' ? comments : comments.filter(c => c.status === filter);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-text">Comments</h1>
          <p className="text-sm text-text-muted mt-1">Moderate reader comments on investigations.</p>
        </div>
        <div className="flex gap-2">
          {['all', 'pending', 'approved', 'rejected'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-accent text-white' : 'bg-surface border border-border text-text-muted hover:text-text'}`}>{f}</button>
          ))}
        </div>
      </div>
      <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-text">
          <thead className="bg-background/80 text-text-muted uppercase text-xs font-semibold border-b border-border">
            <tr>
              <th className="px-6 py-4">Comment</th>
              <th className="px-6 py-4">Author</th>
              <th className="px-6 py-4">Article</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-text-muted">No comments found.</td></tr>
            ) : filtered.map(comment => (
              <tr key={comment._id} className="hover:bg-background/50 transition-colors group">
                <td className="px-6 py-4 max-w-xs text-text-muted truncate">{comment.body}</td>
                <td className="px-6 py-4">
                  <div className="font-medium text-text">{comment.author}</div>
                  <div className="text-xs text-text-muted">{comment.email}</div>
                </td>
                <td className="px-6 py-4 text-text-muted text-xs">{comment.article}</td>
                <td className="px-6 py-4">
                  <Badge variant={comment.status === 'approved' ? 'success' : comment.status === 'rejected' ? 'danger' : 'warning'}>{comment.status}</Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleApprove(comment._id)} className="p-2 text-text-muted hover:text-green-500 hover:bg-green-500/10 rounded-lg transition-colors" title="Approve"><CheckCircle className="w-4 h-4" /></button>
                    <button onClick={() => handleReject(comment._id)} className="p-2 text-text-muted hover:text-yellow-500 hover:bg-yellow-500/10 rounded-lg transition-colors" title="Reject"><XCircle className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(comment._id)} className="p-2 text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

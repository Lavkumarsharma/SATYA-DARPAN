'use client';
import { Shield, Edit, Trash2, UserCheck, UserX } from 'lucide-react';
import Badge from '@/components/ui/Badge';

const mockUsers = [
  { _id: '1', name: 'SatyaDarpan Admin', email: 'admin@satyadarpan.in', role: 'admin', isActive: true, lastLogin: new Date().toISOString(), createdAt: new Date().toISOString() },
];

export default function UsersPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-text">Users & Team</h1>
          <p className="text-sm text-text-muted mt-1">Manage editorial team members and their permissions.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-medium">
          <Shield className="w-4 h-4" /> Invite Editor
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[['admin', 'Full access to all features', 'text-red-500', 'bg-red-500/10'], ['editor', 'Can publish and edit articles', 'text-blue-500', 'bg-blue-500/10'], ['author', 'Can create and submit drafts', 'text-green-500', 'bg-green-500/10']].map(([role, desc, color, bg]) => (
          <div key={role as string} className="bg-surface border border-border rounded-xl p-4 shadow-sm">
            <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full ${bg as string} ${color as string} text-xs font-bold uppercase mb-2`}>
              <Shield className="w-3 h-3" />{role as string}
            </div>
            <p className="text-xs text-text-muted">{desc as string}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-border bg-background/50">
          <h3 className="font-semibold text-text">Team Members</h3>
        </div>
        <table className="w-full text-left text-sm text-text">
          <thead className="bg-background/80 text-text-muted uppercase text-xs font-semibold border-b border-border">
            <tr>
              <th className="px-6 py-4">Member</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Last Login</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mockUsers.map(user => (
              <tr key={user._id} className="hover:bg-background/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">{user.name.charAt(0)}</div>
                    <div>
                      <div className="font-medium text-text">{user.name}</div>
                      <div className="text-xs text-text-muted">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4"><Badge variant="danger">{user.role}</Badge></td>
                <td className="px-6 py-4"><Badge variant={user.isActive ? 'success' : 'default'}>{user.isActive ? 'Active' : 'Inactive'}</Badge></td>
                <td className="px-6 py-4 text-text-muted text-xs">{new Date(user.lastLogin).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-text-muted hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                    <button className="p-2 text-text-muted hover:text-yellow-500 hover:bg-yellow-500/10 rounded-lg transition-colors"><UserX className="w-4 h-4" /></button>
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

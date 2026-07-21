'use client';
import { Shield, User, FileText, Trash2, LogIn, Edit } from 'lucide-react';
import Badge from '@/components/ui/Badge';

const mockLogs = [
  { _id: '1', action: 'LOGIN', user: 'admin@satyadarpan.in', resource: 'Auth', details: 'Admin logged in from Delhi, India', ip: '122.171.xx.xx', createdAt: new Date().toISOString() },
  { _id: '2', action: 'CREATE', user: 'admin@satyadarpan.in', resource: 'Article', details: 'Created: "Electoral Bonds Scam: ₹1.85 Lakh Crore Ka Sach"', ip: '122.171.xx.xx', createdAt: new Date(Date.now() - 3600000).toISOString() },
  { _id: '3', action: 'PUBLISH', user: 'admin@satyadarpan.in', resource: 'Article', details: 'Published: "Adani Group aur Hindenburg Report"', ip: '122.171.xx.xx', createdAt: new Date(Date.now() - 7200000).toISOString() },
  { _id: '4', action: 'UPDATE', user: 'admin@satyadarpan.in', resource: 'Settings', details: 'Updated site settings', ip: '122.171.xx.xx', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { _id: '5', action: 'DELETE', user: 'admin@satyadarpan.in', resource: 'Comment', details: 'Deleted spam comment from user "test123"', ip: '122.171.xx.xx', createdAt: new Date(Date.now() - 172800000).toISOString() },
];

const actionConfig: Record<string, { icon: any; variant: any }> = {
  LOGIN: { icon: LogIn, variant: 'info' },
  CREATE: { icon: FileText, variant: 'success' },
  PUBLISH: { icon: FileText, variant: 'success' },
  UPDATE: { icon: Edit, variant: 'warning' },
  DELETE: { icon: Trash2, variant: 'danger' },
};

export default function LogsPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="w-8 h-8 text-accent" />
        <div>
          <h1 className="text-3xl font-playfair font-bold text-text">Audit Logs</h1>
          <p className="text-sm text-text-muted mt-0.5">Full trail of all admin actions on the platform.</p>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-border bg-background/50 flex items-center justify-between">
          <span className="text-sm font-medium text-text">{mockLogs.length} events recorded</span>
          <span className="text-xs text-text-muted">Showing last 30 days</span>
        </div>
        <div className="divide-y divide-border">
          {mockLogs.map(log => {
            const config = actionConfig[log.action] || { icon: Shield, variant: 'default' };
            const Icon = config.icon;
            return (
              <div key={log._id} className="px-6 py-4 hover:bg-background/50 transition-colors flex items-start gap-4">
                <div className="mt-0.5 p-2 bg-background rounded-lg border border-border flex-shrink-0">
                  <Icon className="w-4 h-4 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={config.variant as any}>{log.action}</Badge>
                    <span className="text-xs text-text-muted">{log.resource}</span>
                  </div>
                  <p className="text-sm text-text">{log.details}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-xs text-text-muted flex items-center gap-1"><User className="w-3 h-3" />{log.user}</span>
                    <span className="text-xs text-text-muted">IP: {log.ip}</span>
                    <span className="text-xs text-text-muted">{new Date(log.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

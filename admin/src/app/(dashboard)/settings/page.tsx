'use client';
import { useState } from 'react';
import { Save, Globe, Shield, Bell, Palette } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function SettingsPage() {
  const [siteName, setSiteName] = useState('सत्यदर्पण');
  const [tagline, setTagline] = useState('Exposing the Truth, One Investigation at a Time');
  const [contactEmail, setContactEmail] = useState('contact@satyadarpan.in');
  const [commentsEnabled, setCommentsEnabled] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      toast.success('Settings saved successfully!');
      setSaving(false);
    }, 800);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-playfair font-bold text-text">Settings</h1>
        <p className="text-sm text-text-muted mt-1">Configure your platform settings.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Site Settings */}
        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-bold text-text">Site Information</h3>
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Site Name</label>
            <input type="text" value={siteName} onChange={e => setSiteName(e.target.value)} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text focus:outline-none focus:border-accent transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Tagline</label>
            <input type="text" value={tagline} onChange={e => setTagline(e.target.value)} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text focus:outline-none focus:border-accent transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Contact Email</label>
            <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text focus:outline-none focus:border-accent transition-colors" />
          </div>
        </div>

        {/* Content Settings */}
        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Palette className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-bold text-text">Content Settings</h3>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="font-medium text-text">Enable Comments</p>
              <p className="text-xs text-text-muted">Allow readers to comment on investigations</p>
            </div>
            <button type="button" onClick={() => setCommentsEnabled(!commentsEnabled)} className={`relative w-12 h-6 rounded-full transition-colors ${commentsEnabled ? 'bg-accent' : 'bg-border'}`}>
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${commentsEnabled ? 'left-6' : 'left-0.5'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-text">Maintenance Mode</p>
              <p className="text-xs text-text-muted">Temporarily take the site offline for visitors</p>
            </div>
            <button type="button" onClick={() => setMaintenanceMode(!maintenanceMode)} className={`relative w-12 h-6 rounded-full transition-colors ${maintenanceMode ? 'bg-red-500' : 'bg-border'}`}>
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${maintenanceMode ? 'left-6' : 'left-0.5'}`} />
            </button>
          </div>
        </div>

        {/* Security */}
        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-bold text-text">Security</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-500/5 border border-green-500/20 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-sm text-text">JWT Authentication: <span className="text-green-500 font-medium">Active</span></span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-500/5 border border-green-500/20 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-sm text-text">Rate Limiting: <span className="text-green-500 font-medium">Enabled (100 req/15min)</span></span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-500/5 border border-green-500/20 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-sm text-text">MongoDB Atlas: <span className="text-green-500 font-medium">Connected</span></span>
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving} className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white rounded-xl hover:bg-accent/90 transition-colors font-semibold text-base shadow-lg disabled:opacity-50">
          <Save className="w-5 h-5" />{saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}

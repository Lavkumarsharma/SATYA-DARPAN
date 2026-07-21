'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  Tag,
  Hash,
  MessageSquare,
  BarChart2,
  Users,
  Settings,
  Shield,
  LogOut,
  Eye,
  Sliders,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Articles', href: '/articles', icon: FileText },
  { name: 'Section CMS', href: '/sections', icon: Sliders },
  { name: 'Media', href: '/media', icon: ImageIcon },
  { name: 'Categories', href: '/categories', icon: Tag },
  { name: 'Tags', href: '/tags', icon: Hash },
  { name: 'Comments', href: '/comments', icon: MessageSquare },
  { name: 'Analytics', href: '/analytics', icon: BarChart2 },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Audit Logs', href: '/logs', icon: Shield },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 bg-surface border-r border-border h-screen flex flex-col transition-all duration-300">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <Eye className="h-6 w-6 text-accent group-hover:scale-110 transition-transform" />
          <span className="text-xl font-bold tracking-wide">सत्यदर्पण</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-accent/10 text-accent font-medium'
                  : 'text-text-muted hover:bg-background hover:text-text'
              }`}
            >
              <item.icon className={`h-5 w-5 ${isActive ? 'text-accent' : ''}`} />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 mb-4 px-2">
          {user?.avatar ? (
            <img src={user.avatar} alt="Avatar" className="w-9 h-9 rounded-full object-cover" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text truncate">{user?.name}</p>
            <p className="text-xs text-text-muted truncate capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}

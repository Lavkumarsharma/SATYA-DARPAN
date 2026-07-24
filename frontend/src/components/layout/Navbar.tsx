'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Search, Menu, X, Eye } from 'lucide-react';
import SearchModal from '@/components/SearchModal';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHomepage = pathname === '/';
  const solid = isScrolled || !isHomepage;

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          solid
            ? 'bg-background/95 backdrop-blur-md py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className={`p-1.5 rounded transition-all duration-300 ${
              solid
                ? 'border border-accent/30 bg-accent/5 group-hover:bg-accent/10'
                : 'border border-white/20 bg-white/5 group-hover:bg-white/10'
            }`}>
              <Eye className={`h-5 w-5 group-hover:rotate-12 transition-transform duration-300 ${
                solid ? 'text-accent' : 'text-white'
              }`} />
            </div>
            <span className={`text-xl font-playfair font-black tracking-widest transition-colors duration-300 ${
              solid ? 'text-text' : 'text-white'
            }`}>
              सत्यदर्पण
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { label: 'मुख्य पृष्ठ', path: '/' },
              { label: 'श्रेणियां', path: '/categories' },
              { label: 'फैक्ट चेक', path: '/fact-checks' },
              { label: 'टाइमलाइन', path: '/timeline' },
              { label: 'हमारे बारे में', path: '/about' },
            ].map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.label}
                  href={item.path}
                  className={`text-[11px] uppercase tracking-widest font-black relative py-1.5 group transition-colors duration-200 ${
                    isActive
                      ? 'text-accent'
                      : solid
                        ? 'text-text-muted hover:text-text'
                        : 'text-white/70 hover:text-white'
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] w-full bg-accent origin-left transition-transform duration-300 ${
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            {/* Search button */}

            <button
              onClick={() => setSearchOpen(true)}
              aria-label="खोजें"
              className={`p-2 rounded border transition-all duration-200 ${
                solid
                  ? 'text-text border-border hover:border-accent/50 hover:text-accent hover:bg-accent/5'
                  : 'text-white border-white/20 hover:border-white/50 hover:bg-white/10'
              }`}
            >
              <Search className="h-4 w-4" />
            </button>

            <button
              aria-label="मोबाइल मेनू"
              className={`md:hidden p-2 rounded border transition-colors ${
                solid
                  ? 'text-text border-border'
                  : 'text-white border-white/20'
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-md border-t border-border shadow-lg">
            <nav className="flex flex-col p-4 space-y-3">
              <div className="pb-2 border-b border-border">
                <span className="text-[10px] uppercase tracking-widest font-black text-text-muted block mb-2">भाषा चुनें</span>
                <LanguageSwitcher isSolid={true} />
              </div>
              {[
                { label: 'मुख्य पृष्ठ', path: '/' },
                { label: 'श्रेणियां', path: '/categories' },
                { label: 'फैक्ट चेक', path: '/fact-checks' },
                { label: 'टाइमलाइन', path: '/timeline' },
                { label: 'हमारे बारे में', path: '/about' },
              ].map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.label}
                    href={item.path}
                    className={`px-4 py-2 text-sm font-bold tracking-widest uppercase transition-colors rounded ${
                      isActive ? 'text-accent bg-accent/10' : 'text-text hover:bg-white/5'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* Search Overlay Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

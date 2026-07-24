'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Globe, X, MoreVertical, Check, RefreshCw, Languages } from 'lucide-react';

export default function LanguageSwitcher() {
  const { currentLang, isLoaded, isLoading, error, switchLanguage, supportedLanguages } =
    useLanguage();

  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation across tabs
  const handleKeyDown = (e: React.KeyboardEvent, langCode: string) => {
    const langCodes = supportedLanguages.map((l) => l.code);
    const currentIndex = langCodes.indexOf(langCode);

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % langCodes.length;
      const nextCode = langCodes[nextIndex];
      tabRefs.current[nextCode]?.focus();
      switchLanguage(nextCode);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + langCodes.length) % langCodes.length;
      const prevCode = langCodes[prevIndex];
      tabRefs.current[prevCode]?.focus();
      switchLanguage(prevCode);
    }
  };

  if (!mounted) return null;

  // Minimized floating launcher icon when popup is closed
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-[9999] flex items-center gap-2 bg-[#12131a]/90 hover:bg-[#1a1c26] text-white border border-white/10 shadow-xl backdrop-blur-md px-3.5 py-2 rounded-full text-xs font-medium transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Open Language Switcher"
        title="Change Language / भाषा बदलें"
      >
        <Globe className="w-4 h-4 text-blue-400 animate-pulse" />
        <span className="uppercase font-semibold tracking-wider">{currentLang}</span>
      </button>
    );
  }

  return (
    <div
      role="region"
      aria-label="Website Language Translator"
      className="fixed top-4 right-4 z-[9999] w-[290px] sm:w-[320px] bg-[#12131a]/95 backdrop-blur-xl border border-white/10 text-white rounded-[12px] shadow-2xl shadow-black/80 transition-all duration-300 animate-in fade-in slide-in-from-top-3"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-white/10 text-xs">
        <div className="flex items-center gap-2 text-gray-200 font-medium">
          <Languages className="w-4 h-4 text-blue-400" />
          <span>Translate / भाषा</span>
          {isLoading && (
            <RefreshCw className="w-3 h-3 text-blue-400 animate-spin ml-1" />
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* Three-dot menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="p-1 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="Language options menu"
              aria-expanded={isMenuOpen}
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#181a24] border border-white/10 rounded-lg shadow-xl py-1 z-10 text-xs text-gray-200 animate-in fade-in zoom-in-95">
                <button
                  onClick={() => {
                    switchLanguage('en');
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-white/10 flex items-center justify-between transition-colors"
                >
                  <span>Reset to English</span>
                  {currentLang === 'en' && <Check className="w-3.5 h-3.5 text-blue-400" />}
                </button>

                <button
                  onClick={() => {
                    window.location.reload();
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-white/10 flex items-center gap-2 text-gray-400 hover:text-white transition-colors border-t border-white/5"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reload Page</span>
                </button>
              </div>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500"
            aria-label="Close language switcher"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Error state message if script fails */}
      {error && (
        <div className="px-3 py-2 bg-red-950/40 border-b border-red-500/20 text-red-300 text-[11px] flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => switchLanguage(currentLang)}
            className="underline text-red-200 hover:text-white ml-2 font-medium"
          >
            Retry
          </button>
        </div>
      )}

      {/* Tabs list for English & Hindi */}
      <div
        role="tablist"
        aria-label="Select website language"
        className="flex items-center border-b border-white/10 px-2 pt-1"
      >
        {supportedLanguages.map((lang) => {
          const isActive = currentLang === lang.code;
          return (
            <button
              key={lang.code}
              ref={(el) => {
                tabRefs.current[lang.code] = el;
              }}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${lang.code}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => switchLanguage(lang.code)}
              onKeyDown={(e) => handleKeyDown(e, lang.code)}
              className={`relative flex-1 py-2 text-center text-xs sm:text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-t-md ${
                isActive
                  ? 'text-blue-400 font-semibold'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5">
                <span>{lang.name}</span>
                <span className="text-[10px] opacity-75">({lang.nativeName})</span>
              </div>

              {/* Blue underline active indicator */}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom info footer */}
      <div className="px-3.5 py-1.5 flex items-center justify-between text-[10px] text-gray-500 bg-white/[0.02] rounded-b-[12px]">
        <span>Powered by Google Translate</span>
        <span className="text-gray-400 font-mono">
          {currentLang === 'hi' ? 'हिन्दी सक्रिय' : 'English Active'}
        </span>
      </div>
    </div>
  );
}

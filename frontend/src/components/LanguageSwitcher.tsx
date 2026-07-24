'use client';

import React, { useState, useEffect } from 'react';
import { MoreVertical, X, Globe, Check, Loader2, Sparkles } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface LanguageSwitcherProps {
  /** Optional position mode: 'floating' (default fixed top-right) or 'inline' */
  position?: 'floating' | 'inline';
  isSolid?: boolean;
}

export default function LanguageSwitcher({ position = 'floating' }: LanguageSwitcherProps) {
  const { currentLang, isLoaded, isTranslating, error, switchLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent SSR hydration mismatch
  if (!mounted) return null;

  // Render hidden container for Google Translate script initialization
  const renderTranslateTarget = () => (
    <div
      id="google_translate_element"
      style={{
        position: 'fixed',
        top: -9999,
        left: -9999,
        opacity: 0,
        pointerEvents: 'none',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
        zIndex: -9999,
      }}
    />
  );

  // If user closed floating popup, show a minimal floating launcher pill
  if (!isOpen && position === 'floating') {
    return (
      <>
        {renderTranslateTarget()}
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open Language Switcher"
          className="fixed top-4 right-4 z-[99] flex items-center gap-2 px-3 py-2 bg-[#1a1d1e]/90 hover:bg-[#1a1d1e] text-white text-xs font-bold rounded-full border border-white/10 shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105"
        >
          <Globe className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="capitalize">{currentLang === 'hi' ? 'Hindi' : 'English'}</span>
        </button>
      </>
    );
  }

  return (
    <>
      {renderTranslateTarget()}

      {/* Floating Popup Card matching reference design */}
      <div
        role="dialog"
        aria-label="Website Language Switcher"
        className={`${
          position === 'floating'
            ? 'fixed top-4 right-4 z-[99] w-72 sm:w-80'
            : 'w-full max-w-xs'
        } bg-[#191c1e] text-white border border-white/10 rounded-[12px] shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-top-3`}
      >
        {/* Top Header Row with Tabs and Controls */}
        <div className="flex items-center justify-between px-3 pt-3 pb-2 border-b border-white/10">
          {/* Tabs: Hindi & English */}
          <div role="tablist" className="flex items-center gap-6 pl-2">
            {/* Hindi Tab */}
            <button
              role="tab"
              aria-selected={currentLang === 'hi'}
              aria-label="Switch language to Hindi"
              onClick={() => switchLanguage('hi')}
              disabled={isTranslating}
              className={`relative py-1 text-sm font-bold transition-all duration-200 ${
                currentLang === 'hi'
                  ? 'text-cyan-400'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Hindi
              {currentLang === 'hi' && (
                <span className="absolute bottom-[-9px] left-0 right-0 h-[2.5px] bg-cyan-400 rounded-full" />
              )}
            </button>

            {/* English Tab */}
            <button
              role="tab"
              aria-selected={currentLang === 'en'}
              aria-label="Switch language to English"
              onClick={() => switchLanguage('en')}
              disabled={isTranslating}
              className={`relative py-1 text-sm font-bold transition-all duration-200 ${
                currentLang === 'en'
                  ? 'text-cyan-400'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              English
              {currentLang === 'en' && (
                <span className="absolute bottom-[-9px] left-0 right-0 h-[2.5px] bg-cyan-400 rounded-full" />
              )}
            </button>
          </div>

          {/* Action Icons: Options menu + Close button */}
          <div className="flex items-center gap-1">
            {isTranslating && (
              <Loader2 className="w-4 h-4 text-cyan-400 animate-spin mr-1" />
            )}

            {/* Three Dot Options Button */}
            <div className="relative">
              <button
                aria-label="Language options menu"
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {/* Three Dot Dropdown Menu */}
              {showMenu && (
                <div className="absolute right-0 top-full mt-1 w-44 bg-[#232729] border border-white/10 rounded-lg shadow-2xl py-1 z-10 animate-in fade-in">
                  <button
                    onClick={() => {
                      switchLanguage('en');
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-white/80 hover:bg-white/10 flex items-center justify-between"
                  >
                    <span>Set English Default</span>
                    {currentLang === 'en' && <Check className="w-3 h-3 text-cyan-400" />}
                  </button>
                  <button
                    onClick={() => {
                      switchLanguage('hi');
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-white/80 hover:bg-white/10 flex items-center justify-between"
                  >
                    <span>Set Hindi Default</span>
                    {currentLang === 'hi' && <Check className="w-3 h-3 text-cyan-400" />}
                  </button>
                </div>
              )}
            </div>

            {/* Close (X) Button */}
            {position === 'floating' && (
              <button
                aria-label="Close language switcher"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Sub-bar: Google Translate watermark branding */}
        <div className="px-4 py-2.5 bg-[#141617]/90 flex items-center justify-between">
          <span className="text-xs font-medium text-white/30 tracking-wider">
            Google Translate
          </span>

          {error && (
            <span className="text-[10px] text-amber-400 font-semibold">
              Offline mode
            </span>
          )}
        </div>
      </div>
    </>
  );
}

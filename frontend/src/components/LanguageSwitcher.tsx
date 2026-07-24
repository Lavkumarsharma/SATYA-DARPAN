'use client';

import { useState, useEffect } from 'react';

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: any;
  }
}

export default function LanguageSwitcher({ isSolid = true }: { isSolid?: boolean }) {
  const [currentLang, setCurrentLang] = useState<'hi' | 'en'>('hi');

  useEffect(() => {
    // Check initial cookie
    const match = document.cookie.match(/(?:^|; )googtrans=([^;]*)/);
    if (match) {
      const langVal = decodeURIComponent(match[1]);
      if (langVal.endsWith('/en')) setCurrentLang('en');
      else setCurrentLang('hi');
    }

    // Google Translate init callback
    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'hi',
            includedLanguages: 'hi,en',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          'google_translate_element'
        );
      }
    };

    // Load Google Translate script
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const switchLanguage = (lang: 'hi' | 'en') => {
    if (currentLang === lang) return;
    setCurrentLang(lang);

    const domain = window.location.hostname;
    const parts = domain.split('.');
    const rootDomain = domain.includes('.') ? '.' + parts.slice(-2).join('.') : domain;

    if (lang === 'en') {
      // Set cookies for English translation
      const valEn = '/hi/en';
      document.cookie = `googtrans=${valEn}; path=/;`;
      document.cookie = `googtrans=${valEn}; path=/; domain=${domain};`;
      if (rootDomain !== domain) {
        document.cookie = `googtrans=${valEn}; path=/; domain=${rootDomain};`;
      }
      
      const valAutoEn = '/auto/en';
      document.cookie = `googtrans=${valAutoEn}; path=/;`;
      document.cookie = `googtrans=${valAutoEn}; path=/; domain=${domain};`;
    } else {
      // Clear cookies for Hindi / Original
      const valHi = '/hi/hi';
      document.cookie = `googtrans=${valHi}; path=/;`;
      document.cookie = `googtrans=${valHi}; path=/; domain=${domain};`;

      document.cookie = 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
      document.cookie = `googtrans=; path=/; domain=${domain}; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
      if (rootDomain !== domain) {
        document.cookie = `googtrans=; path=/; domain=${rootDomain}; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
      }
    }

    // Try triggering select combo if present in DOM
    const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (combo) {
      combo.value = lang;
      combo.dispatchEvent(new Event('change'));
    }

    // Always reload page to ensure 100% clean Google Translate DOM application
    setTimeout(() => {
      window.location.reload();
    }, 150);
  };

  return (
    <div className="relative flex items-center">
      {/* Google Translate target container - positioned off-screen so Google Translate script renders .goog-te-combo in DOM */}
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
        }}
      />

      {/* Styled Language Switcher Tabs */}
      <div
        className={`inline-flex items-center p-1 rounded-lg border transition-all duration-300 ${
          isSolid
            ? 'bg-surface/90 border-border shadow-md'
            : 'bg-background/80 border-white/20 backdrop-blur-md'
        }`}
      >
        <button
          type="button"
          onClick={() => switchLanguage('hi')}
          className={`px-3 py-1 text-xs font-bold rounded-md transition-all duration-200 ${
            currentLang === 'hi'
              ? 'bg-accent text-white shadow-sm'
              : isSolid
              ? 'text-text-muted hover:text-text hover:bg-white/5'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          Hindi
        </button>

        <button
          type="button"
          onClick={() => switchLanguage('en')}
          className={`px-3 py-1 text-xs font-bold rounded-md transition-all duration-200 ${
            currentLang === 'en'
              ? 'bg-accent text-white shadow-sm'
              : isSolid
              ? 'text-text-muted hover:text-text hover:bg-white/5'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          English
        </button>
      </div>
    </div>
  );
}

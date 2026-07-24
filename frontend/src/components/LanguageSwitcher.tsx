'use client';

import { useState, useEffect } from 'react';
import { Languages, Globe } from 'lucide-react';

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: any;
  }
}

export default function LanguageSwitcher({ isSolid = true }: { isSolid?: boolean }) {
  const [currentLang, setCurrentLang] = useState<'hi' | 'en'>('hi');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check initial cookie
    const match = document.cookie.match(/(?:^|; )googtrans=([^;]*)/);
    if (match) {
      const langVal = match[1];
      if (langVal.endsWith('/en')) setCurrentLang('en');
      else setCurrentLang('hi');
    }

    // Define Google Translate init callback
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'hi',
          includedLanguages: 'hi,en',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        'google_translate_element'
      );
      setIsLoaded(true);
    };

    // Load Google Translate script if not already present
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    } else {
      setIsLoaded(true);
    }
  }, []);

  const switchLanguage = (lang: 'hi' | 'en') => {
    if (currentLang === lang) return;
    setCurrentLang(lang);

    const googTransValue = lang === 'en' ? '/hi/en' : '/hi/hi';
    const domain = window.location.hostname;

    // Set cookie for path and domain
    document.cookie = `googtrans=${googTransValue}; path=/;`;
    document.cookie = `googtrans=${googTransValue}; path=/; domain=${domain};`;
    document.cookie = `googtrans=${googTransValue}; path=/; domain=.${domain};`;

    // Trigger iframe change or reload page for translation application
    const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (combo) {
      combo.value = lang;
      combo.dispatchEvent(new Event('change'));
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="relative flex items-center">
      {/* Hidden Google Translate container */}
      <div id="google_translate_element" className="hidden" />

      {/* Styled Widget matching User Screenshot */}
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
          className={`px-3 py-1 text-xs font-bold rounded-md transition-all duration-200 flex items-center gap-1.5 ${
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
          className={`px-3 py-1 text-xs font-bold rounded-md transition-all duration-200 flex items-center gap-1.5 ${
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

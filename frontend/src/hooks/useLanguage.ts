'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getSavedLanguage,
  loadGoogleTranslateScript,
  applyTranslation,
} from '@/lib/googleTranslate';

export function useLanguage() {
  const [currentLang, setCurrentLang] = useState<string>('en');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Get saved language preference from localStorage/cookie
    const initialLang = getSavedLanguage();
    setCurrentLang(initialLang);

    // 2. Lazy load Google Translate script safely (no SSR hydration error)
    loadGoogleTranslateScript(
      () => {
        setIsLoaded(true);
        setError(null);

        // Apply saved language if different from default
        if (initialLang && initialLang !== 'hi') {
          applyTranslation(initialLang);
        }
      },
      (err) => {
        console.warn('Google Translate failed to load:', err);
        setError('Translate service unavailable');
      }
    );
  }, []);

  const switchLanguage = useCallback(async (langCode: string) => {
    if (langCode === currentLang) return;

    try {
      setIsTranslating(true);
      setError(null);
      setCurrentLang(langCode);
      await applyTranslation(langCode);
    } catch (err) {
      console.error('Language switch error:', err);
      setError('Failed to switch language');
    } finally {
      setIsTranslating(false);
    }
  }, [currentLang]);

  return {
    currentLang,
    isLoaded,
    isTranslating,
    error,
    switchLanguage,
  };
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  initGoogleTranslateScript,
  changeLanguage,
  getStoredLanguage,
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  LanguageOption,
} from '@/lib/googleTranslate';

export function useLanguage() {
  const [currentLang, setCurrentLang] = useState<string>(DEFAULT_LANGUAGE);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize language on mount
  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const initialLang = getStoredLanguage();
        if (isMounted) {
          setCurrentLang(initialLang);
        }

        // Lazy load script
        await initGoogleTranslateScript();

        if (isMounted) {
          setIsLoaded(true);
          setIsLoading(false);

          // If initial language is not English, trigger switch once loaded
          if (initialLang !== DEFAULT_LANGUAGE) {
            await changeLanguage(initialLang);
          }
        }
      } catch (err: any) {
        if (isMounted) {
          console.error('Google Translate load error:', err);
          setError(err?.message || 'Failed to load translation service');
          setIsLoading(false);
        }
      }
    };

    initialize();

    return () => {
      isMounted = false;
    };
  }, []);

  const switchLanguage = useCallback(
    async (langCode: string) => {
      if (langCode === currentLang) return;

      try {
        setIsLoading(true);
        setCurrentLang(langCode);
        await changeLanguage(langCode);
        setIsLoading(false);
      } catch (err: any) {
        console.error('Error switching language:', err);
        setError('Translation switch failed');
        setIsLoading(false);
      }
    },
    [currentLang]
  );

  return {
    currentLang,
    isLoaded,
    isLoading,
    error,
    switchLanguage,
    supportedLanguages: SUPPORTED_LANGUAGES,
  };
}

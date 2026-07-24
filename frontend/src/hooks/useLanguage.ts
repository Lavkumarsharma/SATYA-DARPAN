'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  initGoogleTranslateScript,
  changeLanguage,
  getStoredLanguage,
  resetScriptLoader,
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
} from '@/lib/googleTranslate';

export function useLanguage() {
  const [currentLang, setCurrentLang] = useState<string>(DEFAULT_LANGUAGE);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const init = useCallback(async (targetLang?: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const langToUse = targetLang || getStoredLanguage();
      setCurrentLang(langToUse);

      await initGoogleTranslateScript();
      setIsLoaded(true);

      if (langToUse !== DEFAULT_LANGUAGE) {
        await changeLanguage(langToUse);
      }
      setIsLoading(false);
    } catch (err: any) {
      console.error('Google Translate load error:', err);
      setError(err?.message || 'Failed to load translation service');
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      init();
    }

    return () => {
      isMounted = false;
    };
  }, [init]);

  const switchLanguage = useCallback(
    async (langCode: string) => {
      try {
        setIsLoading(true);
        setError(null);

        // If script hasn't loaded yet, try initializing script first
        if (!isLoaded) {
          resetScriptLoader();
          await initGoogleTranslateScript();
          setIsLoaded(true);
        }

        setCurrentLang(langCode);
        await changeLanguage(langCode);
        setIsLoading(false);
      } catch (err: any) {
        console.error('Error switching language:', err);
        setError(err?.message || 'Translation switch failed');
        setIsLoading(false);
      }
    },
    [isLoaded]
  );

  const retry = useCallback(async () => {
    resetScriptLoader();
    await init(currentLang);
  }, [init, currentLang]);

  return {
    currentLang,
    isLoaded,
    isLoading,
    error,
    switchLanguage,
    retry,
    supportedLanguages: SUPPORTED_LANGUAGES,
  };
}

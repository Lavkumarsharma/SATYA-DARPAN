/**
 * Google Translate Integration Helper
 * Provides lazy loading, language switching, cookie management, and DOM translation triggers.
 */

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: any;
    __googleTranslateLoaded?: boolean;
  }
}

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
];

const LOCAL_STORAGE_KEY = 'satya_selected_lang';
const GOOGTRANS_COOKIE = 'googtrans';

/**
 * Set cookie across paths and subdomains
 */
export function setGoogTransCookie(langCode: string) {
  if (typeof window === 'undefined') return;
  const cookieValue = langCode === 'hi' ? '/hi/hi' : `/hi/${langCode}`;
  const domain = window.location.hostname;
  const parts = domain.split('.');
  const rootDomain = domain.includes('.') ? '.' + parts.slice(-2).join('.') : domain;

  // Set for root path and domains
  document.cookie = `${GOOGTRANS_COOKIE}=${cookieValue}; path=/;`;
  document.cookie = `${GOOGTRANS_COOKIE}=${cookieValue}; path=/; domain=${domain};`;
  if (rootDomain !== domain) {
    document.cookie = `${GOOGTRANS_COOKIE}=${cookieValue}; path=/; domain=${rootDomain};`;
  }
}

/**
 * Get stored language from localStorage or cookie
 */
export function getSavedLanguage(): string {
  if (typeof window === 'undefined') return 'en';
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) return saved;
  } catch (e) {
    // Ignore localStorage errors
  }

  // Fallback check cookie
  if (typeof document !== 'undefined') {
    const match = document.cookie.match(/(?:^|; )googtrans=([^;]*)/);
    if (match) {
      const val = decodeURIComponent(match[1]);
      if (val.endsWith('/hi')) return 'hi';
      if (val.endsWith('/en')) return 'en';
    }
  }

  return 'en'; // Default language English
}

/**
 * Save language preference to localStorage
 */
export function saveLanguagePreference(langCode: string) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, langCode);
  } catch (e) {
    // Ignore
  }
}

/**
 * Lazy load Google Translate script dynamically
 */
export function loadGoogleTranslateScript(onLoaded?: () => void, onError?: (err: Error) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  if (window.__googleTranslateLoaded && window.google?.translate) {
    onLoaded?.();
    return () => {};
  }

  window.googleTranslateElementInit = () => {
    try {
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
        window.__googleTranslateLoaded = true;
        onLoaded?.();
      }
    } catch (err) {
      console.error('Google Translate Init Error:', err);
      onError?.(err instanceof Error ? err : new Error('Init failed'));
    }
  };

  const existingScript = document.getElementById('google-translate-script');
  if (!existingScript) {
    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    script.onerror = () => {
      onError?.(new Error('Failed to load Google Translate script'));
    };
    document.body.appendChild(script);
  } else {
    window.googleTranslateElementInit();
  }

  return () => {};
}

/**
 * Trigger dynamic language change in DOM
 */
export function applyTranslation(targetLang: string): Promise<boolean> {
  return new Promise((resolve) => {
    saveLanguagePreference(targetLang);
    setGoogTransCookie(targetLang);

    // Try finding native Google Translate select box in DOM
    const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
    if (combo) {
      combo.value = targetLang;
      combo.dispatchEvent(new Event('change'));

      setTimeout(() => {
        resolve(true);
      }, 200);
    } else {
      // Reload if combo is not initialized yet
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.location.reload();
        }
        resolve(true);
      }, 150);
    }
  });
}

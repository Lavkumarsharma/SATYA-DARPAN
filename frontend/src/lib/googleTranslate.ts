/**
 * Google Translate Integration Helper Library
 */

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
];

export const DEFAULT_LANGUAGE = 'en';
export const LOCAL_STORAGE_KEY = 'satya_selected_language';
export const GOOGTRANS_COOKIE_NAME = 'googtrans';

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            includedLanguages?: string;
            layout?: number;
            autoDisplay?: boolean;
            multilanguagePage?: boolean;
          },
          elementId: string
        ) => void;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

let scriptLoadingPromise: Promise<boolean> | null = null;

/**
 * Set cookie for googtrans with cross-browser compatibility
 */
export function setGoogtransCookie(langCode: string): void {
  if (typeof document === 'undefined') return;

  const cookieVal = langCode === 'en' ? '/en/en' : `/en/${langCode}`;
  const domain = window.location.hostname;
  
  // Set cookie for current path and root
  document.cookie = `${GOOGTRANS_COOKIE_NAME}=${cookieVal}; path=/; max-age=31536000; SameSite=Lax`;

  // Handle subdomain / hostname root cookie clearing or setting
  if (domain.includes('.')) {
    document.cookie = `${GOOGTRANS_COOKIE_NAME}=${cookieVal}; domain=.${domain}; path=/; max-age=31536000; SameSite=Lax`;
  }
}

/**
 * Get stored language from localStorage or googtrans cookie fallback
 */
export function getStoredLanguage(): string {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;

  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
      return saved;
    }
  } catch (e) {
    console.warn('Failed to access localStorage:', e);
  }

  // Fallback to cookie check if available
  if (typeof document !== 'undefined') {
    const match = document.cookie.match(/(?:^|; )googtrans=([^;]*)/);
    if (match) {
      const parts = match[1].split('/');
      const code = parts[parts.length - 1];
      if (code && SUPPORTED_LANGUAGES.some((l) => l.code === code)) {
        return code;
      }
    }
  }

  return DEFAULT_LANGUAGE;
}

/**
 * Dynamically lazy-load Google Translate script with timeout & error handling
 */
export function initGoogleTranslateScript(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false);

  // If already loaded and initialized
  if (window.google?.translate?.TranslateElement) {
    return Promise.resolve(true);
  }

  if (scriptLoadingPromise) {
    return scriptLoadingPromise;
  }

  scriptLoadingPromise = new Promise((resolve, reject) => {
    // Check if element container exists or create one
    let targetEl = document.getElementById('google_translate_element');
    if (!targetEl) {
      targetEl = document.createElement('div');
      targetEl.id = 'google_translate_element';
      targetEl.setAttribute('aria-hidden', 'true');
      document.body.appendChild(targetEl);
    }

    // Set window callback
    window.googleTranslateElementInit = () => {
      try {
        if (window.google?.translate?.TranslateElement) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: SUPPORTED_LANGUAGES.map((l) => l.code).join(','),
              autoDisplay: false,
              multilanguagePage: true,
            },
            'google_translate_element'
          );
          resolve(true);
        } else {
          reject(new Error('Google Translate failed to initialize'));
        }
      } catch (err) {
        reject(err);
      }
    };

    // Create script element
    const existingScript = document.getElementById('google-translate-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      script.defer = true;

      const timeout = setTimeout(() => {
        reject(new Error('Google Translate script load timeout'));
      }, 10000);

      script.onload = () => clearTimeout(timeout);
      script.onerror = (err) => {
        clearTimeout(timeout);
        reject(new Error('Google Translate script failed to load from network'));
      };

      document.head.appendChild(script);
    }
  });

  return scriptLoadingPromise;
}

/**
 * Execute dynamic language change on DOM without page reload
 */
export function changeLanguage(langCode: string): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false);

  return new Promise((resolve) => {
    // 1. Store preference
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, langCode);
    } catch (e) {
      console.warn('Could not save language to localStorage', e);
    }

    // 2. Update cookie
    setGoogtransCookie(langCode);

    // 3. Add smooth fade class to body
    document.body.classList.add('gt-translating');

    // 4. Try updating select element if present
    const selectEl = document.querySelector<HTMLSelectElement>('.goog-te-combo');
    if (selectEl) {
      selectEl.value = langCode;
      selectEl.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // 5. Restore opacity after translation completes
    setTimeout(() => {
      document.body.classList.remove('gt-translating');
      document.body.classList.add('gt-translated-success');
      setTimeout(() => {
        document.body.classList.remove('gt-translated-success');
      }, 300);
      resolve(true);
    }, 400);
  });
}

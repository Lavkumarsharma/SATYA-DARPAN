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
  if (domain && domain.includes('.')) {
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
 * Reset script loader state to allow retrying
 */
export function resetScriptLoader(): void {
  scriptLoadingPromise = null;
  if (typeof document !== 'undefined') {
    const existing = document.getElementById('google-translate-script');
    if (existing) existing.remove();
  }
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

  scriptLoadingPromise = new Promise<boolean>((resolve, reject) => {
    // Check if element container exists or create one
    let targetEl = document.getElementById('google_translate_element');
    if (!targetEl) {
      targetEl = document.createElement('div');
      targetEl.id = 'google_translate_element';
      targetEl.setAttribute('aria-hidden', 'true');
      document.body.appendChild(targetEl);
    }

    // Define global callback before injecting script
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

    // Remove old broken script tag if present
    const existingScript = document.getElementById('google-translate-script');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.id = 'google-translate-script';
    // Use explicit https URL to avoid protocol relative script loading failures
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    script.defer = true;

    const timeout = setTimeout(() => {
      resetScriptLoader();
      reject(new Error('Google Translate script load timeout'));
    }, 12000);

    script.onload = () => {
      clearTimeout(timeout);
      // Fallback check if callback was missed
      setTimeout(() => {
        if (window.google?.translate?.TranslateElement) {
          if (window.googleTranslateElementInit) {
            window.googleTranslateElementInit();
          }
          resolve(true);
        }
      }, 500);
    };

    script.onerror = () => {
      clearTimeout(timeout);
      resetScriptLoader();
      reject(new Error('Google Translate script failed to load from network'));
    };

    document.head.appendChild(script);
  }).catch((err) => {
    resetScriptLoader();
    throw err;
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

    // 4. Update select element if present (or poll for a short window)
    const updateCombo = () => {
      const selectEl = document.querySelector<HTMLSelectElement>('.goog-te-combo');
      if (selectEl) {
        selectEl.value = langCode;
        selectEl.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
      }
      return false;
    };

    if (!updateCombo()) {
      // Retry for up to 2 seconds if select box is still rendering
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (updateCombo() || attempts > 10) {
          clearInterval(interval);
        }
      }, 200);
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

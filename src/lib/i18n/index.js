import { init, locale, getLocaleFromNavigator, _, addMessages } from 'svelte-i18n';

// Import translations synchronously
import en from './locales/en.json';
import es from './locales/es.json';

const LOCALE_KEY = 'taskflow_locale';

export const supportedLocales = [
  { code: 'en', name: 'English', flag: '/usa.svg' },
  { code: 'es', name: 'Español', flag: '/mx.svg' }
];

export const defaultLocale = 'en';

// Add messages synchronously
addMessages('en', en);
addMessages('es', es);

// Get initial locale from localStorage or browser
function getInitialLocale() {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(LOCALE_KEY);
      if (stored && supportedLocales.some(l => l.code === stored)) {
        return stored;
      }

      // Fallback to browser language
      const browserLocale = getLocaleFromNavigator();
      if (browserLocale) {
        const match = supportedLocales.find(l => browserLocale.startsWith(l.code));
        if (match) return match.code;
      }
    } catch (e) {
      // localStorage might not be available
    }
  }
  return defaultLocale;
}

// Initialize i18n synchronously with default locale
init({
  fallbackLocale: defaultLocale,
  initialLocale: defaultLocale,
});

// Set the actual locale based on storage/browser (runs in browser)
if (typeof window !== 'undefined') {
  locale.set(getInitialLocale());
}

// Change locale and persist to localStorage
export function setLocale(newLocale) {
  if (supportedLocales.some(l => l.code === newLocale)) {
    locale.set(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCALE_KEY, newLocale);
    }
  }
}

// Re-export for convenience
export { locale, _ };

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from './i18n/locales/en.json';
import esTranslations from './i18n/locales/es.json';
import frTranslations from './i18n/locales/fr.json';
import deTranslations from './i18n/locales/de.json';
import itTranslations from './i18n/locales/it.json';
import ptTranslations from './i18n/locales/pt.json';
import jaTranslations from './i18n/locales/ja.json';
import zhTranslations from './i18n/locales/zh.json';
// RTL languages (currently no RTL translations available)
export const RTL_LANGUAGES: string[] = [];

// Language configuration
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸', nativeName: 'English' },
  { code: 'es', name: 'Español', flag: '🇪🇸', nativeName: 'Español' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', nativeName: 'Français' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹', nativeName: 'Italiano' },
  { code: 'pt', name: 'Português', flag: '🇵🇹', nativeName: 'Português' },
  { code: 'ja', name: '日本語', flag: '🇯🇵', nativeName: '日本語' },
  { code: 'zh', name: '中文', flag: '🇨🇳', nativeName: '中文' },
];

// Helper function to check if language is RTL
export const isRTL = (language: string): boolean => {
  return RTL_LANGUAGES.includes(language);
};

// Helper function to update document direction
export const updateDocumentDirection = (language: string) => {
  const direction = isRTL(language) ? 'rtl' : 'ltr';
  document.documentElement.dir = direction;
  document.documentElement.lang = language;
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: false,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'travel-app-language',
    },
    resources: {
      en: { translation: enTranslations },
      es: { translation: esTranslations },
      fr: { translation: frTranslations },
      de: { translation: deTranslations },
      it: { translation: itTranslations },
      pt: { translation: ptTranslations },
      ja: { translation: jaTranslations },
      zh: { translation: zhTranslations },
    },
  });

// Update document direction when language changes
i18n.on('languageChanged', (lng) => {
  updateDocumentDirection(lng);
});

// Set initial direction
updateDocumentDirection(i18n.language);

export default i18n;

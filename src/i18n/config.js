import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './locales/en.json';
import taTranslation from './locales/ta.json';
import mrTranslation from './locales/mr.json';
import hiTranslation from './locales/hi.json';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English',  nativeName: 'English' },
  { code: 'hi', name: 'Hindi',    nativeName: 'हिंदी'   },
  { code: 'ta', name: 'Tamil',    nativeName: 'தமிழ்'  },
  { code: 'mr', name: 'Marathi',  nativeName: 'मराठी'  },
];

export const LANGUAGE_STORAGE_KEY = 'swasth_language';
export const LEGACY_LANGUAGE_STORAGE_KEY = 'language';

export const getSavedLanguage = () => {
  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) || localStorage.getItem(LEGACY_LANGUAGE_STORAGE_KEY);
    if (saved && SUPPORTED_LANGUAGES.some((lang) => lang.code === saved)) {
      return saved;
    }
  } catch (e) {
    console.warn('Could not read language from localStorage:', e);
  }
  return 'en';
};

const initialLang = getSavedLanguage();

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      ta: { translation: taTranslation },
      mr: { translation: mrTranslation },
      hi: { translation: hiTranslation },
    },
    lng: initialLang,
    fallbackLng: 'en',
    supportedLngs: ['en', 'ta', 'mr', 'hi'],
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export const updateDocumentLanguage = (langCode) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = langCode || 'en';
    document.documentElement.dir = 'ltr';
  }
};

updateDocumentLanguage(initialLang);

i18n.on('languageChanged', (lng) => {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
  } catch (e) {
    console.warn('Could not save language to localStorage:', e);
  }
  updateDocumentLanguage(lng);
});

export default i18n;

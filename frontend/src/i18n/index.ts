import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ptBR from './locales/pt-BR.json';
import enUS from './locales/en-US.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      'pt-BR': { translation: ptBR },
      'en-US': { translation: enUS },
    },
    fallbackLng: 'pt-BR',
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false, // React already handles XSS
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'igeos-lang',
    },
  });

export default i18n;

/** Supported locales */
export const LOCALES = [
  { code: 'pt-BR', label: 'Português' },
  { code: 'en-US', label: 'English' },
] as const;

export type LocaleCode = (typeof LOCALES)[number]['code'];

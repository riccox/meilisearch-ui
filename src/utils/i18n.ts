import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';

export const SUPPORTED_LANGUAGES = ['en', 'zh'] as const;
export type SUPPORTED_LANGUAGE = (typeof SUPPORTED_LANGUAGES)[number];
export enum SUPPORTED_LANGUAGE_LOCALIZED {
  en = 'EN',
  zh = '中文',
}
export const NAMESPACES = [
  'common',
  'dashboard',
  'task',
  'key',
  'upload',
  'document',
  'instance',
  'header',
  'sys',
] as const;

i18n
  // .use(Backend)
  .use(resourcesToBackend((language: string, namespace: string) => import(`../locales/${language}/${namespace}.json`)))
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    debug: true,
    fallbackLng: SUPPORTED_LANGUAGES[0],
    ns: NAMESPACES,
    fallbackNS: NAMESPACES[0],
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    detection: {
      // order and from where user language should be detected
      order: ['querystring', 'navigator', 'htmlTag'],

      // keys or params to lookup language from
      lookupQuerystring: 'lang',

      // cache user language on
      caches: ['localStorage', 'cookie'],

      // optional htmlTag with lang attribute, the default is:
      htmlTag: document.documentElement,

      // only look up languages rather than locales. default english
      convertDetectedLanguage: (lng) => /^(\w+)/.exec(lng)![0] || 'en',
    },
  });

export default i18n;

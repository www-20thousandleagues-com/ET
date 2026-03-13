import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslations from './locales/en.json';
import dkTranslations from './locales/dk.json';

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations
      },
      dk: {
        translation: dkTranslations
      }
    },
    lng: localStorage.getItem('user_locale') || 'en', // Get saved locale or default to 'en'
    fallbackLng: 'en',
    
    interpolation: {
      escapeValue: false // react already safely escapes
    }
  });

export default i18n;

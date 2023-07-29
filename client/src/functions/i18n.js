// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        type: {
          show: 'Show',
          concert: 'Concert',
          theaters: 'Theaters',
          festival: 'Festival',
          other: 'Other',
          sport: 'Sport',
        },
      },
    },
    hr: {
      translation: {
        type: {
          show: 'Šou',
          concert: 'Koncert',
          theaters: 'Teatar',
          festival: 'Festival',
          other: 'Drugo',
          sport: 'Sport',
        },
      },
    },
  },
  lng: 'hr',
  fallbackLng: 'hr',
  interpolation: {
    escapeValue: false,
  },
});

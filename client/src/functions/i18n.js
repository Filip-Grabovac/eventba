// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        type: {
          concert: 'Concert',
          theaters: 'Theaters',
          festival: 'Festival',
          other: 'Other',
          sport: 'Sport',
        },
        role: {
          reseller: 'Reseller',
          organizer: 'Organizer',
          standard: 'Standard',
          admin: 'Admin',
        },
      },
    },
    hr: {
      translation: {
        type: {
          concert: 'Koncert',
          theaters: 'Predstava',
          festival: 'Festival',
          other: 'Drugo',
          sport: 'Sport',
        },
        role: {
          reseller: 'Preprodavač',
          organizer: 'Organizator',
          standard: 'Standard',
          admin: 'Admin',
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

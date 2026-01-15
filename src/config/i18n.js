import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from '../locales/en.json';
import fr from '../locales/fr.json';

const LANGUAGE_STORAGE_KEY = '@bellepros:language';

// Get device language
const deviceLanguage = Localization.locale.split('-')[0];

const resources = {
  en: { translation: en },
  fr: { translation: fr },
};

// Initialize i18n
i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources,
    lng: deviceLanguage === 'fr' ? 'fr' : 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

// Load saved language preference
AsyncStorage.getItem(LANGUAGE_STORAGE_KEY).then((savedLanguage) => {
  if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'fr')) {
    i18n.changeLanguage(savedLanguage);
  }
});

// Save language preference when changed
export const changeLanguage = async (lang) => {
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  i18n.changeLanguage(lang);
};

export default i18n;

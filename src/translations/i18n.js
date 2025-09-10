import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';

import ar from './ar.json';
import en from './en.json';
import fr from './fr.json';

// Simple language detector that doesn't use the complex async pattern
const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: async (callback) => {
    try {
      // Check if we have a saved language preference
      const savedLanguage = await AsyncStorage.getItem('user-language');
      if (savedLanguage) {
        callback(savedLanguage);
        return;
      }
      
      // Default to device locale or fallback to English
      const deviceLanguage = Localization.locale || 'en';
      if (deviceLanguage.startsWith('ar') || deviceLanguage === 'ar-MA') {
        callback('ar');
      } else if (deviceLanguage.startsWith('fr')) {
        callback('fr');
      } else {
        callback('en'); // Default to English
      }
    } catch (error) {
      console.error('Error reading language', error);
      callback('en');
    }
  },
  init: () => {},
  cacheUserLanguage: async (language) => {
    try {
      await AsyncStorage.setItem('user-language', language);
      // Force LTR layout for all languages (Arabic, French, English)
      I18nManager.forceRTL(false);
    } catch (error) {
      console.error('Error saving language', error);
    }
  },
};

// Initialize i18n with proper error handling
const initI18n = async () => {
  try {
    if (!i18n.isInitialized) {
      await i18n
        .use(languageDetector)
        .use(initReactI18next)
        .init({
          compatibilityJSON: 'v3',
          resources: {
            ar: { translation: ar },
            en: { translation: en },
            fr: { translation: fr },
          },
          fallbackLng: 'en',
          debug: __DEV__,
          returnObjects: true,
          interpolation: {
            escapeValue: false,
          },
          react: {
            useSuspense: false,
          },
        });
    }
  } catch (error) {
    console.error('Error initializing i18n:', error);
    // Fallback initialization without language detector
    try {
      i18n.init({
        compatibilityJSON: 'v3',
        resources: {
          ar: { translation: ar },
          en: { translation: en },
          fr: { translation: fr },
        },
        fallbackLng: 'en',
        lng: 'en',
        debug: __DEV__,
        returnObjects: true,
        interpolation: {
          escapeValue: false,
        },
        react: {
          useSuspense: false,
        },
      });
    } catch (fallbackError) {
      console.error('Fallback i18n initialization failed:', fallbackError);
    }
  }
};

// Initialize immediately but don't block the export
initI18n().catch(error => {
  console.error('Failed to initialize i18n:', error);
});

export default i18n;

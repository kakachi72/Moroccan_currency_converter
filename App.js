import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { I18nextProvider } from 'react-i18next';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

import i18n from './src/translations/i18n';
import AppNavigator from './src/navigation/AppNavigator';
import WelcomeScreen from './src/screens/WelcomeScreen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [isLanguageSelected, setIsLanguageSelected] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Wait for i18n to be ready
        if (!i18n.isInitialized) {
          await new Promise((resolve) => {
            const checkInitialized = () => {
              if (i18n.isInitialized) {
                resolve();
              } else {
                setTimeout(checkInitialized, 100);
              }
            };
            checkInitialized();
          });
        }
        
        // Always show welcome screen - don't check for saved language
        setIsLanguageSelected(false);
        
        // Pre-load any other resources here (fonts, images, etc.)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (e) {
        console.warn(e);
        // On error, still show welcome screen
        setIsLanguageSelected(false);
      } finally {
        setIsReady(true);
        // Tell the application to render
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  const handleLanguageSelect = (language) => {
    setIsLanguageSelected(true);
  };

  if (!isReady) {
    return null; // Show splash screen
  }

  return (
    <SafeAreaProvider>
      <I18nextProvider i18n={i18n}>
        {isLanguageSelected ? (
          <AppNavigator />
        ) : (
          <WelcomeScreen onLanguageSelect={handleLanguageSelect} />
        )}
        <StatusBar style="light" />
      </I18nextProvider>
    </SafeAreaProvider>
  );
}
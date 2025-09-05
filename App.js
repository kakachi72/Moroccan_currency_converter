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
        // FOR TESTING: Clear saved language to force welcome screen
        await AsyncStorage.removeItem('user-language');
        
        // Check if language has been selected before
        const savedLanguage = await AsyncStorage.getItem('user-language');
        console.log('Saved language:', savedLanguage); // Debug log
        
        if (savedLanguage) {
          setIsLanguageSelected(true);
        }
        
        // Pre-load any other resources here (fonts, images, etc.)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
        // Tell the application to render
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  const handleLanguageSelect = (language) => {
    console.log('Language selected:', language); // Debug log
    setIsLanguageSelected(true);
  };

  // For testing - uncomment this to force show welcome screen
  // const resetLanguage = async () => {
  //   await AsyncStorage.removeItem('user-language');
  //   setIsLanguageSelected(false);
  // };

  if (!isReady) {
    console.log('App not ready yet...'); // Debug log
    return null; // Show splash screen
  }

  console.log('App ready, isLanguageSelected:', isLanguageSelected); // Debug log

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
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ImageBackground,
  Image,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  responsiveWidth, 
  responsiveHeight, 
  responsiveFontSize, 
  getResponsivePadding,
  getResponsiveMargin
} from '../utils/responsive';
import BannerAd from '../components/BannerAd';
// RTL utilities removed - all languages now use LTR layout

export default function WelcomeScreen({ onLanguageSelect }) {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language || 'en';
  // All languages now use LTR layout

  const handleLanguageSelect = async (language) => {
    try {
      // Save language preference
      await AsyncStorage.setItem('user-language', language);
      
      // Change i18n language
      await i18n.changeLanguage(language);
      
      // Notify parent component
      onLanguageSelect(language);
    } catch (error) {
      console.error('Error setting language:', error);
    }
  };

  // Use hardcoded names initially to avoid translation issues
  const languages = [
    { code: 'ar', name: 'العربية', flag: '🇲🇦' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ];

  return (
    <ImageBackground 
      source={require('../../assets/background.png')} 
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" backgroundColor="#2D5F3E" />
        
        <View style={styles.content}>
        <View style={styles.header}>
          <Image 
            source={require('../../assets/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.languageContainer}>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={styles.languageButton}
              onPress={() => handleLanguageSelect(lang.code)}
            >
              <Text style={styles.flag}>{lang.flag}</Text>
              <Text style={styles.languageName}>{lang.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bannerContainer}>
          <BannerAd placement="welcome_banner" />
        </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: getResponsivePadding(),
  },
  header: {
    alignItems: 'center',
    marginTop: responsiveHeight(30),
  },
  logo: {
    width: responsiveWidth(250),
    height: responsiveHeight(250),
    marginBottom: responsiveHeight(15),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  languageContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: responsiveHeight(20),
    gap: responsiveHeight(12),
  },
  bannerContainer: {
    marginTop: responsiveHeight(2),
    marginBottom: responsiveHeight(20),
  },
  languageButton: {
    backgroundColor: '#fff',
    borderRadius: responsiveWidth(12),
    paddingVertical: responsiveHeight(12),
    paddingHorizontal: responsiveWidth(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center the content
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  flag: {
    fontSize: responsiveFontSize(24),
    marginRight: responsiveWidth(15),
  },
  languageName: {
    fontSize: responsiveFontSize(16),
    fontWeight: 'bold',
    color: '#2D5F3E',
  },
  footer: {
    alignItems: 'center',
    marginBottom: responsiveHeight(40),
  },
  footerText: {
    fontSize: responsiveFontSize(14),
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

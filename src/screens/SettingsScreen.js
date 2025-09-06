import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  ImageBackground,
  Share,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const [offlineMode, setOfflineMode] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedOfflineMode = await AsyncStorage.getItem('offline-mode');
      if (savedOfflineMode !== null) {
        setOfflineMode(JSON.parse(savedOfflineMode));
      }
    } catch (error) {
      console.log('Failed to load settings:', error);
    }
  };

  const changeLanguage = async (language) => {
    try {
      await i18n.changeLanguage(language);
      setCurrentLanguage(language);
      // The language detector will automatically save to AsyncStorage
    } catch (error) {
      console.log('Failed to change language:', error);
      Alert.alert(t('common.error'), 'Failed to change language');
    }
  };

  const toggleOfflineMode = async (value) => {
    try {
      setOfflineMode(value);
      await AsyncStorage.setItem('offline-mode', JSON.stringify(value));
    } catch (error) {
      console.log('Failed to save offline mode setting:', error);
    }
  };

  const clearCache = async () => {
    Alert.alert(
      t('settings.clearCache'),
      t('settings.clearCacheDescription'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('common.ok'),
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove([
                'cached_exchange_rates',
                'cache_timestamp',
                'quiz_scores',
              ]);
              Alert.alert(t('common.ok'), t('settings.cacheCleared'));
            } catch (error) {
              console.log('Failed to clear cache:', error);
              Alert.alert(t('common.error'), 'Failed to clear cache');
            }
          },
        },
      ]
    );
  };

  const showAbout = () => {
    Alert.alert(
      t('settings.about'),
      `${t('settings.aboutDescription')}\n\n${t('settings.features')}\n\n${t('settings.developer')}\n\n${t('settings.version')}: ${Constants.expoConfig?.version || '1.0.0'}`,
      [{ text: t('common.ok') }]
    );
  };

  const shareApp = async () => {
    try {
      const result = await Share.share({
        message: `${t('settings.shareMessage')}\n\n${t('settings.shareLink')}`,
        title: t('settings.shareTitle'),
        url: t('settings.shareLink'),
      });
    } catch (error) {
      console.log('Error sharing app:', error);
      Alert.alert(t('common.error'), 'Failed to share app');
    }
  };

  return (
    <ImageBackground 
      source={require('../../assets/background.png')} 
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
        <View style={styles.languageContainer}>
          <TouchableOpacity
            style={[
              styles.languageButton,
              currentLanguage === 'ar' && styles.activeLanguageButton,
            ]}
            onPress={() => changeLanguage('ar')}
          >
            <Text style={[
              styles.languageButtonText,
              currentLanguage === 'ar' && styles.activeLanguageButtonText,
            ]}>
              {t('settings.arabic')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.languageButton,
              currentLanguage === 'en' && styles.activeLanguageButton,
            ]}
            onPress={() => changeLanguage('en')}
          >
            <Text style={[
              styles.languageButtonText,
              currentLanguage === 'en' && styles.activeLanguageButtonText,
            ]}>
              {t('settings.english')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.languageButton,
              currentLanguage === 'fr' && styles.activeLanguageButton,
            ]}
            onPress={() => changeLanguage('fr')}
          >
            <Text style={[
              styles.languageButtonText,
              currentLanguage === 'fr' && styles.activeLanguageButtonText,
            ]}>
              {t('settings.french')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.share')}</Text>
        
        <TouchableOpacity style={styles.actionButton} onPress={shareApp}>
          <Text style={styles.actionButtonText}>{t('settings.shareApp')}</Text>
          <Text style={styles.actionButtonDescription}>
            {t('settings.shareDescription')}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.data')}</Text>
        
        <TouchableOpacity style={styles.actionButton} onPress={clearCache}>
          <Text style={styles.actionButtonText}>{t('settings.clearCache')}</Text>
          <Text style={styles.actionButtonDescription}>
            {t('settings.clearCacheDescription')}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.appInfo')}</Text>
        
        <TouchableOpacity style={styles.actionButton} onPress={showAbout}>
          <Text style={styles.actionButtonText}>{t('settings.about')}</Text>
          <Text style={styles.actionButtonDescription}>
            {t('settings.version')}: {Constants.expoConfig?.version || '1.0.0'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {t('settings.madeWith')} ❤️ {t('settings.forMorocco')}
        </Text>
      </View>
      </ScrollView>
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
  section: {
    backgroundColor: '#fff',
    marginVertical: 8,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  languageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  languageButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  activeLanguageButton: {
    borderColor: '#2D5F3E',
    backgroundColor: '#e8f5e8',
  },
  languageButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  activeLanguageButtonText: {
    color: '#2D5F3E',
    fontWeight: 'bold',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  actionButton: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D5F3E',
    marginBottom: 4,
  },
  actionButtonDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

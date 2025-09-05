import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Switch,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { Picker } from '@react-native-picker/picker';

import { 
  convertMoroccanCurrency, 
  formatCurrency, 
  isMoroccanCurrency,
  getAvailableCurrencies,
  breakdownAmount
} from '../utils/currencyUtils';
import { fetchExchangeRates, convertWithRates } from '../services/currencyApi';
import CurrencyBreakdown from '../components/CurrencyBreakdown';

export default function ConverterScreen() {
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('dirham');
  const [toCurrency, setToCurrency] = useState('ryal');
  const [result, setResult] = useState(0);
  const [exchangeRates, setExchangeRates] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isInternationalMode, setIsInternationalMode] = useState(false);

  const currencies = getAvailableCurrencies();
  const allCurrencies = [...currencies.moroccan, ...currencies.international];
  
  // Filter currencies based on mode
  const availableCurrencies = isInternationalMode 
    ? currencies.international 
    : currencies.moroccan;

  useEffect(() => {
    if (isInternationalMode) {
      loadExchangeRates();
    }
  }, [isInternationalMode]);

  const loadExchangeRates = async () => {
    setIsLoading(true);
    try {
      const ratesData = await fetchExchangeRates();
      setExchangeRates(ratesData.rates);
      setIsOnline(ratesData.source !== 'fallback');
      setLastUpdate(ratesData.timestamp);
    } catch (error) {
      console.log('Failed to load exchange rates:', error);
      setIsOnline(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConvert = () => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      Alert.alert(t('common.error'), 'Please enter a valid amount');
      return;
    }

    let convertedAmount = 0;

    // Check if both currencies are Moroccan (offline conversion)
    if (!isInternationalMode && isMoroccanCurrency(fromCurrency) && isMoroccanCurrency(toCurrency)) {
      convertedAmount = convertMoroccanCurrency(numAmount, fromCurrency, toCurrency);
    } 
    // International conversion (requires exchange rates)
    else if (isInternationalMode && exchangeRates) {
      convertedAmount = convertWithRates(numAmount, fromCurrency, toCurrency, exchangeRates);
    } else {
      Alert.alert(t('common.error'), 'Exchange rates not available. Please check your connection.');
      return;
    }

    setResult(convertedAmount);
  };

  const handleModeToggle = () => {
    const newMode = !isInternationalMode;
    setIsInternationalMode(newMode);
    
    // Reset currencies when switching modes
    if (newMode) {
      // International mode: Focus on MAD conversions
      setFromCurrency('MAD');
      setToCurrency('USD');
    } else {
      // National mode: Moroccan currencies
      setFromCurrency('dirham');
      setToCurrency('ryal');
    }
    
    setResult(0); // Clear previous result
  };

  const getCurrencyDisplayName = (currencyCode) => {
    return t(`converter.currencies.${currencyCode}`, { defaultValue: currencyCode });
  };

  const getCurrencyIcon = (currencyCode) => {
    const icons = {
      // Moroccan currencies
      'dirham': '💰',
      'centime': '🪙',
      'franc': '🏛️',
      'ryal': '⭐',
      'dourou': '👑',
      'benduqui': '💎',
      'mouzouna': '🔶',
      'falous': '🟤',
      'qharrouba': '🟫',
      'ouqiya': '⚖️',
      // International currencies
      'MAD': '🇲🇦',
      'USD': '🇺🇸',
      'EUR': '🇪🇺',
      'GBP': '🇬🇧',
      'JPY': '🇯🇵',
      'CAD': '🇨🇦',
      'AUD': '🇦🇺',
      'CHF': '🇨🇭',
      'CNY': '🇨🇳',
      'SAR': '🇸🇦',
      'AED': '🇦🇪',
    };
    return icons[currencyCode] || '💱';
  };

  const getResultInDirhams = () => {
    if (!result) return 0;
    
    // If result is already in dirhams, return as is
    if (toCurrency === 'dirham' || toCurrency === 'MAD') {
      return result;
    }
    
    // If result is in another Moroccan currency, convert to dirhams
    if (isMoroccanCurrency(toCurrency)) {
      return convertMoroccanCurrency(result, toCurrency, 'dirham');
    }
    
    // If result is in international currency, convert to dirhams using exchange rates
    if (exchangeRates) {
      return convertWithRates(result, toCurrency, 'MAD', exchangeRates);
    }
    
    return 0;
  };

  return (
    <ImageBackground 
      source={require('../../assets/background.png')} 
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <ScrollView style={styles.container}>
        {/* Mode Toggle */}
        <View style={styles.modeToggleContainer}>
        <Text style={styles.modeLabel}>{t('converter.national')}</Text>
        <Switch
          value={isInternationalMode}
          onValueChange={handleModeToggle}
          trackColor={{ false: '#5D6D7E', true: '#27AE60' }} // Moroccan green
          thumbColor={isInternationalMode ? '#F39C12' : '#ECF0F1'} // Gold when active
        />
        <Text style={styles.modeLabel}>{t('converter.international')}</Text>
      </View>

      {/* Status Container - only show for international mode */}
      {isInternationalMode && (
        <View style={styles.statusContainer}>
          <Text style={[styles.statusText, { color: isOnline ? '#4CAF50' : '#FF9800' }]}>
            {isOnline ? t('common.online') : t('common.offline')}
          </Text>
          {lastUpdate && (
            <Text style={styles.lastUpdateText}>
              {t('common.lastUpdate')}: {new Date(lastUpdate).toLocaleTimeString()}
            </Text>
          )}
        </View>
      )}

      {/* Large Amount Display */}
      <View style={styles.amountDisplayContainer}>
        <TextInput
          style={styles.amountDisplay}
          value={amount}
          onChangeText={setAmount}
          placeholder="0"
          keyboardType="numeric"
          placeholderTextColor="#C9B99B"
        />
      </View>

      {/* From and To Currency Row */}
      <View style={styles.currencyRowContainer}>
        <View style={styles.currencySelector}>
          <Text style={styles.currencyLabel}>FROM</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={fromCurrency}
              onValueChange={setFromCurrency}
              style={styles.picker}
            >
              {availableCurrencies.map((currency) => (
                <Picker.Item
                  key={currency.code}
                  label={`${getCurrencyIcon(currency.code)} ${getCurrencyDisplayName(currency.code)}`}
                  value={currency.code}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.currencySelector}>
          <Text style={styles.currencyLabel}>TO</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={toCurrency}
              onValueChange={setToCurrency}
              style={styles.picker}
            >
              {availableCurrencies.map((currency) => (
                <Picker.Item
                  key={currency.code}
                  label={`${getCurrencyIcon(currency.code)} ${getCurrencyDisplayName(currency.code)}`}
                  value={currency.code}
                />
              ))}
            </Picker>
          </View>
        </View>
      </View>


      <TouchableOpacity
        onPress={handleConvert}
        disabled={isLoading}
        style={styles.convertButtonContainer}
      >
        <LinearGradient
          colors={['#006233', '#00A651', '#006233']}
          style={styles.convertButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.convertButtonText}>{t('converter.convert')}</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>

      {result > 0 && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultLabel}>{t('converter.result')}</Text>
          <Text style={styles.resultValue}>
            {formatCurrency(result, toCurrency)}
          </Text>
          
          {/* Show visual breakdown if result can be shown in Moroccan currency */}
          <CurrencyBreakdown amount={getResultInDirhams()} />
        </View>
      )}

      {isInternationalMode && (
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={loadExchangeRates}
          disabled={isLoading}
        >
          <Text style={styles.refreshButtonText}>
            {t('common.refresh')} {t('common.rates')}
          </Text>
        </TouchableOpacity>
             )}
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
    backgroundColor: 'transparent', // Make transparent to show background image
    padding: 20,
  },
  modeToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent black
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#000000', // Black border
  },
  modeLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF', // Pure white for maximum contrast
    marginHorizontal: 10,
    textShadowColor: 'rgba(0,0,0,0.8)', // Strong black shadow
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  lastUpdateText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  amountDisplayContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  amountDisplay: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#FFFFFF', // Pure white for the large amount number
    textAlign: 'center',
    backgroundColor: 'transparent',
    borderWidth: 0,
    minWidth: 200,
    textShadowColor: 'rgba(0,0,0,0.8)', // Black shadow for contrast
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  currencyRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  currencySelector: {
    flex: 1,
    marginHorizontal: 10,
  },
  currencyLabel: {
    fontSize: 16, // Increased font size for better visibility
    fontWeight: 'bold',
    color: '#FFFFFF', // Pure white for maximum contrast
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.8)', // Strong black shadow
    textShadowOffset: { width: 2, height: 2 }, // Larger shadow offset
    textShadowRadius: 3, // More shadow blur for better visibility
    letterSpacing: 1, // Better letter spacing for readability
  },
  pickerWrapper: {
    backgroundColor: '#FFFFFF', // White background to match input
    borderRadius: 25, // Pill-shaped like the input
    borderWidth: 2, // Added border for better definition
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    minHeight: 56, // Increased height for better visibility
    ...(Platform.OS === 'ios' ? {
      overflow: 'hidden',
      height: 56,
      justifyContent: 'center',
    } : {}),
  },
  picker: {
    height: 56, // Increased height to match wrapper
    width: '100%',
    color: '#000000', // Black text for maximum contrast
    fontWeight: '600',
    fontSize: 16, // Larger font size for better visibility
    paddingHorizontal: 15, // Add padding for better spacing
    ...(Platform.OS === 'ios' ? { backgroundColor: 'transparent' } : {}),
  },
  convertButtonContainer: {
    marginBottom: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  convertButton: {
    borderRadius: 15,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#004d28',
  },
  convertButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Semi-transparent black
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F39C12', // Gold border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  resultLabel: {
    fontSize: 18, // Increased from 16 to 18
    color: '#FFFFFF', // Pure white for better visibility
    marginBottom: 12, // Increased margin
    textShadowColor: 'rgba(0,0,0,0.8)', // Stronger shadow
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    textAlign: 'center',
    fontWeight: '600',
  },
  resultValue: {
    fontSize: 36, // Increased from 28 to 36 for better visibility
    fontWeight: 'bold',
    color: '#FFD700', // Bright gold for better visibility
    marginBottom: 16,
    textShadowColor: 'rgba(0,0,0,0.8)', // Stronger shadow
    textShadowOffset: { width: 2, height: 2 }, // Larger shadow offset
    textShadowRadius: 3, // More shadow blur
    textAlign: 'center',
  },
  refreshButton: {
    backgroundColor: '#27AE60', // Moroccan green
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2ECC71',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

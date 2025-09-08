import React, { useState, useEffect, useRef } from 'react';
import { Platform, Modal, FlatList } from 'react-native';
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

import { 
  convertMoroccanCurrency, 
  formatCurrency, 
  isMoroccanCurrency,
  getAvailableCurrencies,
  breakdownAmount
} from '../utils/currencyUtils';
import { fetchExchangeRates, convertWithRates } from '../services/currencyApi';
import CurrencyBreakdown from '../components/CurrencyBreakdown';
import { 
  responsiveWidth, 
  responsiveHeight, 
  responsiveFontSize, 
  getResponsivePadding,
  getResponsiveMargin,
  getResponsiveFontSizes,
  getResponsiveDimensions,
  isSmallScreen,
  isMediumScreen,
  isLargeScreen,
  isTablet
} from '../utils/responsive';

export default function ConverterScreen() {
  const { t } = useTranslation();
  const amountInputRef = useRef(null);
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('dirham');
  const [toCurrency, setToCurrency] = useState('ryal');
  const [result, setResult] = useState(0);
  const [exchangeRates, setExchangeRates] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isInternationalMode, setIsInternationalMode] = useState(false);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

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

  // Auto-focus the input when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      if (amountInputRef.current) {
        amountInputRef.current.focus();
      }
    }, 100); // Small delay to ensure component is fully mounted

    return () => clearTimeout(timer);
  }, []);

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
      // Focus the input field instead of showing alert
      if (amountInputRef.current) {
        amountInputRef.current.focus();
      }
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
    
    // Refocus the input after mode change
    setTimeout(() => {
      if (amountInputRef.current) {
        amountInputRef.current.focus();
      }
    }, 100);
  };

  const handleFromCurrencySelect = (currencyCode) => {
    setFromCurrency(currencyCode);
    setShowFromDropdown(false);
    // Don't automatically recalculate - user needs to click convert button
  };

  const handleToCurrencySelect = (currencyCode) => {
    setToCurrency(currencyCode);
    setShowToDropdown(false);
    // Don't automatically recalculate - user needs to click convert button
  };

  const formatNumber = (num) => {
    // Convert to number first to handle any string issues
    const numericValue = parseFloat(num);
    if (isNaN(numericValue)) return '0';
    
    // Format with proper thousands separators
    const formatted = numericValue.toLocaleString('en-US');
    return formatted;
  };

  const formatInternationalNumber = (num) => {
    // Format with 2 decimal places for international currencies
    const numericValue = parseFloat(num);
    if (isNaN(numericValue)) return '0.00';
    
    // Use toLocaleString for proper formatting
    return numericValue.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const parseFormattedNumber = (formattedStr) => {
    // Remove spaces and convert to number
    return parseFloat(formattedStr.replace(/\s/g, '')) || 0;
  };

  const handleAmountChange = (text) => {
    // Remove any non-numeric characters except decimal point
    let cleanText = text.replace(/[^0-9.]/g, '');
    
    // Handle multiple decimal points
    const parts = cleanText.split('.');
    if (parts.length > 2) {
      cleanText = parts[0] + '.' + parts.slice(1).join('');
    }
    
    setAmount(cleanText); // Store the raw input for display
    
    // Clear result if amount is empty
    if (!cleanText || cleanText === '') {
      setResult(0);
    }
  };

  const getCurrencyDisplayName = (currencyCode) => {
    return t(`converter.currencies.${currencyCode}`, { defaultValue: currencyCode });
  };

  const getCurrencySymbol = (currencyCode) => {
    const symbols = {
      // International currencies
      'MAD': 'د.م.', // Moroccan Dirham
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'JPY': '¥',
      'CAD': 'C$',
      'AUD': 'A$',
      'CHF': 'CHF',
      'CNY': '¥',
      'SAR': '﷼',
      'AED': 'د.إ',
      // Moroccan currencies (keep full names)
      'dirham': t('converter.currencies.dirham'),
      'centime': t('converter.currencies.centime'),
      'franc': t('converter.currencies.franc'),
      'ryal': t('converter.currencies.ryal'),
      'dourou': t('converter.currencies.dourou'),
      'benduqui': t('converter.currencies.benduqui'),
      'mouzouna': t('converter.currencies.mouzouna'),
      'falous': t('converter.currencies.falous'),
      'qharrouba': t('converter.currencies.qharrouba'),
      'ouqiya': t('converter.currencies.ouqiya'),
    };
    return symbols[currencyCode] || currencyCode;
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
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
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
          ref={amountInputRef}
          style={styles.amountDisplay}
          value={amount ? formatNumber(amount) : ''}
          onChangeText={handleAmountChange}
          placeholder="0"
          keyboardType="numeric"
          placeholderTextColor="#C9B99B"
          autoFocus={true}
          selectTextOnFocus={true}
        />
      </View>

      {/* From and To Currency Row */}
      <View style={styles.currencyRowContainer}>
        <View style={styles.currencySelector}>
          <Text style={styles.currencyLabel}>{t('converter.from')}</Text>
          <TouchableOpacity 
            style={styles.pickerWrapper}
            onPress={() => setShowFromDropdown(true)}
          >
            <Text style={styles.pickerText}>
              {isInternationalMode 
                ? `${Platform.OS === 'ios' ? '' : getCurrencyIcon(fromCurrency)} ${fromCurrency}`
                : getCurrencyDisplayName(fromCurrency)
              }
            </Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity>
        </View>
        {/* Switch button between dropdowns */}
        <View style={styles.switchButtonContainer}>
          <TouchableOpacity
            accessibilityLabel="Swap currencies"
            onPress={() => {
              const prevFrom = fromCurrency;
              setFromCurrency(toCurrency);
              setToCurrency(prevFrom);
              // Reset result after swap
              setResult(0);
            }}
            style={styles.switchButton}
          >
            <Text style={styles.switchIcon}>⇄</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.currencySelector}>
          <Text style={styles.currencyLabel}>{t('converter.to')}</Text>
          <TouchableOpacity 
            style={styles.pickerWrapper}
            onPress={() => setShowToDropdown(true)}
          >
            <Text style={styles.pickerText}>
              {isInternationalMode 
                ? `${Platform.OS === 'ios' ? '' : getCurrencyIcon(toCurrency)} ${toCurrency}`
                : getCurrencyDisplayName(toCurrency)
              }
            </Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity>
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
          <Text style={[styles.resultValue, { direction: 'ltr' }]}>
            {isInternationalMode ? formatInternationalNumber(result) : formatNumber(result)} {getCurrencySymbol(toCurrency)}
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

      {/* From Currency Dropdown Modal */}
      <Modal
        visible={showFromDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowFromDropdown(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowFromDropdown(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select From Currency</Text>
            <FlatList
              data={availableCurrencies}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.currencyOption,
                    fromCurrency === item.code && styles.selectedCurrencyOption
                  ]}
                  onPress={() => handleFromCurrencySelect(item.code)}
                >
                  <Text style={styles.currencyOptionText}>
                    {isInternationalMode 
                      ? `${Platform.OS === 'ios' ? '' : getCurrencyIcon(item.code)} ${item.code}`
                      : getCurrencyDisplayName(item.code)
                    }
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* To Currency Dropdown Modal */}
      <Modal
        visible={showToDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowToDropdown(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowToDropdown(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select To Currency</Text>
            <FlatList
              data={availableCurrencies}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.currencyOption,
                    toCurrency === item.code && styles.selectedCurrencyOption
                  ]}
                  onPress={() => handleToCurrencySelect(item.code)}
                >
                  <Text style={styles.currencyOptionText}>
                    {isInternationalMode 
                      ? `${Platform.OS === 'ios' ? '' : getCurrencyIcon(item.code)} ${item.code}`
                      : getCurrencyDisplayName(item.code)
                    }
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: responsiveHeight(60),
  },
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent', // Make transparent to show background image
    padding: getResponsivePadding(),
  },
  modeToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: responsiveHeight(10),
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent black
    borderRadius: responsiveWidth(12),
    paddingVertical: responsiveHeight(6),
    paddingHorizontal: getResponsivePadding(),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#000000', // Black border
  },
  modeLabel: {
    fontSize: responsiveFontSize(16),
    fontWeight: 'bold',
    color: '#FFFFFF', // Pure white for maximum contrast
    marginHorizontal: getResponsiveMargin(),
    textShadowColor: 'rgba(0,0,0,0.8)', // Strong black shadow
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: responsiveHeight(10),
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
    marginBottom: responsiveHeight(15),
  },
  amountDisplay: {
    fontSize: responsiveFontSize(60),
    fontWeight: 'bold',
    color: '#FFFFFF', // Pure white for the large amount number
    textAlign: 'center',
    backgroundColor: 'transparent',
    borderWidth: 0,
    minWidth: responsiveWidth(200),
    textShadowColor: 'rgba(0,0,0,0.8)', // Black shadow for contrast
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    writingDirection: 'ltr', // Force LTR for numbers
    textAlignVertical: 'center', // Center text vertically
    includeFontPadding: false, // Remove extra padding that might affect centering
  },
  currencyRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: responsiveHeight(15),
    paddingHorizontal: getResponsivePadding(),
  },
  currencySelector: {
    flex: 1,
    marginHorizontal: getResponsiveMargin(),
  },
  currencyLabel: {
    fontSize: isSmallScreen() ? responsiveFontSize(12) : 
              isTablet() ? responsiveFontSize(16) : responsiveFontSize(14),
    fontWeight: 'bold',
    color: '#FFFFFF', // Pure white for maximum contrast
    textAlign: 'center',
    marginBottom: isSmallScreen() ? responsiveHeight(3) : responsiveHeight(5),
    textShadowColor: 'rgba(0,0,0,0.8)', // Strong black shadow
    textShadowOffset: { width: 2, height: 2 }, // Larger shadow offset
    textShadowRadius: 3, // More shadow blur for better visibility
    letterSpacing: 1, // Better letter spacing for readability
  },
  pickerWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: isSmallScreen() ? responsiveWidth(20) : responsiveWidth(25),
    borderWidth: 2,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    minHeight: isSmallScreen() ? responsiveHeight(40) : 
               isTablet() ? responsiveHeight(55) : responsiveHeight(48),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: isSmallScreen() ? responsiveWidth(12) : 
                       isTablet() ? responsiveWidth(20) : responsiveWidth(15),
  },
  pickerText: {
    fontSize: isSmallScreen() ? responsiveFontSize(14) : 
              isTablet() ? responsiveFontSize(18) : responsiveFontSize(16),
    fontWeight: '600',
    color: '#000000',
    flex: 1,
  },
  dropdownArrow: {
    fontSize: isSmallScreen() ? responsiveFontSize(10) : 
              isTablet() ? responsiveFontSize(14) : responsiveFontSize(12),
    color: '#666',
    marginLeft: isSmallScreen() ? responsiveWidth(8) : responsiveWidth(10),
  },
  switchButtonContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: isSmallScreen() ? responsiveHeight(4) : responsiveHeight(6),
  },
  switchButton: {
    width: responsiveWidth(34),
    height: responsiveWidth(34),
    borderRadius: responsiveWidth(17),
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: responsiveWidth(6),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#1b3a25',
  },
  switchIcon: {
    color: '#27AE60',
    fontSize: responsiveFontSize(14),
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: isSmallScreen() ? responsiveWidth(12) : responsiveWidth(15),
    padding: isSmallScreen() ? responsiveHeight(15) : 
             isTablet() ? responsiveHeight(25) : responsiveHeight(20),
    margin: isSmallScreen() ? responsiveHeight(15) : responsiveHeight(20),
    maxHeight: isSmallScreen() ? '60%' : '70%',
    minWidth: isSmallScreen() ? '90%' : '80%',
    maxWidth: isTablet() ? responsiveWidth(500) : '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: isSmallScreen() ? responsiveFontSize(16) : 
              isTablet() ? responsiveFontSize(20) : responsiveFontSize(18),
    fontWeight: 'bold',
    color: '#2D5F3E',
    marginBottom: isSmallScreen() ? responsiveHeight(12) : responsiveHeight(15),
    textAlign: 'center',
  },
  currencyOption: {
    paddingVertical: isSmallScreen() ? responsiveHeight(12) : 
                     isTablet() ? responsiveHeight(18) : responsiveHeight(15),
    paddingHorizontal: isSmallScreen() ? responsiveWidth(8) : 
                       isTablet() ? responsiveWidth(15) : responsiveWidth(10),
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  selectedCurrencyOption: {
    backgroundColor: '#E8F5E8',
  },
  currencyOptionText: {
    fontSize: isSmallScreen() ? responsiveFontSize(14) : 
              isTablet() ? responsiveFontSize(18) : responsiveFontSize(16),
    color: '#333',
  },
  convertButtonContainer: {
    marginBottom: responsiveHeight(15),
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  convertButton: {
    borderRadius: 15,
    padding: responsiveHeight(15),
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
    padding: responsiveHeight(15),
    marginBottom: responsiveHeight(15),
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
    fontSize: responsiveFontSize(16), // Reduced to save space
    color: '#FFFFFF', // Pure white for better visibility
    marginBottom: responsiveHeight(8), // Reduced margin
    textShadowColor: 'rgba(0,0,0,0.8)', // Stronger shadow
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    textAlign: 'center',
    fontWeight: '600',
  },
  resultValue: {
    fontSize: responsiveFontSize(28), // Reduced to save space
    fontWeight: 'bold',
    color: '#FFD700', // Bright gold for better visibility
    marginBottom: responsiveHeight(10), // Reduced margin
    textShadowColor: 'rgba(0,0,0,0.8)', // Stronger shadow
    textShadowOffset: { width: 2, height: 2 }, // Larger shadow offset
    textShadowRadius: 3, // More shadow blur
    textAlign: 'center',
    writingDirection: 'ltr', // Force LTR for numbers
    direction: 'ltr', // Additional LTR enforcement
  },
  refreshButton: {
    backgroundColor: '#27AE60', // Moroccan green
    borderRadius: 12,
    padding: responsiveHeight(12),
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

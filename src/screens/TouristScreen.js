import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import i18n from '../translations/i18n';
import { fetchExchangeRates } from '../services/currencyApi';
import { DENOMINATIONS } from '../utils/currencyUtils';
import BannerAd from '../components/BannerAd';

export default function TouristScreen() {
  const { t } = useTranslation();
  const [exchangeRates, setExchangeRates] = useState(null);
  const [selectedTab, setSelectedTab] = useState('bills');

  // All languages now use LTR layout

  useEffect(() => {
    loadExchangeRates();
  }, []);

  const loadExchangeRates = async () => {
    try {
      const ratesData = await fetchExchangeRates();
      setExchangeRates(ratesData.rates);
    } catch (error) {
      console.error('Failed to load exchange rates:', error);
    }
  };

  const bills = DENOMINATIONS.filter(d => d.type === 'bill');
  const coins = DENOMINATIONS.filter(d => d.type === 'coin');

  const getCurrencyHistory = () => [
    {
      currency: 'dirham',
      title: t('tourist.currencyHistory.dirham.title'),
      description: t('tourist.currencyHistory.dirham.description'),
      period: t('tourist.currencyHistory.dirham.period'),
      icon: '🪙',
      facts: [
        t('tourist.currencyHistory.dirham.fact1'),
        t('tourist.currencyHistory.dirham.fact2'),
        t('tourist.currencyHistory.dirham.fact3')
      ]
    },
    {
      currency: 'ryal',
      title: t('tourist.currencyHistory.ryal.title'),
      description: t('tourist.currencyHistory.ryal.description'),
      period: t('tourist.currencyHistory.ryal.period'),
      icon: '🪙',
      facts: [
        t('tourist.currencyHistory.ryal.fact1'),
        t('tourist.currencyHistory.ryal.fact2'),
        t('tourist.currencyHistory.ryal.fact3')
      ]
    },
    {
      currency: 'franc',
      title: t('tourist.currencyHistory.franc.title'),
      description: t('tourist.currencyHistory.franc.description'),
      period: t('tourist.currencyHistory.franc.period'),
      icon: '🪙',
      facts: [
        t('tourist.currencyHistory.franc.fact1'),
        t('tourist.currencyHistory.franc.fact2'),
        t('tourist.currencyHistory.franc.fact3')
      ]
    },
    {
      currency: 'centime',
      title: t('tourist.currencyHistory.centime.title'),
      description: t('tourist.currencyHistory.centime.description'),
      period: t('tourist.currencyHistory.centime.period'),
      icon: '🪙',
      facts: [
        t('tourist.currencyHistory.centime.fact1'),
        t('tourist.currencyHistory.centime.fact2'),
        t('tourist.currencyHistory.centime.fact3')
      ]
    }
  ];


  const getBillImage = (value) => {
    switch (value) {
      case 200:
        return require('../../assets/currency/bills/bill_200dh.png');
      case 100:
        return require('../../assets/currency/bills/bill_100dh.png');
      case 50:
        return require('../../assets/currency/bills/bill_50dh.png');
      case 25:
        return require('../../assets/currency/bills/bill_25dh.png');
      case 20:
        return require('../../assets/currency/bills/bill_20dh.png');
      default:
        return null;
    }
  };

  const getCoinImage = (value) => {
    switch (value) {
      case 10:
        return require('../../assets/currency/coins/coin_10dh.png');
      case 5:
        return require('../../assets/currency/coins/coin_5dh.png');
      case 2:
        return require('../../assets/currency/coins/coin_2dh.png');
      case 1:
        return require('../../assets/currency/coins/coin_1dh.png');
      case 0.5:
        return require('../../assets/currency/coins/coin_50c.png');
      case 0.2:
        return require('../../assets/currency/coins/coin_20c.png');
      case 0.1:
        return require('../../assets/currency/coins/coin_10c.png');
      default:
        return null;
    }
  };

  const renderDenomination = (item) => (
    <View key={item.key} style={styles.denominationCard}>
      {item.type === 'bill' && getBillImage(item.value) ? (
        <Image
          source={getBillImage(item.value)}
          style={styles.billImage}
          resizeMode="contain"
        />
      ) : item.type === 'coin' && getCoinImage(item.value) ? (
        <Image
          source={getCoinImage(item.value)}
          style={styles.coinImage}
          resizeMode="contain"
        />
      ) : (
        <View style={[
          styles.denominationIcon,
          { backgroundColor: item.type === 'bill' ? '#4CAF50' : '#FF9800' }
        ]}>
          <Text style={styles.denominationText}>
            {item.value >= 1 ? `${item.value} DH` : `${item.value * 100}c`}
          </Text>
        </View>
      )}
      <Text style={styles.denominationLabel}>
        {t(`breakdown.${item.key}`)}
      </Text>
      <Text style={styles.denominationDescription}>
        {item.type === 'bill' ? t('tourist.bills') : t('tourist.coins')}
      </Text>
    </View>
  );

  const renderCurrencyHistory = () => (
    <View style={styles.historyList}>
      {getCurrencyHistory().map((currency, index) => (
        <View key={currency.currency} style={styles.historyCard}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyIcon}>{currency.icon}</Text>
            <View style={styles.historyTitleContainer}>
              <Text style={styles.historyTitle}>{currency.title}</Text>
              <Text style={styles.historyPeriod}>{currency.period}</Text>
            </View>
          </View>
          <Text style={styles.historyDescription}>{currency.description}</Text>
          <View style={styles.historyFacts}>
            {currency.facts.map((fact, factIndex) => (
              <View key={factIndex} style={styles.factItem}>
                <Text style={styles.factBullet}>•</Text>
                <Text style={styles.factText}>{fact}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <ImageBackground 
      source={require('../../assets/background.png')} 
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <ScrollView style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'bills' && styles.activeTab]}
          onPress={() => setSelectedTab('bills')}
        >
          <Text style={[styles.tabText, selectedTab === 'bills' && styles.activeTabText]}>
            {t('tourist.bills')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'coins' && styles.activeTab]}
          onPress={() => setSelectedTab('coins')}
        >
          <Text style={[styles.tabText, selectedTab === 'coins' && styles.activeTabText]}>
            {t('tourist.coins')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'history' && styles.activeTab]}
          onPress={() => setSelectedTab('history')}
        >
          <Text style={[styles.tabText, selectedTab === 'history' && styles.activeTabText]}>
            {t('tourist.history')}
          </Text>
        </TouchableOpacity>
      </View>

      {selectedTab === 'bills' && (
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>{t('tourist.bills')}</Text>
          <Text style={styles.sectionDescription}>
            Moroccan banknotes come in denominations of 20, 50, 100, and 200 dirhams.
          </Text>
          <View style={styles.denominationGrid}>
            {bills.map(renderDenomination)}
          </View>
        </View>
      )}

      {selectedTab === 'coins' && (
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>{t('tourist.coins')}</Text>
          <Text style={styles.sectionDescription}>
            Moroccan coins include 1, 2, 5, and 10 dirhams, plus smaller denominations.
          </Text>
          <View style={styles.denominationGrid}>
            {coins.map(renderDenomination)}
          </View>
        </View>
      )}

      {selectedTab === 'history' && (
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>{t('tourist.history')}</Text>
          <Text style={styles.sectionDescription}>
            {t('tourist.historyDescription')}
          </Text>
          <View style={styles.historyContainer}>
            {renderCurrencyHistory()}
          </View>
        </View>
      )}

      {/* Banner Ad before Tips */}
      <BannerAd placement="tourist_banner" />

      <View style={styles.conversionTip}>
        <Text style={styles.tipTitle}>💡 {t('common.tip')}</Text>
        <Text style={styles.tipText}>
          Use the Converter tab to get real-time exchange rates between Moroccan Dirhams and your home currency.
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#2D5F3E',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#2D5F3E',
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 22,
  },
  denominationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  denominationCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  denominationIcon: {
    width: 80,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  billImage: {
    width: 120,
    height: 60,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  coinImage: {
    width: 80,
    height: 80,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  denominationText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  denominationLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  denominationDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  historyContainer: {
    marginTop: 10,
  },
  historyList: {
    marginTop: 10,
  },
  historyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  historyIcon: {
    fontSize: 32,
    marginRight: 16,
    textAlign: 'center',
    minWidth: 40,
  },
  historyTitleContainer: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D5F3E',
    marginBottom: 4,
  },
  historyPeriod: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  historyDescription: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 16,
  },
  historyFacts: {
    marginTop: 8,
  },
  factItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  factBullet: {
    fontSize: 16,
    color: '#2D5F3E',
    marginRight: 12,
    marginTop: 2,
  },
  factText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    flex: 1,
  },
  conversionTip: {
    backgroundColor: '#e8f5e8',
    margin: 20,
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D5F3E',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});

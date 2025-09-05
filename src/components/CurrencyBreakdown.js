import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { breakdownAmount } from '../utils/currencyUtils';

export default function CurrencyBreakdown({ amount }) {
  const { t } = useTranslation();
  
  if (!amount || amount <= 0) {
    return null;
  }

  const breakdown = breakdownAmount(amount);
  
  if (breakdown.length === 0) {
    return null;
  }

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

  const renderBreakdownItem = ({ item }) => (
    <View style={styles.breakdownItem}>
      <View style={styles.denominationInfo}>
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
            <Text style={styles.denominationValue}>
              {item.value >= 1 ? `${item.value}` : `${item.value * 100}c`}
            </Text>
          </View>
        )}
        <Text style={styles.denominationName}>
          {t(`breakdown.${item.key}`)}
        </Text>
      </View>
      <View style={styles.countInfo}>
        <Text style={styles.count}>×{item.count}</Text>
        <Text style={styles.total}>{item.total.toFixed(2)} DH</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('converter.breakdown')}</Text>
      <ScrollView 
        style={styles.list}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        {breakdown.map((item) => (
          <View key={item.key}>
            {renderBreakdownItem({ item })}
          </View>
        ))}
      </ScrollView>
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>{t('common.total')}</Text>
        <Text style={styles.totalAmount}>{amount.toFixed(2)} DH</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    width: '100%',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  list: {
    maxHeight: 200,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  denominationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  denominationIcon: {
    width: 40,
    height: 25,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  billImage: {
    width: 60,
    height: 30,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  coinImage: {
    width: 40,
    height: 40,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  denominationValue: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  denominationName: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  countInfo: {
    alignItems: 'flex-end',
  },
  count: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  total: {
    fontSize: 12,
    color: '#2D5F3E',
    fontWeight: '500',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 2,
    borderTopColor: '#2D5F3E',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D5F3E',
  },
});

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ADMOB_CONFIG } from '../config/admob';

// Safe import for modern AdMob
let BannerAd = null;
try {
  const AdMobModule = require('react-native-google-mobile-ads');
  BannerAd = AdMobModule.BannerAd;
} catch (error) {
  console.error('AdMob module not available:', error.message);
}

export default function BannerAdComponent({ placement = 'default' }) {
  const [isAdMobAvailable, setIsAdMobAvailable] = useState(false);
  const [adFailed, setAdFailed] = useState(false);
  const isSquareAd = placement.includes('bills_ad') || placement.includes('coins_ad');
  
  useEffect(() => {
    // Check if AdMob is available
    setIsAdMobAvailable(BannerAd !== null);
  }, []);
  
  // Use real AdMob banner for non-square ads if available
  if (!isSquareAd && isAdMobAvailable && BannerAd && !adFailed) {
    return (
      <View style={styles.container}>
        <BannerAd
          unitId={ADMOB_CONFIG.BANNER_AD_UNIT_ID}
          size="ADAPTIVE_BANNER"
          requestOptions={{
            requestNonPersonalizedAdsOnly: false,
          }}
          onAdFailedToLoad={(error) => {
            // Check if it's a "no fill" error (normal) vs actual error
            const isNoFill = error.message?.includes('no-fill') || 
                           error.message?.includes('no fill') ||
                           error.code === 'no-fill';
            
            if (isNoFill) {
              // "No fill" is normal - just hide the ad container
              setAdFailed(true);
            } else {
              // Real error - log it
              console.error('Banner ad failed to load:', error);
              setAdFailed(true);
            }
          }}
          onAdLoaded={() => {
            // Ad loaded successfully
            setAdFailed(false);
          }}
        />
      </View>
    );
  }
  
  // Don't show anything if ad failed to load (no fill or error)
  if (adFailed) {
    return null;
  }
  
  // Fallback to placeholder if AdMob not available or square ad
  return (
    <View style={isSquareAd ? styles.squareContainer : styles.container}>
      <Text style={styles.placeholderText}>
        {isSquareAd ? 'Ad' : `Ad Space - ${placement}`}
      </Text>
      {!isSquareAd && (
        <Text style={styles.configText}>
          {isAdMobAvailable ? 'Loading Ad...' : 'AdMob not available'}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 10,
    height: 50,
    backgroundColor: '#f0f0f0',
    marginVertical: 0,
    marginHorizontal: 0,
    borderRadius: 0,
    width: '100%',
  },
  squareContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    flex: 1,
    width: '100%',
    minHeight: 80,
  },
  placeholderText: {
    color: '#666',
    fontSize: 12,
    fontStyle: 'italic',
  },
  configText: {
    color: '#999',
    fontSize: 10,
    marginTop: 2,
  },
});

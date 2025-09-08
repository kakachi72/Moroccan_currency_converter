// Interstitial ad manager with modern AdMob configuration
import { ADMOB_CONFIG } from '../config/admob';

// Safe import for modern AdMob
let InterstitialAd = null;
try {
  const AdMobModule = require('react-native-google-mobile-ads');
  InterstitialAd = AdMobModule.InterstitialAd;
} catch (error) {
  console.log('AdMob module not available:', error.message);
}

class InterstitialAdManager {
  constructor() {
    this.isLoaded = false;
    this.isLoading = false;
    this.adUnitId = ADMOB_CONFIG.INTERSTITIAL_AD_UNIT_ID;
    this.isAdMobAvailable = InterstitialAd !== null;
    this.interstitialAd = null;
    
    if (this.isAdMobAvailable) {
      this.setupAd();
    }
  }

  setupAd() {
    if (!InterstitialAd) return;
    
    this.interstitialAd = InterstitialAd.createForAdRequest(this.adUnitId, {
      requestNonPersonalizedAdsOnly: false,
    });

    this.interstitialAd.addAdEventListener('loaded', () => {
      console.log('Interstitial ad loaded successfully');
      this.isLoaded = true;
      this.isLoading = false;
    });

    this.interstitialAd.addAdEventListener('error', (error) => {
      console.log('Interstitial ad failed to load:', error);
      this.isLoaded = false;
      this.isLoading = false;
    });

    this.interstitialAd.addAdEventListener('closed', () => {
      console.log('Interstitial ad closed');
      this.isLoaded = false;
    });
  }

  // Load interstitial ad
  loadAd() {
    if (!this.isAdMobAvailable || !this.interstitialAd) {
      console.log('AdMob not available, skipping ad load');
      return Promise.resolve();
    }

    if (this.isLoading || this.isLoaded) {
      return Promise.resolve();
    }

    this.isLoading = true;
    console.log('Loading interstitial ad...', this.adUnitId);
    
    this.interstitialAd.load();
    return Promise.resolve();
  }

  // Show interstitial ad
  showAd() {
    if (!this.isAdMobAvailable || !this.interstitialAd) {
      console.log('AdMob not available, skipping ad show');
      return false;
    }

    if (!this.isLoaded) {
      console.log('Interstitial ad not loaded yet');
      return false;
    }

    console.log('Showing interstitial ad...');
    this.interstitialAd.show();
    return true;
  }

  // Preload interstitial ad
  preloadAd() {
    if (!this.isLoaded && !this.isLoading) {
      this.loadAd();
    }
  }
}

// Export singleton instance
export const interstitialAdManager = new InterstitialAdManager();

// Export hook for easy use in components
export const useInterstitialAd = () => {
  const showInterstitialAd = () => {
    return interstitialAdManager.showAd();
  };

  const preloadInterstitialAd = () => {
    interstitialAdManager.preloadAd();
  };

  return {
    showInterstitialAd,
    preloadInterstitialAd,
  };
};

// Interstitial ad manager with modern AdMob configuration
import { ADMOB_CONFIG } from '../config/admob';

// Safe import for modern AdMob
let InterstitialAd = null;
try {
  const AdMobModule = require('react-native-google-mobile-ads');
  InterstitialAd = AdMobModule.InterstitialAd;
} catch (error) {
  console.error('AdMob module not available:', error.message);
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
      this.isLoaded = true;
      this.isLoading = false;
    });

    this.interstitialAd.addAdEventListener('error', (error) => {
      // Check if it's a "no fill" error (normal) vs actual error
      const isNoFill = error.message?.includes('no-fill') || 
                     error.message?.includes('no fill') ||
                     error.code === 'no-fill';
      
      if (!isNoFill) {
        // Only log real errors, not "no fill" which is normal
        console.error('Interstitial ad failed to load:', error);
      }
      
      this.isLoaded = false;
      this.isLoading = false;
    });

    this.interstitialAd.addAdEventListener('closed', () => {
      this.isLoaded = false;
    });
  }

  // Load interstitial ad
  loadAd() {
    if (!this.isAdMobAvailable || !this.interstitialAd) {
      return Promise.resolve();
    }

    if (this.isLoading || this.isLoaded) {
      return Promise.resolve();
    }

    this.isLoading = true;
    this.interstitialAd.load();
    return Promise.resolve();
  }

  // Show interstitial ad
  showAd() {
    if (!this.isAdMobAvailable || !this.interstitialAd) {
      return false;
    }

    if (!this.isLoaded) {
      return false;
    }

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

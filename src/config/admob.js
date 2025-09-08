// AdMob Configuration
// Replace these with your actual AdMob unit IDs when you create them

// Environment configuration
const IS_PRODUCTION = true; // Set to true when ready for production

export const ADMOB_CONFIG = {
  // Test Ad Unit IDs (use these for development)
  TEST: {
    BANNER_AD_UNIT_ID: 'ca-app-pub-3940256099942544/6300978111', // Test banner ad
    INTERSTITIAL_AD_UNIT_ID: 'ca-app-pub-3940256099942544/1033173712', // Test interstitial ad
    APP_ID: 'ca-app-pub-3940256099942544~3347511713', // Test app ID
  },
  
  // Production Ad Unit IDs (your real IDs)
  PRODUCTION: {
    BANNER_AD_UNIT_ID: 'ca-app-pub-5705725180630568/4365235232', // Your real banner ad ID
    INTERSTITIAL_AD_UNIT_ID: 'ca-app-pub-5705725180630568/2453387762', // Your real interstitial ad ID
    APP_ID: 'ca-app-pub-5705725180630568~6839355333', // Your real app ID
  },
  
  // Current configuration based on environment
  BANNER_AD_UNIT_ID: IS_PRODUCTION 
    ? 'ca-app-pub-5705725180630568/4365235232' // Your real banner ID
    : 'ca-app-pub-3940256099942544/6300978111',
    
  INTERSTITIAL_AD_UNIT_ID: IS_PRODUCTION 
    ? 'ca-app-pub-5705725180630568/2453387762' // Your real interstitial ID
    : 'ca-app-pub-3940256099942544/1033173712',
    
  APP_ID: IS_PRODUCTION 
    ? 'ca-app-pub-5705725180630568~6839355333' // Your real app ID
    : 'ca-app-pub-3940256099942544~3347511713',
};

// Ad placement configuration
export const AD_PLACEMENTS = {
  SETTINGS_BANNER: 'settings_banner',
  TOURIST_BANNER: 'tourist_banner',
  TOURIST_BILLS_AD: 'tourist_bills_ad',
  TOURIST_COINS_AD: 'tourist_coins_ad',
  QUIZ_INTERSTITIAL: 'quiz_interstitial',
};

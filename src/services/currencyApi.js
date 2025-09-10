import AsyncStorage from '@react-native-async-storage/async-storage';

// Free API endpoints - no API key required
const FREE_API_URL = 'https://open.er-api.com/v6/latest';
const BACKUP_API_URL = 'https://api.exchangerate-api.com/v4/latest';
const CACHE_KEY = 'cached_exchange_rates';
const CACHE_TIMESTAMP_KEY = 'cache_timestamp';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

/**
 * Fetch real-time exchange rates for MAD using free API
 * @returns {Object} - Exchange rates with MAD as base
 */
export async function fetchExchangeRates() {
  try {
    // Try free API first (no API key required)
    let response = await fetch(`${FREE_API_URL}/MAD`);
    
    if (!response.ok) {
      throw new Error('Free API failed');
    }
    
    const data = await response.json();
    
    if (data && data.rates) {
      // Cache the rates
      await cacheExchangeRates(data.rates);
      return {
        success: true,
        rates: data.rates,
        timestamp: Date.now(),
        source: 'free_api'
      };
    }
    
    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Free API failed, trying backup...', error);
    
    try {
      // Try backup approach - get USD rates and calculate MAD rates
      const usdResponse = await fetch(`${BACKUP_API_URL}/USD`);
      const usdData = await usdResponse.json();
      
      if (usdData && usdData.rates && usdData.rates.MAD) {
        // Convert USD-based rates to MAD-based rates
        const madRate = usdData.rates.MAD;
        const madBasedRates = {};
        
        // Calculate rates with MAD as base
        Object.keys(usdData.rates).forEach(currency => {
          if (currency !== 'MAD') {
            madBasedRates[currency] = usdData.rates[currency] / madRate;
          }
        });
        
        madBasedRates.MAD = 1; // MAD to MAD is always 1
        
        await cacheExchangeRates(madBasedRates);
        return {
          success: true,
          rates: madBasedRates,
          timestamp: Date.now(),
          source: 'backup_api'
        };
      }
    } catch (backupError) {
      console.error('Backup API also failed:', backupError);
    }
    
    // If all APIs fail, try to get cached rates
    const cachedRates = await getCachedExchangeRates();
    if (cachedRates) {
      return {
        success: true,
        rates: cachedRates.rates,
        timestamp: cachedRates.timestamp,
        source: 'cache'
      };
    }
    
    // If no cached rates, return fallback rates
    return {
      success: false,
      rates: getFallbackRates(),
      timestamp: Date.now(),
      source: 'fallback',
      error: 'All APIs failed and no cached data available'
    };
  }
}

/**
 * Cache exchange rates to AsyncStorage
 * @param {Object} rates - Exchange rates to cache
 */
async function cacheExchangeRates(rates) {
  try {
    const cacheData = {
      rates,
      timestamp: Date.now()
    };
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    await AsyncStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    console.error('Failed to cache exchange rates:', error);
  }
}

/**
 * Get cached exchange rates from AsyncStorage
 * @returns {Object|null} - Cached rates or null if not available/expired
 */
async function getCachedExchangeRates() {
  try {
    const cachedData = await AsyncStorage.getItem(CACHE_KEY);
    const cacheTimestamp = await AsyncStorage.getItem(CACHE_TIMESTAMP_KEY);
    
    if (cachedData && cacheTimestamp) {
      const timestamp = parseInt(cacheTimestamp);
      const now = Date.now();
      
      // Check if cache is still valid (within cache duration)
      if (now - timestamp < CACHE_DURATION) {
        return JSON.parse(cachedData);
      }
    }
    
    return null;
  } catch (error) {
    console.error('Failed to get cached exchange rates:', error);
    return null;
  }
}

/**
 * Get fallback exchange rates (approximate rates for offline use)
 * @returns {Object} - Fallback exchange rates
 */
function getFallbackRates() {
  return {
    MAD: 1,
    USD: 0.10,   // 1 MAD ≈ 0.10 USD
    EUR: 0.092,  // 1 MAD ≈ 0.092 EUR
    GBP: 0.079,  // 1 MAD ≈ 0.079 GBP
    CAD: 0.135,  // 1 MAD ≈ 0.135 CAD
  };
}

/**
 * Convert currency using exchange rates
 * @param {number} amount - Amount to convert
 * @param {string} fromCurrency - Source currency code
 * @param {string} toCurrency - Target currency code
 * @param {Object} rates - Exchange rates object
 * @returns {number} - Converted amount
 */
export function convertWithRates(amount, fromCurrency, toCurrency, rates) {
  if (!amount || amount <= 0) return 0;
  if (!rates) return 0;
  
  // If converting from MAD
  if (fromCurrency === 'MAD' || fromCurrency === 'dirham') {
    const rate = rates[toCurrency];
    return rate ? amount * rate : 0;
  }
  
  // If converting to MAD
  if (toCurrency === 'MAD' || toCurrency === 'dirham') {
    const rate = rates[fromCurrency];
    return rate ? amount / rate : 0;
  }
  
  // If converting between two non-MAD currencies
  const fromRate = rates[fromCurrency];
  const toRate = rates[toCurrency];
  
  if (fromRate && toRate) {
    // Convert to MAD first, then to target currency
    const madAmount = amount / fromRate;
    return madAmount * toRate;
  }
  
  return 0;
}

/**
 * Check if we have internet connectivity
 * @returns {boolean} - True if online
 */
export async function checkConnectivity() {
  try {
    const response = await fetch('https://www.google.com', {
      method: 'HEAD',
      timeout: 5000
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Get the last update timestamp for cached rates
 * @returns {number|null} - Timestamp or null
 */
export async function getLastUpdateTimestamp() {
  try {
    const timestamp = await AsyncStorage.getItem(CACHE_TIMESTAMP_KEY);
    return timestamp ? parseInt(timestamp) : null;
  } catch (error) {
    return null;
  }
}

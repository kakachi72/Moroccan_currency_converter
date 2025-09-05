// Moroccan currency conversion rates (offline)
export const MOROCCAN_RATES = {
  dirham: 1,      // 1 DH = 1 DH (base)
  centime: 0.01,  // 1 centime = 0.01 DH
  franc: 0.01,    // 1 franc = 0.01 DH (same as centime)
  ryal: 0.05,     // 1 ryal = 0.05 DH
};

// Moroccan currency denominations for visual breakdown
export const DENOMINATIONS = [
  { type: 'bill', value: 200, key: 'bill200' },
  { type: 'bill', value: 100, key: 'bill100' },
  { type: 'bill', value: 50, key: 'bill50' },
  { type: 'bill', value: 25, key: 'bill25' },
  { type: 'bill', value: 20, key: 'bill20' },
  { type: 'coin', value: 10, key: 'coin10' },
  { type: 'coin', value: 5, key: 'coin5' },
  { type: 'coin', value: 2, key: 'coin2' },
  { type: 'coin', value: 1, key: 'coin1' },
  { type: 'coin', value: 0.5, key: 'coin50c' },
  { type: 'coin', value: 0.2, key: 'coin20c' },
  { type: 'coin', value: 0.1, key: 'coin10c' },
];

/**
 * Convert between Moroccan currencies (offline conversion)
 * @param {number} amount - The amount to convert
 * @param {string} fromCurrency - Source currency (dirham, centime, franc, ryal)
 * @param {string} toCurrency - Target currency (dirham, centime, franc, ryal)
 * @returns {number} - Converted amount
 */
export function convertMoroccanCurrency(amount, fromCurrency, toCurrency) {
  if (!amount || amount <= 0) return 0;
  
  // Convert to dirham first (base currency)
  const dirhamAmount = amount * MOROCCAN_RATES[fromCurrency];
  
  // Convert from dirham to target currency
  const result = dirhamAmount / MOROCCAN_RATES[toCurrency];
  
  return Math.round(result * 100) / 100; // Round to 2 decimal places
}

/**
 * Break down an amount in dirhams into bills and coins
 * @param {number} amount - Amount in dirhams
 * @returns {Array} - Array of denomination objects with count
 */
export function breakdownAmount(amount) {
  if (!amount || amount <= 0) return [];
  
  let remaining = Math.round(amount * 100) / 100; // Round to 2 decimal places
  const breakdown = [];
  
  for (const denomination of DENOMINATIONS) {
    const count = Math.floor(remaining / denomination.value);
    if (count > 0) {
      breakdown.push({
        ...denomination,
        count,
        total: count * denomination.value
      });
      remaining = Math.round((remaining - (count * denomination.value)) * 100) / 100;
    }
  }
  
  return breakdown;
}

/**
 * Format currency amount with proper decimals
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code
 * @returns {string} - Formatted amount
 */
export function formatCurrency(amount, currency = 'MAD') {
  if (!amount && amount !== 0) return '0';
  
  const formatted = Math.round(amount * 100) / 100;
  
  switch (currency) {
    case 'MAD':
    case 'dirham':
      return `${formatted.toFixed(2)} DH`;
    case 'USD':
      return `$${formatted.toFixed(2)}`;
    case 'EUR':
      return `€${formatted.toFixed(2)}`;
    case 'GBP':
      return `£${formatted.toFixed(2)}`;
    case 'CAD':
      return `C$${formatted.toFixed(2)}`;
    case 'centime':
    case 'franc':
      return `${formatted.toFixed(2)}`;
    case 'ryal':
      return `${formatted.toFixed(2)}`;
    default:
      return `${formatted.toFixed(2)} ${currency}`;
  }
}

/**
 * Check if a currency is Moroccan (for offline conversion)
 * @param {string} currency - Currency code
 * @returns {boolean} - True if Moroccan currency
 */
export function isMoroccanCurrency(currency) {
  return ['dirham', 'centime', 'franc', 'ryal', 'MAD'].includes(currency);
}

/**
 * Get all available currencies
 * @returns {Object} - Object with Moroccan and international currencies
 */
export function getAvailableCurrencies() {
  return {
    moroccan: [
      { code: 'dirham', symbol: 'DH' },
      { code: 'ryal', symbol: 'r' },
      { code: 'centime', symbol: 'c' },
      { code: 'franc', symbol: 'f' },
    ],
    international: [
      { code: 'MAD', symbol: 'DH' },
      { code: 'USD', symbol: '$' },
      { code: 'EUR', symbol: '€' },
      { code: 'GBP', symbol: '£' },
      { code: 'CAD', symbol: 'C$' },
      { code: 'JPY', symbol: '¥' },
      { code: 'AUD', symbol: 'A$' },
      { code: 'CHF', symbol: 'CHF' },
      { code: 'CNY', symbol: '¥' },
      { code: 'SAR', symbol: 'SR' },
      { code: 'AED', symbol: 'AED' },
    ]
  };
}

import { I18nManager } from 'react-native';

// All languages are now LTR (Left-to-Right)
const RTL_LANGUAGES = []; // Empty array - no RTL languages

/**
 * Check if a language is RTL
 * @param {string} languageCode - Language code (e.g., 'ar', 'en')
 * @returns {boolean} - Always returns false (all languages are LTR)
 */
export const isRTLLanguage = (languageCode) => {
  return false; // All languages (Arabic, French, English) are now LTR
};

/**
 * Get RTL-aware flex direction
 * @param {string} languageCode - Current language code
 * @param {string} defaultDirection - Default direction ('row' or 'row-reverse')
 * @returns {string} - Always returns default direction (all languages are LTR)
 */
export const getRTLFlexDirection = (languageCode, defaultDirection = 'row') => {
  return defaultDirection; // All languages are LTR, so always return default
};

/**
 * Get RTL-aware text alignment
 * @param {string} languageCode - Current language code
 * @param {string} defaultAlignment - Default alignment ('left', 'right', 'center')
 * @returns {string} - Always returns default alignment (all languages are LTR)
 */
export const getRTLTextAlign = (languageCode, defaultAlignment = 'left') => {
  return defaultAlignment; // All languages are LTR, so always return default
};

/**
 * Get RTL-aware margin/padding direction
 * @param {string} languageCode - Current language code
 * @param {string} direction - Direction ('left', 'right', 'start', 'end')
 * @returns {string} - Always returns original direction (all languages are LTR)
 */
export const getRTLDirection = (languageCode, direction) => {
  return direction; // All languages are LTR, so always return original direction
};

/**
 * Get RTL-aware style object for margins
 * @param {string} languageCode - Current language code
 * @param {object} marginStyle - Style object with margin properties
 * @returns {object} - Always returns original margin style (all languages are LTR)
 */
export const getRTLMarginStyle = (languageCode, marginStyle) => {
  return marginStyle; // All languages are LTR, so always return original style
};

/**
 * Get RTL-aware style object for padding
 * @param {string} languageCode - Current language code
 * @param {object} paddingStyle - Style object with padding properties
 * @returns {object} - Always returns original padding style (all languages are LTR)
 */
export const getRTLPaddingStyle = (languageCode, paddingStyle) => {
  return paddingStyle; // All languages are LTR, so always return original style
};

/**
 * Force RTL layout for the app
 * @param {string} languageCode - Current language code
 */
export const forceRTL = (languageCode) => {
  // Always force LTR for all languages (Arabic, French, English)
  I18nManager.forceRTL(false);
  // Note: This requires app restart to take effect
};

/**
 * Get RTL-aware writing direction for text
 * @param {string} languageCode - Current language code
 * @returns {string} - Always returns 'ltr' (all languages are LTR)
 */
export const getWritingDirection = (languageCode) => {
  return 'ltr'; // All languages (Arabic, French, English) are now LTR
};

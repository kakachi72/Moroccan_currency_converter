import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (iPhone 12 Pro as reference)
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

// Responsive width and height
export const responsiveWidth = (size) => {
  return (SCREEN_WIDTH / BASE_WIDTH) * size;
};

export const responsiveHeight = (size) => {
  return (SCREEN_HEIGHT / BASE_HEIGHT) * size;
};

// Responsive font size
export const responsiveFontSize = (size) => {
  const scale = Math.min(SCREEN_WIDTH / BASE_WIDTH, SCREEN_HEIGHT / BASE_HEIGHT);
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// Screen size categories
export const isSmallScreen = () => SCREEN_WIDTH < 375;
export const isMediumScreen = () => SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414;
export const isLargeScreen = () => SCREEN_WIDTH >= 414;
export const isTablet = () => SCREEN_WIDTH >= 768;

// Get responsive padding
export const getResponsivePadding = () => {
  if (isSmallScreen()) return 15;
  if (isMediumScreen()) return 20;
  if (isLargeScreen()) return 25;
  if (isTablet()) return 30;
  return 20;
};

// Get responsive margin
export const getResponsiveMargin = () => {
  if (isSmallScreen()) return 10;
  if (isMediumScreen()) return 15;
  if (isLargeScreen()) return 20;
  if (isTablet()) return 25;
  return 15;
};

// Get responsive font sizes
export const getResponsiveFontSizes = () => {
  const base = {
    small: responsiveFontSize(12),
    medium: responsiveFontSize(14),
    large: responsiveFontSize(16),
    xlarge: responsiveFontSize(18),
    xxlarge: responsiveFontSize(20),
    xxxlarge: responsiveFontSize(24),
    huge: responsiveFontSize(32),
    massive: responsiveFontSize(48),
  };

  if (isSmallScreen()) {
    return {
      ...base,
      small: responsiveFontSize(10),
      medium: responsiveFontSize(12),
      large: responsiveFontSize(14),
      xlarge: responsiveFontSize(16),
      xxlarge: responsiveFontSize(18),
      xxxlarge: responsiveFontSize(20),
      huge: responsiveFontSize(28),
      massive: responsiveFontSize(40),
    };
  }

  if (isTablet()) {
    return {
      ...base,
      small: responsiveFontSize(14),
      medium: responsiveFontSize(16),
      large: responsiveFontSize(18),
      xlarge: responsiveFontSize(20),
      xxlarge: responsiveFontSize(22),
      xxxlarge: responsiveFontSize(26),
      huge: responsiveFontSize(36),
      massive: responsiveFontSize(56),
    };
  }

  return base;
};

// Get responsive dimensions
export const getResponsiveDimensions = () => {
  return {
    screenWidth: SCREEN_WIDTH,
    screenHeight: SCREEN_HEIGHT,
    padding: getResponsivePadding(),
    margin: getResponsiveMargin(),
    isSmallScreen: isSmallScreen(),
    isMediumScreen: isMediumScreen(),
    isLargeScreen: isLargeScreen(),
    isTablet: isTablet(),
  };
};

import { StyleSheet } from 'react-native';

// Global styles to ensure LTR layout for all languages
export const globalLTRStyles = StyleSheet.create({
  // Force LTR text direction for all text elements
  textLTR: {
    writingDirection: 'ltr',
    textAlign: 'left',
  },
  
  // Force LTR flex direction for all containers
  containerLTR: {
    flexDirection: 'row',
  },
  
  // Force LTR for input fields
  inputLTR: {
    textAlign: 'left',
    writingDirection: 'ltr',
  },
  
  // Force LTR for buttons
  buttonLTR: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});

// Helper function to apply LTR styles to any style object
export const applyLTRStyles = (baseStyles) => {
  return {
    ...baseStyles,
    writingDirection: 'ltr',
    textAlign: baseStyles.textAlign || 'left',
  };
};

// Helper function to ensure LTR flex direction
export const ensureLTRFlex = (flexDirection = 'row') => {
  return flexDirection === 'row-reverse' ? 'row' : flexDirection;
};

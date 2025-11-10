import {Dimensions, PixelRatio, Platform} from 'react-native';

// Get device dimensions
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

// Base dimensions (iPhone 6/7/8 - 375x667)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 667;

// Device type detection
export const getDeviceType = () => {
  const width = SCREEN_WIDTH;
  const height = SCREEN_HEIGHT;
  
  if (width >= 768) {
    return 'tablet';
  } else if (width >= 414) {
    return 'large-phone';
  } else if (width >= 375) {
    return 'medium-phone';
  } else {
    return 'small-phone';
  }
};

// Responsive width calculation
export const responsiveWidth = (size: number) => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  return Math.round(PixelRatio.roundToNearestPixel(size * scale));
};

// Responsive height calculation
export const responsiveHeight = (size: number) => {
  const scale = SCREEN_HEIGHT / BASE_HEIGHT;
  return Math.round(PixelRatio.roundToNearestPixel(size * scale));
};

// Responsive font size calculation
export const responsiveFontSize = (size: number) => {
  const scale = Math.min(SCREEN_WIDTH / BASE_WIDTH, SCREEN_HEIGHT / BASE_HEIGHT);
  const newSize = size * scale;
  
  // Ensure minimum font size for readability
  const minSize = 12;
  const maxSize = size * 1.5; // Prevent text from becoming too large
  
  return Math.max(minSize, Math.min(maxSize, Math.round(PixelRatio.roundToNearestPixel(newSize))));
};

// Responsive padding/margin calculation
export const responsiveSize = (size: number) => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  return Math.round(PixelRatio.roundToNearestPixel(size * scale));
};

// Responsive border radius
export const responsiveBorderRadius = (size: number) => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  return Math.round(PixelRatio.roundToNearestPixel(size * scale));
};

// Device-specific adjustments
export const getDeviceSpecificSize = (small: number, medium: number, large: number, tablet?: number) => {
  const deviceType = getDeviceType();
  
  switch (deviceType) {
    case 'small-phone':
      return responsiveSize(small);
    case 'medium-phone':
      return responsiveSize(medium);
    case 'large-phone':
      return responsiveSize(large);
    case 'tablet':
      return responsiveSize(tablet || large);
    default:
      return responsiveSize(medium);
  }
};

// Responsive font sizes with device-specific adjustments
export const getResponsiveFontSize = (baseSize: number) => {
  const deviceType = getDeviceType();
  let multiplier = 1;
  
  switch (deviceType) {
    case 'small-phone':
      multiplier = 0.9;
      break;
    case 'medium-phone':
      multiplier = 1;
      break;
    case 'large-phone':
      multiplier = 1.1;
      break;
    case 'tablet':
      multiplier = 1.2;
      break;
  }
  
  return responsiveFontSize(baseSize * multiplier);
};

// Responsive spacing system
export const spacing = {
  xs: responsiveSize(4),
  sm: responsiveSize(8),
  md: responsiveSize(16),
  lg: responsiveSize(24),
  xl: responsiveSize(32),
  xxl: responsiveSize(48),
};

// Responsive font sizes
export const fontSizes = {
  xs: getResponsiveFontSize(12),
  sm: getResponsiveFontSize(14),
  md: getResponsiveFontSize(16),
  lg: getResponsiveFontSize(18),
  xl: getResponsiveFontSize(20),
  xxl: getResponsiveFontSize(24),
  xxxl: getResponsiveFontSize(28),
  heading: getResponsiveFontSize(32),
};

// Screen dimensions
export const screenDimensions = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmallDevice: SCREEN_WIDTH < 375,
  isMediumDevice: SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414,
  isLargeDevice: SCREEN_WIDTH >= 414 && SCREEN_WIDTH < 768,
  isTablet: SCREEN_WIDTH >= 768,
};

// Legacy support - keep the existing function for backward compatibility
export const dimensionsCalculation = responsiveSize;

// Responsive container styles
export const responsiveStyles = {
  container: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  safeContainer: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 44 : 24,
    paddingHorizontal: spacing.md,
  },
  card: {
    borderRadius: responsiveBorderRadius(12),
    padding: spacing.md,
    marginVertical: spacing.sm,
  },
  button: {
    height: responsiveHeight(48),
    borderRadius: responsiveBorderRadius(8),
    paddingHorizontal: spacing.lg,
  },
};

// Responsive text styles
export const responsiveTextStyles = {
  heading: {
    fontSize: fontSizes.heading,
    fontWeight: 'bold' as const,
  },
  subheading: {
    fontSize: fontSizes.xxl,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: fontSizes.md,
    lineHeight: fontSizes.md * 1.5,
  },
  caption: {
    fontSize: fontSizes.sm,
    lineHeight: fontSizes.sm * 1.4,
  },
  small: {
    fontSize: fontSizes.xs,
    lineHeight: fontSizes.xs * 1.3,
  },
};

// Responsive image dimensions
export const getResponsiveImageSize = (baseWidth: number, baseHeight: number) => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  return {
    width: responsiveWidth(baseWidth),
    height: responsiveHeight(baseHeight),
  };
};

// Responsive modal dimensions
export const getResponsiveModalSize = () => {
  const deviceType = getDeviceType();
  
  switch (deviceType) {
    case 'small-phone':
      return {
        width: SCREEN_WIDTH * 0.9,
        height: SCREEN_HEIGHT * 0.8,
      };
    case 'medium-phone':
      return {
        width: SCREEN_WIDTH * 0.85,
        height: SCREEN_HEIGHT * 0.75,
      };
    case 'large-phone':
      return {
        width: SCREEN_WIDTH * 0.8,
        height: SCREEN_HEIGHT * 0.7,
      };
    case 'tablet':
      return {
        width: SCREEN_WIDTH * 0.6,
        height: SCREEN_HEIGHT * 0.6,
      };
    default:
      return {
        width: SCREEN_WIDTH * 0.85,
        height: SCREEN_HEIGHT * 0.75,
      };
  }
};

// Responsive grid columns
export const getResponsiveColumns = () => {
  const deviceType = getDeviceType();
  
  switch (deviceType) {
    case 'small-phone':
      return 1;
    case 'medium-phone':
      return 2;
    case 'large-phone':
      return 2;
    case 'tablet':
      return 3;
    default:
      return 2;
  }
};

// Responsive breakpoints
export const breakpoints = {
  small: 375,
  medium: 414,
  large: 768,
  tablet: 1024,
};

// Check if current screen matches breakpoint
export const isBreakpoint = (breakpoint: keyof typeof breakpoints) => {
  return SCREEN_WIDTH >= breakpoints[breakpoint];
};

// Responsive hook for dynamic updates
export const useResponsiveDimensions = () => {
  return {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    deviceType: getDeviceType(),
    isSmallDevice: screenDimensions.isSmallDevice,
    isMediumDevice: screenDimensions.isMediumDevice,
    isLargeDevice: screenDimensions.isLargeDevice,
    isTablet: screenDimensions.isTablet,
  };
};

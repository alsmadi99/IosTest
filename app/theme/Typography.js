/**
 * Typography:
 * This contains all the typography config for the application
 * #Note: color and font size are defaulted as they can be overridden
 *        as required.
 */

import { fonts } from '../common';
import { fontSizes, responsiveTextStyles } from '../utils';

export const FontWeights = {
  Bold: {
    fontFamily: fonts.primaryBold,
    // color: '#000',
  },
  Regular: {
    fontFamily: fonts.primaryRegular,
    // color: '#000',
  },
  Light: {
    fontFamily: fonts.primaryLight,
    // color: '#000',
  },
};

export const FontSizes = {
  Heading: {
    fontSize: fontSizes.heading,
  },
  SubHeading: {
    fontSize: fontSizes.xxl,
  },
  Label: {
    fontSize: fontSizes.lg,
  },
  Body: {
    fontSize: fontSizes.md,
  },
  Caption: {
    fontSize: fontSizes.sm,
  },
  Small: {
    fontSize: fontSizes.xs,
  },
};

// Responsive text styles
export const ResponsiveTextStyles = {
  ...responsiveTextStyles,
  // Additional custom styles
  title: {
    fontSize: fontSizes.xxxl,
    fontWeight: 'bold',
    lineHeight: fontSizes.xxxl * 1.2,
  },
  subtitle: {
    fontSize: fontSizes.xl,
    fontWeight: '600',
    lineHeight: fontSizes.xl * 1.3,
  },
  button: {
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
  input: {
    fontSize: fontSizes.md,
    lineHeight: fontSizes.md * 1.4,
  },
};

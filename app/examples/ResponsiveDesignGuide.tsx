/**
 * RESPONSIVE DESIGN IMPLEMENTATION GUIDE
 *
 * This guide shows how to update your React Native screens to be responsive
 * and compatible with all device sizes.
 *
 * QUICK START:
 * 1. Import responsive utilities: import { responsiveWidth, responsiveHeight, fontSizes, spacing } from '../utils';
 * 2. Replace fixed dimensions with responsive functions
 * 3. Use responsive text styles
 * 4. Test on different device sizes
 *
 * EXAMPLES:
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
  responsiveSize,
  responsiveBorderRadius,
  spacing,
  fontSizes,
  responsiveTextStyles,
  getDeviceType,
  screenDimensions,
} from '../utils';
import { AppColors } from '../theme';
import { fonts } from '../common';

// EXAMPLE 1: Basic responsive styles
const exampleStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
    paddingHorizontal: spacing.md, // Use spacing system
  },
  header: {
    height: responsiveHeight(60), // Responsive height
    backgroundColor: AppColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: fontSizes.heading, // Responsive font size
    fontFamily: fonts.primaryBold,
    color: AppColors.white,
  },
  card: {
    backgroundColor: AppColors.white,
    borderRadius: responsiveBorderRadius(12), // Responsive border radius
    padding: spacing.md,
    marginVertical: spacing.sm,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: responsiveHeight(200), // Responsive image height
    borderRadius: responsiveBorderRadius(8),
    resizeMode: 'cover',
  },
  text: {
    fontSize: fontSizes.md,
    lineHeight: fontSizes.md * 1.5, // Better line height
    color: AppColors.mainText,
    marginTop: spacing.sm,
  },
});

// EXAMPLE 2: Device-specific adjustments
const getDeviceSpecificCardStyle = () => {
  const deviceType = getDeviceType();

  switch (deviceType) {
    case 'small-phone':
      return {
        padding: spacing.sm,
        marginVertical: spacing.xs,
      };
    case 'medium-phone':
      return {
        padding: spacing.md,
        marginVertical: spacing.sm,
      };
    case 'large-phone':
      return {
        padding: spacing.lg,
        marginVertical: spacing.md,
      };
    case 'tablet':
      return {
        padding: spacing.xl,
        marginVertical: spacing.lg,
      };
    default:
      return {
        padding: spacing.md,
        marginVertical: spacing.sm,
      };
  }
};

// EXAMPLE 3: Responsive component
const ResponsiveExampleScreen = () => {
  const deviceType = getDeviceType();
  const isTablet = deviceType === 'tablet';

  return (
    <ScrollView style={exampleStyles.container}>
      <View style={exampleStyles.header}>
        <Text style={exampleStyles.title}>Responsive Example</Text>
      </View>

      <View style={[exampleStyles.card, getDeviceSpecificCardStyle()]}>
        <Image
          source={{ uri: 'https://example.com/image.jpg' }}
          style={exampleStyles.image}
        />
        <Text style={exampleStyles.text}>
          This text will scale appropriately on all device sizes.
        </Text>
      </View>

      {/* Responsive grid example */}
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}>
        {[1, 2, 3, 4].map((item) => (
          <View
            key={item}
            style={{
              width: isTablet ? '30%' : '48%', // Different widths for tablet vs phone
              backgroundColor: AppColors.e5,
              borderRadius: responsiveBorderRadius(8),
              padding: spacing.sm,
              marginBottom: spacing.sm,
            }}>
            <Text
              style={{
                fontSize: fontSizes.sm,
                textAlign: 'center',
                color: AppColors.mainText,
              }}>
              Item {item}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

// EXAMPLE 4: Responsive text with different variants
const ResponsiveTextExample = () => {
  return (
    <View style={{ padding: spacing.md }}>
      <Text style={responsiveTextStyles.heading}>Heading Text</Text>
      <Text style={responsiveTextStyles.subheading}>Subheading Text</Text>
      <Text style={responsiveTextStyles.body}>
        Body text that scales properly
      </Text>
      <Text style={responsiveTextStyles.caption}>Caption text</Text>
      <Text style={responsiveTextStyles.small}>Small text</Text>
    </View>
  );
};

// EXAMPLE 5: Responsive modal
const ResponsiveModalExample = () => {
  const { width: SCREEN_WIDTH } = screenDimensions;

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View
        style={{
          backgroundColor: AppColors.white,
          borderRadius: responsiveBorderRadius(15),
          padding: spacing.lg,
          width: SCREEN_WIDTH * 0.9, // 90% of screen width
          maxHeight: '80%',
        }}>
        <Text
          style={{
            fontSize: fontSizes.xl,
            fontFamily: fonts.primaryBold,
            textAlign: 'center',
            marginBottom: spacing.md,
          }}>
          Responsive Modal
        </Text>
        <Text
          style={{
            fontSize: fontSizes.md,
            lineHeight: fontSizes.md * 1.5,
            textAlign: 'center',
          }}>
          This modal will adapt to different screen sizes
        </Text>
      </View>
    </View>
  );
};

// MIGRATION CHECKLIST:
/*
□ Replace all fixed pixel values with responsive functions:
  - width: 100 → width: responsiveWidth(100)
  - height: 50 → height: responsiveHeight(50)
  - fontSize: 16 → fontSize: fontSizes.md
  - padding: 10 → padding: spacing.sm
  - borderRadius: 8 → borderRadius: responsiveBorderRadius(8)

□ Update text styles to use responsive font sizes:
  - fontSize: 24 → fontSize: fontSizes.heading
  - fontSize: 18 → fontSize: fontSizes.lg
  - fontSize: 16 → fontSize: fontSizes.md
  - fontSize: 14 → fontSize: fontSizes.sm
  - fontSize: 12 → fontSize: fontSizes.xs

□ Use spacing system for consistent margins and padding:
  - margin: 8 → margin: spacing.sm
  - padding: 16 → padding: spacing.md
  - marginVertical: 24 → marginVertical: spacing.lg

□ Add device-specific adjustments where needed:
  - Use getDeviceType() for conditional styling
  - Use screenDimensions for screen size checks
  - Use getDeviceSpecificSize() for device-specific values

□ Test on different device sizes:
  - Small phones (< 375px width)
  - Medium phones (375-414px width)
  - Large phones (414-768px width)
  - Tablets (>= 768px width)

□ Use responsive components when possible:
  - ResponsiveView for containers
  - ResponsiveText for text elements
  - ResponsiveCard for card layouts
  - ResponsiveButton for buttons
  - ResponsiveGrid for grid layouts
*/

export default ResponsiveExampleScreen;

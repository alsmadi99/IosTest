import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import {
  responsiveStyles,
  responsiveTextStyles,
  spacing,
  fontSizes,
  getDeviceType,
  screenDimensions,
} from '../utils';

interface ResponsiveViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: keyof typeof spacing;
  margin?: keyof typeof spacing;
  container?: boolean;
  safe?: boolean;
}

export const ResponsiveView: React.FC<ResponsiveViewProps> = ({
  children,
  style,
  padding,
  margin,
  container = false,
  safe = false,
}) => {
  const containerStyle = container ? responsiveStyles.container : {};
  const safeStyle = safe ? responsiveStyles.safeContainer : {};
  const paddingStyle = padding ? { padding: spacing[padding] } : {};
  const marginStyle = margin ? { margin: spacing[margin] } : {};

  return (
    <View style={[containerStyle, safeStyle, paddingStyle, marginStyle, style]}>
      {children}
    </View>
  );
};

interface ResponsiveTextProps {
  children: React.ReactNode;
  style?: TextStyle;
  variant?: keyof typeof responsiveTextStyles;
  color?: string;
  align?: 'left' | 'center' | 'right';
  weight?: 'normal' | 'bold' | '600';
}

export const ResponsiveText: React.FC<ResponsiveTextProps> = ({
  children,
  style,
  variant = 'body',
  color,
  align = 'left',
  weight,
}) => {
  const textStyle = responsiveTextStyles[variant];
  const customStyle = {
    color,
    textAlign: align,
    fontWeight: weight,
  };

  return <Text style={[textStyle, customStyle, style]}>{children}</Text>;
};

interface ResponsiveCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: keyof typeof spacing;
  margin?: keyof typeof spacing;
  elevation?: number;
}

export const ResponsiveCard: React.FC<ResponsiveCardProps> = ({
  children,
  style,
  padding = 'md',
  margin = 'sm',
  elevation = 2,
}) => {
  const cardStyle = {
    ...responsiveStyles.card,
    padding: spacing[padding],
    marginVertical: spacing[margin],
    elevation: elevation,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: elevation,
    },
    shadowOpacity: 0.1,
    shadowRadius: elevation * 2,
  };

  return <View style={[cardStyle, style]}>{children}</View>;
};

interface ResponsiveButtonProps {
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  onPress?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
}

export const ResponsiveButton: React.FC<ResponsiveButtonProps> = ({
  children,
  style,
  textStyle,
  onPress,
  disabled = false,
  variant = 'primary',
}) => {
  const buttonStyle = {
    ...responsiveStyles.button,
    backgroundColor:
      variant === 'primary'
        ? '#163C61'
        : variant === 'secondary'
          ? '#F8C600'
          : 'transparent',
    borderWidth: variant === 'outline' ? 1 : 0,
    borderColor: variant === 'outline' ? '#163C61' : undefined,
    opacity: disabled ? 0.6 : 1,
  };

  const buttonTextStyle = {
    ...responsiveTextStyles.button,
    color: variant === 'primary' ? '#FFF' : '#163C61',
    ...textStyle,
  };

  return (
    <View style={[buttonStyle, style]}>
      <ResponsiveText style={buttonTextStyle}>{children}</ResponsiveText>
    </View>
  );
};

// Responsive grid component
interface ResponsiveGridProps {
  children: React.ReactNode;
  columns?: number;
  spacing?: keyof typeof spacing;
  style?: ViewStyle;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  columns,
  spacing: gridSpacing = 'sm',
  style,
}) => {
  const deviceType = getDeviceType();
  const defaultColumns =
    columns ||
    (deviceType === 'tablet' ? 3 : deviceType === 'small-phone' ? 1 : 2);

  const gridStyle = {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    justifyContent: 'space-between',
    marginHorizontal: -spacing[gridSpacing] / 2,
  };

  const itemStyle = {
    width: `${100 / defaultColumns}%`,
    paddingHorizontal: spacing[gridSpacing] / 2,
    marginBottom: spacing[gridSpacing],
  };

  return (
    <View style={[gridStyle, style]}>
      {React.Children.map(children, (child, index) => (
        <View key={index} style={itemStyle}>
          {child}
        </View>
      ))}
    </View>
  );
};

// Responsive image component
interface ResponsiveImageProps {
  source: any;
  style?: any;
  width?: number;
  height?: number;
  aspectRatio?: number;
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  source,
  style,
  width,
  height,
  aspectRatio,
}) => {
  const deviceType = getDeviceType();
  const scale = screenDimensions.width / 375; // Base width

  const imageStyle = {
    width: width ? width * scale : undefined,
    height: height ? height * scale : undefined,
    aspectRatio: aspectRatio,
  };

  return (
    <View style={imageStyle}>
      {/* You would use Image component here */}
      {/* <Image source={source} style={[imageStyle, style]} /> */}
    </View>
  );
};

// Export all components
export {
  ResponsiveView,
  ResponsiveText,
  ResponsiveCard,
  ResponsiveButton,
  ResponsiveGrid,
  ResponsiveImage,
};

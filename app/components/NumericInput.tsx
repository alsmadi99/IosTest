import { AppIcon, fonts } from '../common';
import { AppTouchableOpacity } from '../components';
import * as React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ColorValue,
  TextStyle,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { AppColors } from '../theme';
import { dimensionsCalculation } from '../utils';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    overflow: 'hidden',
    alignItems: 'center',
  },
  plusMinusBtn: {
    backgroundColor: AppColors.black,
    width: dimensionsCalculation(29),
    height: dimensionsCalculation(29),
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberOfPersons: {
    width: dimensionsCalculation(40),
    textAlign: 'center',
    fontSize: dimensionsCalculation(20),
    fontFamily: fonts.primaryBold,
  },
});
export interface NumericInputProps {
  value: number;
  incrementValue?: number;
  onPlus: (newValue: number) => void;
  onMinus: (newValue: number) => void;
  containerBackgroundColor?: ColorValue;
  buttonBackgroundColor?: ColorValue;
  buttonSize?: number;
  iconSize?: number;
  iconColor?: string;
  buttonAndroidRippleColor?: ColorValue;
  contianerStyle?: StyleProp<ViewStyle>;
  valueStyle?: StyleProp<TextStyle>;
}

const NumericInput = ({
  value,
  incrementValue = 1,
  containerBackgroundColor = '#E5E5E5',
  buttonBackgroundColor = AppColors.black,
  buttonSize = dimensionsCalculation(29),
  iconSize = dimensionsCalculation(16),
  iconColor = AppColors.white,
  buttonAndroidRippleColor = AppColors.white,
  onMinus,
  onPlus,
  contianerStyle,
  valueStyle,
}: NumericInputProps) => {
  return (
    <View
      style={[
        styles.container,
        contianerStyle,
        { backgroundColor: containerBackgroundColor },
      ]}>
      <AppTouchableOpacity
        androidRippleColor={buttonAndroidRippleColor}
        style={[
          styles.plusMinusBtn,
          {
            backgroundColor: buttonBackgroundColor,
            width: buttonSize,
            height: buttonSize,
          },
        ]}
        disabled={value <= incrementValue}
        onPress={() => {
          if (value > incrementValue) onMinus(value - incrementValue);
        }}>
        <AppIcon
          name="minus"
          type="Feather"
          color={iconColor}
          size={iconSize}
        />
      </AppTouchableOpacity>
      <Text
        style={[
          styles.numberOfPersons,
          { height: buttonSize - 2, textAlignVertical: 'center' },
          valueStyle,
        ]}>
        {value}
      </Text>
      <AppTouchableOpacity
        androidRippleColor={buttonAndroidRippleColor}
        style={[
          styles.plusMinusBtn,
          {
            backgroundColor: buttonBackgroundColor,
            width: buttonSize,
            height: buttonSize,
          },
        ]}
        disabled={value / incrementValue >= 99}
        onPress={() => {
          onPlus(value + incrementValue);
        }}
        onLongPress={() => { }}>
        <AppIcon name="plus" type="Feather" color={iconColor} size={iconSize} />
      </AppTouchableOpacity>
    </View>
  );
};

export default NumericInput;

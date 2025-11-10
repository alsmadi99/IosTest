import React, { ReactNode } from 'react';
import { TouchableNativeFeedback } from 'react-native';
import { TouchableOpacityProps } from 'react-native';
import { Platform } from 'react-native';
import { ColorValue } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { View } from 'react-native';
import { AppColors } from '../theme';
import { dimensionsCalculation } from '../utils';

export interface AppTouchableOpacityProps extends TouchableOpacityProps {
  androidRippleColor?: ColorValue;
  borderless?: boolean;
  children?: ReactNode;
}

export default function AppTouchableOpacity(props: AppTouchableOpacityProps) {
  if (Platform.OS == 'android')
    return (
      <TouchableNativeFeedback
        background={TouchableNativeFeedback.Ripple(
          props?.androidRippleColor ?? AppColors.androidRippleColor.black15,
          props?.borderless,
        )}
        {...props}
        useForeground
        disabled={props.disabled}
        onPress={(e) => {
          try {
            props?.onPress(e);
          } catch (error) {
            __DEV__ && console.error('error', error);
          }
        }}>
        <View
          style={[
            { borderRadius: dimensionsCalculation(5), overflow: 'hidden' },
            props.style,
          ]}>
          {props.children}
        </View>
      </TouchableNativeFeedback>
    );

  return (
    <TouchableOpacity
      {...props}
      disabled={props.disabled}
      onPress={(e) => {
        try {
          props.onPress(e);
        } catch (error) {
          __DEV__ && console.error('error', error);
        }
      }}>
      {props.children}
    </TouchableOpacity>
  );
}

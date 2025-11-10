import fonts from '../common/fonts';
import * as React from 'react';
import { View } from 'react-native';
import { Platform } from 'react-native';
import { TextStyle } from 'react-native';
import { TouchableNativeFeedback } from 'react-native';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ColorValue,
  StyleProp,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { AppColors } from '../theme';
import { dimensionsCalculation } from '../utils';

interface LoadingButtonProps {
  isLoading: boolean;
  disabled?: boolean;
  backgroundColor?: ColorValue;
  textColor: string;
  text: string;
  onPress: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  linearGradiant?: boolean;
  androidRippleColor?: ColorValue;
}

export default function LoadingButton({
  isLoading,
  disabled = false,
  backgroundColor = AppColors.black,
  text = '',
  textColor = AppColors.white,
  onPress,
  containerStyle = {},
  textStyle = {},
  linearGradiant = false,
  androidRippleColor = AppColors.white,
}: LoadingButtonProps) {
  if (Platform.OS == 'android') {
    if (linearGradiant) {
      return (
        <TouchableNativeFeedback
          background={TouchableNativeFeedback.Ripple(androidRippleColor, false)}
          useForeground
          // style={[styles.container, containerStyle, {backgroundColor}]}
          disabled={isLoading || disabled}
          onPress={() => {
            try {
              if (disabled)
                return (
                  __DEV__ && console.error('onPress', 'Btn is disabled!!!')
                );
              onPress();
            } catch (e) {
              __DEV__ && console.error('onPress', e);
            }
          }}>
          <LinearGradient
            colors={AppColors.gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.container,
              { backgroundColor: AppColors.transparent },
              containerStyle,
            ]}>
            {isLoading ? (
              <ActivityIndicator size="small" color={textColor} />
            ) : (
              <Text style={[styles.textStyle, { color: textColor }, textStyle]}>
                {text}
              </Text>
            )}
          </LinearGradient>
        </TouchableNativeFeedback>
      );
    }
    return (
      <TouchableNativeFeedback
        background={TouchableNativeFeedback.Ripple(androidRippleColor, false)}
        useForeground
        // style={[styles.container, containerStyle, {backgroundColor}]}
        disabled={isLoading || disabled}
        onPress={() => {
          try {
            if (disabled)
              return __DEV__ && console.error('onPress', 'Btn is disabled!!!');
            onPress();
          } catch (e) {
            __DEV__ && console.error('onPress', e);
          }
        }}>
        <View style={[styles.container, { backgroundColor }, containerStyle]}>
          {isLoading ? (
            <ActivityIndicator size="small" color={textColor} />
          ) : (
            <Text
              style={[styles.textStyle, { color: textColor }, textStyle]}
              numberOfLines={1}
              adjustsFontSizeToFit>
              {text}
            </Text>
          )}
        </View>
      </TouchableNativeFeedback>
    );
  } else {
    if (linearGradiant) {
      return (
        <TouchableOpacity
          style={[]}
          disabled={isLoading || disabled}
          onPress={() => {
            try {
              if (disabled)
                return (
                  __DEV__ && console.error('onPress', 'Btn is disabled!!!')
                );
              onPress();
            } catch (e) {
              __DEV__ && console.error('onPress', e);
            }
          }}>
          <LinearGradient
            colors={AppColors.gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.container,
              { backgroundColor: AppColors.transparent },
              containerStyle,
            ]}>
            {isLoading ? (
              <ActivityIndicator size="small" color={textColor} />
            ) : (
              <Text style={[styles.textStyle, { color: textColor }, textStyle]}>
                {text}
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity
        style={[styles.container, containerStyle, { backgroundColor }]}
        disabled={isLoading || disabled}
        onPress={() => {
          try {
            if (disabled)
              return __DEV__ && console.error('onPress', 'Btn is disabled!!!');
            onPress();
          } catch (e) {
            __DEV__ && console.error('onPress', e);
          }
        }}>
        {isLoading ? (
          <ActivityIndicator size="small" color={textColor} />
        ) : (
          <Text style={[styles.textStyle, { color: textColor }]}>{text}</Text>
        )}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.black,
    borderRadius: dimensionsCalculation(10),
    height: dimensionsCalculation(50),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: dimensionsCalculation(10),
    overflow: 'hidden',
  },
  textStyle: {
    color: AppColors.black,
    fontFamily: fonts.primaryBold,
    fontSize: dimensionsCalculation(16),
  },
});

import * as React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Languages, AppIcon } from '../common';
import { AppColors, FontWeights, FontSizes, MaterialColors } from '../../app/theme';
import LinearGradient from 'react-native-linear-gradient';
import { dimensionsCalculation, isIOS } from '../utils';
import { TouchableNativeFeedback } from 'react-native';
import { ColorValue } from 'react-native';
import { ReactNode } from 'react';
import { IconType } from '../common/Types';

interface AppButtonProps {
  text?: string;
  containerStyle?: StyleProp<ViewStyle>;
  numberOfLines?: number;
  onPress: Function;
  textStyle?: StyleProp<TextStyle>;
  icon?;
  iconSize?: number;
  useIconDefaultColors?: boolean;
  textColor?;
  iconType?: IconType;
  disabled?: boolean;
  iconStyle?: TextStyle | ViewStyle;
  linearGradiant?: boolean;
  androidRippleColor?: ColorValue;
  renderText?: ReactNode;
  adjustsFontSizeToFit?: boolean;
}

const AppButton = ({
  text,
  icon,
  onPress,
  textStyle = {},
  textColor,
  iconType,
  disabled = false,
  containerStyle = {},
  iconSize,
  useIconDefaultColors = false,
  iconStyle = {},
  linearGradiant = false,
  androidRippleColor = AppColors.white,
  renderText,
  adjustsFontSizeToFit = false,
  numberOfLines = 1,
}: AppButtonProps) => {
  if (linearGradiant)
    return (
      <TouchableOpacity
        key={text || icon}
        style={[
          {
            padding: 0,
            height: dimensionsCalculation(50),
            width: '100%',
            borderRadius: dimensionsCalculation(6),
            overflow: 'hidden',
          },
          containerStyle,
        ]}
        disabled={disabled}
        onPress={() => {
          try {
            onPress();
          } catch (error) {
            __DEV__ && console.error('error', error);
          }
        }}>
        <LinearGradient
          colors={AppColors.gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {icon && (
            <AppIcon
              type={iconType || 'MaterialIcons'}
              name={icon}
              color={textColor || 'white'}
              size={iconSize || 20}
              style={[text ? styles.icon : {}, iconStyle]}
              useDefaultColors={useIconDefaultColors}
            />
          )}
          {renderText ? (
            renderText
          ) : text ? (
            <Text
              style={[styles.text, textStyle, textColor && { color: textColor }]}
            // adjustsFontSizeToFit
            // numberOfLines={1}
            >
              {text}
            </Text>
          ) : null}
          {/* {text && (
            <Text
              style={[styles.text, textStyle, textColor && {color: textColor}]}
              adjustsFontSizeToFit
              numberOfLines={1}>
              {text}
            </Text>
          )} */}
        </LinearGradient>
      </TouchableOpacity>
    );
  if (isIOS)
    return (
      <TouchableOpacity
        key={text || icon}
        disabled={disabled}
        onPress={() => {
          try {
            onPress();
          } catch (error) {
            __DEV__ && console.error('error', error);
          }
        }}
        style={[styles.container, containerStyle]}>
        {icon && (
          <AppIcon
            type={iconType || 'MaterialIcons'}
            name={icon}
            color={textColor || 'white'}
            size={iconSize || 20}
            style={[text ? styles.icon : {}, iconStyle]}
            useDefaultColors={useIconDefaultColors}
          />
        )}
        {renderText ? (
          renderText
        ) : text ? (
          <Text
            style={[styles.text, textStyle, textColor && { color: textColor }]}
            adjustsFontSizeToFit={adjustsFontSizeToFit}
            numberOfLines={numberOfLines}>
            {text}
          </Text>
        ) : null}
        {/* {text && (
            <Text
              style={[styles.text, textStyle, textColor && {color: textColor}]}
              adjustsFontSizeToFit
              numberOfLines={1}>
              {text}
            </Text>
          )} */}
      </TouchableOpacity>
    );

  return (
    <TouchableNativeFeedback
      key={text || icon}
      background={TouchableNativeFeedback.Ripple(androidRippleColor, false)}
      useForeground
      // style={[styles.container, containerStyle, {backgroundColor}]}
      disabled={disabled}
      onPress={() => {
        try {
          onPress();
        } catch (error) {
          __DEV__ && console.error('error', error);
        }
      }}>
      <View style={[styles.container, containerStyle]}>
        {icon && (
          <AppIcon
            type={iconType || 'MaterialIcons'}
            name={icon}
            color={textColor || 'white'}
            size={iconSize || 20}
            style={[text ? styles.icon : {}, iconStyle]}
            useDefaultColors={useIconDefaultColors}
          />
        )}
        {renderText ? (
          renderText
        ) : text ? (
          <Text
            style={[styles.text, textStyle, textColor && { color: textColor }]}
            adjustsFontSizeToFit={adjustsFontSizeToFit}
            numberOfLines={numberOfLines}>
            {text}
          </Text>
        ) : null}
        {/* {text && (
            <Text
              style={[styles.text, textStyle, textColor && {color: textColor}]}
              adjustsFontSizeToFit
              numberOfLines={1}>
              {text}
            </Text>
          )} */}
      </View>
    </TouchableNativeFeedback>
  );
};

export default AppButton;

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    padding: dimensionsCalculation(5),
    backgroundColor: AppColors.primary,
    borderRadius: dimensionsCalculation(5),
  },
  text: {
    ...FontWeights.Bold,
    ...FontSizes.Body,
    color: '#fff',
  },
  icon: {
    marginRight: dimensionsCalculation(10),
  },
});

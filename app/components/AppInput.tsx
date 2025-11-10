import { AppIcon, Languages } from '../common';
import fonts from '../common/fonts';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  StyleProp,
  TextStyle,
  ColorValue,
  I18nManager,
  ReturnKeyTypeIOS,
  ReturnKeyTypeAndroid,
  ReturnKeyType,
} from 'react-native';
import { dimensionsCalculation, isIOS, isRTL } from '../utils';
import * as Animatable from 'react-native-animatable';
import { ViewStyle } from 'react-native';

interface AppInputProps {
  forwardedRef?: React.LegacyRef<TextInput>;
  value?: string;
  placeholder: string;
  onFocus?: () => void;
  onBlur?: () => void;
  headerText?: string;
  style?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<TextStyle>;
  inputWrapperStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  onChangeText: (value: string) => void;
  onSubmitEditing?: () => void;
  secureTextEntry?: boolean;
  backgroundColor?: ColorValue;
  maxLength?: number;
  textColor: string;
  keyboardType?:
  | 'default'
  | 'email-address'
  | 'numeric'
  | 'phone-pad'
  | 'number-pad'
  | 'decimal-pad'
  | 'visible-password'
  | 'ascii-capable'
  | 'numbers-and-punctuation'
  | 'url'
  | 'name-phone-pad'
  | 'twitter'
  | 'web-search';
  editable?: boolean;
  showError?: boolean;
  errorMsg?: string;
  required?: boolean;
  autoFocus?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  returnKeyType?: ReturnKeyType | ReturnKeyTypeAndroid | ReturnKeyTypeIOS;
}

export default function AppInput({
  forwardedRef,
  value,
  placeholder,
  onChangeText,
  onSubmitEditing,
  textColor,
  headerText = null,
  onFocus,
  onBlur,
  secureTextEntry = false,
  keyboardType = 'default',
  editable = true,
  showError = false,
  errorMsg = '',
  autoFocus = false,
  autoCapitalize = 'none',
  returnKeyType = 'default',
  containerStyle = {},
  inputStyle = {},
  maxLength = 250,
}: AppInputProps) {
  const animatedView = React.useRef<View>();

  return (
    <Animatable.View
      ref={animatedView}
      style={[styles.inputWrapper, containerStyle]}>
      {headerText ? (
        <Text
          style={{
            color: textColor,
            fontSize: dimensionsCalculation(13),
            textAlign: 'left',
            paddingLeft: dimensionsCalculation(3),
          }}>
          {headerText}
        </Text>
      ) : null}
      <TextInput
        autoFocus={autoFocus}
        ref={forwardedRef}
        placeholder={placeholder}
        onChangeText={(value) => {
          onChangeText(value);
        }}
        onSubmitEditing={() => {
          onSubmitEditing();
        }}
        autoCapitalize={autoCapitalize}
        returnKeyType={returnKeyType}
        editable={editable}
        secureTextEntry={secureTextEntry}
        style={[
          styles.inputStyle,
          isIOS && { paddingVertical: dimensionsCalculation(5) },
          inputStyle,
          !editable && { opacity: 0.5 },
          textColor && { color: textColor },
          showError && errorMsg != '' && { borderWidth: 1, borderColor: 'red' },
        ]}
        value={value}
        keyboardType={keyboardType}
        onFocus={onFocus}
        onBlur={onBlur}
        maxLength={maxLength}
      />
      {showError && errorMsg != '' && (
        <Animatable.View style={styles.errContainer}>
          <Text style={styles.errMsg}>{errorMsg}</Text>
        </Animatable.View>
      )}
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    marginBottom: dimensionsCalculation(20),
    // flex: 1,
  },
  inputStyle: {
    borderWidth: 1,
    borderColor: '#d9d9d9',
    textAlign: isRTL ? 'right' : 'left',
    color: '#d9d9d9',
    borderRadius: dimensionsCalculation(5),
    fontSize: dimensionsCalculation(14),
    paddingHorizontal: dimensionsCalculation(15),
    fontFamily: fonts.primaryRegular,
    // flex: 1,
  },
  errContainer: {
    marginTop: dimensionsCalculation(0),
    marginLeft: dimensionsCalculation(5),
  },
  errMsg: {
    color: 'red',
    fontSize: dimensionsCalculation(12),
    fontFamily: fonts.primaryLight,
    textAlign: 'left',
  },
});

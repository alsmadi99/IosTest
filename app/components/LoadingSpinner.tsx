import * as React from 'react';
import {
  Dimensions,
  Image,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { View, Text, ActivityIndicator } from 'react-native';
import { AppColors } from '../theme';
import LottieView from 'lottie-react-native';
import { dimensionsCalculation, isRTL } from '../utils';

export interface LoadingSpinnerProps {
  overlay?: boolean;
  customStyle?: StyleProp<ViewStyle>;
}

export default function LoadingSpinner(props: LoadingSpinnerProps) {
  return (
    <View
      style={[
        props.overlay ? styles.overlayStyle : styles.container,
        props.customStyle,
      ]}>
      {/* <Image
        source={require('assets/animations/loading.gif')}
        style={styles.image}
      /> */}
      <ActivityIndicator size="large" color={AppColors.white} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.primary,
  },
  overlayStyle: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.primary,
    zIndex: 15500,
    elevation: 1500,
  },
  image: {
    height: '100%',
    width: '100%',
    left: isRTL ? null : -50,
    right: isRTL ? -50 : null,
    resizeMode: 'contain',
  },
});

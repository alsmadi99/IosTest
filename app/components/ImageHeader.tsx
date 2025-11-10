import { AppIcon } from '../common';
import { AppTouchableOpacity } from '../components';
import { openDrawer } from '../navigation';
import React, { ReactNode } from 'react';
import {
  Dimensions,
  I18nManager,
  ImageBackground,
  ImageBackgroundProps,
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import FastImage, { Source, ImageStyle } from 'react-native-fast-image';
import { AppColors } from '../theme';
import { dimensionsCalculation, getStatusBarHeight, isRTL } from '../utils';

const styles = StyleSheet.create({
  imageStyle: {
    width: '100%',
    height: Dimensions.get('screen').width / 1.7,
  },
  headerBtn: {
    alignSelf: 'flex-start',
    padding: 5,
    overflow: 'visible',
    marginLeft: dimensionsCalculation(4),
  },
});

export interface ImageHeaderProps extends ImageBackgroundProps {
  hideMenuButton?: boolean;
  style?: StyleProp<ImageStyle>;
  children?: ReactNode;
}

const ImageHeader = (props: ImageHeaderProps) => {
  return (
    <ImageBackground
      {...props}
      source={props.source}
      defaultSource={require('../../assets/images/logo.png')}
      style={[
        styles.imageStyle,
        !props.hideMenuButton && {
          paddingTop: getStatusBarHeight() + dimensionsCalculation(10),
          paddingLeft: dimensionsCalculation(10),
        },
        props.style,
      ]}>
      {!props.hideMenuButton && (
        <AppTouchableOpacity
          androidRippleColor={AppColors.androidRippleColor.black15}
          onPress={() => {
            openDrawer();
          }}
          borderless
          style={styles.headerBtn}>
          <AppIcon
            style={{
              transform: isRTL
                ? [
                  {
                    rotateY: '180deg',
                  },
                ]
                : [],
            }}
            name={require('../../assets/images/menu.png')}
            type="Image"
            size={dimensionsCalculation(22)}
            color={AppColors.primary}
          />
        </AppTouchableOpacity>
      )}
      {props.children}
    </ImageBackground>
  );
};

export default ImageHeader;

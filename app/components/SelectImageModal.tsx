import { fonts, Languages } from '../common';
import { SelectImageModalProps } from '../common/Types';
import React, { createRef, ReactNode, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StyleProp,
  ViewStyle,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
// import ImageCropPicker from 'react-native-image-crop-picker';
import Modal from 'react-native-modalbox';
import { PERMISSIONS, request } from 'react-native-permissions';
import { AppColors } from '../theme';
import { dimensionsCalculation } from '../utils';

export default function SelectImageModal({
  forwardedRef,
  onImageSelected,
  open,
  close,
}: SelectImageModalProps) {
  useEffect(() => { }, []);

  open = () => {
    forwardedRef?.current?.open();
    request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then((data) => { });
    request(PERMISSIONS.ANDROID.CAMERA).then((data) => { });
  };
  close = () => {
    forwardedRef?.current?.close();
  };
  const backgroundRef = createRef<View>();
  const bodyRef = createRef<View>();
  return (
    <Modal
      isOpen={false}
      ref={forwardedRef}
      coverScreen
      backButtonClose
      animationDuration={0}
      startOpen
      swipeToClose={false}
      style={{
        height: '100%',
        width: '100%',
        backgroundColor: AppColors.transparent,
      }}
      backdrop={false}
      backdropColor={AppColors.transparent}
      backdropOpacity={0}
      statusBarTranslucent>
      <Animatable.View
        animation="fadeIn"
        delay={0}
        ref={backgroundRef}
        duration={500}
        style={{}}>
        <TouchableOpacity
          activeOpacity={1}
          style={{
            height: '100%',
            width: '100%',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.75)',
          }}
          onPress={() => {
            bodyRef?.current?.zoomOut(300);
            backgroundRef?.current?.fadeOut(300);
            setTimeout(() => {
              close();
            }, 300);
          }}>
          <TouchableOpacity activeOpacity={1} style={{}} onPress={() => { }}>
            <Animatable.View
              ref={bodyRef}
              duration={500}
              animation="zoomIn"
              style={[styles.requestModalContainer]}>
              <TouchableOpacity
                style={styles.optionStyle}
                onPress={() => {
                  // ImageCropPicker.openCamera({
                  //   mediaType: 'photo',
                  //   cropping: true,
                  //   compressImageQuality: 0.5,
                  //   compressImageMaxHeight: 500,
                  //   compressImageMaxWidth: 500,
                  //   width: 500,
                  //   height: 500,
                  // }).then((image) => {
                  //   onImageSelected(image);
                  //   close();
                  // });
                }}>
                <Text style={styles.optionText}>{Languages.Camera}</Text>
              </TouchableOpacity>
              <View
                style={{
                  borderBottomColor: AppColors.e5,
                  borderBottomWidth: 1,
                  width: '100%',
                  //   marginVertical: dimensionsCalculation(10),
                }}
              />
              <TouchableOpacity
                style={styles.optionStyle}
                onPress={() => {
                  // ImageCropPicker.openPicker({
                  //   mediaType: 'photo',
                  //   cropping: true,
                  //   compressImageQuality: 0.5,
                  //   compressImageMaxHeight: 500,
                  //   compressImageMaxWidth: 500,
                  //   width: 500,
                  //   height: 500,
                  // }).then((image) => {
                  //   onImageSelected(image);
                  //   close();
                  // });
                }}>
                <Text style={styles.optionText}>{Languages.Gallery}</Text>
              </TouchableOpacity>
            </Animatable.View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Animatable.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  requestModalContainer: {
    backgroundColor: AppColors.white,
    borderRadius: dimensionsCalculation(25),
    zIndex: 150,
    borderWidth: 0,
    width: dimensionsCalculation(Dimensions.get('screen').width * 0.65),
    alignSelf: 'center',
    overflow: 'hidden',
  },
  optionStyle: {
    padding: dimensionsCalculation(30),
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    fontFamily: fonts.primaryBold,
    fontSize: dimensionsCalculation(18),
    textAlign: 'center',
  },
});

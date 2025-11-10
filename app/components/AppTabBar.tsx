import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Keyboard } from 'react-native';
import { AppColors } from '../theme';
import {
  configureNextScaleAnimation,
  dimensionsCalculation,
  getBottomSpace,
} from '../utils';
import { AppIcon, Constants } from '../common';
import { navigate } from '../navigation';

const AppTabBar = (props: any) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardShown, setIsKeyboardShown] = useState(false);
  const [data, setData] = useState([
    require('../../assets/images/ecoSystem.png'),
    require('../../assets/images/quds.png'),
    require('../../assets/images/sheild.png'),
  ]);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', (e) => {
      // configureNextScaleAnimation();
      setKeyboardHeight(e.endCoordinates?.height + 50);
      setIsKeyboardShown(true);
    });
    Keyboard.addListener('keyboardDidHide', () => {
      // configureNextScaleAnimation();
      setKeyboardHeight(0);
      setIsKeyboardShown(false);
    });
    return () => { };
  }, []);
  return (
    <View
      style={{
        position: 'absolute',
        bottom: isKeyboardShown ? -keyboardHeight : 0,
        left: 0,
        right: 0,
        zIndex: 1500,
        elevation: 1500,
      }}>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: AppColors.primary,
          alignItems: 'center',
          justifyContent: 'space-evenly',
          height: Constants.tabBarHeight,
          paddingBottom: getBottomSpace(),
          borderTopWidth: 0,
          overflow: 'visible',
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          borderTopLeftRadius: dimensionsCalculation(30),
          borderTopRightRadius: dimensionsCalculation(30),
        }}>
        {data.map((route, index) => {
          const onPress = () => {
            navigate('StaticPageScreen', {
              type: index == 0 ? '40151' : index == 1 ? '40155' : '40153',
              istabbar: true,
            });
          };

          return (
            <TouchableOpacity
              activeOpacity={1}
              accessibilityRole="button"
              onPress={onPress}
              style={{ justifyContent: 'center', alignItems: 'center' }}>
              <AppIcon
                name={route}
                type="Image"
                useDefaultColors
                size={dimensionsCalculation(35)}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default AppTabBar;

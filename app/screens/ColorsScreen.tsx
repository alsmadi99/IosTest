import { AppIcon, Constants, fonts, Languages } from '../common';
import { Color } from '../common/Types';
import {
  AppTabBar,
  AppHeader,
  LoadingSpinner,
  AppButton,
  AppTouchableOpacity,
} from '../components';
import { navigate } from '../navigation';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image } from 'react-native';

import { View, Text, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modalbox';
import Zoom from 'react-native-zoom-reanimated';
import { getColorsCall } from '../services/api/calls';
import { AppColors } from '../theme';
import { dimensionsCalculation } from '../utils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  flatlist: {
    flexGrow: 1,
    paddingTop: Constants.headerHeight + dimensionsCalculation(10),
    paddingBottom: Constants.tabBarHeight + dimensionsCalculation(10),
    paddingHorizontal: dimensionsCalculation(10),
  },
});

export interface ColorsScreenProps { }

const ColorsScreen = (props: ColorsScreenProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [colors, setColors] = useState<Color[]>([]);
  const [selectedColor, setSelectedColor] = useState<Color>(null);

  const modalRef = useRef<Modal>();

  useEffect(() => {
    getColors();
  }, []);

  useEffect(() => {
    if (selectedColor) modalRef?.current?.open();
  }, [selectedColor]);

  const getColors = async () => {
    const result = await getColorsCall({});
    if (result?.data) {
      setColors(result?.data);
    }
    setIsLoading(false);
  };

  const renderItem = ({ item, index }: { item: Color; index: number }) => {
    return (
      <View
        style={{
          flex: 1,
          maxWidth: '50%',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: dimensionsCalculation(10),
          padding: dimensionsCalculation(10),
          paddingBottom: dimensionsCalculation(5),
          backgroundColor: AppColors.white,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.18,
          shadowRadius: 1.0,
          marginRight: index % 2 == 0 ? dimensionsCalculation(10) : 0,
          borderRadius: dimensionsCalculation(5),
        }}>
        <FastImage
          source={{
            uri: item?.image ?? '',
          }}
          style={{
            width: Dimensions.get('screen').width * 0.4,
            height: Dimensions.get('screen').width * 0.4,
          }}
          fallback
          defaultSource={require('../../assets/images/qudsLogo.png')}
          resizeMode="contain"
        />
        <Text
          style={{
            color: AppColors.mainText,
            fontSize: dimensionsCalculation(15),
            textAlign: 'center',
          }}
          numberOfLines={1}>
          {item?.name}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: dimensionsCalculation(5),
          }}>
          <AppButton
            onPress={() => {
              navigate('WebViewScreen', {
                // url: `http://196.25.70.10/virtualroom?colorid=${item?.id}`,
                // url: `https://qudspaints.bloom-jo.com/virtualroom?colorid=${item?.id}`,
                url: `https://www.qudspaints.com/virtualroom?l=${Languages.getLanguage()}&colorid=${item?.id
                  }`,
              });
            }}
            text={Languages.TryIt}
            androidRippleColor={AppColors.androidRippleColor.white}
            containerStyle={{
              backgroundColor: AppColors.primary,
              height: dimensionsCalculation(30),
              borderRadius: dimensionsCalculation(22.5),
              flex: 1,
              // alignSelf: 'stretch',
              marginTop: dimensionsCalculation(10),
            }}
            textStyle={{
              fontFamily: fonts.primaryRegular,
            }}
          />
          <AppButton
            onPress={() => {
              setSelectedColor(item);
            }}
            text={Languages.ViewIt}
            androidRippleColor={AppColors.androidRippleColor.white}
            containerStyle={{
              backgroundColor: AppColors.secondary,
              height: dimensionsCalculation(30),
              borderRadius: dimensionsCalculation(22.5),
              flex: 1,
              marginLeft: dimensionsCalculation(5),
              // alignSelf: 'stretch',
              marginTop: dimensionsCalculation(10),
            }}
            textStyle={{
              fontFamily: fonts.primaryRegular,
            }}
          />
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <AppHeader />
      <AppTabBar />
      {isLoading && <LoadingSpinner overlay />}
      <Modal
        ref={modalRef}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: AppColors.white,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        coverScreen
        backButtonClose
        backdrop={false}
        swipeToClose={false}
        statusBarTranslucent
        onClosed={() => {
          setSelectedColor(null);
        }}>
        <Image
          source={{
            uri: selectedColor?.image2,
          }}
          onError={() => {
            setSelectedColor((prev) => ({
              ...prev,
              image2: prev?.image,
            }));
          }}
          style={{
            position: 'absolute',
            zIndex: -1,
            width: 1,
            height: 1,
          }}
        />
        <Zoom
          style={{ width: '100%', height: '100%' }}
          doubleTapConfig={{
            defaultScale: 2,
            minZoomScale: 1,
            maxZoomScale: 4,
          }}
        >
          <Image
            source={{ uri: selectedColor?.image2 ?? selectedColor?.image }}
            style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
          />
        </Zoom>
        <AppTouchableOpacity
          androidRippleColor={AppColors.androidRippleColor.white}
          style={{
            backgroundColor: 'rgba(0,0,0,0.3)',
            width: dimensionsCalculation(50),
            height: dimensionsCalculation(50),
            borderRadius: dimensionsCalculation(25),
            alignSelf: 'center',
            position: 'absolute',
            bottom: dimensionsCalculation(20),
            zIndex: 1111,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            modalRef?.current?.close();
          }}>
          <AppIcon
            size={dimensionsCalculation(35)}
            name="close"
            color={AppColors.white}
            type="SimpleLineIcons"
          />
        </AppTouchableOpacity>
      </Modal>
      <FlatList
        numColumns={2}
        contentContainerStyle={styles.flatlist}
        keyExtractor={(item, index) => index.toString()}
        data={colors}
        renderItem={renderItem}
      />
    </View>
  );
};

export default ColorsScreen;

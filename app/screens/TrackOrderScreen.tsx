import { Constants, fonts, Languages } from '../common';
import { Order } from '../common/Types';
import { AppButton, AppHeader, AppTabBar, LoadingSpinner } from '../components';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';
import StepIndicator from 'react-native-step-indicator';
import { AppColors } from '../theme';
import {
  configureNextScaleAnimation,
  dimensionsCalculation,
  ShowToast,
} from '../utils';
import { trackOrderCall } from '../services/api/calls';
import WebView from 'react-native-webview';
import { reset } from '../navigation';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  scrollview: {
    paddingTop: Constants.headerHeight + dimensionsCalculation(20),
    paddingHorizontal: dimensionsCalculation(20),
    paddingBottom: Constants.tabBarHeight + dimensionsCalculation(20),
  },
  orderStateView: {
    // minHeight: 120,
    justifyContent: 'center',
    paddingLeft: dimensionsCalculation(10),
    alignItems: 'flex-start',
    width: Dimensions.get('screen').width - dimensionsCalculation(100),
    marginBottom: dimensionsCalculation(10),
  },
});

const images = [
  require('../../assets/images/placed.png'),
  require('../../assets/images/proccessing.png'),
  require('../../assets/images/delivery.png'),
  require('../../assets/images/delivered.png'),
];
const customStyles = {
  stepIndicatorSize: dimensionsCalculation(60),
  separatorStrokeWidth: 2,
  labelSize: 0,
};

export interface TrackOrderScreenProps {
  route: {
    params: {
      isCartCheckout: boolean;
      order: Order;
    };
  };
}

const TrackOrderScreen = ({ route }: TrackOrderScreenProps) => {
  const labels = [
    Languages.OrderPlaced,
    Languages.ProcessOrder,
    Languages.ShippingOrder,
    Languages.OrderDelivered,
  ];
  const [order, setOrder] = useState<Order>(route?.params?.order);
  const [orderStatus, setOrderStatus] = useState<{
    orderids: string;
    status: number;
    preparing: string;
    processing: string;
    shipping: string;
    deliver: string;
  }>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { isCartCheckout } = route.params;

  useEffect(() => {
    getOrderStatus();
  }, []);

  const getOrderStatus = async () => {
    const result = await trackOrderCall({
      id: order?.order?.id,
    });
    configureNextScaleAnimation();
    if (result?.data) {
      setOrderStatus(result?.data);
    } else {
      ShowToast(Languages.Oops);
    }
    setIsLoading(false);
  };

  const currentPosition =
    orderStatus?.status == 0 || orderStatus?.status == 1
      ? 0
      : orderStatus?.status - 1;

  return (
    <View style={styles.container}>
      <AppHeader />
      <AppTabBar />
      <ScrollView
        contentContainerStyle={[
          styles.scrollview,
          !!isCartCheckout && {
            paddingBottom: Constants.tabBarHeight + dimensionsCalculation(80),
          },
        ]}>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <View
            style={{
              flexGrow: 1,
            }}>
            <StepIndicator
              stepCount={4}
              direction="vertical"
              renderStepIndicator={(props) => {
                return (
                  <View
                    style={{
                      backgroundColor:
                        props.position == currentPosition
                          ? AppColors.secondary
                          : AppColors.primary,
                      width: dimensionsCalculation(60),
                      height: dimensionsCalculation(60),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <FastImage
                      source={images[props.position]}
                      style={{
                        width: dimensionsCalculation(30),
                        height: dimensionsCalculation(30),
                      }}
                      resizeMode="contain"
                    />
                  </View>
                );
              }}
              renderLabel={({ label, position, currentPosition }) => {
                let html =
                  position == 0
                    ? orderStatus?.preparing ?? Languages.OrderPlaced
                    : position == 1
                      ? orderStatus?.processing ?? Languages.ProcessOrder
                      : position == 2
                        ? orderStatus?.shipping ?? Languages.ShippingOrder
                        : orderStatus?.deliver ?? Languages.OrderDelivered;

                // let html = '';
                // if (position == 0 && orderStatus?.status == 0) {
                //   html = orderStatus?.preparing;
                // } else if (position == 1 && orderStatus?.status == 2) {
                //   html = orderStatus?.processing;
                // } else if (position == 2 && orderStatus?.status == 4) {
                //   html = orderStatus?.shipping;
                // } else if (position == 3 && orderStatus?.status) {
                //   html = orderStatus?.deliver;
                // }
                html = html.replace(/<style([\s\S]*?)<\/style>/gi, '');
                html = html.replace(/<script([\s\S]*?)<\/script>/gi, '');
                html = html.replace(/<\/div>/gi, '\n');
                html = html.replace(/<\/li>/gi, '\n');
                html = html.replace(/<li>/gi, '  *  ');
                html = html.replace(/<\/ul>/gi, '\n');
                html = html.replace(/<\/p>/gi, '\n');
                html = html.replace(/<br\s*[\/]?>/gi, '\n');
                html = html.replace(/<[^>]+>/gi, '');
                html = html.replace(/&nbsp;/gi, ' ');
                return (
                  <View style={styles.orderStateView}>
                    <Text
                      style={{
                        textAlign: 'left',
                        color:
                          position == currentPosition
                            ? AppColors.secondary
                            : '#676767',
                        fontSize:
                          position == currentPosition
                            ? dimensionsCalculation(16)
                            : dimensionsCalculation(13),
                        fontFamily:
                          position == currentPosition
                            ? fonts.primaryBold
                            : fonts.primaryRegular,
                      }}>
                      {labels[position]}
                    </Text>
                    <Text
                      numberOfLines={4}
                      style={{
                        fontSize: dimensionsCalculation(12),
                        color: AppColors.mainText,
                      }}>
                      {html}
                    </Text>
                  </View>
                );
              }}
              customStyles={{
                ...customStyles,
                currentStepIndicatorSize: dimensionsCalculation(60),
                stepStrokeCurrentColor: AppColors.secondary,
                stepIndicatorCurrentColor: AppColors.secondary,
                separatorFinishedColor: AppColors.primary,
                labelAlign: 'center',
              }}
              currentPosition={currentPosition}
              labels={labels}
            />
          </View>
        )}
      </ScrollView>
      {!!isCartCheckout && (
        <AppButton
          onPress={() => {
            reset([{ name: 'HomeScreen' }]);
          }}
          text={Languages.ContinueShopping}
          textColor={AppColors.white}
          androidRippleColor={AppColors.androidRippleColor.white}
          containerStyle={{
            position: 'absolute',
            bottom: Constants.tabBarHeight + dimensionsCalculation(30),
            zIndex: 1111,
            alignSelf: 'center',
            borderRadius: dimensionsCalculation(25),
            height: dimensionsCalculation(50),
            paddingHorizontal: dimensionsCalculation(30),
            backgroundColor: AppColors.secondary,
          }}
        />
      )}
    </View>
  );
};

export default TrackOrderScreen;

import { AppIcon, Constants, fonts, Languages } from '../common';
import {
  OrderDetailsScreenProps,
  OrderDetailsScreenState,
  OrderItem,
} from '../common/Types';
import {
  AppButton,
  AppHeader,
  AppTabBar,
  AppTouchableOpacity,
  LoadingSpinner,
} from '../components';
import { goBack, navigate, push, reset } from '../navigation';
import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList } from 'react-native';
import FastImage from 'react-native-fast-image';
import { orderDetailsGetCall } from '../services/api/calls';
import { AppColors } from '../theme';
import {
  configureNextScaleAnimation,
  currencyFormatter,
  dimensionsCalculation,
  ShowToast,
} from '../utils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  flatlist: {
    flexGrow: 1,
    paddingHorizontal: dimensionsCalculation(20),
    paddingTop: Constants.headerHeight + dimensionsCalculation(20),
    paddingBottom: Constants.tabBarHeight + dimensionsCalculation(20),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: dimensionsCalculation(5),
  },
  key: {
    textAlign: 'left',
    fontSize: dimensionsCalculation(14),
  },
  value: {
    textAlign: 'right',
    fontSize: dimensionsCalculation(16),
    fontFamily: fonts.primaryBold,
  },
  listTableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: '#848484',
    borderBottomWidth: 1,
    paddingBottom: dimensionsCalculation(10),
  },
  itemNameHeader: {
    flex: 1,
    paddingLeft: dimensionsCalculation(5),
    textAlign: 'left',
    fontSize: dimensionsCalculation(13),
    fontFamily: fonts.primaryLight,
  },
  tableHeaderSide: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  tableHeaderText: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: dimensionsCalculation(13),
    fontFamily: fonts.primaryLight,
  },
  heartContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: dimensionsCalculation(60),
    height: dimensionsCalculation(60),
    marginHorizontal: dimensionsCalculation(5),
    borderRadius: dimensionsCalculation(5),
  },
  listCell: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    overflow: 'visible',
  },
  quantity: {
    backgroundColor: AppColors.white,
    borderRadius: dimensionsCalculation(20),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    paddingHorizontal: dimensionsCalculation(20),
    paddingVertical: dimensionsCalculation(0),
    alignSelf: 'stretch',
    marginHorizontal: dimensionsCalculation(15),
  },
});

export default class OrderDetailsScreen extends Component<
  OrderDetailsScreenProps,
  OrderDetailsScreenState
> {
  constructor(props: OrderDetailsScreenProps) {
    super(props);
    this.state = {
      isLoading: true,
      order: this.props.route?.params?.order,
    };
  }

  componentDidMount = () => {
    this.orderGet();
  };

  orderGet = async () => {
    const result = await orderDetailsGetCall({
      id: this.state.order?.order?.id,
    });
    configureNextScaleAnimation();
    if (result?.data?.order) {
      this.setState(
        {
          order: { order: result?.data?.order },
          isLoading: false,
        },
        () => { },
      );
    } else {
      ShowToast(Languages.Oops);
      goBack();
    }
  };

  renderItem = ({ item, index }: { item: OrderItem; index: number }) => {
    const { order } = this.state;
    return (
      <View
        style={[
          styles.listTableHeader,
          { paddingTop: dimensionsCalculation(10) },
          index == order?.order?.items?.length - 1 && { borderBottomWidth: 0 },
        ]}>
        <AppTouchableOpacity
          androidRippleColor={AppColors.androidRippleColor.white}
          onPress={() => {
            navigate('ProductDetailsScreen', {
              product: {
                product: {
                  id: item?.item?.productid,
                  name: item?.item?.productname,
                },
              },
            });
          }}
          style={styles.heartContainer}>
          <FastImage
            source={{ uri: item?.item?.image ?? '' }}
            style={styles.itemImage}
            fallback
            defaultSource={require('../../assets/images/qudsLogo.png')}
          />
          <Text
            style={{
              flex: 1,
            }}
            numberOfLines={2}
            adjustsFontSizeToFit>
            {item?.item?.productname}
          </Text>
        </AppTouchableOpacity>
        <View style={styles.tableHeaderSide}>
          <View style={styles.listCell}>
            <View style={styles.quantity}>
              <Text
                style={{
                  textAlign: 'center',
                  color: AppColors.mainText,
                }}
                numberOfLines={1}
                adjustsFontSizeToFit>
                {item?.item?.quantity}
              </Text>
            </View>
          </View>
          <View style={styles.listCell}>
            <Text
              style={{
                textAlign: 'center',
                color: AppColors.mainText,
              }}>
              {`${parseFloat(item?.item?.total)}\n${Languages.JOD}`}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  render() {
    const { isLoading, order } = this.state;
    const { isCartCheckout } = this.props.route?.params;
    return (
      <View style={styles.container}>
        <AppHeader />
        <AppTabBar />
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <FlatList
              contentContainerStyle={[
                styles.flatlist,
                !!isCartCheckout && {
                  paddingBottom:
                    Constants.tabBarHeight + dimensionsCalculation(80),
                },
              ]}
              ListHeaderComponent={
                <View style={{}}>
                  <AppButton
                    onPress={() => {
                      push('TrackOrderScreen', {
                        order,
                        isCartCheckout,
                      });
                    }}
                    text={Languages.TrackYOrder}
                    textColor={AppColors.white}
                    androidRippleColor={AppColors.androidRippleColor.white}
                    containerStyle={{
                      alignSelf: 'center',
                      borderRadius: dimensionsCalculation(25),
                      height: dimensionsCalculation(50),
                      paddingHorizontal: dimensionsCalculation(30),
                      backgroundColor: AppColors.secondary,
                    }}
                  />
                  <View style={styles.row}>
                    <Text style={styles.key}>{`${Languages.OrderNo}`}</Text>
                    <Text style={styles.value}>{`#${order?.order?.id}`}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.key}>{`${Languages.OrderDate}`}</Text>
                    <Text style={styles.value}>{order?.order?.date}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text
                      style={styles.key}>{`${Languages.DeliveryFees}`}</Text>
                    <Text style={styles.value}>{`${parseFloat(
                      order?.order?.shipping,
                    )} ${Languages.JOD}`}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.key}>{`${Languages.Total}`}</Text>
                    <Text style={styles.value}>{`${parseFloat(order?.order?.total) +
                      parseFloat(order?.order?.shipping)
                      } ${Languages.JOD}`}</Text>
                  </View>
                  <View style={styles.listTableHeader}>
                    <Text style={styles.itemNameHeader}>{Languages.Item}</Text>
                    <View style={styles.tableHeaderSide}>
                      <Text
                        adjustsFontSizeToFit
                        numberOfLines={1}
                        style={[styles.tableHeaderText, {}]}>
                        {Languages.Quantity}
                      </Text>
                      <Text style={styles.tableHeaderText}>
                        {Languages.Price}
                      </Text>
                    </View>
                  </View>
                </View>
              }
              keyExtractor={(item, index) => index.toString()}
              data={order?.order?.items}
              renderItem={this.renderItem}
            />
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
          </>
        )}
      </View>
    );
  }
}

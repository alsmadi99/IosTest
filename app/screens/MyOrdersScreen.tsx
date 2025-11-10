import { Constants, fonts, Languages } from '../common';
import { MyOrdersScreenProps, MyOrdersScreenState, Order } from '../common/Types';
import {
  AppHeader,
  AppTabBar,
  AppTouchableOpacity,
  LoadingSpinner,
} from '../components';
import { navigate } from '../navigation';
import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { userOrdersGetCall } from '../services/api/calls';
import { AppColors } from '../theme';
import {
  configureNextScaleAnimation,
  currencyFormatter,
  dimensionsCalculation,
  isIOS,
} from '../utils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  flatlist: {
    flexGrow: 1,
    paddingTop: Constants.headerHeight + dimensionsCalculation(20),
    paddingBottom: Constants.tabBarHeight + dimensionsCalculation(20),
    paddingHorizontal: dimensionsCalculation(20),
  },
  title: {
    fontSize: dimensionsCalculation(22),
    textAlign: 'center',
    color: AppColors.mainText,
    fontFamily: fonts.primaryBold,
    marginBottom: dimensionsCalculation(20),
  },
  orderContainer: {
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    backgroundColor: AppColors.white,
    padding: dimensionsCalculation(10),
    marginBottom: dimensionsCalculation(20),
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
});

export default class MyOrdersScreen extends Component<
  MyOrdersScreenProps,
  MyOrdersScreenState
> {
  pagenumber = 1;
  constructor(props: MyOrdersScreenProps) {
    super(props);
    this.state = {
      isLoading: true,
      isRefreshing: false,
      isFetchingMore: false,
      orders: [],
      pages: 0,
    };
  }

  componentDidMount = () => {
    this.getOrders();
  };

  getOrders = (
    isLoading: boolean = true,
    isRefreshing: boolean = false,
    isFetchingMore: boolean = false,
  ) => {
    this.setState(
      {
        isLoading,
        isRefreshing,
        isFetchingMore,
      },
      async () => {
        const result = await userOrdersGetCall({
          p: this.pagenumber,
        });
        configureNextScaleAnimation();
        if (result?.data?.orders) {
          const orders = result?.data?.orders;
          this.setState(
            {
              orders: isRefreshing ? orders : [...this.state.orders, ...orders],
              pages: result?.data?.pages,
              isLoading: false,
              isRefreshing: false,
              isFetchingMore: false,
            },
            () => { },
          );
        } else {
          this.setState(
            {
              isLoading: false,
              isRefreshing: false,
              isFetchingMore: false,
            },
            () => { },
          );
        }
      },
    );
  };

  renderOrder = ({ item, index }: { item: Order; index: number }) => {
    return (
      <AppTouchableOpacity
        style={styles.orderContainer}
        onPress={() => {
          navigate('OrderDetailsScreen', {
            order: item,
          });
        }}>
        <View style={styles.row}>
          <Text style={styles.key}>{`${Languages.OrderNo}`}</Text>
          <Text style={styles.value}>{`#${item?.order?.id}`}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.key}>{`${Languages.OrderDate}`}</Text>
          <Text style={styles.value}>{`${item?.order?.date}`}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.key}>{`${Languages.Total}`}</Text>
          <Text style={styles.value}>{`${parseFloat(item?.order?.total ?? '0') +
            parseFloat(item?.order?.shipping ?? '0')
            } ${Languages.JOD}`}</Text>
        </View>
        <AppTouchableOpacity disabled style={{}} onPress={() => { }}>
          <Text style={{ color: AppColors.mainText, textAlign: 'center' }}>
            {Languages.MoreDetails}
          </Text>
        </AppTouchableOpacity>
      </AppTouchableOpacity>
    );
  };

  onEndReached = () => {
    const { isFetchingMore, pages } = this.state;
    if (!isFetchingMore && this.pagenumber < pages)
      this.getOrders(false, false, true);
  };

  render() {
    const { isLoading, isRefreshing, isFetchingMore, orders } = this.state;
    return (
      <View style={styles.container}>
        <AppHeader />
        <AppTabBar />
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {isIOS && isRefreshing && <LoadingSpinner overlay />}
            <FlatList
              contentContainerStyle={styles.flatlist}
              ListHeaderComponent={
                orders?.length > 0 ? (
                  <View style={{}}>
                    <Text style={styles.title}>{Languages.MyOrders}</Text>
                  </View>
                ) : null
              }
              refreshControl={
                <RefreshControl
                  progressViewOffset={dimensionsCalculation(80)}
                  refreshing={isRefreshing}
                  onRefresh={() => {
                    this.getOrders(false, true);
                  }}
                />
              }
              keyExtractor={(item, index) => index.toString()}
              data={orders}
              renderItem={this.renderOrder}
              ListEmptyComponent={
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: AppColors.mainText,
                      fontFamily: fonts.primaryBold,
                      fontSize: dimensionsCalculation(20),
                      textAlign: 'center',
                      marginHorizontal: dimensionsCalculation(20),
                    }}>
                    {Languages.NoOrders}
                  </Text>
                </View>
              }
              onEndReached={this.onEndReached}
              ListFooterComponent={
                isFetchingMore ? (
                  <View style={{}}>
                    <ActivityIndicator color={AppColors.primary} />
                  </View>
                ) : null
              }
            />
          </>
        )}
      </View>
    );
  }
}

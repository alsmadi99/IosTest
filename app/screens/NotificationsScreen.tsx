import { Constants, fonts, Languages } from '../common';
import {
  Notification,
  NotificationsScreenProps,
  NotificationsScreenState,
} from '../common/Types';
import { AppHeader, AppTabBar, LoadingSpinner } from '../components';
import moment from 'moment';
import React, { Component, Dispatch } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { clearNotificationsGet, notificationsGetCall } from '../services/api/calls';
import { getUserDataAction } from '../store/actions/AuthActions';
import { AppColors } from '../theme';
import { configureNextScaleAnimation, dimensionsCalculation, isIOS } from '../utils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  title: {
    fontSize: dimensionsCalculation(22),
    textAlign: 'center',
    color: AppColors.mainText,
    fontFamily: fonts.primaryBold,
    marginBottom: dimensionsCalculation(20),
  },
  listStyle: {
    flexGrow: 1,
    paddingBottom: Constants.tabBarHeight + dimensionsCalculation(20),
    paddingTop: Constants.headerHeight + dimensionsCalculation(20),
  },
  notificationContainer: {
    elevation: 1,
    marginHorizontal: dimensionsCalculation(20),
    backgroundColor: AppColors.white,
    borderRadius: dimensionsCalculation(10),
    marginBottom: dimensionsCalculation(10),
    padding: dimensionsCalculation(10),
  },
  notificationText: {
    textAlign: 'left',
    fontSize: dimensionsCalculation(14),
    color: AppColors.black,
  },
  notificationDate: {
    textAlign: 'left',
    color: AppColors.inputText,
    fontSize: dimensionsCalculation(12),
  },
});

class NotificationsScreen extends Component<
  NotificationsScreenProps,
  NotificationsScreenState
> {
  pagenumber = 1;
  constructor(props: NotificationsScreenProps) {
    super(props);
    this.state = {
      isLoading: true,
      isRefreshing: false,
      isFetchingMore: false,
      stopFetchingMore: false,
      notifications: [],
    };
  }

  componentDidMount = () => {
    this.getNotifications();
    this.clearNotifications();
  };

  clearNotifications = async () => {
    const result = await clearNotificationsGet();
    if (result.data) {
      this.props.getUserData();
    }
  };

  getNotifications = (
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
        const result = await notificationsGetCall({
          p: this.pagenumber++,
        });
        configureNextScaleAnimation();
        const newNotifications = result?.data?.notifications;
        this.setState(
          {
            notifications: isRefreshing
              ? newNotifications
              : [...this.state.notifications, ...newNotifications],
            isLoading: false,
            isRefreshing: false,
            isFetchingMore: false,
            stopFetchingMore: newNotifications?.length == 0,
          },
          () => { },
        );
      },
    );
  };

  renderNotification = ({ item, index }: { item: Notification; index: number }) => {
    return (
      <View
        style={styles.notificationContainer}
        key={`blog${index.toString()}`}>
        <Text
          style={styles.notificationText}
          numberOfLines={1}
          adjustsFontSizeToFit>
          {item?.title}
        </Text>
        <Text style={styles.notificationDate}>{item?.description}</Text>
        <Text style={styles.notificationDate}>
          {moment(item?.date).format('DD-MM-YYYY')}
        </Text>
      </View>
    );
  };

  render() {
    const {
      isLoading,
      isRefreshing,
      isFetchingMore,
      stopFetchingMore,
      notifications,
    } = this.state;
    return (
      <View style={styles.container}>
        <AppHeader activeScreen="notifications" />
        <AppTabBar />
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {isIOS && isRefreshing && <LoadingSpinner overlay />}
            <FlatList
              ListHeaderComponent={
                notifications?.length == 0 ? null : (
                  <View
                    style={{
                      marginBottom: dimensionsCalculation(20),
                    }}>
                    <Text style={styles.title}>{Languages.Notifications}</Text>
                  </View>
                )
              }
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
                    {Languages.NoNotifications}
                  </Text>
                </View>
              }
              ListFooterComponent={
                isFetchingMore ? (
                  <View
                    style={{
                      paddingVertical: dimensionsCalculation(10),
                      alignItems: 'center',
                    }}>
                    <ActivityIndicator color={AppColors.primary} size="small" />
                  </View>
                ) : null
              }
              refreshControl={
                <RefreshControl
                  progressViewOffset={dimensionsCalculation(80)}
                  refreshing={isRefreshing}
                  onRefresh={() => {
                    this.pagenumber = 1;
                    this.getNotifications(false, true, false);
                  }}
                />
              }
              onEndReached={() => {
                if (!isFetchingMore && !stopFetchingMore)
                  this.getNotifications(false, false, true);
              }}
              contentContainerStyle={styles.listStyle}
              keyExtractor={(item, index) => index.toString()}
              data={notifications}
              renderItem={this.renderNotification}
            />
          </>
        )}
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return {
    getUserData: () => {
      return dispatch(getUserDataAction() as any);
    },
  };
};

export default connect(null, mapDispatchToProps)(NotificationsScreen);

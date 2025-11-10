import { AppIcon, Constants } from '../common';
import { AppHeaderProps, QudsPaintsStore } from '../common/Types';
import { AppTouchableOpacity } from '../components';
import { canGoBack, goBack, navigate, openDrawer } from '../navigation';
import React from 'react';
import { View, StyleSheet, I18nManager } from 'react-native';
import { useSelector } from 'react-redux';
import { AppColors } from '../theme';
import { dimensionsCalculation, getStatusBarHeight, isIOS, isRTL } from '../utils';

export default function AppHeader({
  showMenu = false,
  onBackPress,
  onLayout,
  headerStyle = {},
  forwardedRef,
  activeScreen,
}: AppHeaderProps) {
  const { cartItems, wishlist, token, newnotifications } = useSelector(
    ({ cart, auth }: QudsPaintsStore) => ({
      cartItems: cart?.items,
      wishlist: auth?.wishlist,
      token: auth?.user?.token,
      newnotifications: auth?.user?.newnotifications,
    }),
  );

  return (
    <View
      ref={forwardedRef}
      style={[styles.headerStyle, headerStyle]}
      onLayout={(e) => {
        onLayout && onLayout(e);
      }}>
      <AppTouchableOpacity
        androidRippleColor={AppColors.androidRippleColor.white}
        onPress={() => {
          showMenu
            ? openDrawer()
            : onBackPress
              ? onBackPress()
              : canGoBack()
                ? goBack()
                : navigate('HomeScreen');
        }}
        borderless
        style={[
          styles.headerBtn,
          showMenu && { marginLeft: dimensionsCalculation(4) },
        ]}>
        {showMenu ? (
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
            size={dimensionsCalculation(18)}
            color={AppColors.white}
          />
        ) : (
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
            name={isIOS ? 'chevron-thin-left' : 'arrow-left'}
            type={isIOS ? 'Entypo' : 'AntDesign'}
            size={dimensionsCalculation(24)}
            color={AppColors.white}
          />
        )}
      </AppTouchableOpacity>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <AppTouchableOpacity
          androidRippleColor={AppColors.androidRippleColor.white}
          onPress={() => {
            if (!token) {
              return navigate('LoginScreen');
            }
            navigate('NotificationsScreen');
          }}
          disabled={activeScreen == 'notifications'}
          borderless
          style={[
            styles.whiteBtn,
            activeScreen == 'notifications' && {
              backgroundColor: AppColors.secondary,
            },
          ]}>
          {!!token && !!newnotifications && <View style={styles.redDot} />}
          <AppIcon
            style={{ marginLeft: isRTL ? -0.5 : 0.5 }}
            name="bell"
            type="SimpleLineIcons"
            size={dimensionsCalculation(18)}
            color={AppColors.black}

          />
        </AppTouchableOpacity>
        <AppTouchableOpacity
          androidRippleColor={AppColors.androidRippleColor.white}
          onPress={() => {
            if (!token) {
              return navigate('LoginScreen');
            }
            navigate('WishlistScreen');
          }}
          borderless
          disabled={activeScreen == 'wishlist'}
          style={[
            styles.whiteBtn,
            activeScreen == 'wishlist' && {
              backgroundColor: AppColors.secondary,
            },
          ]}>
          {token && wishlist?.length > 0 && <View style={styles.redDot} />}
          <AppIcon
            style={{
              marginTop: 1,
            }}
            name={'hearto'}
            type="AntDesign"
            size={dimensionsCalculation(18)}
            color={AppColors.black}
          />
        </AppTouchableOpacity>
        <AppTouchableOpacity
          androidRippleColor={AppColors.androidRippleColor.white}
          onPress={() => {
            if (!token) {
              return navigate('LoginScreen');
            }
            navigate('CartScreen');
          }}
          borderless
          disabled={activeScreen == 'cart'}
          style={[
            styles.whiteBtn,
            activeScreen == 'cart' && { backgroundColor: AppColors.secondary },
          ]}>
          {token && cartItems?.length > 0 && <View style={styles.redDot} />}
          <AppIcon
            name={'shoppingcart'}
            type="AntDesign"
            size={dimensionsCalculation(18)}
            color={AppColors.black}
          />
        </AppTouchableOpacity>
        <AppTouchableOpacity
          androidRippleColor={AppColors.androidRippleColor.white}
          onPress={() => {
            if (!token) {
              return navigate('LoginScreen');
            }
            navigate('ProfileScreen');
          }}
          borderless
          disabled={activeScreen == 'profile'}
          style={[
            styles.whiteBtn,
            activeScreen == 'profile' && { backgroundColor: AppColors.secondary },
          ]}>
          <AppIcon
            style={{
              marginLeft: isRTL ? 0 : 1,
            }}
            name={'user-o'}
            type="FontAwesome"
            size={dimensionsCalculation(18)}
            color={AppColors.black}
          />
        </AppTouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1500,
    backgroundColor: AppColors.primary,
    borderBottomLeftRadius: dimensionsCalculation(40),
    borderBottomRightRadius: dimensionsCalculation(40),
    paddingTop: dimensionsCalculation(getStatusBarHeight()),
    height: Constants.headerHeight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: dimensionsCalculation(10),
    paddingHorizontal: dimensionsCalculation(20),
  },
  headerBtn: {
    padding: 5,
    overflow: 'visible',
    // marginLeft: dimensionsCalculation(4),
  },
  whiteBtn: {
    marginLeft: dimensionsCalculation(10),
    overflow: 'visible',
    backgroundColor: AppColors.white,
    borderRadius: dimensionsCalculation(20),
    width: dimensionsCalculation(30),
    height: dimensionsCalculation(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  redDot: {
    backgroundColor: 'red',
    width: dimensionsCalculation(8),
    height: dimensionsCalculation(8),
    borderRadius: dimensionsCalculation(4),
    zIndex: 1500,
    position: 'absolute',
    top: dimensionsCalculation(5),
    right: dimensionsCalculation(5),
  },
});

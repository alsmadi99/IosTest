import { AppIcon, fonts, Languages } from '../common';
import {
  DrawerContentItemProps,
  DrawerContentProps,
  QudsPaintsStore,
} from '../common/Types';
import { AppTouchableOpacity } from '../components';
import { closeDrawer, navigate, push, reset } from '../navigation';
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  I18nManager,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '../store/actions/AuthActions';
import { AppColors } from '../theme';
import { dimensionsCalculation, getBottomSpace, getStatusBarHeight } from '../utils';
import RNRestart from 'react-native-restart';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
  container: {
    paddingTop: dimensionsCalculation(getStatusBarHeight() + 20),
    flex: 1,
  },
  headerBtn: {
    marginHorizontal: dimensionsCalculation(20),
    padding: 5,
    overflow: 'visible',
    marginLeft: dimensionsCalculation(4),
    alignSelf: 'flex-end',
  },
  contentBtn: {
    paddingVertical: dimensionsCalculation(5),
    marginBottom: dimensionsCalculation(5),
    paddingHorizontal: dimensionsCalculation(7),
  },
  contentText: {
    color: AppColors.white,
    fontFamily: fonts.primaryBold,
    fontSize: dimensionsCalculation(16),
    textAlign: 'left',
  },
  termsBtn: {
    paddingHorizontal: dimensionsCalculation(7),
    paddingVertical: dimensionsCalculation(5),
    marginBottom: dimensionsCalculation(3),
  },
  termsText: {
    textAlign: 'left',
    color: AppColors.white,
    fontSize: dimensionsCalculation(12),
  },
});

const DrawerContent = (props: DrawerContentProps) => {
  const { user } = useSelector(({ auth }: QudsPaintsStore) => ({ user: auth?.user }));
  const dispatch = useDispatch();

  const drawerSections: DrawerContentItemProps[] = [
    {
      label:
        Languages.getLanguage() == 'ar' ? Languages.English : Languages.Arabic,
      onPress: () => {
        Alert.alert(Languages.ConfirmLang, Languages.ChangeLangConfirm, [
          {
            text: Languages.YesLang,
            onPress: async () => {
              await AsyncStorage.setItem(
                'appLanguage',
                Languages.getLanguage() == 'ar' ? 'en' : 'ar',
              );
              I18nManager.allowRTL(Languages.getLanguage() != 'ar');
              I18nManager.forceRTL(Languages.getLanguage() != 'ar');
              RNRestart.Restart();
            },
          },
          {
            text: Languages.NoLang,
          },
        ]);
      },
    },
    {
      label: Languages.Home,
      onPress: () => {
        navigate('HomeScreen');
      },
    },
    {
      label: Languages.Products,
      navigate: 'ProductsScreen',
      onPress: () => {
        navigate('ProductsScreen', {
          type: 'normal',
        });
      },
    },
    {
      label: Languages.MyOrders,
      onPress: () => {
        navigate('MyOrdersScreen');
      },
      needAuth: true,
    },
    {
      label: Languages.MyWishList,
      onPress: () => {
        navigate('WishlistScreen');
      },
      needAuth: true,
    },
    {
      label: Languages.VirtualRoom,
      onPress: () => {
        navigate('WebViewScreen', {
          // url: 'http://196.25.70.10/virtualroom',
          // url: 'https://qudspaints.bloom-jo.com/virtualroom',
          url:
            'https://www.qudspaints.com/virtualroom?l=' +
            Languages.getLanguage(),
        });
      },
    },
    {
      label: Languages.TakeSurvey,

      onPress: () => {
        navigate('TakeSurveyScreen');
      },
    },
    {
      label: Languages.Wallpaper,

      onPress: () => {
        navigate('StaticPageScreen', {
          istabbar: true,
          type: '40199',
        });
      },
    },
    {
      label: Languages.Colors,
      onPress: () => {
        navigate('ColorsScreen');
      },
    },
    {
      label: Languages.Gallery,
      onPress: () => {
        navigate('PhotoGalleryScreen');
      },
    },
    {
      label: Languages.Videos,
      onPress: () => {
        navigate('VideoGalleryScreen');
      },
    },
    {
      label: Languages.Branches,
      onPress: () => {
        navigate('DistributionPointsScreen');
      },
    },
    {
      label: Languages.Articles,
      onPress: () => {
        navigate('BlogScreen');
      },
    },
    {
      label: Languages.Offers,
      onPress: () => {
        navigate('ProductsScreen', {
          type: 'offers',
        });
      },
    },
    {
      label: Languages.ContactUS,
      onPress: () => {
        navigate('ContactUsScreen');
      },
    },
    {
      label: user ? Languages.Logout : Languages.Login,
      onPress: async () => {
        user && (await dispatch(clearUser()));
        !user && reset([{ name: 'LoginScreen' }]);
      },
    },
  ];

  const renderDrawerSection = ({
    item,
    index,
  }: {
    item: DrawerContentItemProps;
    index: number;
  }) => {
    return item?.needAuth && user == null ? null : (
      <AppTouchableOpacity
        onPress={() => {
          item.onPress ? item?.onPress() : navigate(item.navigate);
          closeDrawer();
        }}
        androidRippleColor={AppColors.androidRippleColor.white}
        style={styles.contentBtn}>
        <Text style={styles.contentText}>{item?.label}</Text>
      </AppTouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <AppTouchableOpacity
        androidRippleColor={AppColors.androidRippleColor.white}
        onPress={() => {
          closeDrawer();
        }}
        borderless
        style={styles.headerBtn}>
        <AppIcon
          name={'close'}
          type="AntDesign"
          size={dimensionsCalculation(20)}
          color={AppColors.white}
        />
      </AppTouchableOpacity>
      <FlatList
        contentContainerStyle={{
          paddingTop: dimensionsCalculation(20),
          paddingHorizontal: dimensionsCalculation(20),
        }}
        keyExtractor={(item, index) => index.toString()}
        data={drawerSections}
        renderItem={renderDrawerSection}
        ListFooterComponent={
          <View
            style={{
              paddingBottom: dimensionsCalculation(getBottomSpace() + 20),
            }}>
            <AppTouchableOpacity
              androidRippleColor={AppColors.androidRippleColor.white}
              style={styles.termsBtn}
              onPress={() => {
                navigate('StaticPageScreen', {
                  istabbar: false,
                  type: '30119',
                });
              }}>
              <Text style={styles.termsText}>{Languages.TermsNConditions}</Text>
            </AppTouchableOpacity>
            {/* <AppTouchableOpacity
              androidRippleColor={AppColors.androidRippleColor.white}
              style={styles.termsBtn}
              onPress={() => {
                navigate('StaticPageScreen', {
                  istabbar: false,
                  type: '30113',
                });
              }}>
              <Text style={styles.termsText}>{Languages.PrivacyPolicy}</Text>
            </AppTouchableOpacity> */}
          </View>
        }
      />
    </View>
  );
};

export default DrawerContent;

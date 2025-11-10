import React, { createRef } from 'react';
import { StatusBar, LogBox, Platform, Dimensions } from 'react-native';
import {
  DrawerActions,
  NavigationContainer,
  NavigationContainerRef,
  ParamListBase,
  StackActions,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import GlobalFont from 'react-native-global-font';
import fonts from '../common/fonts';
import { DrawerContent } from '../components';
import { isRTL } from '../utils';

// screens (keep your real imports)
import {
  SplashScreen,
  HomeScreen,
  ProductsScreen,
  ProductDetailsScreen,
  LoginScreen,
  RegisterScreen,
  BlogScreen,
  WishlistScreen,
  VideoGalleryScreen,
  PhotoGalleryScreen,
  CartScreen,
  ContactUsScreen,
  DistributionPointsScreen,
  ProfileScreen,
  SelectLocationScreen,
  WebViewScreen,
  StaticPageScreen,
  EditProfileScreen,
  EditPasswordScreen,
  SearchScreen,
  MyAddressesScreen,
  MyOrdersScreen,
  TechnicalExcellenceScreen,
  NotificationsScreen,
  BlogDetailsScreen,
  OrderDetailsScreen,
  PaintCalculatorScreen,
  TakeSurveyScreen,
  TrackOrderScreen,
  TechnicalDetailsScreen,
  VerifyOtpScreen,
  ColorsScreen,
  AlbumScreen,
} from '../screens';

LogBox.ignoreAllLogs(true);
GlobalFont.applyGlobal(fonts.primaryRegular);

// ----- navigation ref (typed) -----
export const navigationRef = createRef<NavigationContainerRef<ParamListBase>>();

export const navigate = (name: string, params?: any) => {
  navigationRef.current?.navigate(name as any, params);
};

export const reset = (routes: { name: string; params?: any }[], index: number = 0) => {
  navigationRef.current?.reset({ routes, index });
};

export const push = (name: string, params?: any) => {
  navigationRef.current?.dispatch(StackActions.push(name, params));
};

export const replace = (name: string, params?: any) => {
  navigationRef.current?.dispatch(StackActions.replace(name, params));
};

export const canGoBack = () => navigationRef.current?.canGoBack();
export const goBack = () => navigationRef.current?.goBack();
export const openDrawer = () => navigationRef.current?.dispatch(DrawerActions.openDrawer());
export const closeDrawer = () => navigationRef.current?.dispatch(DrawerActions.closeDrawer());

// ----- animation literals (as const to preserve literal types) -----
const iosAnim = 'slide_from_right' as const;
const androidAnim = 'fade' as const;

// typed screenOptions so TS knows the exact allowed option values
const screenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  animation: Platform.OS === 'ios' ? iosAnim : androidAnim,
  animationTypeForReplace: 'pop',
};

// ----- navigators (typed with ParamListBase) -----
const Stack = createNativeStackNavigator<ParamListBase>();
const Drawer = createDrawerNavigator<ParamListBase>();

const MainStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="SplashScreen" component={SplashScreen} />
    <Stack.Screen name="LoginScreen" component={LoginScreen} />
    <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
    <Stack.Screen name="WebViewScreen" component={WebViewScreen} />
    <Stack.Screen name="SearchScreen" component={SearchScreen} />
    <Stack.Screen name="VerifyOtpScreen" component={VerifyOtpScreen} />
    <Stack.Screen name="ProductDetailsScreen" component={ProductDetailsScreen} />
    <Stack.Screen name="ColorsScreen" component={ColorsScreen} />
    <Stack.Screen name="AlbumScreen" component={AlbumScreen} />
    <Stack.Screen name="PaintCalculatorScreen" component={PaintCalculatorScreen} />
    <Stack.Screen name="HomeScreen" component={HomeScreen} />
    <Stack.Screen name="ProductsScreen" component={ProductsScreen} />
    <Stack.Screen name="WishlistScreen" component={WishlistScreen} />
    <Stack.Screen name="VideoGalleryScreen" component={VideoGalleryScreen} />
    <Stack.Screen name="PhotoGalleryScreen" component={PhotoGalleryScreen} />
    <Stack.Screen name="CartScreen" component={CartScreen} />
    <Stack.Screen name="ContactUsScreen" component={ContactUsScreen} />
    <Stack.Screen name="DistributionPointsScreen" component={DistributionPointsScreen} />
    <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
    <Stack.Screen name="SelectLocationScreen" component={SelectLocationScreen} />
    <Stack.Screen name="StaticPageScreen" component={StaticPageScreen} />
    <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
    <Stack.Screen name="EditPasswordScreen" component={EditPasswordScreen} />
    <Stack.Screen name="MyAddressesScreen" component={MyAddressesScreen} />
    <Stack.Screen name="MyOrdersScreen" component={MyOrdersScreen} />
    <Stack.Screen name="TechnicalExcellenceScreen" component={TechnicalExcellenceScreen} />
    <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} />
    <Stack.Screen name="BlogDetailsScreen" component={BlogDetailsScreen} />
    <Stack.Screen name="OrderDetailsScreen" component={OrderDetailsScreen} />
    <Stack.Screen name="TakeSurveyScreen" component={TakeSurveyScreen} />
    <Stack.Screen name="TrackOrderScreen" component={TrackOrderScreen} />
    <Stack.Screen name="BlogScreen" component={BlogScreen} />
    <Stack.Screen name="TechnicalDetailsScreen" component={TechnicalDetailsScreen} />
  </Stack.Navigator>
);
// ...existing code...
const AppNavigator = () => (
  <NavigationContainer ref={navigationRef}>
    <StatusBar backgroundColor="transparent" barStyle="light-content" translucent />

    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false, // <- hide Drawer header (removes "MainStack" title and left icon)
        drawerPosition: isRTL ? 'right' : 'left',
        drawerStyle: {
          width: Dimensions.get('screen').width * 0.6,
          backgroundColor: 'rgba(22, 60, 97, 0.8)',
        },
        swipeEnabled: true,
      }}
    >
      <Drawer.Screen name="MainStack" component={MainStack} />
    </Drawer.Navigator>
  </NavigationContainer>
);
// ...existing code...

export default AppNavigator;

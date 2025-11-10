import { Constants, fonts, Languages } from '../common';
import AppIcon from '../components/AppIcon';
import {
  HomeScreenProps,
  HomeScreenState,
  Product,
  QudsPaintsStore,
} from '../common/Types';
import {
  AppButton,
  AppHeader,
  AppTabBar,
  AppTouchableOpacity,
  LoadingSpinner,
  ProductCard,
  SearchBar,
} from '../components';
import React, { Component, createRef, RefObject } from 'react';
import { connect } from 'react-redux';
import { AppColors } from '../theme';
import {
  configureNextScaleAnimation,
  dimensionsCalculation,
  getStatusBarHeight,
  isIOS,
  isRTL,
  ShowToast,
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
  responsiveSize,
  responsiveBorderRadius,
  spacing,
  fontSizes,
  getDeviceType,
  screenDimensions,
} from '../utils';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  I18nManager,
  RefreshControl,
  Linking,
} from 'react-native';
import { FlatList } from 'react-native';
import { homePageGetCall, productsGetCall } from '../services/api/calls';
import Modal from 'react-native-modalbox';
import { AnyAction, Dispatch } from 'redux';
import { ImageBackground } from 'react-native';
import WebView from 'react-native-webview';
import { canGoBack, goBack, navigate } from '../navigation';
import notifee, { AndroidImportance } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import { BackHandler } from 'react-native';
import { Alert } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  backBtn: {
    position: 'absolute',
    top: getStatusBarHeight() + responsiveSize(5),
    left: responsiveSize(10),
    borderRadius: responsiveBorderRadius(40),
    zIndex: 1500,
    backgroundColor: 'rgba(255,255,255,0.3)',
    width: responsiveSize(50),
    height: responsiveSize(50),
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListStyle: {
    paddingTop: Constants.headerHeight + responsiveSize(20),
    paddingBottom: Constants.tabBarHeight + responsiveSize(20),
  },
  searchContainer: {
    marginHorizontal: spacing.lg,
    backgroundColor: '#FBFBFB',
    padding: responsiveSize(4),
    borderRadius: responsiveBorderRadius(20),
    marginBottom: spacing.lg,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
  },
  searchInnerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: AppColors.white,
    borderRadius: responsiveBorderRadius(20),
    paddingLeft: spacing.sm,
    borderWidth: 1,
    borderColor: '#B9BBBD',
  },
  findColor: {
    color: AppColors.mainText,
    fontSize: fontSizes.sm,
  },
  bannerBtn: {
    marginHorizontal: spacing.lg,
    borderRadius: responsiveBorderRadius(10),
    padding: 0,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  bannerImg: {
    height: responsiveHeight(150), // Responsive height instead of calculated width
    width:
      screenDimensions.width -
      (isIOS ? responsiveSize(40) : responsiveSize(20)),
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  bannerTxtContainer: {
    flex: 1,
    alignItems: 'center',
    paddingRight: responsiveSize(25),
  },
  bannerTxt: {
    color: AppColors.white,
    fontFamily: fonts.primaryBold,
    textAlign: 'center',
    fontSize: fontSizes.lg,
  },
  separator: {
    borderBottomColor: AppColors.secondary,
    borderBottomWidth: 1,
    width: '78%',
  },
  calculateBtn: {
    backgroundColor: AppColors.white,
    borderRadius: responsiveBorderRadius(20),
    height: responsiveHeight(30),
    marginTop: spacing.sm,
    alignSelf: 'center',
    paddingHorizontal: spacing.sm,
  },
  squareBanner: {
    width: screenDimensions.width * 0.5 - responsiveSize(25),
    height: screenDimensions.width * 0.5 - responsiveSize(25),
    alignItems: 'center',
    justifyContent: 'center',
  },
  squareBannerTxt: {
    fontFamily: fonts.primaryBold,
    fontSize: fontSizes.xl,
    color: AppColors.mainText,
    lineHeight: fontSizes.xl * 1.5,
    textAlign: 'center',
  },
  productsHeader: {
    marginHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  ourProducts: {
    color: '#535353',
    fontSize: fontSizes.md,
  },
  filterBtn: {
    backgroundColor: AppColors.white,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    height: responsiveHeight(30),
    borderRadius: responsiveBorderRadius(15),
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    marginLeft: spacing.sm,
  },
});

class HomeScreen extends Component<HomeScreenProps, HomeScreenState> {
  takeTourModalRef = null as RefObject<Modal>;
  back: any;
  constructor(props: HomeScreenProps) {
    super(props);
    this.state = {
      search: '',
      isLoading: true,
      isRefreshing: false,
      products: [],
      canOpenWhatsapp: false,
    };
    this.takeTourModalRef = createRef();
  }

  componentDidMount = async () => {
    try {
      const canOpenWhatsapp = await Linking.canOpenURL(
        'whatsapp://send?phone=${+962797557772}&text=',
      );
      this.setState(
        {
          canOpenWhatsapp,
        },
        () => { },
      );
    } catch (error) { }
    this.back = BackHandler.addEventListener('hardwareBackPress', () => {
      if (canGoBack()) {
        goBack();
      } else {
        Alert.alert(Languages.ExitApp, Languages.ExitAppConfirm, [
          {
            text: Languages.No,
            onPress: () => {
              return true;
            },
          },
          {
            text: Languages.Yes,
            onPress: () => BackHandler.exitApp(),
          },
        ]);
      }
      return true;
    });
    this.homePageGet();
    this.prepareNotifications();
  };

  componentWillUnmount = () => {
    this.back?.remove();
    this.messageListener?.(); // remove foreground listener
  };

  prepareNotifications = () => {
    // Listen for foreground messages
    this.messageListener = messaging().onMessage(async remoteMessage => {
      if (!remoteMessage) return;

      const { notification, messageId } = remoteMessage;

      if (Platform.OS === 'android') {
        // Create Android channel
        const channelId = await notifee.createChannel({
          id: 'reminders',
          name: 'Reminders',
          importance: AndroidImportance.HIGH,
        });

        // Display notification
        await notifee.displayNotification({
          id: messageId,
          title: notification?.title,
          body: notification?.body,
          android: {
            channelId,
            smallIcon: 'ic_launcher', // Make sure you have this icon
            pressAction: { id: 'default' },
          },
          data: remoteMessage.data,
        });
      } else {
        // iOS notification
        await notifee.displayNotification({
          id: messageId,
          title: notification?.title,
          body: notification?.body,
          data: remoteMessage.data,
        });
      }
    });
  };


  homePageGet = (isLoading: boolean = true, isRefreshing: boolean = false) => {
    this.setState(
      {
        isLoading,
        isRefreshing,
      },
      async () => {
        try {
          const result = await homePageGetCall();
          configureNextScaleAnimation();
          if (result?.data?.products?.length > 0) {
            this.setState(
              {
                isLoading: false,
                isRefreshing: false,
                products: result?.data?.products,
              },
              () => { },
            );
          } else {
            this.setState(
              {
                isLoading: false,
                isRefreshing: false,
              },
              () => { },
            );
          }
        } catch (error) { }
      },
    );
  };

  renderProductCard = ({ item, index }: { item: Product; index: number }) => {
    return <ProductCard product={item} index={index} />;
  };

  render() {
    const { isLoading, isRefreshing, products, canOpenWhatsapp } = this.state;
    return (
      <View style={styles.container}>
        <AppHeader showMenu />
        <AppTabBar />
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <View style={{}}>
            {true && (
              <AppTouchableOpacity
                androidRippleColor={AppColors.androidRippleColor.white}
                style={{
                  position: 'absolute',
                  bottom: dimensionsCalculation(10) + Constants.tabBarHeight,
                  zIndex: 100000,
                  right: dimensionsCalculation(10),
                  backgroundColor: '#25D366',
                  width: dimensionsCalculation(40),
                  height: dimensionsCalculation(40),
                  borderRadius: dimensionsCalculation(20),
                  justifyContent: 'center',
                  alignItems: 'center',
                  elevation: 5,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                }}
                onPress={() => {
                  try {
                    Linking.openURL(
                      'whatsapp://send?phone=+962797557772&text=',
                    );
                  } catch (error) {
                    ShowToast(Languages.WhatsappNotSupported);
                  }
                }}>
                <AppIcon
                  name="whatsapp"
                  size={dimensionsCalculation(20)}
                  type="FontAwesome"
                  color={AppColors.white}
                />
              </AppTouchableOpacity>
            )}
            <Modal
              style={{
                flex: 1,
                width: '100%',
                height: '100%',
                backgroundColor: AppColors.white,
              }}
              ref={this.takeTourModalRef}
              coverScreen
              backdropPressToClose={false}
              backButtonClose
              swipeToClose={false}>
              <AppTouchableOpacity
                androidRippleColor={AppColors.androidRippleColor.white}
                style={styles.backBtn}
                // borderless
                onPress={() => {
                  this.takeTourModalRef?.current?.close();
                }}>
                <AppIcon
                  name={isRTL ? 'chevron-thin-right' : 'chevron-thin-left'}
                  size={dimensionsCalculation(25)}
                  color={AppColors.black}
                  type="Entypo"
                  style={{
                    marginLeft: isRTL ? 0 : -5,
                    marginRight: isRTL ? 0 : -5,
                  }}
                />
              </AppTouchableOpacity>
              <WebView
                style={{ flex: 1 }}
                source={{
                  uri: `${isRTL
                    ? 'https://www.youtube.com/embed/Dm4-Qal4q8I?rel=0'
                    : 'https://www.youtube.com/embed/CUnx9NSMZNI?rel=0'
                    }`,
                }}
                startInLoadingState
                renderLoading={() => <LoadingSpinner overlay />}
              />
            </Modal>
            {isIOS && isRefreshing && <LoadingSpinner overlay />}
            <FlatList
              contentContainerStyle={[
                styles.flatListStyle,
                canOpenWhatsapp && {
                  paddingBottom:
                    Constants.tabBarHeight + dimensionsCalculation(50),
                },
              ]}
              numColumns={2}
              keyExtractor={(item, index) => index.toString()}
              data={products?.slice(0, 4)}
              renderItem={this.renderProductCard}
              refreshControl={
                <RefreshControl
                  progressViewOffset={dimensionsCalculation(80)}
                  refreshing={isRefreshing}
                  onRefresh={() => {
                    this.homePageGet(false, true);
                  }}
                  colors={[AppColors.primary, AppColors.secondary]}
                />
              }
              ListHeaderComponent={
                <>
                  <SearchBar />
                  <AppTouchableOpacity
                    androidRippleColor={AppColors.androidRippleColor.white}
                    style={styles.bannerBtn}
                    onPress={() => {
                      navigate('ProductsScreen', {
                        type: 'best',
                      });
                    }}>
                    <ImageBackground
                      source={require('../../assets/images/banner1.png')}
                      style={styles.bannerImg}>
                      {!isRTL && <View style={{ flex: 1.5 }}></View>}
                      <View style={styles.bannerTxtContainer}>
                        <Text style={styles.bannerTxt}>
                          {Languages.DiscoverBestSelling}
                        </Text>
                        <View style={styles.separator} />
                      </View>
                      {isRTL && <View style={{ flex: 1.5 }}></View>}
                    </ImageBackground>
                  </AppTouchableOpacity>
                  <AppTouchableOpacity
                    androidRippleColor={AppColors.androidRippleColor.white}
                    style={styles.bannerBtn}
                    onPress={() => {
                      navigate('WebViewScreen', {
                        // url: 'http://196.25.70.10/virtualroom',
                        // url: `https://qudspaints.bloom-jo.com/virtualroom`,
                        url: `https://www.qudspaints.com/virtualroom?l=${Languages.getLanguage()}`,
                      });
                    }}>
                    <ImageBackground
                      source={require('../../assets/images/banner2.png')}
                      style={[
                        styles.bannerImg,
                        {
                          justifyContent: 'flex-start',
                          alignItems: 'flex-start',
                          paddingTop: dimensionsCalculation(20),
                          paddingLeft: dimensionsCalculation(20),
                        },
                      ]}>
                      {isRTL && <View style={{ flex: 1.5 }}></View>}
                      <View
                        style={{
                          flex: 1,
                        }}>
                        <Text
                          style={[
                            styles.bannerTxt,
                            {
                              textAlign: 'left',
                              fontSize: isRTL
                                ? dimensionsCalculation(12)
                                : dimensionsCalculation(17),
                            },
                          ]}>
                          {Languages.VirtualRoom}
                        </Text>
                        <View
                          style={[
                            styles.separator,
                            { marginVertical: dimensionsCalculation(5) },
                          ]}
                        />
                        <Text
                          style={{
                            textAlign: 'left',
                            marginRight: isRTL ? dimensionsCalculation(25) : 0,
                            flex: 1,
                            color: AppColors.white,
                            fontSize: dimensionsCalculation(9),
                          }}>
                          {Languages.PaintOnline}
                        </Text>
                      </View>
                      {!isRTL && <View style={{ flex: 1.5 }}></View>}
                    </ImageBackground>
                  </AppTouchableOpacity>
                  <View
                    style={{
                      // marginHorizontal: dimensionsCalculation(20),
                      marginBottom: dimensionsCalculation(20),
                      paddingHorizontal: dimensionsCalculation(20),
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flex: 1,
                    }}>
                    <AppTouchableOpacity
                      androidRippleColor={AppColors.androidRippleColor.black15}
                      style={[
                        // styles.bannerBtn,
                        {},
                      ]}
                      onPress={() => {
                        navigate('TechnicalExcellenceScreen');
                      }}>
                      <ImageBackground
                        source={require('../../assets/images/banner3.png')}
                        style={styles.squareBanner}>
                        <Text style={styles.squareBannerTxt}>
                          {Languages.TechnicalExcellence}
                        </Text>
                      </ImageBackground>
                    </AppTouchableOpacity>
                    <AppTouchableOpacity
                      androidRippleColor={AppColors.androidRippleColor.black15}
                      style={[
                        // styles.bannerBtn,
                        {
                          marginLeft: dimensionsCalculation(10),
                        },
                      ]}
                      onPress={() => {
                        this.takeTourModalRef?.current?.open();
                      }}>
                      <ImageBackground
                        source={require('../../assets/images/banner4.png')}
                        style={styles.squareBanner}>
                        <Text
                          style={[
                            styles.squareBannerTxt,
                            { color: AppColors.white },
                          ]}>
                          {Languages.TakeTour}
                        </Text>
                      </ImageBackground>
                    </AppTouchableOpacity>
                  </View>
                  <View style={styles.productsHeader}>
                    <Text style={styles.ourProducts}>
                      {Languages.ProdectsOffers}
                    </Text>
                    {false && (
                      <AppTouchableOpacity
                        androidRippleColor={
                          AppColors.androidRippleColor.black15
                        }
                        style={{}}
                        onPress={() => {
                          navigate('ProductsScreen', {
                            type: 'normal',
                          });
                        }}>
                        <Text
                          style={[
                            styles.ourProducts,
                            {
                              color: AppColors.mainText,
                              textDecorationLine: 'underline',
                            },
                          ]}>
                          {Languages.AllProducts}
                        </Text>
                      </AppTouchableOpacity>
                    )}
                  </View>
                </>
              }
              ListFooterComponent={
                <AppButton
                  text={Languages.AllProducts}
                  onPress={() => {
                    navigate('ProductsScreen', {
                      type: 'normal',
                    });
                  }}
                  androidRippleColor={AppColors.androidRippleColor.black15}
                  containerStyle={{
                    // backgroundColor: AppColors.white,
                    borderRadius: dimensionsCalculation(10),
                    width: '50%',
                    alignSelf: 'center',
                  }}
                  textStyle={{
                    fontFamily: fonts.primaryRegular,
                  }}
                />
              }
            />
          </View>
        )}
      </View>
    );
  }
}

const mapStateToProps = ({ auth }: QudsPaintsStore) => {
  return {
    user: auth?.user,
  };
};
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

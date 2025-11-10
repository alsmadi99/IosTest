import { AppIcon, Constants, fonts, Languages } from '../common';
import {
  Address,
  CartItem,
  CartScreenProps,
  CartScreenState,
  QudsPaintsStore,
  VerifyCodeScreenNavigateType,
} from '../common/Types';
import {
  AppButton,
  AppHeader,
  AppInput,
  AppTabBar,
  AppTouchableOpacity,
  LoadingButton,
  LoadingSpinner,
  PlusMinusButtons,
  SearchBar,
} from '../components';
import React, { Component, createRef, Dispatch, RefObject } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Dimensions,
  I18nManager,
  ScrollView,
  BackHandler,
  NativeEventSubscription,
  Alert,
  Keyboard,
  TextInput,
  KeyboardEvent,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import { AppColors } from '../theme';
import {
  configureNextAnimation,
  configureNextScaleAnimation,
  currencyFormatter,
  dimensionsCalculation,
  getStatusBarHeight,
  isRTL,
  ShowToast,
} from '../utils';
import StepIndicator from 'react-native-step-indicator';
import { goBack, navigate, push, replace, reset } from '../navigation';
import { AnyAction } from 'redux';
import { getCartAction, removeCartItemAction } from '../store/actions/CartActions';
import {
  addPhoneCall,
  addressesGetCall,
  cartCheckoutCall,
  checkoutCheckCall,
  checkProductCodeCall,
  getCitiesCall,
  getDeliveryFeesCall,
} from '../services/api/calls';
import Modal from 'react-native-modalbox';
import WebView from 'react-native-webview';
import PhoneInput from 'react-native-phone-input';

const styles = StyleSheet.create({
  enterCodeInput: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    borderRadius: dimensionsCalculation(10),
    textAlign: 'center',
    marginBottom: dimensionsCalculation(10),
  },
  surveyContainer: {
    backgroundColor: AppColors.white,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    borderRadius: dimensionsCalculation(30),
    padding: dimensionsCalculation(30),
    width: Dimensions.get('screen').width * 0.9,
    minHeight: Dimensions.get('screen').width * 0.45,
    alignSelf: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
    paddingTop: Constants.headerHeight + dimensionsCalculation(20),
    paddingBottom: Constants.tabBarHeight,
  },
  headerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: dimensionsCalculation(20),
  },
  activeTab: {
    backgroundColor: AppColors.secondary,
    borderRadius: dimensionsCalculation(20),
    width: '45%',
    paddingVertical: dimensionsCalculation(10),
  },
  inactiveTab: {
    backgroundColor: '#D9D9D9',
    borderRadius: dimensionsCalculation(20),
    width: '45%',
    paddingVertical: dimensionsCalculation(10),
  },
  tabText: {
    color: '#012241',
    fontFamily: fonts.primaryRegular,
    fontSize: dimensionsCalculation(13),
  },
  cartItemsList: {
    paddingTop: 0,
    padding: dimensionsCalculation(30),
  },
  cartItemContainer: {
    flexDirection: 'row',
    borderBottomColor: AppColors.secondary,
    borderBottomWidth: 0.2,
    paddingVertical: dimensionsCalculation(20),
  },
  cartItemSection: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    paddingLeft: dimensionsCalculation(10),
    top: -dimensionsCalculation(5),
  },
  cartItemImg: {
    width: dimensionsCalculation(80),
    height: dimensionsCalculation(80),
    marginRight: dimensionsCalculation(5),
  },
  cartItemName: {
    marginLeft: dimensionsCalculation(2),
    color: AppColors.mainText,
    fontSize: dimensionsCalculation(14),
    maxWidth: Dimensions.get('screen').width / 2 - dimensionsCalculation(100),
    textAlign: 'left',
  },
  cartItemColor: {
    color: '#9A9999',
    fontSize: dimensionsCalculation(12),
    marginLeft: dimensionsCalculation(2),
    marginTop: dimensionsCalculation(5),
    textAlign: 'left',
  },
  checkoutContainer: {
    flexGrow: 1,
    // paddingVertical: dimensionsCalculation(20),
  },
  checkoutHeader: {
    // flexDirection: 'row',
    // borderRadius: dimensionsCalculation(10),
    // borderColor: 'rgba(0,0,0,0.2)',
    // borderWidth: 1,
    // padding: dimensionsCalculation(5),
    // marginHorizontal: dimensionsCalculation(40),
    // marginBottom: dimensionsCalculation(40),
  },
  paymentOption: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: dimensionsCalculation(10),
    borderColor: 'rgba(0,0,0,0.2)',
    borderWidth: 1,
    marginHorizontal: dimensionsCalculation(20),
    paddingHorizontal: dimensionsCalculation(10),
    paddingVertical: dimensionsCalculation(5),
    borderRadius: dimensionsCalculation(5),
  },
  paymentOptionImg: {
    marginLeft: dimensionsCalculation(10),
    height: dimensionsCalculation(40),
    width: dimensionsCalculation(60),
  },
  paymentOptionTxt: {
    color: AppColors.black,
    fontSize: dimensionsCalculation(15),
    marginLeft: dimensionsCalculation(10),
  },
  contactInfo: {
    paddingHorizontal: dimensionsCalculation(20),
  },
  inputHeader: {
    color: AppColors.mainText,
    marginBottom: dimensionsCalculation(10),
    marginLeft: dimensionsCalculation(10),
  },
  orderStateView: {
    paddingLeft: dimensionsCalculation(10),
    alignItems: 'flex-start',
    width: Dimensions.get('screen').width - dimensionsCalculation(100),
    marginBottom: dimensionsCalculation(10),
  },
  currentStepFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    paddingHorizontal: dimensionsCalculation(20),
  },
  currentStep: {
    color: AppColors.mainText,
    marginRight: dimensionsCalculation(1),
    fontSize: dimensionsCalculation(10),
  },
  footerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: dimensionsCalculation(20),
    paddingVertical: dimensionsCalculation(10),
  },
  footerBtnText: {
    fontFamily: fonts.primaryBold,
    fontSize: dimensionsCalculation(14),
    color: AppColors.white,
  },
  modalStyle: {
    width: '100%',
    height: '100%',
    flex: 1,
    backgroundColor: AppColors.transparent,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: AppColors.transparent,
    zIndex: 0,
  },
  addressesContainer: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    backgroundColor: AppColors.white,
    borderTopLeftRadius: dimensionsCalculation(40),
    borderTopRightRadius: dimensionsCalculation(40),
    minHeight: Dimensions.get('screen').width,
    maxHeight: Dimensions.get('screen').height * 0.5,
  },
  selectAddress: {
    fontFamily: fonts.primaryBold,
    textAlign: 'center',
    fontSize: dimensionsCalculation(17),
    color: AppColors.mainText,
    paddingVertical: dimensionsCalculation(15),
    backgroundColor: AppColors.white,
  },
  addnewAddress: {
    backgroundColor: AppColors.secondary,
    elevation: 3,
    height: dimensionsCalculation(40),
    borderRadius: dimensionsCalculation(50),
    alignSelf: 'center',
    width: '50%',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: dimensionsCalculation(15),
    borderBottomWidth: 0.4,
    borderBottomColor: AppColors.mainText,
    borderRadius: 0,
  },
  address: {
    color: AppColors.mainText,
    fontSize: dimensionsCalculation(16),
    textAlign: 'left',
    marginLeft: dimensionsCalculation(10),
  },
});

class CartScreen extends Component<CartScreenProps, CartScreenState> {
  backhandler = null as NativeEventSubscription;
  addressesModalRef: RefObject<Modal> = null;
  checkoutModalRef: RefObject<Modal> = null;
  codeModalRef: RefObject<Modal> = null;
  phoneModalRef: RefObject<Modal> = null;
  phone = null as PhoneInput;
  timeout = null;
  constructor(props: CartScreenProps) {
    super(props);
    this.state = {
      isLoading: true,
      currentStep: 0,
      paymentOption: 3,
      isAddressesFetching: true,
      addresses: [],
      selectedAddressID: null,
      area: null,
      code: '',
      isCheckingCode: false,
      isKeyboardShown: false,
      phone: '',
      isAddingPhone: false,
      isValidPhone: true,
      isAddBtnClicked: false,
    };
    this.addressesModalRef = createRef();
    this.checkoutModalRef = createRef();
    this.codeModalRef = createRef();
    this.phoneModalRef = createRef();
  }

  componentDidMount = () => {
    this.cartGet();
    this.props.navigation.addListener('focus', this.navigationFocus);
    this.props.navigation.addListener('blur', this.navigationBlur);
  };

  navigationFocus = () => {
    this.backhandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackBtn,
    );
  };

  navigationBlur = () => {
    this.backhandler?.remove();
  };

  handleBackBtn = () => {
    if (this.state.currentStep == 0) return false;
    configureNextAnimation();
    this.setState(
      {
        currentStep: this.state.currentStep - 1,
      },
      () => { },
    );
    return true;
  };

  cartGet = () => {
    this.setState(
      {
        isLoading: true,
      },
      async () => {
        await this.props.getCart();
        configureNextScaleAnimation();
        this.setState(
          {
            isLoading: false,
          },
          () => { },
        );
      },
    );
  };

  getUserAddresses = async () => {
    const result = await addressesGetCall();
    configureNextScaleAnimation();
    if (result?.data?.address) {
      this.setState(
        {
          addresses: result?.data?.address,
          isAddressesFetching: false,
        },
        () => { },
      );
    } else {
      this.setState(
        {
          isAddressesFetching: false,
        },
        () => { },
      );
    }
  };

  componentWillUnmount = () => {
    this.backhandler?.remove();
  };

  renderHeader = () => {
    const { currentStep } = this.state;
    return (
      <View style={{}}>
        {/* <SearchBar /> */}
        <View style={styles.headerStyle}>
          {/* <AppButton
            onPress={() => {}}
            containerStyle={
              currentStep == 2 ? styles.activeTab : styles.inactiveTab
            }
            disabled={currentStep <= 2}
            adjustsFontSizeToFit
            textStyle={styles.tabText}
            text={Languages.TrackYOrder}
          /> */}
        </View>
      </View>
    );
  };

  removeCartItem = (item: CartItem) => {
    this.setState(
      {
        isLoading: true,
      },
      async () => {
        await this.props.removeCartItem(item?.item?.id);
        configureNextScaleAnimation();
        this.setState(
          {
            isLoading: false,
          },
          () => { },
        );
      },
    );
  };

  renderCartItem = ({ item, index }: { item: CartItem; index: number }) => {
    const {
      cart: { items },
    } = this.props;
    return (
      <View
        style={[
          styles.cartItemContainer,
          index == items.length - 1 && { borderBottomWidth: 0 },
        ]}>
        <AppTouchableOpacity
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
          style={styles.cartItemSection}>
          <FastImage
            source={{
              uri: item?.item?.image,
              // ?.replace(
              //   `${item?.item?.productid}_540x255.jpg`,
              //   `${item?.item?.productid}_540x453.png`,
              // ) ?? '',
            }}
            fallback
            defaultSource={require('../../assets/images/qudsLogo.png')}
            style={styles.cartItemImg}
          />
          <View
            style={{
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                flex: 1,
              }}>
              <Text numberOfLines={3} style={styles.cartItemName}>
                {item.item?.productname}
              </Text>
              {item?.item?.colorname && (
                <Text style={styles.cartItemColor}>
                  {item?.item?.colorname ?? 'blue'}
                </Text>
              )}
              {item?.item?.sizename && (
                <Text style={styles.cartItemColor}>
                  {item?.item?.sizename ?? 'Large'}
                </Text>
              )}
            </View>
            <PlusMinusButtons
              item={item}
              value={parseFloat(item?.item?.quantity)}
              onPlus={(newValue) => { }}
              onMinus={(newValue) => { }}
              onLoading={(isLoading) => {
                this.setState(
                  {
                    isLoading,
                  },
                  () => { },
                );
              }}
            />
          </View>
        </AppTouchableOpacity>
        <View style={[styles.cartItemSection, styles.rightSection]}>
          <View style={{ paddingTop: dimensionsCalculation(5) }}>
            {/* <Text
              style={{
                fontSize: dimensionsCalculation(15),
                textDecorationLine: 'line-through',
              }}>
              {`${item?.item?.price} ${Languages.JOD}`}
            </Text> */}
            {!item?.item?.prevent && item?.item?.price != '0' && (
              <Text
                style={{
                  color: AppColors.mainText,
                  fontSize: dimensionsCalculation(17),
                }}>
                {`${item?.item?.price} ${Languages.JOD}`}
              </Text>
            )}
          </View>
          <AppTouchableOpacity
            style={{ overflow: 'visible', padding: dimensionsCalculation(5) }}
            borderless
            androidRippleColor={AppColors.androidRippleColor.black15}
            onPress={() => {
              this.removeCartItem(item);
            }}>
            <AppIcon
              name="close"
              type="FontAwesome"
              color={AppColors.secondary}
              size={dimensionsCalculation(20)}
            />
          </AppTouchableOpacity>
        </View>
      </View>
    );
  };

  renderCart = () => {
    const {
      cart: { items, total },
    } = this.props;
    return (
      <FlatList
        contentContainerStyle={styles.cartItemsList}
        keyExtractor={(item, index) => index.toString()}
        data={items}
        renderItem={this.renderCartItem}
        ListFooterComponent={
          !total || items.findIndex((x) => x.item.prevent) != -1 ? null : (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontFamily: fonts.primaryBold,
                  fontSize: dimensionsCalculation(20),
                  color: AppColors.mainText,
                }}>
                {Languages.Total}
              </Text>
              <Text
                style={{
                  fontFamily: fonts.primaryBold,
                  fontSize: dimensionsCalculation(20),
                  color: AppColors.secondary,
                }}>
                {`${total} ${Languages.JOD}`}
              </Text>
            </View>
          )
        }
      />
    );
  };

  handleCheckout = () => {
    const { cart } = this.props;
    const { selectedAddressID } = this.state;
    this.setState(
      {
        isLoading: true,
      },
      async () => {
        const result = await cartCheckoutCall({
          // cartid: cart?.cartid,
          addressid: selectedAddressID,
          // getway: 1,
        });
        if (result?.data) {
          replace('OrderDetailsScreen', {
            order: {
              order: {
                id: result?.data?.orderid,
              },
            },
            isCartCheckout: true,
          });
          ShowToast(Languages.PlacedSuccessfully, 'success');
          // this.setState(
          //   {
          //     isLoading: false,
          //     currentStep: 2,
          //   },
          //   () => {},
          // );
          this.props.getCart();
        } else {
          ShowToast(Languages.Oops);
          this.setState(
            {
              isLoading: false,
            },
            () => { },
          );
        }
      },
    );
  };

  getDelivery = async (areaid) => {
    const result = await getCitiesCall();
    if (result?.data) {
      result?.data?.map((x) => {
        x?.areas?.map((xx) => {
          if (xx?.id == areaid) {
            this.setState(
              {
                area: x,
              },
              () => { },
            );
          }
        });
      });
    } else {
      goBack();
      ShowToast(Languages.Oops);
    }
  };

  renderCheckout = () => {
    const { cart } = this.props;
    const { paymentOption, addresses, area, selectedAddressID } = this.state;
    return (
      <ScrollView contentContainerStyle={styles.checkoutContainer}>
        <AppButton
          onPress={() => {
            this.addressesModalRef?.current?.open();
          }}
          text={
            addresses?.find((x) => x.address?.id == selectedAddressID)?.address
              ?.location ?? Languages.SelectAddress
          }
          androidRippleColor={AppColors.white}
          containerStyle={{
            backgroundColor: AppColors.secondary,
            marginHorizontal: dimensionsCalculation(20),
            marginBottom:
              selectedAddressID &&
                !!cart?.total &&
                cart.items.findIndex((x) => x.item.prevent) == -1
                ? 0
                : dimensionsCalculation(10),
            paddingVertical: dimensionsCalculation(10),
          }}
        />
        {selectedAddressID &&
          cart.items.findIndex((x) => x.item.prevent) == -1 && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginHorizontal: dimensionsCalculation(20),
                marginTop: dimensionsCalculation(10),
              }}>
              <Text
                style={{
                  fontFamily: fonts.primaryBold,
                  fontSize: dimensionsCalculation(16),
                  color: AppColors.black,
                }}>
                {Languages.DeliveryFees}
              </Text>
              <Text
                style={{
                  fontFamily: fonts.primaryBold,
                  fontSize: dimensionsCalculation(16),
                  color: AppColors.mainText,
                }}>
                {area?.shipping
                  ? area?.shipping + ' ' + Languages.JOD
                  : isRTL
                    ? 'مجانا'
                    : 'Free'}
              </Text>
            </View>
          )}
        {selectedAddressID &&
          !!cart?.total &&
          cart.items.findIndex((x) => x.item.prevent) == -1 && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginHorizontal: dimensionsCalculation(20),
                marginTop: dimensionsCalculation(10),
                marginBottom: dimensionsCalculation(10),
              }}>
              <Text
                style={{
                  fontFamily: fonts.primaryBold,
                  fontSize: dimensionsCalculation(16),
                  color: AppColors.black,
                }}>
                {Languages.Total}
              </Text>
              <Text
                style={{
                  fontFamily: fonts.primaryBold,
                  fontSize: dimensionsCalculation(16),
                  color: AppColors.mainText,
                }}>
                {cart?.total + (area?.shipping ?? 0) + ' ' + Languages.JOD}
              </Text>
            </View>
          )}
        <View style={styles.checkoutHeader}>
          <AppTouchableOpacity
            androidRippleColor={AppColors.androidRippleColor.black15}
            style={styles.paymentOption}
            onPress={() => {
              configureNextAnimation();
              this.setState(
                {
                  paymentOption: 3,
                },
                () => { },
              );
            }}>
            <AppIcon
              type="MaterialIcons"
              name={
                paymentOption == 3 ? 'check-box' : 'check-box-outline-blank'
              }
              size={dimensionsCalculation(25)}
              color={
                paymentOption == 3 ? AppColors.secondary : `rgba(0,0,0,0.6)`
              }
            />
            <FastImage
              source={require('../../assets/images/cod2.png')}
              style={[
                styles.paymentOptionImg,
                paymentOption == 3 && { opacity: 1 },
              ]}
              resizeMode="contain"
            />
            <Text style={styles.paymentOptionTxt}>{Languages.COD}</Text>
          </AppTouchableOpacity>
          <AppTouchableOpacity
            disabled
            androidRippleColor={AppColors.androidRippleColor.black15}
            style={styles.paymentOption}
            onPress={() => {
              configureNextScaleAnimation();
              this.setState(
                {
                  paymentOption: 4,
                },
                () => { },
              );
            }}>
            <AppIcon
              type="MaterialIcons"
              name={
                paymentOption == 4 ? 'check-box' : 'check-box-outline-blank'
              }
              size={dimensionsCalculation(25)}
              color={
                paymentOption == 4 ? AppColors.secondary : `rgba(0,0,0,0.6)`
              }
            />
            <FastImage
              source={require('../../assets/images/zain2.png')}
              style={[
                styles.paymentOptionImg,
                paymentOption == 4 && { opacity: 1 },
              ]}
              resizeMode="contain"
            />
            <Text style={styles.paymentOptionTxt}>{Languages.Zain}</Text>
          </AppTouchableOpacity>
          <AppTouchableOpacity
            androidRippleColor={AppColors.androidRippleColor.black15}
            disabled
            style={styles.paymentOption}
            onPress={() => {
              configureNextScaleAnimation();
              this.setState(
                {
                  paymentOption: 1,
                },
                () => { },
              );
            }}>
            <AppIcon
              type="MaterialIcons"
              name={
                paymentOption == 1 ? 'check-box' : 'check-box-outline-blank'
              }
              size={dimensionsCalculation(25)}
              color={
                paymentOption == 1 ? AppColors.secondary : `rgba(0,0,0,0.6)`
              }
            />
            <FastImage
              source={require('../../assets/images/visa2.png')}
              style={[
                styles.paymentOptionImg,
                paymentOption == 1 && { opacity: 1 },
              ]}
              resizeMode="contain"
            />
            <Text style={styles.paymentOptionTxt}>{Languages.Credit}</Text>
          </AppTouchableOpacity>
          <AppTouchableOpacity
            disabled
            androidRippleColor={AppColors.androidRippleColor.black15}
            style={styles.paymentOption}
            onPress={() => {
              configureNextScaleAnimation();
              this.setState(
                {
                  paymentOption: 2,
                },
                () => { },
              );
            }}>
            <AppIcon
              type="MaterialIcons"
              name={
                paymentOption == 2 ? 'check-box' : 'check-box-outline-blank'
              }
              size={dimensionsCalculation(25)}
              color={
                paymentOption == 2 ? AppColors.secondary : `rgba(0,0,0,0.6)`
              }
            />
            <FastImage
              source={require('../../assets/images/paypal2.png')}
              style={[
                styles.paymentOptionImg,
                paymentOption == 2 && { opacity: 1 },
              ]}
              resizeMode="contain"
            />
            <Text style={styles.paymentOptionTxt}>{Languages.Paypal}</Text>
          </AppTouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  renderOrderTracking = () => {
    const labels = [
      Languages.OrderPlaced,
      Languages.ProcessOrder,
      Languages.ShippingOrder,
      Languages.OrderDelivered,
    ];
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

    return (
      <ScrollView
        contentContainerStyle={[
          styles.checkoutContainer,
          { paddingHorizontal: dimensionsCalculation(20) },
        ]}>
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
                      props.position == 3
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
              return (
                <View style={styles.orderStateView}>
                  <Text
                    style={{
                      textAlign: 'left',
                      color: position == 3 ? AppColors.secondary : '#676767',
                      fontSize:
                        position == 3
                          ? dimensionsCalculation(16)
                          : dimensionsCalculation(13),
                      fontFamily:
                        position == 3
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
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book. It has survived not only five centuries,
                    but also the leap into electronic typesetting, remaining
                    essentially unchanged. It was popularised in the 1960s with
                    the release of Letraset sheets containing Lorem Ipsum
                    passages, and more recently with desktop publishing software
                    like Aldus PageMaker including versions of Lorem Ipsum.
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
            }}
            currentPosition={3}
            labels={labels}
          />
        </View>
      </ScrollView>
    );
  };

  renderFooter = () => {
    const { currentStep, paymentOption, selectedAddressID } = this.state;
    const { cart } = this.props;
    return (
      <View style={{}}>
        <View style={styles.currentStepFooter}>
          <Text style={styles.currentStep}>{`${currentStep + 1}/${2}`}</Text>
          <AppIcon
            name={isRTL ? 'chevron-thin-left' : 'chevron-thin-right'}
            color={AppColors.mainText}
            size={dimensionsCalculation(10)}
            type="Entypo"
          />
        </View>
        <View style={styles.footerStyle}>
          {currentStep == 0 ? (
            <AppButton
              onPress={() => {
                navigate('ProductsScreen', {
                  type: 'normal',
                });
              }}
              containerStyle={[
                styles.activeTab,
                {
                  height: dimensionsCalculation(45),
                  width: '40%',
                },
              ]}
              text={Languages.ContinueShopping}
              textStyle={styles.footerBtnText}
              adjustsFontSizeToFit
            />
          ) : (
            <View style={{}} />
          )}
          <AppButton
            onPress={async () => {
              switch (currentStep) {
                case 0: {
                  if (this.props.user.phone?.trim()) {
                    configureNextAnimation();
                    this.setState(
                      {
                        currentStep: currentStep + 1,
                      },
                      () => { },
                    );
                  } else {
                    this.phoneModalRef?.current?.open();
                  }
                  break;
                }
                case 1: {
                  // this.addressesModalRef?.current?.open();
                  if (paymentOption != null && selectedAddressID) {
                    this.setState(
                      {
                        isLoading: true,
                      },
                      async () => {
                        const result = await checkoutCheckCall();
                        if (result?.data) {
                          if (result?.data?.result == 3) {
                            if (paymentOption < 3) {
                              this.setState(
                                {
                                  isLoading: true,
                                },
                                () => {
                                  setTimeout(() => {
                                    this.checkoutModalRef?.current?.open();
                                  }, 500);
                                },
                              );
                            } else {
                              this.handleCheckout();
                            }
                          } else if (result?.data?.result < 3) {
                            this.cartGet();
                            this.codeModalRef?.current?.open();
                            this.setState(
                              {
                                isLoading: false,
                              },
                              () => { },
                            );
                          } else {
                            this.cartGet();
                            this.setState(
                              {
                                isLoading: false,
                              },
                              () => { },
                            );
                            return ShowToast(Languages.NeedCustomerSupport);
                          }
                        } else {
                          ShowToast(Languages.Oops);
                          this.setState(
                            {
                              isLoading: false,
                            },
                            () => { },
                          );
                        }
                      },
                    );
                  } else {
                    ShowToast(Languages.SelectPaymentAddress);
                  }

                  break;
                }
                case 2: {
                  replace('ContactUsScreen');
                  break;
                }
              }
            }}
            containerStyle={[
              styles.activeTab,
              {
                height: dimensionsCalculation(45),
                backgroundColor: AppColors.primary,
                width: '40%',
              },
            ]}
            text={
              currentStep == 0
                ? Languages.Checkout
                : currentStep == 1
                  ? Languages.PlaceOrder
                  : Languages.ContactUS
            }
            textStyle={styles.footerBtnText}
          />
        </View>
      </View>
    );
  };

  checkCode = async () => {
    const { code, paymentOption } = this.state;
    if (code?.length == 0) return Alert.alert('', Languages.EnterCode);
    this.setState(
      {
        isCheckingCode: true,
      },
      async () => {
        const result = await checkProductCodeCall({
          code,
        });
        if (result?.data?.result == 1) {
          this.codeModalRef.current?.close();
          if (paymentOption < 3) {
            this.setState(
              {
                isLoading: true,
              },
              () => {
                setTimeout(() => {
                  this.checkoutModalRef?.current?.open();
                }, 500);
              },
            );
          } else {
            this.handleCheckout();
          }
        } else {
          ShowToast(Languages.IncorrectCode);
        }
        this.setState(
          {
            isCheckingCode: false,
          },
          () => { },
        );
      },
    );
  };

  renderCodeModal = () => {
    const { isLoading, code, isKeyboardShown, isCheckingCode } = this.state;
    return (
      <Modal
        ref={this.codeModalRef}
        statusBarTranslucent
        backdrop={false}
        backButtonClose
        swipeToClose={false}
        coverScreen
        onClosed={() => { }}
        style={[styles.modalStyle, { justifyContent: 'center' }]}>
        <AppTouchableOpacity
          disabled={isCheckingCode}
          androidRippleColor={AppColors.transparent}
          style={[
            styles.modalBackdrop,
            { backgroundColor: 'rgba(255,255,255,0.1)' },
          ]}
          activeOpacity={1}
          onPress={() => {
            configureNextScaleAnimation();
            if (isKeyboardShown) {
              Keyboard.dismiss();
            } else {
              this.codeModalRef?.current?.close();
            }
          }}
        />
        {isLoading && <LoadingSpinner overlay />}
        <View
          style={[
            styles.surveyContainer,
            {
              marginBottom: isKeyboardShown ? dimensionsCalculation(100) : 0,
              minHeight: null,
              padding: dimensionsCalculation(10),
              borderRadius: dimensionsCalculation(10),
            },
          ]}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: dimensionsCalculation(13),
              color: AppColors.mainText,
              marginBottom: dimensionsCalculation(10),
              marginHorizontal: dimensionsCalculation(5),
            }}>
            {'*' + Languages.NeedCustomerSupport}
          </Text>
          <TextInput
            placeholder={Languages.TypeCodeHere}
            style={styles.enterCodeInput}
            value={code}
            onChangeText={(code) => {
              this.setState({ code }, () => { });
            }}
            onFocus={() => {
              configureNextAnimation();
              this.setState(
                {
                  isKeyboardShown: true,
                },
                () => { },
              );
            }}
            onBlur={() => {
              configureNextAnimation();
              this.setState(
                {
                  isKeyboardShown: false,
                },
                () => { },
              );
            }}
          />
          <LoadingButton
            isLoading={isCheckingCode}
            onPress={this.checkCode}
            text={Languages.CheckCode}
            textColor={AppColors.white}
            androidRippleColor={AppColors.androidRippleColor.white}
            backgroundColor={AppColors.primary}
            containerStyle={{ marginBottom: 0 }}
          />
        </View>
      </Modal>
    );
  };

  addPhone = () => {
    const { phone, isValidPhone, currentStep } = this.state;
    this.setState(
      {
        isAddBtnClicked: true,
      },
      () => {
        if (phone == '') return ShowToast(Languages.EnterPhone);
        if (phone?.length < 10) return ShowToast(Languages.PhoneTooShort);
        if (!isValidPhone) return ShowToast(Languages.IncorrectPhone);
        this.setState(
          {
            isAddingPhone: true,
          },
          async () => {
            const result = await addPhoneCall({
              phone,
            });
            if (result.data?.result == 1) {
              this.phoneModalRef.current.close();
              push('VerifyOtpScreen', {
                type: VerifyCodeScreenNavigateType.checkout,
                extraAction: () =>
                  this.setState(
                    {
                      currentStep: currentStep + 1,
                    },
                    () => { },
                  ),
              });
            } else {
              ShowToast(Languages.PhoneIsUsed);
            }
            this.setState(
              {
                isAddingPhone: false,
              },
              () => { },
            );
          },
        );
      },
    );
  };

  renderPhoneModal = () => {
    const {
      isLoading,
      isKeyboardShown,
      phone,
      isAddBtnClicked,
      isValidPhone,
      isAddingPhone,
    } = this.state;
    return (
      <Modal
        ref={this.phoneModalRef}
        statusBarTranslucent
        backdrop={false}
        backButtonClose
        swipeToClose={false}
        coverScreen
        onClosed={() => {
          this.setState(
            {
              phone: '',
              isAddBtnClicked: false,
              isAddingPhone: false,
              isValidPhone: true,
            },
            () => { },
          );
        }}
        style={[styles.modalStyle, { justifyContent: 'center' }]}>
        <AppTouchableOpacity
          disabled={isAddingPhone}
          androidRippleColor={AppColors.transparent}
          style={[
            styles.modalBackdrop,
            { backgroundColor: 'rgba(255,255,255,0.1)' },
          ]}
          activeOpacity={1}
          onPress={() => {
            configureNextScaleAnimation();
            if (isKeyboardShown) {
              Keyboard.dismiss();
            } else {
              this.phoneModalRef?.current?.close();
            }
          }}
        />
        {isLoading && <LoadingSpinner overlay />}
        <View
          style={[
            styles.surveyContainer,
            {
              marginBottom: isKeyboardShown ? dimensionsCalculation(100) : 0,
              minHeight: null,
              padding: dimensionsCalculation(10),
              borderRadius: dimensionsCalculation(10),
            },
          ]}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: dimensionsCalculation(13),
              color: AppColors.mainText,
              marginBottom: dimensionsCalculation(10),
              marginHorizontal: dimensionsCalculation(5),
            }}>
            {Languages.NeedPhone}
          </Text>
          {/* <TextInput
            placeholder={Languages.Phone}
            keyboardType="number-pad"
            style={styles.enterCodeInput}
            value={phone}
            onChangeText={(phone) => {
              this.setState({phone}, () => {});
            }}
          /> */}
          <AppInput
            textColor={AppColors.inputText}
            onChangeText={(phone) => {
              this.setState({ phone }, () => {
                this.timeout && clearTimeout(this.timeout);
                this.phone?.setValue(`+962${phone}`);
                this.timeout = setTimeout(() => {
                  this.setState(
                    {
                      isValidPhone: this.phone?.isValidNumber(),
                    },
                    () => { },
                  );
                }, 500);
              });
            }}
            editable={!isLoading}
            placeholder={Languages.PhonePlaceholder}
            value={phone}
            keyboardType="phone-pad"
            returnKeyType="next"
            showError={isAddBtnClicked && (phone?.length < 10 || !isValidPhone)}
            errorMsg={
              phone?.length == 0
                ? Languages.Required
                : !isValidPhone
                  ? Languages.EnterValidPhone
                  : Languages.PhoneTooShort
            }
            onSubmitEditing={() => {
              setTimeout(() => {
                this.addPhone();
              }, 550);
            }}
            containerStyle={{
              marginBottom: dimensionsCalculation(10),
            }}
            onFocus={() => {
              configureNextAnimation();
              this.setState(
                {
                  isKeyboardShown: true,
                },
                () => { },
              );
            }}
            onBlur={() => {
              configureNextAnimation();
              this.setState(
                {
                  isKeyboardShown: false,
                },
                () => { },
              );
            }}
          />
          <LoadingButton
            isLoading={isAddingPhone}
            onPress={this.addPhone}
            text={Languages.Submit}
            textColor={AppColors.white}
            androidRippleColor={AppColors.androidRippleColor.white}
            backgroundColor={AppColors.primary}
            containerStyle={{
              marginBottom: 0,
              borderRadius: dimensionsCalculation(5),
            }}
          />
        </View>
      </Modal>
    );
  };

  renderAddress = ({ item, index }: { item: Address; index: number }) => {
    const { addresses, selectedAddressID, paymentOption } = this.state;
    return (
      <AppTouchableOpacity
        androidRippleColor={AppColors.androidRippleColor.black15}
        onPress={() => {
          this.setState(
            {
              selectedAddressID: item?.address?.id,
            },
            () => {
              this.addressesModalRef?.current?.close();
              this.getDelivery(item?.address?.areaid);
            },
          );
        }}
        style={[
          styles.addressContainer,
          index == addresses?.length - 1 && { borderBottomWidth: 0 },
        ]}>
        <AppIcon
          name="map-marker"
          type="FontAwesome"
          size={dimensionsCalculation(16)}
          color={AppColors.mainText}
        />
        <Text style={styles.address}>{item?.address?.location}</Text>
      </AppTouchableOpacity>
    );
  };

  renderAdressesModal = () => {
    const { isAddressesFetching, addresses, paymentOption } = this.state;
    return (
      <Modal
        ref={this.addressesModalRef}
        statusBarTranslucent
        backdrop
        backdropPressToClose={false}
        backdropColor={AppColors.white}
        backdropOpacity={0.3}
        backButtonClose
        swipeArea={Dimensions.get('screen').height * 0.5}
        swipeThreshold={5}
        coverScreen
        style={styles.modalStyle}
        onOpened={() => {
          this.setState(
            {
              selectedAddressID: null,
            },
            () => { },
          );
          if (addresses?.length == 0) {
            this.getUserAddresses();
          }
        }}>
        <AppTouchableOpacity
          androidRippleColor={AppColors.transparent}
          activeOpacity={1}
          style={styles.modalBackdrop}
          onPress={() => {
            this.addressesModalRef?.current?.close();
          }}
        />
        <View style={styles.addressesContainer}>
          {isAddressesFetching && <LoadingSpinner overlay />}
          <FlatList
            stickyHeaderIndices={[0]}
            ListHeaderComponent={
              <Text style={styles.selectAddress}>
                {Languages.SelectAddAddress}
              </Text>
            }
            ListEmptyComponent={
              isAddressesFetching ? null : (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                  }}>
                  <AppButton
                    onPress={() => {
                      this.addressesModalRef?.current?.close();
                      setTimeout(() => {
                        push('MyAddressesScreen', {
                          onAddressAdded: () => {
                            goBack();
                            this.addressesModalRef?.current?.open();
                            this.setState(
                              {
                                isAddressesFetching: true,
                              },
                              () => {
                                this.getUserAddresses();
                              },
                            );
                          },
                        });
                      }, 300);
                    }}
                    androidRippleColor={AppColors.androidRippleColor.white}
                    textColor={AppColors.white}
                    text={Languages.AddNewAddress}
                    containerStyle={styles.addnewAddress}
                  />
                </View>
              )
            }
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: dimensionsCalculation(30),
              paddingBottom: dimensionsCalculation(15),
            }}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            data={addresses}
            renderItem={this.renderAddress}
            ListFooterComponent={
              isAddressesFetching || addresses?.length == 0 ? null : (
                <AppButton
                  onPress={() => {
                    this.addressesModalRef?.current?.close();
                    setTimeout(() => {
                      push('MyAddressesScreen', {
                        onAddressAdded: () => {
                          goBack();
                          this.addressesModalRef?.current?.open();
                          this.setState(
                            {
                              isAddressesFetching: true,
                            },
                            () => {
                              this.getUserAddresses();
                            },
                          );
                        },
                      });
                    }, 300);
                  }}
                  androidRippleColor={AppColors.androidRippleColor.white}
                  textColor={AppColors.white}
                  text={Languages.AddNewAddress}
                  containerStyle={styles.addnewAddress}
                />
              )
            }
          />
        </View>
      </Modal>
    );
  };

  renderCheckoutModal = () => {
    const { paymentOption, selectedAddressID } = this.state;
    return (
      <Modal
        ref={this.checkoutModalRef}
        statusBarTranslucent
        backdrop={false}
        backButtonClose={__DEV__}
        swipeToClose={false}
        coverScreen
        style={styles.modalStyle}
        onClosed={() => {
          this.setState(
            {
              isLoading: false,
            },
            () => { },
          );
        }}>
        <View
          style={{
            flex: 1,
            backgroundColor: AppColors.white,
          }}>
          <AppTouchableOpacity
            androidRippleColor={AppColors.androidRippleColor.black15}
            style={{
              overflow: 'visible',
              padding: dimensionsCalculation(7),
              alignSelf: 'flex-start',
              marginTop: getStatusBarHeight(),
              zIndex: 150,
            }}
            borderless
            onPress={() => {
              Alert.alert(Languages.Confirm, Languages.ConfirmCancelPayment, [
                {
                  text: Languages.No,
                },
                {
                  text: Languages.Yes,
                  onPress: () => {
                    this.checkoutModalRef?.current?.close();
                  },
                },
              ]);
            }}>
            <AppIcon
              name="closecircle"
              type="AntDesign"
              size={dimensionsCalculation(26)}
              color={AppColors.inputText}
            />
          </AppTouchableOpacity>
          <WebView
            style={{
              flex: 1,
            }}
            injectedJavaScript={`const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=0.5, maximum-scale=0.5, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `}
            scalesPageToFit={false}
            source={{
              uri:
                paymentOption == 0 || paymentOption == 1
                  ? `${Constants.url}HyperPay/Start?addressid=${selectedAddressID}&token=${this.props.user?.token}&plang=${Languages.LangID}`
                  : `${Constants.url}Paypal/Start?addressid=${selectedAddressID}&token=${this.props.user?.token}&plang=${Languages.LangID}`,
            }}
            onMessage={(e) => {
              const { data }: { data: any } = e.nativeEvent;
              let response = data;
              try {
                response = JSON.parse(
                  data
                    ?.replace(/\'/g, '"')
                    ?.replace(/{/g, '{"')
                    ?.replace(/\s/g, '')
                    ?.replace(/:/g, '":')
                    ?.replace(/,/g, ',"')
                    ?.replace(/,\s/g, ',"'),
                );
              } catch (error) { }
              this.checkoutModalRef?.current?.close();
              setTimeout(() => {
                if (response?.result == 1) {
                  this.props.getCart();
                  ShowToast(Languages.OrderPlaced, 'success');
                  replace('OrderDetailsScreen', {
                    order: {
                      order: {
                        id: response?.orderid,
                      },
                    },
                    isCartCheckout: true,
                  });
                } else {
                  ShowToast(Languages.TransactionFailed);
                }
              }, 500);
            }}
          />
        </View>
      </Modal>
    );
  };

  render() {
    const { isLoading, currentStep } = this.state;
    const {
      user,
      cart: { items },
      isCartFetching,
    } = this.props;
    return (
      <View style={styles.container}>
        <AppHeader
          onBackPress={() => {
            if (currentStep > 0) {
              configureNextAnimation();
              this.setState(
                {
                  currentStep: 0,
                },
                () => { },
              );
            } else {
              goBack();
            }
          }}
          activeScreen="cart"
        />
        <AppTabBar />
        {items?.length == 0 ? (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text
              style={{
                color: AppColors.mainText,
                fontFamily: fonts.primaryBold,
                fontSize: dimensionsCalculation(20),
                textAlign: 'center',
                marginHorizontal: dimensionsCalculation(20),
              }}>
              {Languages.YourCartIsEmpty}
            </Text>
          </View>
        ) : (
          <>
            {isLoading && <LoadingSpinner overlay />}
            <PhoneInput
              ref={(ref) => {
                this.phone = ref;
              }}
              style={{
                position: 'absolute',
                top: -250,
                left: -250,
                opacity: 0,
                zIndex: -1,
              }}
              allowZeroAfterCountryCode
              // value={this.state.phone}
              // textProps={{
              //   value: this.state.phone,
              // }}
              initialCountry={'jo'}
            />
            {this.renderAdressesModal()}
            {this.renderPhoneModal()}
            {this.renderCodeModal()}
            {this.renderCheckoutModal()}
            {this.renderHeader()}
            {currentStep == 0 && this.renderCart()}
            {currentStep == 1 && this.renderCheckout()}
            {currentStep == 2 && this.renderOrderTracking()}
            {this.renderFooter()}
          </>
        )}
      </View>
    );
  }
}

const mapStateToProps = ({ auth, cart }: QudsPaintsStore) => {
  return {
    user: auth.user,
    cart: cart,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return {
    getCart: () => {
      return dispatch(getCartAction() as any);
    },
    removeCartItem: (productid) => {
      return dispatch(removeCartItemAction(productid) as any);
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CartScreen);

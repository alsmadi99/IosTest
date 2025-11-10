import { Constants, fonts, Languages } from '../common';
import AppIcon from '../components/AppIcon';
import {
  Color,
  IconType,
  Product,
  ProductDetailsScreenProps,
  ProductDetailsScreenState,
  QudsPaintsStore,
  Size,
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
  ProductCard,
} from '../components';
import React, { Component, createRef, RefObject } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  I18nManager,
  FlatList,
  Dimensions,
  Linking,
  TextInput,
  Keyboard,
  KeyboardEvent,
  Image,
  Animated,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modalbox';
import { connect } from 'react-redux';
import { AppColors } from '../theme';
import {
  configureNextAnimation,
  configureNextScaleAnimation,
  dimensionsCalculation,
  getBottomSpace,
  getStatusBarHeight,
  isIOS,
  isRTL,
  requestExternalStoragePermission,
  ShowToast,
} from '../utils';
import { SimpleZoom as Zoom } from '../components';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { goBack, navigate, push } from '../navigation';
import {
  bookCallRequest,
  checkProductCodeCall,
  getProductDetailsCall,
  getProductQuestionsCall,
  getProductPriceCall,
  removeFromWishlistCall,
  addToWishlistCall,
  relatedProductsGetCall,
  addPhoneCall,
} from '../services/api/calls';
import WebView from 'react-native-webview';
import { Alert } from 'react-native';
import { addToCartAction } from '../store/actions/CartActions';
import { getWishlistAction } from '../store/actions/AuthActions';
import { ActivityIndicator } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import { ImageBackground } from 'react-native';
import AutoHeightWebView from 'react-native-autoheight-webview';

import PhoneInput from 'react-native-phone-input';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  backBtn: {
    position: 'absolute',
    top: getStatusBarHeight() + dimensionsCalculation(5),
    left: dimensionsCalculation(10),
    borderRadius: dimensionsCalculation(40),
    zIndex: 1500,
    backgroundColor: 'rgba(255,255,255,0.3)',
    width: dimensionsCalculation(50),
    height: dimensionsCalculation(50),
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    // paddingTop: Constants.headerHeight + dimensionsCalculation(20),
  },
  productsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: dimensionsCalculation(10),
    paddingHorizontal: dimensionsCalculation(10),
  },
  ourProducts: {
    color: '#535353',
    fontSize: dimensionsCalculation(15),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imageContainer: {
    flex: 1,
    // width: Dimensions.get('screen').width * 0.3,
    margin: 1,
    // elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    // backgroundColor: AppColors.white,
    borderRadius: dimensionsCalculation(20),
    borderWidth: 0,
    padding: dimensionsCalculation(10),
    marginLeft: dimensionsCalculation(10),
  },
  productImage: {
    flex: 1,
  },
  zoomIn: {
    backgroundColor: AppColors.white,
    width: dimensionsCalculation(50),
    height: dimensionsCalculation(50),
    borderRadius: dimensionsCalculation(25),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    overflow: 'visible',
    position: 'absolute',
    bottom: dimensionsCalculation(10),
    left: dimensionsCalculation(15),
  },
  productInfoContainer: {
    flex: 1,
    paddingVertical: dimensionsCalculation(10),
  },
  productName: {
    fontFamily: fonts.primaryBold,
    fontSize: dimensionsCalculation(16),
    // color: AppColors.mainText,
    textAlign: 'left',
  },
  infoBtn: {
    backgroundColor: AppColors.primary,
    borderRadius: dimensionsCalculation(20),
    alignSelf: 'center',
    paddingHorizontal: dimensionsCalculation(15),
    height: dimensionsCalculation(20),
    paddingVertical: 0,
  },
  infoBtnTxt: {
    fontSize: dimensionsCalculation(12),
    fontFamily: fonts.primaryBold,
  },
  selectedColor: {
    textAlign: 'left',
    fontFamily: fonts.primaryBold,
    color: AppColors.black,
    fontSize: dimensionsCalculation(16),
    marginBottom: dimensionsCalculation(10),
  },
  color: {
    width: dimensionsCalculation(30),
    height: dimensionsCalculation(30),
    borderRadius: dimensionsCalculation(15),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: dimensionsCalculation(10),
  },
  sizeContainer: {
    borderColor: AppColors.mainText,
    borderWidth: 0.3,
    paddingHorizontal: dimensionsCalculation(15),
    justifyContent: 'center',
    // paddingVertical: dimensionsCalculation(7),
    height: dimensionsCalculation(40),
    borderRadius: dimensionsCalculation(10),
    marginRight: dimensionsCalculation(5),
  },
  sizeTxt: {
    color: AppColors.mainText,
    fontSize: dimensionsCalculation(14),
  },
  priceContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    // marginTop: dimensionsCalculation(20),
    // paddingHorizontal: dimensionsCalculation(10),
  },
  productPrice: {
    textAlign: 'left',
    fontSize: dimensionsCalculation(23),
    // paddingLeft: dimensionsCalculation(10),
    color: AppColors.mainText,
  },
  qtyBtn: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.3)',
    padding: dimensionsCalculation(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // width: '100%',
    // backgroundColor: AppColors.white,
    marginTop: dimensionsCalculation(10),
    borderRadius: dimensionsCalculation(5),
    // height: dimensionsCalculation(40),
  },
  qtyText: {
    fontFamily: fonts.primaryRegular,
    fontSize: dimensionsCalculation(16),
    marginRight: dimensionsCalculation(5),
  },
  actionsContainer: {
    marginTop: dimensionsCalculation(20),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingHorizontal: dimensionsCalculation(10),
  },
  actionBtn: {
    // backgroundColor: AppColors.white,
    width: '95%',
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: dimensionsCalculation(10),
    height: dimensionsCalculation(40),
    borderRadius: dimensionsCalculation(10),
    marginRight: dimensionsCalculation(10),
  },
  actionTxt: {
    // color: AppColors.mainText,
    // marginRight: dimensionsCalculation(2),
    // fontFamily: fonts.primaryRegular,
    fontSize: dimensionsCalculation(15),
  },
  relatedContainer: {
    marginTop: dimensionsCalculation(20),
  },
  relatedTxt: {
    fontSize: dimensionsCalculation(16),
    fontFamily: fonts.primaryBold,
    // color: AppColors.mainText,
    marginLeft: dimensionsCalculation(20),
    textAlign: 'left',
  },
  productCard: {
    borderRadius: dimensionsCalculation(15),
    width: Dimensions.get('screen').width * 0.33,
    padding: dimensionsCalculation(10),
    paddingTop: dimensionsCalculation(10),
  },
  modalStyle: {
    width: '100%',
    height: '100%',
    flex: 1,
    backgroundColor: AppColors.transparent,
    justifyContent: 'center',
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
    borderRadius: dimensionsCalculation(10),
    paddingVertical: dimensionsCalculation(10),
    width: Dimensions.get('screen').width * 0.9,
    minHeight: Dimensions.get('screen').width * 0.45,
    alignSelf: 'center',
  },
  questionStyle: {
    color: AppColors.mainText,
    fontFamily: fonts.primaryBold,
    fontSize: dimensionsCalculation(14),
    marginBottom: dimensionsCalculation(10),
  },
  optionContainer: {
    marginLeft: dimensionsCalculation(10),
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: dimensionsCalculation(10),
    paddingHorizontal: dimensionsCalculation(5),
  },
  surveyFooter: {
    marginTop: dimensionsCalculation(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dotsContainer: {
    flex: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  certificateModalBody: {
    backgroundColor: AppColors.primary,
    borderRadius: dimensionsCalculation(15),
    width: Dimensions.get('screen').width * 0.8,
    height: Dimensions.get('screen').width,
    alignSelf: 'center',
    paddingHorizontal: dimensionsCalculation(10),
  },
  tdsModalBody: {
    width: Dimensions.get('screen').width,
    height: '100%',
    paddingHorizontal: 0,
  },
  closeBtn: {
    overflow: 'visible',
    alignSelf: 'flex-start',
    padding: dimensionsCalculation(5),
    marginTop: getStatusBarHeight() + dimensionsCalculation(10),
  },
  certificateImg: {
    flex: 1,
    marginTop: dimensionsCalculation(10),
    marginBottom: dimensionsCalculation(5),
  },
  downloadBtn: {
    marginBottom: dimensionsCalculation(10),
    alignSelf: 'center',
    flexDirection: 'row-reverse',
  },
  downloadTxt: {
    marginRight: dimensionsCalculation(5),
    fontSize: dimensionsCalculation(13),
    fontFamily: fonts.primaryRegular,
  },
  tdsContent: {
    flex: 1,
    // borderRadius: dimensionsCalculation(15),
    // margin: dimensionsCalculation(20),
    // marginBottom: dimensionsCalculation(10),
    backgroundColor: AppColors.white,
    overflow: 'hidden',
  },
  tdsScrollview: {
    padding: dimensionsCalculation(10),
    paddingBottom: dimensionsCalculation(20),
    flexGrow: 1,
  },
  tdsTitle: {
    paddingVertical: dimensionsCalculation(10),
    fontSize: dimensionsCalculation(16),
    fontFamily: fonts.primaryBold,
    color: AppColors.mainText,
    textAlign: 'center',
  },
  tdsBody: {
    textAlign: 'left',
    fontSize: dimensionsCalculation(14),
    color: '#212121',
  },
  bottomView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1500,
    backgroundColor: AppColors.white,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // overflow: 'hidden',
    borderTopLeftRadius: dimensionsCalculation(40),
    borderTopRightRadius: dimensionsCalculation(40),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: getBottomSpace() + dimensionsCalculation(20),
    paddingTop: dimensionsCalculation(20),
    paddingHorizontal: dimensionsCalculation(20),
  },
  callBtn: {
    backgroundColor: AppColors.primary,
    paddingVertical: dimensionsCalculation(5),
    paddingHorizontal: dimensionsCalculation(30),
    borderRadius: dimensionsCalculation(20),
  },
  bookCallContainer: {
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
    padding: dimensionsCalculation(30),
  },
  bookCallHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: dimensionsCalculation(12),
    marginBottom: dimensionsCalculation(10),
  },
  bookCallText: {
    fontSize: dimensionsCalculation(16),
    fontFamily: fonts.primaryRegular,
    color: AppColors.mainText,
  },
  timeContainer: {
    borderRadius: dimensionsCalculation(10),
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: dimensionsCalculation(20),
  },
  timeSectionView: {
    margin: 1,
    marginRight: dimensionsCalculation(5),
    backgroundColor: AppColors.secondary,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    borderRadius: dimensionsCalculation(10),
    paddingVertical: dimensionsCalculation(5),
    paddingHorizontal: dimensionsCalculation(10),
  },
  timeSection: {
    color: AppColors.mainText,
  },
  timeSeparator: {
    marginRight: dimensionsCalculation(5),
    fontSize: dimensionsCalculation(25),
    fontFamily: fonts.primaryBold,
    alignSelf: 'center',
    bottom: dimensionsCalculation(8),
    color: AppColors.mainText,
    maxHeight: dimensionsCalculation(25),
  },
  dayComponent: {
    borderRadius: dimensionsCalculation(5),
    borderWidth: 0,
    width: dimensionsCalculation(30),
    height: dimensionsCalculation(30),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 2.22,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  changeMonth: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: AppColors.secondary,
    borderRadius: dimensionsCalculation(10),
    paddingHorizontal: dimensionsCalculation(20),
    flex: 0.7,
    paddingVertical: dimensionsCalculation(5),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  year: {
    color: AppColors.mainText,
    backgroundColor: AppColors.secondary,
    paddingHorizontal: dimensionsCalculation(10),
    paddingVertical: dimensionsCalculation(5),
    borderRadius: dimensionsCalculation(10),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  enterCodeInput: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    borderRadius: dimensionsCalculation(10),
    textAlign: 'center',
    marginBottom: dimensionsCalculation(10),
  },
});

class ProductDetailsScreen extends Component<
  ProductDetailsScreenProps,
  ProductDetailsScreenState
> {
  photoModalRef: RefObject<Modal>;
  bookCallModalRef: RefObject<Modal>;
  surveyModalRef: RefObject<Modal>;
  calendarRef: RefObject<any>;
  codeModalRef: RefObject<Modal>;
  scrollviewRef: RefObject<ScrollView>;
  qtyInputRef: RefObject<TextInput>;
  phoneModalRef: RefObject<Modal> = null;
  phone: PhoneInput = null;
  timeout = null;

  constructor(props: ProductDetailsScreenProps) {
    super(props);
    this.state = {
      isLoading: true,
      isRefreshing: false,
      product: props.route?.params?.product,
      surveyQuestions: [],
      currentQuestion: 0,
      realtedProducts: [],
      isRelatedProductsFetching: true,
      selectedColor: null,
      selectedSize: null,
      quantity: 1,
      isInfoModalOpen: false,
      infoModalContent: null,
      selectedDay: null,
      currentDate: moment().format('yyyy-MM-DD'),
      isTimePickerVisible: false,
      selectedTime: null,
      isBookingCall: false,
      isKeyboardShown: false,
      price: null,
      oldprice: null,
      productQuantity: 0,
      code: '',
      isCheckingCode: false,
      isAddToCartClicked: false,
      productAttribute: null,
      isColorSizeChange: false,
      viewHeight: null,
      showSizes: false,
      isVideoModalOpen: false,
      isWebviewLoading: true,
      selectedTab: 'description',
      scrollX: new Animated.Value(0),
      phone: '',
      isAddingPhone: false,
      isValidPhone: true,
      isAddBtnClicked: false,
    };
    this.photoModalRef = createRef();
    this.bookCallModalRef = createRef();
    this.surveyModalRef = createRef();
    this.calendarRef = createRef();
    this.codeModalRef = createRef();
    this.scrollviewRef = createRef();
    this.qtyInputRef = createRef();
    this.phoneModalRef = createRef();
  }

  componentDidMount = () => {
    this.getProduct();
    this.getRelatedProduct();
  };

  getProduct = (isLoading: boolean = true, isRefreshing: boolean = false) => {
    this.setState(
      {
        isLoading,
        isRefreshing,
      },
      async () => {
        try {
          const result = await getProductDetailsCall({
            id: this.state.product?.product?.id,
          });
          // configureNextScaleAnimation();
          if (result?.data?.product) {
            this.setState(
              {
                product: { product: result?.data?.product },
                price:
                  result?.data?.product?.hassize == '1' ||
                    result?.data?.product?.hascolor == '1'
                    ? null
                    : result?.data?.product?.price,
                oldprice:
                  result?.data?.product?.hassize == '1' ||
                    result?.data?.product?.hascolor == '1'
                    ? null
                    : result?.data?.product?.oldprice,
                productQuantity:
                  result?.data?.product?.hassize == '1' ||
                    result?.data?.product?.hascolor == '1'
                    ? null
                    : result?.data?.product?.quantity,
                isLoading: false,
                isRefreshing: false,
                selectedColor:
                  result?.data?.product?.colors?.length > 0
                    ? result?.data?.product?.colors[0]?.id == '249'
                      ? 'tinting'
                      : result?.data?.product?.colors[0]?.id
                    : null,
                selectedSize: result?.data?.product?.sizes[0]?.id ?? null,
              },
              () => {
                this.colorSizeChangeHandle();
              },
            );
            const questionsResult = await getProductQuestionsCall({
              id: result?.data?.product?.id,
            });
            if (questionsResult?.data?.questions) {
              this.setState(
                {
                  surveyQuestions: questionsResult?.data?.questions,
                },
                () => { },
              );
            }
          } else {
            goBack();
            ShowToast(Languages.Oops);
          }
        } catch (err) {
          console.log(err.message);
        }
      },
    );
  };

  getRelatedProduct = async () => {
    const result = await relatedProductsGetCall({
      productid: this.state.product.product.id,
    });
    if (result?.data) {
      this.setState(
        {
          realtedProducts: result?.data?.products,
          isRelatedProductsFetching: false,
        },
        () => { },
      );
    } else {
      this.setState(
        {
          isRelatedProductsFetching: false,
        },
        () => { },
      );
    }
  };

  colorSizeChangeHandle = (isColorSizeChange: boolean = true) => {
    const { product, selectedColor, selectedSize } = this.state;
    if (
      (product?.product?.hassizecolor == '1' &&
        selectedColor &&
        selectedSize) ||
      (product?.product?.hascolor == '1' &&
        selectedColor &&
        product?.product?.hassize == '0') ||
      (product?.product?.hassize == '1' &&
        selectedSize &&
        product?.product?.hascolor == '0') ||
      (product.product.hassize == '0' && product.product.hascolor == '0')
    ) {
      this.setState(
        {
          isColorSizeChange,
        },
        async () => {
          const result = await getProductPriceCall({
            id: product?.product?.id,
            sizeid: selectedSize,
            colorid: selectedColor == 'tinting' ? '249' : selectedColor,
          });
          // configureNextScaleAnimation();
          if (result?.data?.result == 1) {
            // configureNextAnimation();
            this.setState(
              {
                price: result?.data?.price,
                oldprice: result?.data?.oldprice,
                productQuantity: parseFloat(result?.data?.quantity),
                quantity:
                  parseFloat(result?.data?.quantity) > this.state.quantity
                    ? this.state.quantity
                    : parseFloat(result?.data?.quantity),
                productAttribute: result?.data?.attrid,
              },
              () => { },
            );
          } else {
            ShowToast(Languages.Oops);
            this.setState(
              {
                selectedColor: null,
                selectedSize: null,
                price: product?.product?.price?.toString(),
                oldprice: product?.product?.oldprice?.toString(),
                productQuantity: product?.product?.quantity,
                quantity: 1,
              },
              () => { },
            );
          }
          this.setState({ isColorSizeChange: false }, () => { });
        },
      );
    }
  };

  renderColor = ({ item, index }: { item: Color; index: number }) => {
    const { selectedColor } = this.state;
    return (
      <View
        style={{
          flexDirection: 'row',
        }}>
        <AppTouchableOpacity
          androidRippleColor={AppColors.androidRippleColor.white}
          style={[
            styles.color,
            {
              marginRight: dimensionsCalculation(5),
              marginBottom: dimensionsCalculation(5),
              backgroundColor: `#${item.code}`,
              borderWidth: 1,
              borderColor: AppColors.mainText,
            },
            !item?.isTinting
              ? {
                // borderColor: `#${item.code}`,
                backgroundColor:
                  item.id == selectedColor
                    ? AppColors.transparent
                    : `#${item.code}`,
                // borderWidth: item.id == selectedColor ? 1 : 0,
              }
              : {
                borderWidth: selectedColor == 'tinting' ? 1 : 0,
                borderColor: AppColors.black,
                // overflow: 'visible',
              },
          ]}
          disabled={item.id == selectedColor && selectedColor != 'tinting'}
          onPress={() => {
            // configureNextAnimation();
            this.setState(
              {
                // selectedColor: selectedColor == item?.id ? null : item?.id,
                selectedColor: item?.id,
              },
              () => {
                this.colorSizeChangeHandle();
                item.isTinting && Alert.alert('', Languages.TintingDesc);
              },
            );
          }}>
          {item.isTinting && (
            <FastImage
              source={require('../../assets/images/colors.png')}
              style={{
                width: dimensionsCalculation(
                  selectedColor == 'tinting' ? 22 : 30,
                ),
                height: dimensionsCalculation(
                  selectedColor == 'tinting' ? 22 : 30,
                ),
                borderColor: AppColors.mainText,
                borderWidth: selectedColor == 'tinting' ? 1 : 0,
                borderRadius: dimensionsCalculation(11),
              }}
              resizeMode="cover"
            />
          )}
          {item.id != 'tinting' && item.id == selectedColor && (
            <View
              style={{
                backgroundColor: `#${item.code}`,
                borderWidth: 1,
                borderColor: AppColors.mainText,
                width: dimensionsCalculation(22),
                height: dimensionsCalculation(22),
                borderRadius: dimensionsCalculation(11),
              }}
            />
          )}
        </AppTouchableOpacity>
        {selectedColor == 'tinting' && item.isTinting && (
          <Text
            style={{
              top: dimensionsCalculation(2),
              color: AppColors.black,
              marginLeft: dimensionsCalculation(5),
            }}>
            {Languages.Tinting}
          </Text>
        )}
      </View>
    );
  };

  renderSize = ({ item, index }: { item: Size; index: number }) => {
    const { selectedSize } = this.state;
    return (
      <AppTouchableOpacity
        androidRippleColor={AppColors.androidRippleColor.black15}
        disabled={item?.id == selectedSize}
        style={[
          styles.sizeContainer,
          item?.id == selectedSize && {
            backgroundColor: AppColors.primary,
            borderColor: AppColors.transparent,
          },
        ]}
        onPress={() => {
          // configureNextAnimation();
          this.setState(
            {
              selectedSize: item?.id == selectedSize ? null : item?.id,
            },
            () => {
              this.colorSizeChangeHandle();
            },
          );
        }}>
        <Text
          style={[
            styles.sizeTxt,
            item?.id == selectedSize && {
              color: AppColors.white,
              fontFamily: fonts.primaryBold,
            },
          ]}>
          {item?.name?.replace(/\n/g, ' ').trim()}
        </Text>
      </AppTouchableOpacity>
    );
  };

  getColorCode = () => {
    const { product, selectedColor } = this.state;
    let prd = product?.product?.colors?.find((x) => x?.id == selectedColor);
    let string = prd?.code?.toLowerCase() ?? '000000';
    if (prd?.whitec) string = '000000';
    return string;
  };

  renderAction = ({
    text,
    icon,
    iconType,
    backgroundColor = AppColors.primary,
    onPress,
    marginRight = dimensionsCalculation(10),
    marginBottom = dimensionsCalculation(10),
    useIconDefaultColors,
  }: {
    text?: string;
    icon?: string;
    iconType?: IconType;
    useIconDefaultColors?: boolean;
    backgroundColor?: string;
    marginRight?: number;
    marginBottom?: number;
    onPress: () => void;
  }) => {
    return (
      <View
        style={{
          width: '50%',
        }}>
        <AppButton
          androidRippleColor={AppColors.androidRippleColor.black15}
          onPress={() => {
            this.setState({}, () => {
              onPress();
            });
          }}
          containerStyle={[
            styles.actionBtn,
            {
              // backgroundColor,
              // marginRight,
              marginBottom,
            },
          ]}
          useIconDefaultColors
          icon={icon}
          iconType={iconType}
          iconSize={dimensionsCalculation(20)}
          iconStyle={{ marginRight: dimensionsCalculation(10) }}
          text={text}
          textStyle={styles.actionTxt}
          adjustsFontSizeToFit={true || icon != null}
        />
      </View>
    );
  };

  renderRelatedProduct = ({ item, index }: { item: Product; index: number }) => {
    return (
      <ProductCard
        product={item}
        index={index}
        horizontal
        hideButtons
        hideDescription
        containerStyle={styles.productCard}
      />
    );
  };

  renderCertificate = () => {
    const { product } = this.state;
    return (
      <View style={styles.tdsContent}>
        {this.isPdf(product?.product?.certificateattach) ? (
          <WebView
            containerStyle={{
              flexGrow: 1,
            }}
            startInLoadingState
            renderLoading={() => {
              return <LoadingSpinner overlay />;
            }}
            onLoad={() => {
              this.setState(
                {
                  isWebviewLoading: false,
                },
                () => { },
              );
            }}
            showsHorizontalScrollIndicator={false}
            source={{
              uri: isIOS
                ? `${product?.product?.certificateattach}`
                : `https://docs.google.com/gview?embedded=true&url=${product?.product?.certificateattach}`,
            }}
          />
        ) : (
          <Zoom
            style={styles.certificateImg}
            doubleTapConfig={{
              defaultScale: 2,
              minZoomScale: 1,
              maxZoomScale: 4,
            }}>
            <Image
              source={{ uri: product?.product?.certificateattach ?? '' }}
              style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
            />
          </Zoom>
        )}
      </View>
    );
  };

  renderMSDS = () => {
    const { product } = this.state;
    return (
      <View style={styles.tdsContent}>
        {this.isPdf(product?.product?.msdsattach) ? (
          <WebView
            containerStyle={{
              flexGrow: 1,
            }}
            startInLoadingState
            onLoad={() => {
              this.setState(
                {
                  isWebviewLoading: false,
                },
                () => { },
              );
            }}
            renderLoading={() => {
              return <LoadingSpinner overlay />;
            }}
            showsHorizontalScrollIndicator={false}
            source={{
              uri: isIOS
                ? `${product?.product?.msdsattach}`
                : `https://docs.google.com/gview?embedded=true&url=${product?.product?.msdsattach}`,
            }}
          />
        ) : (
          <Zoom
            style={styles.certificateImg}
            doubleTapConfig={{
              defaultScale: 2,
              minZoomScale: 1,
              maxZoomScale: 4,
            }}>
            <Image
              source={{ uri: product?.product?.msdsattach ?? '' }}
              style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
            />
          </Zoom>
        )}
      </View>
    );
  };

  renderTDS = () => {
    const { product } = this.state;
    return (
      <View style={styles.tdsContent}>
        {this.isPdf(product?.product?.tdsattache) ? (
          <WebView
            containerStyle={{
              flexGrow: 1,
            }}
            startInLoadingState
            onLoad={() => {
              this.setState(
                {
                  isWebviewLoading: false,
                },
                () => { },
              );
            }}
            renderLoading={() => {
              return <LoadingSpinner overlay />;
            }}
            showsHorizontalScrollIndicator={false}
            source={{
              uri: isIOS
                ? `${product?.product?.tdsattache}`
                : `${product?.product?.tdsattache}`,
            }}
          />
        ) : (
          <Zoom
            style={styles.certificateImg}
            doubleTapConfig={{
              defaultScale: 2,
              minZoomScale: 1,
              maxZoomScale: 4,
            }}>
            <Image
              source={{ uri: product?.product?.tdsattache ?? '' }}
              style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
            />
          </Zoom>
        )}
      </View>
    );
  };

  renderDescription = () => {
    const { product } = this.state;
    return (
      <View
        style={[
          styles.tdsContent,
          {
            borderRadius: dimensionsCalculation(15),
            // margin: dimensionsCalculation(20),
            marginBottom: dimensionsCalculation(10),
            marginTop: dimensionsCalculation(5),
          },
        ]}>
        {product?.product?.description != '' && (
          <WebView
            style={styles.tdsScrollview}
            startInLoadingState
            onLoad={() => {
              this.setState(
                {
                  isWebviewLoading: false,
                },
                () => { },
              );
            }}
            renderLoading={() => {
              return <LoadingSpinner overlay />;
            }}
            showsHorizontalScrollIndicator={false}
            source={{
              html: ` <html dir="${Languages.langDirection}">
              <head>
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              </head>
              <body style="
              text-align: ${isRTL ? 'right' : 'left'} !important;
              " >
              <p
              style="
              ">${product?.product?.description} </body>
              </html>`,
            }}
            injectedJavaScript={`const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `}
            scalesPageToFit={false}
          />
        )}
      </View>
    );
  };

  isPdf(url) {
    return url?.toLowerCase().endsWith('.pdf');
  }

  renderCertificateModal = () => {
    const { isInfoModalOpen, infoModalContent, product } = this.state;
    const showDownload =
      !isIOS &&
      ((infoModalContent == 'tds' &&
        product?.product?.tdsattache &&
        product?.product?.tdsattache?.split('/')[
        product?.product?.tdsattache?.split('/')?.length - 1
        ] != '') ||
        (infoModalContent == 'msds' &&
          product?.product?.msdsattach &&
          product?.product?.msdsattach?.split('/')[
          product?.product?.msdsattach?.split('/')?.length - 1
          ] != '') ||
        (infoModalContent == 'certificate' &&
          product?.product?.certificateattach &&
          product?.product?.certificateattach?.split('/')[
          product?.product?.certificateattach?.split('/')?.length - 1
          ] != ''));
    return (
      <Modal
        isOpen={isInfoModalOpen}
        animationDuration={0}
        backdrop
        backdropPressToClose={false}
        backdropColor={'rgba(255,255,255,0.1)'}
        backdropOpacity={1}
        backButtonClose
        swipeToClose={false}
        coverScreen
        onClosed={() => {
          this.setState(
            {
              isInfoModalOpen: false,
              infoModalContent: null,
            },
            () => { },
          );
        }}
        style={styles.modalStyle}>
        <AppTouchableOpacity
          androidRippleColor={AppColors.transparent}
          activeOpacity={1}
          style={styles.modalBackdrop}
          onPress={() => {
            this.setState(
              {
                isInfoModalOpen: false,
              },
              () => { },
            );
          }}
        />
        <View
          style={[
            styles.certificateModalBody,
            infoModalContent != 'description' && styles.tdsModalBody,
          ]}>
          <AppTouchableOpacity
            androidRippleColor={AppColors.androidRippleColor.white}
            borderless
            style={[
              styles.closeBtn,
              infoModalContent == 'description' && {
                marginTop: dimensionsCalculation(10),
              },
            ]}
            onPress={() => {
              this.setState(
                {
                  isInfoModalOpen: false,
                },
                () => { },
              );
            }}>
            <AppIcon
              name="close-circle"
              type="AntDesign"
              size={dimensionsCalculation(25)}
              color={AppColors.white}
            />
          </AppTouchableOpacity>
          {infoModalContent == 'certificate'
            ? this.renderCertificate()
            : infoModalContent == 'tds'
              ? this.renderTDS()
              : infoModalContent == 'msds'
                ? this.renderMSDS()
                : infoModalContent == 'description'
                  ? this.renderDescription()
                  : null}
          {false && showDownload && (
            <AppButton
              onPress={async () => {
                const { config, fs } = RNFetchBlob;
                const result = await requestExternalStoragePermission();
                if (result?.granted) {
                  let direction = fs.dirs.DownloadDir;
                  let options = {
                    fileCache: true,
                    addAndroidDownloads: {
                      useDownloadManager: true,
                      notification: true,
                      path:
                        direction +
                        '/quds_' +
                        Math.floor(
                          new Date().getTime() + new Date().getSeconds() / 2,
                        ),
                      description: 'Downloading ...',
                    },
                  };
                  config(options)
                    .fetch(
                      'GET',
                      infoModalContent == 'certificate'
                        ? product?.product?.certificateattach
                        : infoModalContent == 'msds'
                          ? product?.product?.msdsattach
                          : infoModalContent == 'tds'
                            ? product?.product?.tdsattache
                            : null,
                    )
                    .then((res) => {
                      // __DEV__ && console.log('res', JSON.stringify(res));
                    })
                    .catch((err) => {
                      // __DEV__ && console.error('error', err + '');
                    });
                  this.setState(
                    {
                      isInfoModalOpen: false,
                    },
                    () => { },
                  );
                } else {
                  Alert.alert('', Languages.PermissionRequired);
                }
              }}
              text={Languages.Download}
              textStyle={styles.downloadTxt}
              textColor={AppColors.white}
              containerStyle={styles.downloadBtn}
              icon="download"
              iconType="Feather"
              iconSize={dimensionsCalculation(16)}
              androidRippleColor={AppColors.androidRippleColor.white}
            />
          )}
          {/* {!showDownload && (
            <View style={{marginTop: dimensionsCalculation(10)}} />
          )} */}
        </View>
      </Modal>
    );
  };

  renderImageModal = () => {
    const { isLoading, product } = this.state;
    return (
      <Modal
        ref={this.photoModalRef}
        coverScreen
        style={[styles.modalStyle, { backgroundColor: AppColors.white }]}
        backButtonClose
        animationDuration={300}
        backdrop={false}
        swipeToClose={false}>
        <AppTouchableOpacity
          androidRippleColor={AppColors.androidRippleColor.black15}
          borderless
          style={[
            styles.closeBtn,
            {
              position: 'absolute',
              top: getStatusBarHeight(),
              marginLeft: dimensionsCalculation(10),
              zIndex: 1500,
            },
          ]}
          onPress={() => {
            this.photoModalRef?.current?.close();
          }}>
          <AppIcon
            name="closecircle"
            type="AntDesign"
            size={dimensionsCalculation(26)}
            color={AppColors.primary}
          />
        </AppTouchableOpacity>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <Zoom
            style={{ flex: 1 }}
            doubleTapConfig={{
              defaultScale: 2,
              minZoomScale: 1,
              maxZoomScale: 4,
            }}>
            <Image
              source={{
                uri:
                  product?.product?.fullimage
                    ?.replace(/\\/g, '/')
                    ?.replace(/\s/g, '%20') ?? '',
              }}
              style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
            />
          </Zoom>
        )}
      </Modal>
    );
  };

  renderBookCallModal = () => {
    const {
      product,
      selectedDay,
      currentDate,
      isTimePickerVisible,
      selectedTime,
      isBookingCall,
    } = this.state;
    return (
      <Modal
        ref={this.bookCallModalRef}
        backButtonClose={!isBookingCall}
        backdrop={false}
        swipeToClose={false}
        coverScreen
        style={[styles.modalStyle, { justifyContent: 'flex-end' }]}
        onClosed={() => {
          this.setState(
            {
              selectedDay: null,
              currentDate: moment().format('yyyy-MM-DD'),
              selectedTime: null,
              isBookingCall: false,
            },
            () => { },
          );
        }}>
        <DateTimePickerModal
          isVisible={isTimePickerVisible}
          mode="time"
          date={selectedTime ? selectedTime : new Date()}
          onConfirm={(date) => {
            this.setState(
              {
                selectedTime: date,
                isTimePickerVisible: false,
              },
              () => { },
            );
          }}
          onCancel={() => {
            this.setState(
              {
                isTimePickerVisible: false,
              },
              () => { },
            );
          }}
          display="spinner"
          textColor={AppColors.mainText}
        />
        <AppTouchableOpacity
          disabled={isBookingCall}
          androidRippleColor={AppColors.transparent}
          activeOpacity={1}
          style={styles.modalBackdrop}
          onPress={() => {
            this.bookCallModalRef?.current?.close();
          }}></AppTouchableOpacity>
        <View style={styles.bookCallContainer}>
          <View style={styles.bookCallHeader}>
            <Text style={styles.bookCallText}>{Languages.PickDateTime}</Text>
            <Text style={styles.bookCallText}>{Languages.BookCall}</Text>
          </View>
          <View style={styles.bookCallHeader}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: AppColors.mainText,
                  fontSize: dimensionsCalculation(16),
                }}>
                {Languages.Time}
              </Text>
              <AppTouchableOpacity
                androidRippleColor={AppColors.androidRippleColor.black15}
                style={styles.timeContainer}
                onPress={() => {
                  this.setState(
                    {
                      isTimePickerVisible: true,
                    },
                    () => { },
                  );
                }}>
                <View style={styles.timeSectionView}>
                  <Text style={styles.timeSection}>
                    {selectedTime ? moment(selectedTime).format('hh') : '00'}
                  </Text>
                </View>
                <Text style={styles.timeSeparator}>:</Text>
                <View style={styles.timeSectionView}>
                  <Text style={styles.timeSection}>
                    {selectedTime ? moment(selectedTime).format('mm') : '00'}
                  </Text>
                </View>
                <View style={[styles.timeSectionView, { marginRight: 0 }]}>
                  <Text style={styles.timeSection}>
                    {selectedTime ? moment(selectedTime).format('A') : '--'}
                  </Text>
                </View>
              </AppTouchableOpacity>
            </View>
            <LoadingButton
              isLoading={isBookingCall}
              onPress={() => {
                if (!selectedDay) return ShowToast(Languages.SelectDay);
                if (!selectedTime) return ShowToast(Languages.SelectTime);
                this.setState(
                  {
                    isBookingCall: true,
                  },
                  async () => {
                    const result = await bookCallRequest({
                      productid: product?.product?.id,
                      date:
                        Object.keys(selectedDay)[0] +
                        `T${moment(selectedTime).format('HH')}:${moment(
                          selectedTime,
                        ).format('mm')}:00.000Z`,
                    });
                    if (result?.data?.result == 1) {
                      ShowToast(Languages.BookedSuccesfully, 'success');
                      this.bookCallModalRef?.current?.close();
                    } else {
                      this.setState(
                        {
                          isBookingCall: false,
                        },
                        () => { },
                      );
                      ShowToast(Languages.Oops);
                    }
                  },
                );
              }}
              text={Languages.Submit}
              textStyle={{
                fontFamily: fonts.primaryBold,
                fontSize: dimensionsCalculation(13),
              }}
              textColor={AppColors.white}
              androidRippleColor={AppColors.androidRippleColor.white}
              containerStyle={{
                backgroundColor: AppColors.primary,
                borderRadius: dimensionsCalculation(10),
                paddingHorizontal: dimensionsCalculation(15),
                paddingVertical: dimensionsCalculation(5),
                padding: 0,
                height: null,
              }}
            />
          </View>
          <Calendar
            ref={this.calendarRef}
            current={currentDate}
            minDate={moment().add(1, 'days').format('yyyy-MM-DD')}
            maxDate={'2025-05-30'}
            onDayPress={(day) => {
              // configureNextScaleAnimation();
              let selectedDay = {};
              selectedDay[day.dateString] = { selected: true };
              this.setState(
                {
                  selectedDay,
                },
                () => { },
              );
            }}
            markedDates={selectedDay}
            monthFormat={'yyyy MM'}
            onMonthChange={(month) => { }}
            hideExtraDays
            hideArrows
            dayComponent={(day) => {
              const disabled =
                moment(day.date.dateString).diff(moment(), 'day') < 0 ||
                moment(day.date.dateString).diff(moment('2100-12-31'), 'day') >
                0;
              return (
                <AppTouchableOpacity
                  disabled={disabled}
                  onPress={() => {
                    let selectedDay = {};
                    selectedDay[day.date.dateString] = { selected: true };
                    this.setState(
                      {
                        selectedDay,
                      },
                      () => { },
                    );
                  }}
                  style={[
                    styles.dayComponent,
                    {
                      shadowOpacity: disabled ? 0 : 0.22,
                      elevation: disabled ? 0 : 1,
                      opacity: disabled ? 0.5 : 1,
                      backgroundColor:
                        selectedDay &&
                          day.date.dateString == Object.keys(selectedDay)[0]
                          ? AppColors.secondary
                          : AppColors.white,
                    },
                  ]}>
                  <Text
                    style={{
                      color: AppColors.mainText,
                    }}>
                    {day.date.day.toString()}
                  </Text>
                </AppTouchableOpacity>
              );
            }}
            theme={{
              textDayStyle: {},
            }}
            renderHeader={(date) => {
              return (
                <View style={styles.calendarHeader}>
                  <Text
                    style={{
                      color: AppColors.mainText,
                    }}>
                    {Languages.Date}
                  </Text>
                  <View style={styles.changeMonth}>
                    <AppTouchableOpacity
                      style={{
                        overflow: 'visible',
                        padding: 3,
                      }}
                      hitSlop={{
                        top: 15,
                        bottom: 15,
                        left: 15,
                        right: 15,
                      }}
                      borderless
                      onPress={() => {
                        this.setState(
                          {
                            currentDate: moment(currentDate)
                              .add('months', -1)
                              .format('yyyy-MM-DD'),
                          },
                          () => {
                            this.calendarRef?.current?.addMonth(-1);
                          },
                        );
                      }}>
                      <AppIcon
                        type="AntDesign"
                        name={isRTL ? 'caret-right' : 'caret-left'}
                        size={dimensionsCalculation(12)}
                        color={AppColors.mainText}
                      />
                    </AppTouchableOpacity>
                    <Text
                      style={{
                        color: AppColors.mainText,
                        textAlign: 'center',
                      }}>
                      {moment(currentDate).format('MMM')}
                    </Text>
                    <AppTouchableOpacity
                      style={{
                        overflow: 'visible',
                        padding: 3,
                      }}
                      hitSlop={{
                        top: 15,
                        bottom: 15,
                        left: 15,
                        right: 15,
                      }}
                      borderless
                      onPress={() => {
                        this.setState(
                          {
                            currentDate: moment(currentDate)
                              .add('months', 1)
                              .format('yyyy-MM-DD'),
                          },
                          () => {
                            this.calendarRef?.current?.addMonth(1);
                          },
                        );
                      }}>
                      <AppIcon
                        type="AntDesign"
                        name={isRTL ? 'caretleft' : 'caretright'}
                        size={dimensionsCalculation(12)}
                        color={AppColors.mainText}
                      />
                    </AppTouchableOpacity>
                  </View>
                  <Text style={styles.year}>
                    {moment(currentDate).format('yyyy')}
                  </Text>
                </View>
              );
            }}
          />
        </View>
      </Modal>
    );
  };

  addToCart = (selectedProductID?: string) => {
    const { product, selectedColor, selectedSize, quantity, productAttribute } =
      this.state;
    this.setState(
      {
        isLoading: true,
      },
      async () => {
        if (!productAttribute) {
          const result = await getProductPriceCall({
            id: product?.product?.id,
            sizeid: selectedSize,
            colorid: selectedColor,
          });
          if (result?.data?.result == 1) {
            await this.props.addToCart(
              selectedProductID ? selectedProductID : product?.product?.id,
              selectedProductID || selectedColor == 'tinting'
                ? null
                : selectedColor,
              selectedProductID ? null : selectedSize,
              quantity,
              selectedColor == 'tinting' ? '1' : null,
              result?.data?.attrid,
            );
            this.setState(
              {
                isLoading: false,
              },
              () => { },
            );
          } else {
            this.setState(
              {
                isLoading: false,
              },
              () => {
                ShowToast(Languages.Oops);
              },
            );
          }
        } else {
          await this.props.addToCart(
            selectedProductID ? selectedProductID : product?.product?.id,
            selectedProductID || selectedColor == 'tinting'
              ? null
              : selectedColor,
            selectedProductID ? null : selectedSize,
            quantity,
            selectedColor == 'tinting' ? '1' : null,
            productAttribute,
          );
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

  renderSurveyModal = () => {
    const { surveyQuestions, currentQuestion } = this.state;
    const isLastQuestion = currentQuestion == surveyQuestions?.length - 1;
    return (
      <Modal
        ref={this.surveyModalRef}
        backdrop={false}
        backButtonClose
        swipeToClose={false}
        coverScreen
        onClosed={() => {
          this.setState(
            {
              currentQuestion: 0,
            },
            () => { },
          );
        }}
        style={styles.modalStyle}>
        <AppTouchableOpacity
          androidRippleColor={AppColors.transparent}
          style={[
            styles.modalBackdrop,
            { backgroundColor: 'rgba(255,255,255,0.1)' },
          ]}
          activeOpacity={1}
          onPress={() => {
            this.surveyModalRef?.current?.close();
          }}
        />

        <View
          style={[
            styles.surveyContainer,
            {
              maxHeight: Dimensions.get('screen').height * 0.9,
            },
          ]}>
          <AppTouchableOpacity
            androidRippleColor={AppColors.androidRippleColor.black15}
            style={{
              marginLeft: dimensionsCalculation(10),
              alignSelf: 'flex-start',
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: dimensionsCalculation(10),
            }}
            onPress={() => {
              this.surveyModalRef?.current?.close();
            }}>
            <AppIcon
              name="close"
              type="FontAwesome"
              size={dimensionsCalculation(20)}
              color={AppColors.mainText}
            />
            <Text
              style={{
                marginLeft: dimensionsCalculation(10),
                color: AppColors.mainText,
              }}>
              {Languages.Close}
            </Text>
          </AppTouchableOpacity>
          <Text
            style={{
              textAlign: 'left',
              fontSize: dimensionsCalculation(15),
              color: AppColors.mainText,
              lineHeight: dimensionsCalculation(20),
              marginHorizontal: dimensionsCalculation(10),
            }}>
            {Languages.QuestionsDescription}
          </Text>
          {surveyQuestions?.length > 0 ? (
            <>
              <ScrollView
                contentContainerStyle={{
                  flexGrow: 1,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'center',
                    // paddingHorizontal: dimensionsCalculation(10),
                  }}>
                  {surveyQuestions.map((x, i) => (
                    <AppTouchableOpacity
                      androidRippleColor={AppColors.androidRippleColor.black15}
                      style={{
                        alignSelf: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: dimensionsCalculation(10),
                        marginLeft: dimensionsCalculation(i % 2 == 0 ? 0 : 10),
                        backgroundColor: AppColors.white,
                        elevation: 5,
                        shadowColor: '#000',
                        shadowOffset: {
                          width: 0,
                          height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        borderRadius: dimensionsCalculation(15),
                        paddingVertical: dimensionsCalculation(10),
                        width: '45%',
                      }}
                      onPress={() => {
                        this.surveyModalRef?.current?.close();
                        const product: any = {
                          product: {
                            id: x?.productid,
                            productimage: x?.productimage,
                            productname: x?.productname,
                          },
                        };
                        push('ProductDetailsScreen', {
                          product,
                        });
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          fontSize: dimensionsCalculation(15),
                          color: '#575757',
                          marginHorizontal: dimensionsCalculation(10),
                        }}
                        numberOfLines={2}>
                        {x?.name}
                      </Text>
                      <Text
                        style={{
                          textAlign: 'center',
                          fontSize: dimensionsCalculation(15),
                          color: AppColors.mainText,
                          marginHorizontal: dimensionsCalculation(10),
                        }}
                        numberOfLines={1}>
                        {x?.productname}
                      </Text>
                      <AppTouchableOpacity
                        androidRippleColor={AppColors.transparent}
                        disabled
                        style={{
                          marginTop: dimensionsCalculation(5),
                          alignSelf: 'center',
                          paddingHorizontal: dimensionsCalculation(20),
                          borderRadius: dimensionsCalculation(5),
                          paddingVertical: dimensionsCalculation(3),
                          backgroundColor: AppColors.primary,
                        }}
                        onPress={() => { }}>
                        <Text
                          style={{
                            textAlign: 'center',
                            color: AppColors.white,
                          }}>
                          {Languages.ViewIt}
                        </Text>
                      </AppTouchableOpacity>
                    </AppTouchableOpacity>
                  ))}
                </View>
              </ScrollView>
              <AppButton
                text={Languages.AddToCart}
                icon="shoppingcart"
                iconType="AntDesign"
                iconSize={dimensionsCalculation(16)}
                textColor={AppColors.white}
                onPress={() => {
                  this.surveyModalRef?.current?.close();
                  this.addToCart();
                }}
                androidRippleColor={AppColors.androidRippleColor.white}
                textStyle={[
                  styles.actionTxt,
                  {
                    fontSize: dimensionsCalculation(16),
                  },
                ]}
                containerStyle={[
                  styles.actionBtn,
                  {
                    width: null,
                    alignSelf: 'stretch',
                    marginHorizontal: dimensionsCalculation(10),
                    marginTop: dimensionsCalculation(10),
                    marginBottom: 0,
                    borderRadius: dimensionsCalculation(5),
                  },
                ]}
              />
              {false && (
                <>
                  <AppTouchableOpacity
                    androidRippleColor={AppColors.androidRippleColor.black15}
                    style={{
                      alignSelf: 'center',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: dimensionsCalculation(10),
                      backgroundColor: AppColors.white,
                      elevation: 5,
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                      borderRadius: dimensionsCalculation(15),
                      paddingVertical: dimensionsCalculation(10),
                      width: '75%',
                    }}
                    onPress={() => {
                      this.surveyModalRef?.current?.close();
                      const product: any = {
                        product: {
                          id: surveyQuestions[currentQuestion]?.productid,
                          productimage:
                            surveyQuestions[currentQuestion]?.productimage,
                          productname:
                            surveyQuestions[currentQuestion]?.productname,
                        },
                      };
                      push('ProductDetailsScreen', {
                        product,
                      });
                    }}>
                    <View
                      style={{
                        backgroundColor: AppColors.primary,
                        width: dimensionsCalculation(30),
                        height: dimensionsCalculation(30),
                        borderRadius: dimensionsCalculation(15),
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        key={`questionnumber${surveyQuestions[currentQuestion]?.id}`}
                        style={{
                          color: AppColors.white,
                          fontSize: dimensionsCalculation(14),
                        }}>
                        {currentQuestion + 1}
                      </Text>
                    </View>
                    <FastImage
                      source={{
                        uri:
                          surveyQuestions[currentQuestion]?.productimage ?? '',
                      }}
                      style={{
                        width: Dimensions.get('screen').width * 0.5,
                        height: Dimensions.get('screen').width * 0.35,
                      }}
                      fallback
                      defaultSource={require('../../assets/images/qudsLogo.png')}
                      resizeMode="cover"
                    />
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: dimensionsCalculation(15),
                        color: '#575757',
                        marginHorizontal: dimensionsCalculation(10),
                      }}>
                      {surveyQuestions[currentQuestion]?.name}
                    </Text>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: dimensionsCalculation(15),
                        color: AppColors.mainText,
                        marginHorizontal: dimensionsCalculation(10),
                      }}>
                      {surveyQuestions[currentQuestion]?.productname}
                    </Text>
                  </AppTouchableOpacity>
                  <View style={styles.surveyFooter}>
                    <View style={{}}>
                      <AppTouchableOpacity
                        disabled={currentQuestion == 0}
                        androidRippleColor={
                          AppColors.androidRippleColor.black15
                        }
                        style={{}}
                        onPress={() => {
                          // configureNextAnimation();
                          this.setState(
                            {
                              currentQuestion: currentQuestion - 1,
                            },
                            () => { },
                          );
                        }}>
                        <Text
                          style={{
                            color:
                              currentQuestion > 0
                                ? AppColors.mainText
                                : AppColors.white,
                            textDecorationLine: 'underline',
                          }}>
                          {Languages.Back}
                        </Text>
                      </AppTouchableOpacity>
                    </View>
                    <View style={styles.dotsContainer}>
                      {surveyQuestions?.map((_, index) => (
                        <AppIcon
                          name={
                            index == currentQuestion ? 'circle' : 'circle-thin'
                          }
                          type="FontAwesome"
                          size={dimensionsCalculation(13)}
                          color={AppColors.mainText}
                        />
                      ))}
                    </View>
                    <AppTouchableOpacity
                      androidRippleColor={
                        isLastQuestion
                          ? AppColors.androidRippleColor.white
                          : AppColors.androidRippleColor.black15
                      }
                      style={{
                        padding: dimensionsCalculation(5),
                        backgroundColor: AppColors.transparent,
                        borderRadius: dimensionsCalculation(10),
                      }}
                      onPress={() => {
                        if (isLastQuestion) {
                          this.surveyModalRef?.current?.close();
                          this.addToCart();
                        } else {
                          // configureNextAnimation();
                          this.setState(
                            {
                              currentQuestion: currentQuestion + 1,
                            },
                            () => { },
                          );
                        }
                      }}>
                      <Text
                        style={{
                          textDecorationLine: 'underline',
                          color: AppColors.mainText,
                        }}>
                        {isLastQuestion ? Languages.Submit : Languages.Next}
                      </Text>
                    </AppTouchableOpacity>
                  </View>
                </>
              )}
            </>
          ) : (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
              }}>
              <ActivityIndicator color={AppColors.primary} size="large" />
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: fonts.primaryBold,
                  fontSize: dimensionsCalculation(16),
                  color: AppColors.mainText,
                }}>
                {Languages.LoadingQuestions}
              </Text>
            </View>
          )}
        </View>
      </Modal>
    );
  };

  checkColorSize = async (): Promise<boolean> => {
    const { product, selectedColor, selectedSize, quantity } = this.state;
    if (
      (product?.product?.hascolor == '1' || product?.product?.tinting) &&
      !selectedColor
    ) {
      ShowToast(Languages.ShouldSelectColor);
      return false;
    }
    if (product?.product?.hassize == '1' && !selectedSize) {
      ShowToast(Languages.ShouldSelectSize);
      return false;
    }
    if (selectedColor != 'tinting' && quantity < 1) {
      ShowToast(Languages.SpeifyQty);
      return false;
    }
    return true;
  };

  handleAddToCart = async () => {
    const { product, surveyQuestions } = this.state;
    const { user } = this.props;
    if (!user)
      return navigate('LoginScreen', {
        extraAction: () => push('ProductDetailsScreen', { product }),
      });
    if (!user.otpactive)
      return navigate('VerifyOtpScreen', {
        extraAction: () => push('ProductDetailsScreen', { product }),
      });
    this.setState(
      {
        isAddToCartClicked: true,
      },
      () => { },
    );
    const canAddToCart = await this.checkColorSize();
    if (!canAddToCart) return;
    if (
      surveyQuestions?.length > 0
      //|| product?.product?.type == 1
    ) {
      this.surveyModalRef?.current?.open();
    }
    // else if (product?.product?.type == 2) {
    //   this.codeModalRef?.current?.open();
    // }
    else {
      this.addToCart();
    }
  };

  handleAddWishlist = async () => {
    const { product, selectedColor, selectedSize, quantity, productAttribute } =
      this.state;
    const { wishlist, user } = this.props;
    if (!user) return navigate('LoginScreen');
    if (!user.otpactive) return navigate('VerifyOtpScreen');
    const isFavourite =
      wishlist?.findIndex((x) => x?.product?.id == product?.product?.id) != -1;
    if (isFavourite) {
      const result = await removeFromWishlistCall({
        id: product?.product?.id,
      });
      if (result?.data?.result == 1) {
        await this.props.getWishlist();
        // configureNextAnimation();
        ShowToast(Languages.RemovedSuccessfully, 'warning');
      } else {
        ShowToast(Languages.Oops);
      }
    } else {
      const canAddToCart = await this.checkColorSize();
      if (!canAddToCart) return;
      if (!productAttribute) {
        const result = await getProductPriceCall({
          id: product?.product?.id,
          sizeid: selectedSize,
          colorid: selectedColor,
        });
        if (result?.data?.result == 1) {
          const wishlistresult = await addToWishlistCall({
            id: product?.product?.id,
            // colorid: selectedColor == 'tinting' ? null : selectedColor,
            // sizeid: selectedSize,
            quantity,
            tinting: selectedColor == 'tinting' ? '1' : null,
            attrid: result?.data?.attrid,
          });
          if (wishlistresult?.data?.result == 1) {
            await this.props.getWishlist();
            // configureNextAnimation();
            ShowToast(Languages.AddedSuccessfully, 'success');
          } else {
            ShowToast(Languages.Oops);
          }
        }
      } else {
        const result = await addToWishlistCall({
          id: product?.product?.id,
          // colorid: selectedColor == 'tinting' ? null : selectedColor,
          // sizeid: selectedSize,
          quantity,
          tinting: selectedColor == 'tinting' ? '1' : null,
          attrid: productAttribute,
        });
        if (result?.data?.result == 1) {
          await this.props.getWishlist();
          // configureNextAnimation();
          ShowToast(Languages.AddedSuccessfully, 'success');
        } else {
          ShowToast(Languages.Oops);
        }
      }
    }
  };

  checkCode = async () => {
    const { product, code } = this.state;
    if (code?.length == 0) return Alert.alert('', Languages.EnterCode);
    this.setState(
      {
        isCheckingCode: true,
      },
      async () => {
        const result = await checkProductCodeCall({
          // productid: product?.product?.id,
          code,
        });
        if (result?.data?.result == 1) {
          this.codeModalRef.current?.close();
          await this.addToCart();
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
        backdrop={false}
        backButtonClose
        swipeToClose={false}
        coverScreen
        onClosed={() => { }}
        style={styles.modalStyle}>
        <AppTouchableOpacity
          disabled={isCheckingCode}
          androidRippleColor={AppColors.transparent}
          style={[
            styles.modalBackdrop,
            { backgroundColor: 'rgba(255,255,255,0.1)' },
          ]}
          activeOpacity={1}
          onPress={() => {
            // configureNextScaleAnimation();
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
              marginBottom: isKeyboardShown ? dimensionsCalculation(80) : 0,
              minHeight: null,
              padding: dimensionsCalculation(10),
              borderRadius: dimensionsCalculation(10),
            },
          ]}>
          <TextInput
            placeholder={Languages.TypeHere}
            style={styles.enterCodeInput}
            value={code}
            onChangeText={(code) => {
              this.setState({ code }, () => { });
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

  renderVideoModal = () => {
    const { isVideoModalOpen, product } = this.state;
    return (
      <Modal
        isOpen={isVideoModalOpen}
        onClosed={() => {
          this.setState(
            {
              isVideoModalOpen: false,
            },
            () => { },
          );
        }}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: AppColors.white,
        }}
        coverScreen
        backdropPressToClose={false}
        backButtonClose
        swipeToClose={false}>
        <AppTouchableOpacity
          androidRippleColor={AppColors.androidRippleColor.white}
          style={styles.backBtn}
          // borderless
          onPress={() => {
            this.setState(
              {
                isVideoModalOpen: false,
              },
              () => { },
            );
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
            uri: `https://www.youtube.com/embed/${product?.product?.youtubecode}?rel=0`,
          }}
          startInLoadingState
          renderLoading={() => <LoadingSpinner overlay />}
        />
      </Modal>
    );
  };

  downloadFile = async () => {
    const { product, infoModalContent } = this.state;
    const url =
      infoModalContent == 'certificate'
        ? product?.product?.certificateattach
        : infoModalContent == 'msds'
          ? product?.product?.msdsattach
          : infoModalContent == 'tds'
            ? product?.product?.tdsattache
            : null;
    if (!!url) {
      Linking.openURL(url);
    }
    this.setState(
      {
        infoModalContent: null,
      },
      () => { },
    );
    // const {config, fs} = RNFetchBlob;
    // const result = await requestExternalStoragePermission();
    // if (result?.granted) {
    //   let direction = fs.dirs.DownloadDir;
    //   let options = {
    //     fileCache: true,
    //     addAndroidDownloads: {
    //       useDownloadManager: true,
    //       notification: true,
    //       path: `${direction}/${
    //         infoModalContent == 'certificate'
    //           ? 'CERTIFICATE'
    //           : infoModalContent == 'msds'
    //           ? 'MSDS'
    //           : infoModalContent == 'tds'
    //           ? 'TDS'
    //           : ''
    //       }_${product?.product?.id}_${Math.floor(
    //         new Date().getTime() + new Date().getSeconds() / 2,
    //       )}`,
    //       description: 'Downloading ...',
    //     },
    //   };
    //   __DEV__ &&
    //     console.log(
    //       JSON.stringify(
    //         infoModalContent == 'certificate'
    //           ? product?.product?.certificateattach
    //           : infoModalContent == 'msds'
    //           ? product?.product?.msdsattach
    //           : infoModalContent == 'tds'
    //           ? product?.product?.tdsattache
    //           : null,
    //       ),
    //     );
    //   config(options)
    //     .fetch(
    //       'GET',
    //       infoModalContent == 'certificate'
    //         ? product?.product?.certificateattach
    //         : infoModalContent == 'msds'
    //         ? product?.product?.msdsattach
    //         : infoModalContent == 'tds'
    //         ? product?.product?.tdsattache
    //         : null,
    //     )
    //     .then((res) => {
    //       this.setState(
    //         {
    //           infoModalContent: null,
    //         },
    //         () => {},
    //       );
    //       // __DEV__ && console.log('res', JSON.stringify(res));
    //     })
    //     .catch((err) => {
    //       __DEV__ && console.error('error', err + '');
    //       this.setState(
    //         {
    //           infoModalContent: null,
    //         },
    //         () => {},
    //       );
    //     });
    // } else {
    //   this.setState(
    //     {
    //       infoModalContent: null,
    //     },
    //     () => {},
    //   );
    // }
  };

  addPhone = () => {
    const { phone, isValidPhone } = this.state;
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
                extraAction: () => this.bookCallModalRef?.current?.open(),
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

  render() {
    const {
      isLoading,
      isRefreshing,
      product,
      realtedProducts,
      isRelatedProductsFetching,
      quantity,
      isKeyboardShown,
      price,
      oldprice,
      productQuantity,
      isAddToCartClicked,
      selectedColor,
      selectedSize,
      isColorSizeChange,
      showSizes,
      viewHeight,
      selectedTab,
      scrollX,
    } = this.state;
    const { wishlist } = this.props;
    const isFavourite =
      wishlist?.findIndex((x) => x?.product?.id == product?.product?.id) != -1;
    const showTDSMSDSview =
      product?.product?.msds ||
      (product?.product?.msdsattach &&
        product?.product?.msdsattach?.split('/')[
        product?.product?.msdsattach?.split('/')?.length - 1
        ] != '') ||
      product?.product?.msds ||
      (product?.product?.msdsattach &&
        product?.product?.msdsattach?.split('/')[
        product?.product?.msdsattach?.split('/')?.length - 1
        ] != '');
    const isOutOfStock =
      ((product?.product?.hassizecolor == '1' &&
        selectedColor &&
        selectedColor != 'tinting' &&
        selectedSize) ||
        (product?.product?.hascolor == '1' &&
          selectedColor &&
          selectedColor != 'tinting' &&
          product?.product?.hassize == '0') ||
        (product?.product?.hassize == '1' &&
          selectedSize &&
          product?.product?.hascolor == '0')) &&
      !productQuantity;
    const scale = scrollX.interpolate({
      inputRange: [0, Dimensions.get('screen').width],
      outputRange: [1, 0.7],
      extrapolate: 'clamp',
    });
    return (
      <View style={styles.container}>
        <AppHeader />
        {/* <AppTabBar /> */}
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
        {this.renderPhoneModal()}
        {this.renderSurveyModal()}
        {this.renderCertificateModal()}
        {this.renderImageModal()}
        {this.renderBookCallModal()}
        {!!product?.product?.youtubecode && this.renderVideoModal()}
        {product?.product?.type == 2 && this.renderCodeModal()}
        {isLoading || isRefreshing ? (
          <LoadingSpinner overlay />
        ) : (
          <>
            {/* {isColorSizeChange && <LoadingSpinner overlay />} */}
            <Animated.ScrollView
              ref={this.scrollviewRef}
              key={`scrollViewProduct${product?.product?.id}`}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {
                        y: scrollX,
                      },
                    },
                  },
                ],
                { useNativeDriver: true },
              )}
              scrollEventThrottle={16}
              contentContainerStyle={[
                styles.scrollView,
                !isIOS &&
                isKeyboardShown && {
                  paddingBottom: dimensionsCalculation(50),
                },
              ]}>
              <Animated.View
                style={{
                  padding: dimensionsCalculation(20),
                  paddingTop:
                    Constants.headerHeight + dimensionsCalculation(20),
                  height: Dimensions.get('screen').width * 1.2,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Animated.View
                  key={`scrollViewProduct${product?.product?.id}`}
                  style={{
                    width: '100%',
                    flex: 1,
                    transform: [
                      {
                        scale,
                      },
                    ],
                  }}>
                  <ImageBackground
                    source={require('../../assets/images/prodBack.png')}
                    resizeMode="contain"
                    style={{
                      width: '100%',
                      flex: 1,
                    }}>
                    <AppTouchableOpacity
                      androidRippleColor={AppColors.transparent}
                      activeOpacity={1}
                      style={{
                        flex: 1,
                      }}
                      onPress={() => {
                        this.photoModalRef.current.open();
                      }}>
                      <FastImage
                        source={{
                          uri: product?.product?.image ?? '',
                        }}
                        fallback
                        defaultSource={require('../../assets/images/qudsLogo.png')}
                        style={[
                          styles.productImage,
                          {
                            margin: dimensionsCalculation(20),
                          },
                        ]}
                        resizeMode="contain"
                      />
                    </AppTouchableOpacity>
                  </ImageBackground>
                </Animated.View>
                <AppTouchableOpacity
                  borderless
                  style={styles.zoomIn}
                  onPress={() => {
                    this.photoModalRef?.current?.open();
                  }}>
                  <AppIcon
                    type="MaterialIcons"
                    name="zoom-in"
                    size={dimensionsCalculation(33)}
                    color={AppColors.primary}
                  />
                </AppTouchableOpacity>
                <AppTouchableOpacity
                  borderless
                  style={[
                    styles.zoomIn,
                    { left: null, right: dimensionsCalculation(15) },
                  ]}
                  onPress={this.handleAddWishlist}>
                  <AppIcon
                    style={{}}
                    name={isFavourite ? 'heart' : 'hearto'}
                    type="AntDesign"
                    size={dimensionsCalculation(28)}
                    color={
                      isFavourite ? AppColors.secondary : AppColors.mainText
                    }
                  />
                </AppTouchableOpacity>
              </Animated.View>
              <View
                style={{
                  backgroundColor: AppColors.white,
                  elevation: 10,
                  paddingVertical: dimensionsCalculation(20),
                  paddingBottom:
                    Constants.tabBarHeight + dimensionsCalculation(60),
                }}>
                <View
                  style={{
                    paddingHorizontal: dimensionsCalculation(20),
                    marginBottom: dimensionsCalculation(5),
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.productName}>
                    {product?.product?.name}
                  </Text>
                  {false && isOutOfStock && !isLoading && (
                    <Text
                      style={{
                        fontSize: dimensionsCalculation(16),
                        color: 'red',
                        marginLeft: dimensionsCalculation(10),
                      }}>
                      ({Languages.OutOfStock})
                    </Text>
                  )}
                </View>
                <View
                  style={[
                    styles.priceContainer,
                    {
                      paddingHorizontal: dimensionsCalculation(20),
                      marginBottom: dimensionsCalculation(10),
                    },
                  ]}>
                  <Text
                    style={[
                      styles.productPrice,
                      selectedColor == 'tinting' && {
                        fontSize: dimensionsCalculation(13),
                      },
                    ]}>
                    {isColorSizeChange
                      ? ' '
                      : selectedColor == 'tinting'
                        ? Languages.PriceSupport
                        : price != '' &&
                          price != null &&
                          price != undefined &&
                          price != '0'
                          ? `${price?.toString() ?? ''} ${Languages.JOD}`
                          : Languages.PriceOnSelection}
                  </Text>
                  {selectedColor != 'tinting' &&
                    oldprice != '' &&
                    oldprice != null &&
                    oldprice != undefined &&
                    oldprice != '0' && (
                      <Text
                        style={{
                          color: 'rgba(0,0,0,0.7)',
                          textDecorationLine: isColorSizeChange
                            ? 'none'
                            : 'line-through',
                          fontSize: dimensionsCalculation(23),
                          paddingHorizontal: dimensionsCalculation(10),
                        }}>
                        {isColorSizeChange
                          ? ' '
                          : `${oldprice?.toString() ?? ''} ${Languages.JOD}`}
                      </Text>
                    )}
                  {isColorSizeChange && (
                    <ActivityIndicator color={AppColors.primary} size="small" />
                  )}
                </View>
                {(product?.product?.hascolor == '1' ||
                  product?.product?.tinting) && (
                    <View
                      style={{
                        marginTop: dimensionsCalculation(10),
                        backgroundColor: '#F7F7F7',
                        paddingTop: dimensionsCalculation(10),
                        paddingBottom:
                          product?.product?.hassize == '1'
                            ? 0
                            : dimensionsCalculation(10),
                        paddingHorizontal: dimensionsCalculation(20),
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginBottom: dimensionsCalculation(10),
                        }}>
                        <Text
                          style={[
                            styles.selectedColor,
                            { marginBottom: dimensionsCalculation(0) },
                            isAddToCartClicked &&
                            !selectedColor && { color: 'red' },
                          ]}>
                          {`${Languages.Color}`}
                        </Text>
                        {selectedColor != null && selectedColor != 'tinting' && (
                          <Text
                            style={{
                              flex: 1,
                              left: dimensionsCalculation(5),
                              color: `#${this.getColorCode()}`,
                              fontFamily: fonts.primaryBold,
                              fontSize: dimensionsCalculation(12),
                              textAlign: 'left',
                            }}
                            numberOfLines={1}>
                            {`${selectedColor != null && selectedColor != 'tinting'
                              ? '(' +
                              product?.product?.colors?.find(
                                (x) => x?.id == selectedColor,
                              )?.name +
                              ')'
                              : ''
                              }`}
                          </Text>
                        )}
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          // paddingHorizontal: dimensionsCalculation(10),
                        }}>
                        {(product?.product?.tinting
                          ? [
                            ...product?.product?.colors?.filter(
                              (x) => x?.id != '249',
                            ),
                            { id: 'tinting', isTinting: true },
                          ]
                          : product?.product?.colors?.filter(
                            (x) => x?.id != '249',
                          )
                        )?.map((item, index) =>
                          this.renderColor({
                            item,
                            index,
                          }),
                        )}
                      </View>
                    </View>
                  )}
                {product?.product?.hassize == '1' && (
                  <View
                    style={{
                      backgroundColor: '#F7F7F7',
                      paddingTop:
                        product?.product?.hascolor == '0'
                          ? dimensionsCalculation(10)
                          : 0,
                      paddingHorizontal: dimensionsCalculation(20),
                      paddingBottom: dimensionsCalculation(10),
                    }}>
                    <Text
                      style={[
                        styles.selectedColor,
                        isAddToCartClicked && !selectedSize && { color: 'red' },
                      ]}>
                      {Languages.Size}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                      }}>
                      {product?.product?.sizes?.map((item, index) =>
                        this.renderSize({
                          item,
                          index,
                        }),
                      )}
                    </View>
                  </View>
                )}
                <View
                  style={{
                    backgroundColor: '#F7F7F7',
                    paddingBottom: dimensionsCalculation(20),
                  }}>
                  <View
                    style={[
                      styles.qtyBtn,
                      {
                        marginTop:
                          product?.product?.hascolor == '0' &&
                            product?.product?.hassize == '0'
                            ? dimensionsCalculation(20)
                            : null,
                        marginHorizontal: dimensionsCalculation(20),
                      },
                    ]}>
                    <Text
                      style={{
                        fontSize: dimensionsCalculation(16),
                        fontFamily: fonts.primaryBold,
                      }}>
                      {Languages.Quantity}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <AppTouchableOpacity
                        androidRippleColor={AppColors.androidRippleColor.white}
                        style={{
                          alignItems: 'center',
                          width: dimensionsCalculation(50),
                          borderTopLeftRadius: dimensionsCalculation(10),
                          borderBottomLeftRadius: dimensionsCalculation(10),
                          justifyContent: 'center',
                          borderRadius: 0,
                        }}
                        disabled={quantity <= 1 || isOutOfStock}
                        onPress={() => {
                          this.setState(
                            {
                              quantity: quantity - 1,
                            },
                            () => { },
                          );
                        }}>
                        <AppIcon
                          name="minus"
                          size={dimensionsCalculation(20)}
                          color={
                            quantity <= 1 || isOutOfStock
                              ? 'gray'
                              : isAddToCartClicked && !quantity
                                ? 'red'
                                : AppColors.primary
                          }
                          type="AntDesign"
                        />
                      </AppTouchableOpacity>
                      <TextInput
                        editable={!!price && !isOutOfStock}
                        defaultValue={quantity?.toString()}
                        onChangeText={(value) => {
                          this.setState(
                            {
                              quantity: value ? parseInt(value) : null,
                            },
                            () => { },
                          );
                        }}
                        style={{
                          padding: 0,
                          flexGrow: 0,
                          color: isOutOfStock
                            ? 'gray'
                            : isAddToCartClicked && !quantity
                              ? 'red'
                              : AppColors.mainText,
                          textAlign: 'center',
                          paddingHorizontal: dimensionsCalculation(10),
                          fontSize: dimensionsCalculation(16),
                          fontFamily: fonts.primaryBold,
                        }}
                        ref={this.qtyInputRef}
                        maxLength={7}
                        onBlur={() => {
                          this.setState(
                            {
                              isKeyboardShown: false,
                            },
                            () => { },
                          );
                          if (!quantity)
                            return this.setState({ quantity: 1 }, () => { });
                          if (
                            selectedColor != 'tinting' &&
                            quantity > productQuantity
                          ) {
                            ShowToast(
                              Languages.OnlyAvailableStock?.replace(
                                '{0}',
                                productQuantity?.toString(),
                              ),
                            );
                            return this.setState(
                              { quantity: productQuantity },
                              () => { },
                            );
                          }
                        }}
                        onFocus={() => {
                          this.setState(
                            {
                              isKeyboardShown: true,
                            },
                            () => {
                              setTimeout(() => {
                                this.qtyInputRef.current.measure(
                                  (x, y, width, height, pageX, pageY) => {
                                    this.scrollviewRef.current.scrollTo({
                                      y: pageY + 20,
                                      animated: true,
                                    });
                                  },
                                );
                              }, 250);
                            },
                          );
                        }}
                        keyboardType="numeric"
                      />
                      <AppTouchableOpacity
                        androidRippleColor={AppColors.androidRippleColor.white}
                        style={{
                          alignItems: 'center',
                          width: dimensionsCalculation(50),
                          borderTopRightRadius: dimensionsCalculation(10),
                          borderBottomRightRadius: dimensionsCalculation(10),
                          justifyContent: 'center',
                          borderRadius: 0,
                        }}
                        disabled={
                          isOutOfStock ||
                          (selectedColor != 'tinting' &&
                            quantity >= productQuantity)
                        }
                        onPress={() => {
                          this.setState(
                            {
                              quantity: quantity + 1,
                            },
                            () => { },
                          );
                        }}>
                        <AppIcon
                          name="plus"
                          size={dimensionsCalculation(20)}
                          color={
                            isOutOfStock ||
                              (selectedColor != 'tinting' &&
                                quantity >= productQuantity)
                              ? 'gray'
                              : isAddToCartClicked && !quantity
                                ? 'red'
                                : AppColors.primary
                          }
                          type="FontAwesome"
                        />
                      </AppTouchableOpacity>
                    </View>
                  </View>
                </View>
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderBottomColor: 'rgba(0,0,0,0.3)',
                      borderBottomWidth: 0.5,
                    }}>
                    {!!product?.product?.description && (
                      <AppButton
                        onPress={() => {
                          this.setState(
                            {
                              selectedTab: 'description',
                            },
                            () => { },
                          );
                        }}
                        textColor={AppColors.black}
                        text={Languages.Description}
                        containerStyle={{
                          borderBottomWidth: 3,
                          borderBottomColor:
                            selectedTab == 'description'
                              ? AppColors.black
                              : AppColors.white,
                          backgroundColor: AppColors.white,
                          paddingLeft: dimensionsCalculation(20),
                          paddingRight: dimensionsCalculation(20),
                          borderRadius: 0,
                          paddingVertical: dimensionsCalculation(10),
                        }}
                      />
                    )}
                    {(!!product?.product?.tinting ||
                      (product?.product?.certificateattach &&
                        product?.product?.certificateattach?.split('/')[
                        product?.product?.certificateattach?.split('/')
                          ?.length - 1
                        ] != '') ||
                      (product?.product?.tdsattache &&
                        product?.product?.tdsattache?.split('/')[
                        product?.product?.tdsattache?.split('/')?.length - 1
                        ] != '') ||
                      (product?.product?.msdsattach &&
                        product?.product?.msdsattach?.split('/')[
                        product?.product?.msdsattach?.split('/')?.length - 1
                        ] != '')) && (
                        <AppButton
                          onPress={() => {
                            this.setState(
                              {
                                selectedTab: 'certificate',
                              },
                              () => { },
                            );
                          }}
                          textColor={AppColors.black}
                          text={Languages.Specs}
                          containerStyle={{
                            borderBottomWidth: 3,
                            borderBottomColor:
                              selectedTab == 'certificate'
                                ? AppColors.black
                                : AppColors.white,
                            backgroundColor: AppColors.white,
                            paddingHorizontal: dimensionsCalculation(10),
                            borderRadius: 0,
                            paddingVertical: dimensionsCalculation(10),
                          }}
                        />
                      )}
                    {!!product?.product?.youtubecode && (
                      <AppButton
                        onPress={() => {
                          this.setState(
                            {
                              isVideoModalOpen: true,
                            },
                            () => { },
                          );
                        }}
                        textColor={AppColors.black}
                        text={Languages.Video}
                        containerStyle={{
                          // borderBottomWidth: 3,
                          borderBottomColor: AppColors.black,
                          backgroundColor: AppColors.white,
                          paddingHorizontal: dimensionsCalculation(10),
                          borderRadius: 0,
                          paddingVertical: dimensionsCalculation(10),
                        }}
                      />
                    )}
                  </View>
                  {selectedTab == 'description' &&
                    !!product?.product?.description && (
                      <AutoHeightWebView
                        scalesPageToFit={false}
                        key={`webViewProduct${product?.product?.id}`}
                        source={{
                          html: `<html dir="${Languages.langDirection}"><head>
                          <style>
                          body {
                            -webkit-touch-callout: none;
                            -webkit-user-select: none;
                            -khtml-user-select: none;
                            -moz-user-select: none;
                            -ms-user-select: none;
                            user-select: none;
                          }</style>
                          <meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body style="text-align: ${isRTL ? 'right' : 'left'
                            };
                    padding-left: ${dimensionsCalculation(20)}px;
                       padding-right: ${dimensionsCalculation(20)}px;
                      "><p style="text-align: ${isRTL ? 'right' : 'left'
                            } !important">${product?.product?.description ?? ''
                            }</p></body></html>`,
                        }}
                        style={{
                          opacity: 0.99,
                          overflow: 'hidden',
                          marginTop: dimensionsCalculation(10),
                          width: Dimensions.get('screen').width,
                        }}
                      />
                    )}
                  {selectedTab == 'certificate' && (
                    <View
                      style={[
                        styles.actionsContainer,
                        product?.product?.type == 2 &&
                        !realtedProducts?.length && {
                          marginBottom: dimensionsCalculation(70),
                        },
                      ]}>
                      {!!product?.product?.tinting &&
                        this.renderAction({
                          onPress: () => push('ColorsScreen'),
                          text: Languages.Tinting,
                          icon: require('../../assets/images/tinting2.png'),
                          iconType: 'Image',
                          useIconDefaultColors: true,
                        })}
                      {product?.product?.type == 2 &&
                        this.renderAction({
                          text: Languages.BookCall,
                          icon: 'calendar',
                          iconType: 'AntDesign',
                          onPress: () => {
                            const { user } = this.props;
                            if (!user)
                              return navigate('LoginScreen', {
                                extraAction: () => {
                                  push('ProductDetailsScreen', { product });
                                  this.bookCallModalRef?.current?.open();
                                },
                              });
                            if (!user.phone)
                              return this.phoneModalRef?.current?.open();
                            if (!user.otpactive)
                              return push('VerifyOtpScreen', {
                                type: VerifyCodeScreenNavigateType.checkout,
                                extraAction: () =>
                                  this.bookCallModalRef?.current?.open(),
                              });
                            this.bookCallModalRef?.current?.open();
                          },
                        })}
                      {product?.product?.certificateattach &&
                        product?.product?.certificateattach?.split('/')[
                        product?.product?.certificateattach?.split('/')
                          ?.length - 1
                        ] != '' &&
                        this.renderAction({
                          onPress: () => {
                            this.setState(
                              {
                                infoModalContent: 'certificate',
                                isInfoModalOpen: isIOS,
                              },
                              async () => {
                                !isIOS && this.downloadFile();
                              },
                            );
                          },
                          text: Languages.Certificate.toUpperCase(),
                          icon: isIOS ? null : 'download',
                          iconType: 'Feather',
                        })}
                      {product?.product?.tdsattache &&
                        product?.product?.tdsattache?.split('/')[
                        product?.product?.tdsattache?.split('/')?.length - 1
                        ] != '' &&
                        this.renderAction({
                          onPress: () => {
                            this.setState(
                              {
                                infoModalContent: 'tds',
                                isInfoModalOpen: isIOS,
                              },
                              async () => {
                                !isIOS && this.downloadFile();
                              },
                            );
                          },
                          text: Languages.TDS.toUpperCase(),
                          icon: isIOS ? null : 'download',
                          iconType: 'Feather',
                        })}
                      {product?.product?.msdsattach &&
                        product?.product?.msdsattach?.split('/')[
                        product?.product?.msdsattach?.split('/')?.length - 1
                        ] != '' &&
                        this.renderAction({
                          onPress: () => {
                            this.setState(
                              {
                                infoModalContent: 'msds',
                                isInfoModalOpen: isIOS,
                              },
                              async () => {
                                !isIOS && this.downloadFile();
                              },
                            );
                          },
                          text: Languages.MSDS.toUpperCase(),
                          icon: isIOS ? null : 'download',
                          iconType: 'Feather',
                        })}
                    </View>
                  )}
                </View>
                {realtedProducts?.length > 0 && (
                  <View style={styles.relatedContainer}>
                    <Text style={styles.relatedTxt}>
                      {Languages.RelatedItems}
                    </Text>
                    <FlatList
                      contentContainerStyle={{
                        paddingHorizontal: dimensionsCalculation(10),
                        paddingVertical: dimensionsCalculation(10),
                        paddingLeft: dimensionsCalculation(20),
                        flexGrow: 1,
                      }}
                      showsHorizontalScrollIndicator={false}
                      horizontal
                      keyExtractor={(item, index) => index.toString()}
                      data={realtedProducts}
                      ListEmptyComponent={
                        isRelatedProductsFetching ? (
                          <View
                            style={{
                              alignSelf: 'center',
                              justifyContent: 'center',
                              alignItems: 'center',
                              flexGrow: 1,
                            }}>
                            <ActivityIndicator
                              color={AppColors.primary}
                              size={'large'}
                            />
                          </View>
                        ) : null
                      }
                      renderItem={this.renderRelatedProduct}
                    />
                  </View>
                )}
              </View>
            </Animated.ScrollView>
          </>
        )}
        {!isKeyboardShown && (
          <View style={styles.bottomView}>
            <AppButton
              androidRippleColor={AppColors.androidRippleColor.black15}
              onPress={this.handleAddToCart}
              containerStyle={{
                backgroundColor: AppColors.primary,
                flex: 1,
                height: dimensionsCalculation(40),
              }}
              textColor={AppColors.white}
              text={Languages.AddToCart}
              icon="shoppingcart"
              iconType="AntDesign"
            />
            <AppButton
              androidRippleColor={AppColors.androidRippleColor.black15}
              onPress={() => {
                push('PaintCalculatorScreen', { product });
              }}
              containerStyle={{
                backgroundColor: AppColors.primary,
                flex: 1,
                marginLeft: dimensionsCalculation(10),
                height: dimensionsCalculation(40),
              }}
              textColor={AppColors.white}
              textStyle={{
                // flex: 1,
                maxWidth: '90%',
                fontSize: dimensionsCalculation(isIOS ? 14 : 20),
              }}
              text={Languages.PaintCalculator}
              adjustsFontSizeToFit
              numberOfLines={1}
              icon="calculator"
              iconType="FontAwesome"
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
    wishlist: auth?.wishlist,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    addToCart: (
      product,
      selectedColor,
      selectedSize,
      quantity,
      tinting,
      productAttribute,
    ) => {
      return dispatch(
        addToCartAction(
          product,
          selectedColor,
          selectedSize,
          quantity,
          tinting,
          productAttribute,
        ),
      );
    },
    getWishlist: () => {
      return dispatch(getWishlistAction());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProductDetailsScreen);

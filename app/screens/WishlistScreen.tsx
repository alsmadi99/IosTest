import { AppIcon, Constants, fonts, Languages } from '../common';
import {
  Product,
  QudsPaintsStore,
  WishlistScreenProps,
  WishlistScreenState,
} from '../common/Types';
import {
  AppButton,
  AppHeader,
  AppTabBar,
  AppTouchableOpacity,
  ImageHeader,
  LoadingSpinner,
} from '../components';
import { push } from '../navigation';
import React, { Component, createRef } from 'react';
import { RefObject } from 'react';
import { Dispatch } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  ScrollView,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modalbox';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import {
  getProductQuestionsCall,
  removeFromWishlistCall,
} from '../services/api/calls';
import { getWishlistAction } from '../store/actions/AuthActions';
import { addToCartAction } from '../store/actions/CartActions';
import { AppColors } from '../theme';
import {
  configureNextAnimation,
  configureNextScaleAnimation,
  dimensionsCalculation,
  ShowToast,
} from '../utils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  listStyle: {
    flexGrow: 1,
    paddingBottom: Constants.tabBarHeight + dimensionsCalculation(20),
    paddingTop: Constants.headerHeight,
  },
  listTableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: dimensionsCalculation(20),
    paddingLeft: dimensionsCalculation(10),
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
    left: dimensionsCalculation(-20),
  },
  itemImage: {
    width: dimensionsCalculation(60),
    height: dimensionsCalculation(40),
    marginHorizontal: dimensionsCalculation(5),
  },
  listCell: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    overflow: 'visible',
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
  actionBtn: {
    width: '30%',
    justifyContent: 'center',
    marginBottom: dimensionsCalculation(10),
    height: dimensionsCalculation(30),
    borderRadius: dimensionsCalculation(10),
    marginRight: dimensionsCalculation(10),
  },
  actionTxt: {
    marginRight: dimensionsCalculation(2),
    fontFamily: fonts.primaryRegular,
    fontSize: dimensionsCalculation(12),
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
});

class WishlistScreen extends Component<
  WishlistScreenProps,
  WishlistScreenState
> {
  surveyModalRef: RefObject<Modal> = null;
  constructor(props: WishlistScreenProps) {
    super(props);
    this.state = {
      isLoading: true,
      isRefreshing: false,
      isFetchingMore: false,
      selectedProduct: null,
      currentQuestion: 0,
      surveyQuestions: [],
    };
    this.surveyModalRef = createRef();
  }

  componentDidMount = () => {
    this.getMyWishlist();
  };

  getMyWishlist = async (
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
        await this.props.getWishlist();
        configureNextScaleAnimation();
        this.setState(
          {
            isLoading: false,
            isRefreshing: false,
            isFetchingMore: false,
          },
          () => { },
        );
      },
    );
  };

  addToCart = async (product: Product) => {
    const success = await this.props.addToCart(
      product?.product?.id,
      product?.product?.tinting ? null : product?.product?.colorid,
      product?.product?.sizeid,
      product?.product?.quantity,
      product?.product?.tinting ? '1' : null,
      product?.product?.attrid,
    );
    if (success) {
      const result = await removeFromWishlistCall({
        id: product?.product?.id,
      });
      if (result?.data?.result == 1) {
        await this.props.getWishlist();
      }
    }
    this.setState({ isLoading: false }, () => { });
  };

  renderWishlistItem = ({ item, index }: { item: Product; index: number }) => {
    const { wishlist } = this.props;
    return (
      <View
        style={[
          styles.listTableHeader,
          { paddingTop: dimensionsCalculation(10) },
          index == wishlist?.length - 1 && { borderBottomWidth: 0 },
        ]}>
        <AppTouchableOpacity
          androidRippleColor={AppColors.androidRippleColor.white}
          onPress={() => {
            push('ProductDetailsScreen', {
              product: item,
            });
          }}
          style={styles.heartContainer}>
          <AppIcon
            name="hearto"
            type="AntDesign"
            size={dimensionsCalculation(16)}
            color="red"
          />
          <FastImage
            source={{
              uri: item?.product?.image,
            }}
            resizeMode="contain"
            fallback
            defaultSource={require('../../assets/images/qudsLogo.png')}
            style={styles.itemImage}
          />
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
            }}>
            <Text style={{ textAlign: 'left' }} numberOfLines={2}>
              {`${item?.product?.quantity} x ${item?.product?.name}`}
            </Text>
            {!!item?.product?.colorname && (
              <Text
                style={{ color: AppColors.mainText, textAlign: 'left' }}
                numberOfLines={1}>
                {item?.product?.colorname}
              </Text>
            )}
            {!!item?.product?.sizename && (
              <Text
                style={{ color: AppColors.mainText, textAlign: 'left' }}
                numberOfLines={1}>
                {item?.product?.sizename}
              </Text>
            )}
          </View>
        </AppTouchableOpacity>
        <View style={styles.tableHeaderSide}>
          <AppTouchableOpacity
            androidRippleColor={AppColors.androidRippleColor.black15}
            borderless
            onPress={() => {
              this.setState(
                {
                  isLoading: true,
                },
                async () => {
                  const result = await getProductQuestionsCall({
                    id: item.product.id,
                  });
                  if (result.data?.questions?.length > 0) {
                    this.setState(
                      {
                        selectedProduct: {
                          product: item?.product,
                        },
                        surveyQuestions: result.data?.questions,
                        isLoading: false,
                      },
                      () => {
                        this.surveyModalRef?.current?.open();
                      },
                    );
                  } else {
                    await this.addToCart(item);
                    this.setState({ isLoading: false }, () => { });
                  }
                },
              );
            }}
            style={styles.listCell}>
            <AppIcon
              name={require('../../assets/images/addToCart.png')}
              useDefaultColors
              type="Image"
              size={dimensionsCalculation(30)}
              color="red"
            />
          </AppTouchableOpacity>
          <AppTouchableOpacity
            androidRippleColor={AppColors.androidRippleColor.black15}
            borderless
            onPress={() => {
              this.setState(
                {
                  isRefreshing: true,
                },
                async () => {
                  const result = await removeFromWishlistCall({
                    id: item?.product?.id,
                  });
                  if (result?.data?.result == 1) {
                    ShowToast(Languages.RemovedSuccessfully, 'warning');
                    await this.props.getWishlist();
                  } else {
                    ShowToast(Languages.Oops);
                  }
                  this.setState(
                    {
                      isRefreshing: false,
                    },
                    () => { },
                  );
                },
              );
            }}
            style={styles.listCell}>
            <AppIcon
              name="closecircleo"
              type="AntDesign"
              size={dimensionsCalculation(18)}
              color="#333"
            />
          </AppTouchableOpacity>
        </View>
      </View>
    );
  };

  renderSurveyModal = () => {
    const { surveyQuestions, currentQuestion, selectedProduct } = this.state;
    const isLastQuestion = currentQuestion == surveyQuestions?.length - 1;
    return (
      <Modal
        ref={this.surveyModalRef}
        statusBarTranslucent
        backdrop={false}
        backButtonClose
        swipeToClose={false}
        coverScreen
        onClosed={() => {
          this.setState(
            {
              currentQuestion: 0,
              surveyQuestions: [],
              selectedProduct: null,
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
                        const product: Product = {
                          product: {
                            id: x?.productid,
                            productimage: x?.productimage,
                            productname: x?.productname,
                          } as any,
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
                  this.addToCart(selectedProduct);
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
                      const product: Product = {
                        product: {
                          id: surveyQuestions[currentQuestion]?.productid,
                          productimage:
                            surveyQuestions[currentQuestion]?.productimage,
                          productname:
                            surveyQuestions[currentQuestion]?.productname,
                        } as any,
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
                          configureNextAnimation();
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
                          this.addToCart(selectedProduct);
                        } else {
                          configureNextAnimation();
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

  render() {
    const { isLoading, isRefreshing, isFetchingMore } = this.state;
    const { wishlist } = this.props;
    return (
      <View style={styles.container}>
        <AppHeader activeScreen="wishlist" />
        <AppTabBar />
        {isRefreshing && <LoadingSpinner overlay />}
        {isLoading && <LoadingSpinner overlay />}
        {this.renderSurveyModal()}
        <FlatList
          ListHeaderComponent={
            wishlist?.length > 0 ? (
              <View style={{}}>
                <ImageHeader
                  source={require('../../assets/images/wishlist.png')}
                  hideMenuButton
                  style={{
                    marginBottom: dimensionsCalculation(30),
                    width: Dimensions.get('screen').width * 1.25,
                  }}>
                  <View
                    style={{
                      paddingLeft: dimensionsCalculation(20),
                      height: '100%',
                      justifyContent: 'center',
                      marginTop: -40,
                    }}>
                    <Text
                      style={{
                        fontFamily: fonts.primaryBold,
                        color: AppColors.mainText,
                        fontSize: dimensionsCalculation(25),
                      }}>
                      {Languages.WishList}
                    </Text>
                  </View>
                </ImageHeader>
                <View style={styles.listTableHeader}>
                  <Text style={styles.itemNameHeader}>{Languages.Item}</Text>
                  <View style={styles.tableHeaderSide}>
                    <Text
                      adjustsFontSizeToFit
                      numberOfLines={1}
                      style={[styles.tableHeaderText, {}]}>
                      {Languages.AddToCart}
                    </Text>
                    <Text style={styles.tableHeaderText}>
                      {Languages.Delete}
                    </Text>
                  </View>
                </View>
              </View>
            ) : null
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
              refreshing={isRefreshing}
              onRefresh={() => {
                this.getMyWishlist(false, true, false);
              }}
            />
          }
          onEndReached={() => { }}
          contentContainerStyle={styles.listStyle}
          keyExtractor={(item, index) => index.toString()}
          data={wishlist}
          renderItem={this.renderWishlistItem}
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
                {Languages.EmptyEishlist}
              </Text>
            </View>
          }
        />
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

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return {
    getWishlist: () => {
      return dispatch(getWishlistAction() as any);
    },
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
        ) as any,
      );
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WishlistScreen);

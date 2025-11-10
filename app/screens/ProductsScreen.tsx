import { AppIcon, Constants, fonts, Languages } from '../common';
import {
  Product,
  ProductsScreenProps,
  ProductsScreenState,
  QudsPaintsStore,
} from '../common/Types';
import {
  AppButton,
  AppHeader,
  AppTabBar,
  AppTouchableOpacity,
  ImageHeader,
  LoadingSpinner,
  ProductCard,
} from '../components';
import React, { Component, createRef, RefObject } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  RefreshControl,
  Dimensions,
  TextInput,
  ScrollView,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modalbox';
import { connect } from 'react-redux';
import { AppColors } from '../theme';
import {
  configureNextAnimation,
  configureNextScaleAnimation,
  dimensionsCalculation,
  getBottomSpace,
  isIOS,
  isRTL,
} from '../utils';
import { getColorsCall, productsGetCall } from '../services/api/calls';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  flatListStyle: {
    paddingBottom: Constants.tabBarHeight + dimensionsCalculation(20),
    paddingTop: Constants.headerHeight,
  },
  title: {
    width: '40%',
    alignSelf: isRTL ? 'flex-start' : 'flex-end',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleTxt: {
    fontSize: dimensionsCalculation(25),
    color: AppColors.mainText,
    fontFamily: fonts.primaryBold,
  },
  productsHeader: {
    backgroundColor: AppColors.white,
    paddingHorizontal: dimensionsCalculation(20),
    paddingTop: dimensionsCalculation(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: dimensionsCalculation(20),
  },
  ourProducts: {
    color: '#535353',
    fontSize: dimensionsCalculation(15),
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
    overflow: isIOS ? 'visible' : 'hidden',
    height: dimensionsCalculation(30),
    borderRadius: dimensionsCalculation(15),
    flexDirection: 'row',
    paddingHorizontal: dimensionsCalculation(15),
    marginLeft: dimensionsCalculation(10),
  },
  filtersModal: {
    width: '100%',
    height: '100%',
    backgroundColor: AppColors.transparent,
  },
  modalBackDrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  filtersViewContainer: {
    backgroundColor: AppColors.white,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    overflow: isIOS ? 'hidden' : 'hidden',
    borderWidth: isIOS ? 0.5 : 0,
    borderColor: 'rgba(0,0,0,0.1)',
    top: Constants.headerHeight + dimensionsCalculation(10),
    position: 'absolute',
    bottom: dimensionsCalculation(getBottomSpace() + 30),
    borderTopLeftRadius: !isIOS && isRTL ? 0 : dimensionsCalculation(10),
    borderBottomLeftRadius: !isIOS && isRTL ? 0 : dimensionsCalculation(10),
    borderTopRightRadius: isIOS || !isRTL ? 0 : dimensionsCalculation(10),
    borderBottomRightRadius: isIOS || !isRTL ? 0 : dimensionsCalculation(10),
    alignSelf: 'flex-start',
    padding: dimensionsCalculation(10),
    paddingTop: 0,
  },
  filterSection: {
    paddingLeft: dimensionsCalculation(5),
    marginTop: dimensionsCalculation(3),
    width: dimensionsCalculation(Dimensions.get('screen').width * 0.5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterKey: {
    textAlign: 'left',
    fontFamily: fonts.primaryLight,
    color: AppColors.mainText,
    fontSize: dimensionsCalculation(15),
  },
  priceContainer: {
    marginHorizontal: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    borderRadius: dimensionsCalculation(5),
    padding: dimensionsCalculation(5),
    marginVertical: dimensionsCalculation(9),
    backgroundColor: AppColors.white,
  },
  searchInput: {
    borderColor: AppColors.e5,
    borderWidth: 1,
    marginTop: dimensionsCalculation(5),
    borderRadius: dimensionsCalculation(5),
    marginBottom: dimensionsCalculation(5),
    padding: dimensionsCalculation(5),
    width: '100%',
    textAlignVertical: 'top',
    minHeight: dimensionsCalculation(90),
    textAlign: isRTL ? 'right' : 'left',
  },
});

class ProductsScreen extends Component<
  ProductsScreenProps,
  ProductsScreenState
> {
  filtersModalRef = null as RefObject<Modal>;
  filtersScrollViewRef = null as RefObject<ScrollView>;
  pagenumber = 1;
  constructor(props: ProductsScreenProps) {
    super(props);
    this.state = {
      isLoading: true,
      isRefreshing: false,
      isFetchingMore: false,
      products: [],
      viewPosition: -Dimensions.get('screen').width,
      keyboardHeight: 0,
      disableBackDrop: false,
      sortBy: null,
      pages: 0,
      showAllColors: false,
      availableColors: [],
      selectedColors: [],
      availableMinPrice: 0,
      availableMaxPrice: 0,
      minPrice: null,
      maxPrice: null,
      search: '',
    };
    this.filtersModalRef = createRef();
    this.filtersScrollViewRef = createRef();
  }

  componentDidMount = () => {
    this.getProducts();
    this.getColors();
    Keyboard.addListener('keyboardDidShow', (e) => {
      configureNextAnimation();
      this.setState(
        {
          disableBackDrop: true,
          keyboardHeight: e.endCoordinates.height,
        },
        () => {
          setTimeout(() => {
            this.filtersScrollViewRef?.current?.scrollToEnd({
              animated: true,
            });
          }, 500);
        },
      );
    });
    Keyboard.addListener('keyboardDidHide', () => {
      this.setState(
        {
          disableBackDrop: false,
          keyboardHeight: 0,
        },
        () => { },
      );
    });
  };

  getProducts = (
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
        const { selectedColors, minPrice, maxPrice, search, sortBy } = this.state;
        const result = await productsGetCall({
          p: this.pagenumber++,
          colors: selectedColors?.length > 0 ? selectedColors?.join(',') : null,
          max: maxPrice == 0 ? null : maxPrice,
          min: minPrice == 0 ? null : minPrice,
          search: search != '' ? search : null,
          sortby: sortBy,
          type: this.props.route?.params?.type,
        });
        configureNextScaleAnimation();
        if (result?.data?.products) {
          const newProds = result?.data?.products;
          this.setState(
            {
              products: isRefreshing
                ? newProds
                : [...this.state.products, ...newProds],
              pages: result?.data?.pages,
              availableMinPrice:
                this.pagenumber <= 2
                  ? result?.data?.minprice
                  : this.state.availableMinPrice,
              availableMaxPrice:
                this.pagenumber <= 2
                  ? result?.data?.maxprice
                  : this.state.availableMaxPrice,
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

  getColors = async () => {
    const result = await getColorsCall({
      type: 2,
    });
    if (result.data) {
      this.setState(
        {
          availableColors: result.data,
        },
        () => { },
      );
    }
  };

  componentDidUpdate = (
    prevProps: ProductsScreenProps,
    prevState: ProductsScreenState,
  ) => {
    if (this.props.route?.params?.type != prevProps?.route?.params?.type) {
      this.pagenumber = 1;
      this.getProducts(true, true);
    }
  };

  renderProductCard = ({ item, index }: { item: Product; index: number }) => {
    return <ProductCard product={item} index={index} />;
  };

  renderFiltersModal = () => {
    const {
      viewPosition,
      keyboardHeight,
      disableBackDrop,
      sortBy,
      showAllColors,
      availableColors,
      selectedColors,
      availableMinPrice,
      minPrice,
      availableMaxPrice,
      maxPrice,
      search,
    } = this.state;
    return (
      <Modal
        ref={this.filtersModalRef}
        animationDuration={0}
        statusBarTranslucent
        backButtonClose
        swipeToClose={false}
        backdropPressToClose={false}
        backdrop={false}
        style={styles.filtersModal}
        coverScreen
        onClosed={() => {
          this.setState(
            {
              viewPosition: -Dimensions.get('screen').width,
            },
            () => {
              this.pagenumber = 1;
              this.getProducts(false, true);
            },
          );
        }}
        onOpened={() => {
          configureNextAnimation();
          this.setState(
            {
              viewPosition: 0,
              showAllColors: false,
            },
            () => { },
          );
        }}>
        <AppTouchableOpacity
          androidRippleColor={AppColors.transparent}
          style={styles.modalBackDrop}
          onPress={() => {
            if (disableBackDrop) {
              return Keyboard.dismiss();
            }
            configureNextAnimation();
            this.setState(
              {
                viewPosition: -Dimensions.get('screen').width,
              },
              () => {
                setTimeout(() => {
                  this.filtersModalRef?.current?.close();
                }, 300);
              },
            );
          }}
        />
        <ScrollView
          contentContainerStyle={[
            {
              paddingBottom: dimensionsCalculation(10) + keyboardHeight,
            },
            isIOS && {
              padding: dimensionsCalculation(10),
            },
          ]}
          ref={this.filtersScrollViewRef}
          style={[
            styles.filtersViewContainer,
            {
              right: viewPosition,
              paddingBottom: dimensionsCalculation(30),
            },
          ]}
          stickyHeaderIndices={[0]}>
          <View
            style={{
              backgroundColor: AppColors.white,
              paddingTop: dimensionsCalculation(10),
            }}>
            <AppButton
              onPress={() => { }}
              disabled
              containerStyle={[
                styles.filterBtn,
                { backgroundColor: AppColors.secondary, alignSelf: 'center' },
              ]}
              text={Languages.Filter}
              icon={'filter'}
              iconType="AntDesign"
              iconSize={dimensionsCalculation(13)}
              iconStyle={{
                marginRight: 0,
              }}
              textColor={AppColors.mainText}
              textStyle={{
                fontSize: dimensionsCalculation(13),
                fontFamily: fonts.primaryRegular,
              }}
            />
          </View>
          <AppTouchableOpacity
            disabled={sortBy == 'atoz'}
            style={[
              styles.filterSection,
              {
                marginTop: dimensionsCalculation(50),
              },
            ]}
            onPress={() => {
              configureNextAnimation();
              this.setState(
                {
                  sortBy: 'atoz',
                },
                () => { },
              );
            }}>
            <Text style={styles.filterKey}>{Languages.ATOZ}</Text>
            <AppIcon
              name={sortBy == 'atoz' ? 'check-box' : 'check-box-outline-blank'}
              color={sortBy == 'atoz' ? AppColors.mainText : AppColors.e5}
              type="MaterialIcons"
              size={dimensionsCalculation(24)}
              style={{ alignSelf: 'flex-end' }}
            />
          </AppTouchableOpacity>
          <AppTouchableOpacity
            disabled={sortBy == 'ztoa'}
            style={styles.filterSection}
            onPress={() => {
              configureNextAnimation();
              this.setState(
                {
                  sortBy: 'ztoa',
                },
                () => { },
              );
            }}>
            <Text style={styles.filterKey}>{Languages.ZTOA}</Text>
            <AppIcon
              name={sortBy == 'ztoa' ? 'check-box' : 'check-box-outline-blank'}
              color={sortBy == 'ztoa' ? AppColors.mainText : AppColors.e5}
              type="MaterialIcons"
              size={dimensionsCalculation(24)}
              style={{ alignSelf: 'flex-end' }}
            />
          </AppTouchableOpacity>
          <AppTouchableOpacity
            style={styles.filterSection}
            onPress={() => {
              configureNextAnimation();
              this.setState(
                {
                  sortBy: 'lowtohigh',
                },
                () => { },
              );
            }}>
            <Text style={styles.filterKey}>{Languages.LowToHigh}</Text>
            <AppIcon
              name={
                sortBy == 'lowtohigh' ? 'check-box' : 'check-box-outline-blank'
              }
              color={sortBy == 'lowtohigh' ? AppColors.mainText : AppColors.e5}
              type="MaterialIcons"
              size={dimensionsCalculation(24)}
              style={{ alignSelf: 'flex-end' }}
            />
          </AppTouchableOpacity>
          <AppTouchableOpacity
            style={styles.filterSection}
            onPress={() => {
              configureNextAnimation();
              this.setState(
                {
                  sortBy: 'hightolow',
                },
                () => { },
              );
            }}>
            <Text style={styles.filterKey}>{Languages.HighToLow}</Text>
            <AppIcon
              name={
                sortBy == 'hightolow' ? 'check-box' : 'check-box-outline-blank'
              }
              color={sortBy == 'hightolow' ? AppColors.mainText : AppColors.e5}
              type="MaterialIcons"
              size={dimensionsCalculation(24)}
              style={{ alignSelf: 'flex-end' }}
            />
          </AppTouchableOpacity>
          <AppTouchableOpacity disabled style={styles.filterSection}>
            <Text style={styles.filterKey}>{Languages.Color}</Text>
            <AppIcon
              name={
                selectedColors?.length > 0
                  ? 'check-box'
                  : 'check-box-outline-blank'
              }
              type="MaterialIcons"
              size={dimensionsCalculation(24)}
              color={
                selectedColors?.length > 0 ? AppColors.mainText : AppColors.e5
              }
              style={{ alignSelf: 'flex-end' }}
            />
          </AppTouchableOpacity>
          <View
            style={[
              {
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: Dimensions.get('screen').width * 0.5,
                overflow: 'hidden',
              },
              !showAllColors && {
                maxHeight: Dimensions.get('screen').width * 0.5,
              },
            ]}>
            {availableColors.map((item, index) => {
              const isSelected =
                selectedColors?.findIndex((x) => x == item?.id) != -1;
              return (
                <AppTouchableOpacity
                  style={[
                    styles.filterSection,
                    {
                      marginTop: dimensionsCalculation(3),
                      // width: Dimensions.get('screen').width * 0.33,
                      width: null,
                      minWidth: Dimensions.get('screen').width * 0.22,
                      marginLeft: dimensionsCalculation(10),
                      alignSelf: 'flex-start',
                    },
                  ]}
                  onPress={() => {
                    if (selectedColors?.findIndex((x) => x == item?.id) != -1) {
                      this.setState(
                        {
                          selectedColors: [
                            ...selectedColors.filter((x) => x != item?.id),
                          ],
                        },
                        () => { },
                      );
                    } else {
                      this.setState(
                        {
                          selectedColors: [...selectedColors, item.id],
                        },
                        () => { },
                      );
                    }
                  }}>
                  <Text
                    style={[
                      styles.filterKey,
                      {
                        fontSize: dimensionsCalculation(12),
                        color: AppColors.mainText,
                        flex: 1,
                      },
                    ]}
                    numberOfLines={1}>
                    {item.name}
                  </Text>
                  <AppIcon
                    name={!isSelected ? 'check-box-outline-blank' : 'check-box'}
                    type="MaterialIcons"
                    size={dimensionsCalculation(18)}
                    color={!isSelected ? AppColors.e5 : AppColors.mainText}
                    style={{ alignSelf: 'flex-end' }}
                  />
                </AppTouchableOpacity>
              );
            })}
          </View>
          {availableColors?.length > 0 && (
            <AppTouchableOpacity
              style={{
                borderRadius: dimensionsCalculation(15),
                borderWidth: 0.4,
                borderColor: AppColors.mainText,
                height: dimensionsCalculation(30),
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                width: '50%',
                marginVertical: dimensionsCalculation(10),
              }}
              onPress={() => {
                configureNextScaleAnimation();
                this.setState(
                  {
                    showAllColors: !showAllColors,
                  },
                  () => { },
                );
              }}>
              <Text
                style={{
                  color: AppColors.mainText,
                  marginLeft: dimensionsCalculation(10),
                }}>
                {showAllColors ? Languages.SeeLess : Languages.ShowAll}
              </Text>
            </AppTouchableOpacity>
          )}
          {false && (
            <View style={styles.priceContainer}>
              <Text style={styles.filterKey}>{Languages.Price}</Text>
              {/* <RangeSlider
              type="range" // ios only
              min={availableMinPrice}
              max={availableMaxPrice}
              hideLabels
              maxLabelFontSize={0}
              minLabelFontSize={0}
              selectedMinimum={minPrice} // ios only
              selectedMaximum={maxPrice} // ios only
              tintColor={AppColors.e5}
              handleColor={AppColors.mainText}
              cornerRadius={dimensionsCalculation(10)}
              step={1}
              minStartValue={minPrice}
              maxStartValue={maxPrice}
              handlePressedColor={AppColors.mainText}
              tintColorBetweenHandles={AppColors.e5}
              onChange={(minPrice: number, maxPrice: number) => {
                this.setState(
                  {
                    minPrice,
                    maxPrice,
                  },
                  () => {},
                );
              }}
            /> */}
              <View style={styles.filterSection}>
                <TextInput
                  style={[
                    styles.searchInput,
                    { minHeight: null, width: '47%', textAlign: 'center' },
                  ]}
                  value={minPrice?.toString() ?? ''}
                  onChangeText={(minPrice) => {
                    if (isNaN(parseFloat(minPrice))) {
                      this.setState(
                        {
                          minPrice: null,
                        },
                        () => { },
                      );
                    } else {
                      this.setState(
                        {
                          minPrice: parseFloat(minPrice),
                        },
                        () => { },
                      );
                    }
                  }}
                  onBlur={() => {
                    if (
                      isNaN(minPrice) ||
                      minPrice < availableMinPrice ||
                      minPrice > availableMaxPrice
                    ) {
                      this.setState(
                        {
                          minPrice: availableMinPrice,
                        },
                        () => { },
                      );
                    }
                  }}
                  keyboardType="number-pad"
                  placeholder={Languages.From} // availableMinPrice?.toString() ?? '0'}
                />
                <TextInput
                  style={[
                    styles.searchInput,
                    { minHeight: null, width: '47%', textAlign: 'center' },
                  ]}
                  value={!maxPrice ? '' : maxPrice?.toString() ?? ''}
                  onChangeText={(maxPrice) => {
                    if (isNaN(parseFloat(maxPrice))) {
                      this.setState(
                        {
                          maxPrice: null,
                        },
                        () => { },
                      );
                    } else {
                      this.setState(
                        {
                          maxPrice: parseFloat(maxPrice),
                        },
                        () => { },
                      );
                    }
                  }}
                  onBlur={() => {
                    if (
                      isNaN(maxPrice) ||
                      maxPrice > availableMaxPrice ||
                      maxPrice < availableMinPrice
                    ) {
                      this.setState(
                        {
                          maxPrice: availableMaxPrice,
                        },
                        () => { },
                      );
                    }
                  }}
                  keyboardType="number-pad"
                  placeholder={Languages.To} // availableMaxPrice?.toString() ?? '0'}
                />
              </View>
            </View>
          )}
          {/* <AppTouchableOpacity style={styles.filterSection}>
            <Text style={styles.filterKey}>{Languages.Date}</Text>
            <AppIcon
              name="check-box"
              type="MaterialIcons"
              size={dimensionsCalculation(24)}
              color={AppColors.mainText}
              style={{alignSelf: 'flex-end'}}
            />
          </AppTouchableOpacity>
          <AppTouchableOpacity style={styles.filterSection}>
            <Text style={styles.filterKey}>{Languages.Place}</Text>
            <AppIcon
              name="check-box"
              type="MaterialIcons"
              size={dimensionsCalculation(24)}
              color={AppColors.mainText}
              style={{alignSelf: 'flex-end'}}
            />
          </AppTouchableOpacity> */}
          {false && (
            <View
              style={[
                styles.filterSection,
                {
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                },
              ]}>
              <Text style={styles.filterKey}>{Languages.Keywords}</Text>
              <TextInput
                style={styles.searchInput}
                placeholder={Languages.SearchPlaceholder}
                // multiline
                // numberOfLines={4}
                value={search}
                onChangeText={(search) => {
                  this.setState(
                    {
                      search,
                    },
                    () => { },
                  );
                }}
              />
            </View>
          )}
        </ScrollView>
      </Modal>
    );
  };

  render() {
    const {
      isLoading,
      isRefreshing,
      isFetchingMore,
      products,
      pages,
    } = this.state;
    const isOffers = this.props.route?.params?.type !== 'normal';
    return (
      <View style={styles.container}>
        <AppHeader />
        <AppTabBar />
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {this.renderFiltersModal()}
            {isIOS && isRefreshing && <LoadingSpinner overlay />}
            <FlatList
              contentContainerStyle={styles.flatListStyle}
              refreshControl={
                <RefreshControl
                  progressViewOffset={dimensionsCalculation(80)}
                  refreshing={isRefreshing}
                  onRefresh={() => {
                    this.pagenumber = 1;
                    this.getProducts(false, true);
                  }}
                />
              }
              stickyHeaderIndices={isOffers ? [] : [0]}
              ListHeaderComponent={
                isOffers ? (
                  <ImageHeader
                    source={require('../../assets/images/sale.png')}
                    style={{
                      height: Dimensions.get('screen').width / 3,
                      marginBottom: dimensionsCalculation(20),
                    }}
                    resizeMode="contain"
                    hideMenuButton>
                    <View style={styles.title}>
                      <Text style={styles.titleTxt}>
                        {this.props.route?.params?.type == 'offers'
                          ? Languages.Sale
                          : Languages.BestSelling}
                      </Text>
                    </View>
                  </ImageHeader>
                ) : (
                  <View style={styles.productsHeader}>
                    <Text style={styles.ourProducts}>
                      {Languages.OurProducts}
                    </Text>
                    <AppButton
                      androidRippleColor={AppColors.androidRippleColor.black15}
                      containerStyle={styles.filterBtn}
                      onPress={() => {
                        this.filtersModalRef?.current?.open();
                      }}
                      text={Languages.Filter}
                      icon={'filter'}
                      iconType="AntDesign"
                      iconSize={dimensionsCalculation(13)}
                      iconStyle={{
                        marginRight: 0,
                      }}
                      textColor={AppColors.mainText}
                      textStyle={{
                        fontSize: dimensionsCalculation(13),
                        fontFamily: fonts.primaryRegular,
                      }}
                    />
                  </View>
                )
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
              onEndReached={() => {
                if (this.pagenumber <= pages && !isFetchingMore)
                  this.getProducts(false, false, true);
              }}
              numColumns={2}
              keyExtractor={(item, index) => index.toString()}
              data={products}
              renderItem={this.renderProductCard}
            />
          </>
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

export default connect(mapStateToProps, null)(ProductsScreen);

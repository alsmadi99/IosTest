import { AppIcon, Constants, fonts, Languages } from '../common';
import {
  Address,
  MyAddressesScreenProps,
  MyAddressesScreenState,
} from '../common/Types';
import {
  AppButton,
  AppHeader,
  AppInput,
  AppTabBar,
  AppTouchableOpacity,
  LoadingButton,
  LoadingSpinner,
} from '../components';
import { navigate } from '../navigation';
import React, { Component, createRef, RefObject } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  RefreshControl,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modalbox';
import { AppColors } from '../theme';
import {
  configureNextAnimation,
  configureNextScaleAnimation,
  dimensionsCalculation,
  getBottomSpace,
  isIOS,
  ShowToast,
} from '../utils';
import {
  addressAddCall,
  addressesGetCall,
  deleteAddressCall,
  getAreasCall,
  getCitiesCall,
} from '../services/api/calls';
import { Alert } from 'react-native';
import { Keyboard } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  flatlist: {
    paddingTop: Constants.headerHeight + dimensionsCalculation(20),
    paddingBottom: Constants.tabBarHeight + dimensionsCalculation(20),
    paddingHorizontal: dimensionsCalculation(20),
  },
  modalBackDrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  addnewModal: {
    width: Dimensions.get('screen').width * 0.9,
    paddingHorizontal: dimensionsCalculation(30),
    paddingTop: dimensionsCalculation(30),
    paddingBottom: dimensionsCalculation(20),
    backgroundColor: AppColors.white,
    borderRadius: dimensionsCalculation(20),
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: dimensionsCalculation(22),
    textAlign: 'center',
    color: AppColors.mainText,
    fontFamily: fonts.primaryBold,
    marginBottom: dimensionsCalculation(20),
  },
  addnew: {
    backgroundColor: AppColors.secondary,
    marginTop: dimensionsCalculation(20),
    elevation: 3,
    height: dimensionsCalculation(40),
    borderRadius: dimensionsCalculation(50),
    alignSelf: 'center',
    width: '50%',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: '#d9d9d9',
    borderBottomWidth: 1,
    padding: dimensionsCalculation(10),
  },
  addressName: {
    color: AppColors.mainText,
    fontSize: dimensionsCalculation(14),
    textAlign: 'left',
    flex: 1,
  },
});

export default class MyAddressesScreen extends Component<
  MyAddressesScreenProps,
  MyAddressesScreenState
> {
  addnewModalRef = null as RefObject<Modal>;
  citiesModalRef = null as RefObject<Modal>;
  areasModalRef = null as RefObject<Modal>;
  constructor(props: MyAddressesScreenProps) {
    super(props);
    this.state = {
      search: '',
      isLoading: true,
      isRefreshing: false,
      isDeleting: false,
      addresses: [],
      isAddingAddress: false,
      isAddBtnClicked: false,
      newaddressName: '',
      adderssName: '',
      details: '',
      selectedArea: null,
      selectedCity: null,
      keyboardheight: 0,
      cities: [],
      areas: [],
      pin: null,
      viewHeight: 0,

      isCitiesSearching: false,
      isAreasSearching: false,
    };
    this.addnewModalRef = createRef();
    this.citiesModalRef = createRef();
    this.areasModalRef = createRef();
  }

  componentDidMount = () => {
    this.getAddresses();
    this.getAreas();
    this.getCities();
    // Keyboard.addListener('keyboardDidShow', (e) => {
    //   this.setState(
    //     {
    //       keyboardheight: e.endCoordinates.height,
    //     },
    //     () => {},
    //   );
    // });
    // Keyboard.addListener('keyboardDidHide', () => {
    //   this.setState(
    //     {
    //       keyboardheight: 0,
    //     },
    //     () => {},
    //   );
    // });
  };

  getAreas = async () => {
    const result = await getAreasCall();
    if (result?.data) {
      this.setState(
        {
          areas: result?.data?.areas,
        },
        () => { },
      );
    }
  };

  getCities = async () => {
    const result = await getCitiesCall();
    if (result?.data) {
      this.setState(
        {
          cities: result?.data,
        },
        () => { },
      );
    }
  };

  getAddresses = (isLoading: boolean = true, isRefreshing: boolean = false) => {
    this.setState(
      {
        isLoading,
        isRefreshing,
      },
      async () => {
        const result = await addressesGetCall();
        configureNextScaleAnimation();
        if (result?.data?.address) {
          this.setState(
            {
              addresses: result?.data?.address,
              isLoading: false,
              isRefreshing: false,
            },
            () => { },
          );
        } else {
          ShowToast(Languages.Oops);
          this.setState(
            {
              isLoading: false,
              isRefreshing: false,
            },
            () => { },
          );
        }
        this.props.route?.params?.onAddressAdded &&
          this.addnewModalRef?.current?.open();
      },
    );
  };

  deleteAddress = (item: Address) => {
    this.setState(
      {
        isDeleting: true,
      },
      async () => {
        const result = await deleteAddressCall({
          id: item?.address?.id,
        });
        if (result?.data?.result == 1) {
          configureNextScaleAnimation();
          this.setState(
            {
              addresses: this.state.addresses?.filter(
                (x) => x?.address?.id != item?.address?.id,
              ),
              isDeleting: false,
            },
            () => { },
          );
          ShowToast(Languages.DeletedSuccessfully, 'success');
        } else {
          ShowToast(Languages.Oops);
          this.setState(
            {
              isDeleting: false,
            },
            () => { },
          );
        }
      },
    );
  };

  renderAddress = ({ item, index }: { item: Address; index: number }) => {
    return (
      <View
        style={[
          styles.addressContainer,
          index == this.state.addresses?.length - 1 && { borderBottomWidth: 0 },
        ]}>
        <Text style={styles.addressName}>{`${item?.address?.location}`}</Text>
        <AppTouchableOpacity
          borderless
          style={{ overflow: 'visible' }}
          onPress={() => {
            Alert.alert(
              Languages.Confirm,
              Languages.ConfirmDeleteAddress?.replace(
                '{0}',
                item?.address?.location,
              ),
              [
                {
                  text: Languages.No,
                  style: 'destructive',
                },
                {
                  text: Languages.Yes,
                  onPress: () => {
                    this.deleteAddress(item);
                  },
                },
              ],
            );
          }}>
          <AppIcon
            name="delete"
            size={dimensionsCalculation(20)}
            color={AppColors.mainText}
            type="AntDesign"
          />
        </AppTouchableOpacity>
      </View>
    );
  };

  render() {
    const {
      isLoading,
      isRefreshing,
      isDeleting,
      addresses,
      selectedCity,
      selectedArea,
      adderssName,
      details,
      keyboardheight,
      cities,
      search,
      pin,
      isAddingAddress,
      viewHeight,
      isAreasSearching,
      isCitiesSearching,
    } = this.state;
    return (
      <View style={styles.container}>
        <AppHeader />
        {!isAddingAddress && <AppTabBar />}
        <Modal
          ref={this.addnewModalRef}
          coverScreen
          statusBarTranslucent
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: AppColors.transparent,
            justifyContent: 'flex-end',
          }}
          backdropColor={AppColors.black}
          backdropOpacity={0.3}
          swipeToClose={false}
          backButtonClose
          onClosed={() => {
            this.setState(
              {
                search: '',
                isAddingAddress: false,
              },
              () => { },
            );
          }}>
          <Modal
            ref={this.citiesModalRef}
            coverScreen
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: AppColors.transparent,
              justifyContent: 'flex-end',
            }}
            backdropColor={AppColors.black}
            statusBarTranslucent
            backdropOpacity={0.3}
            swipeToClose={false}
            backButtonClose
            onClosed={() => {
              this.setState(
                {
                  search: '',
                },
                () => { },
              );
            }}>
            <AppTouchableOpacity
              androidRippleColor={AppColors.transparent}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: -1,
              }}
              activeOpacity={1}
              onPress={() => {
                this.citiesModalRef?.current?.close();
              }}
            />
            <View
              style={{
                backgroundColor: AppColors.white,
                borderTopLeftRadius: dimensionsCalculation(
                  isCitiesSearching ? 0 : 40,
                ),
                borderTopRightRadius: dimensionsCalculation(
                  isCitiesSearching ? 0 : 40,
                ),
                height: isCitiesSearching ? '100%' : viewHeight,
              }}>
              <FlatList
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  flexGrow: 1,
                  paddingHorizontal: dimensionsCalculation(30),
                  paddingBottom: dimensionsCalculation(30),
                }}
                keyboardShouldPersistTaps="handled"
                stickyHeaderIndices={[0]}
                ListHeaderComponent={
                  <View
                    style={{
                      backgroundColor: AppColors.white,
                      borderRadius: dimensionsCalculation(40),
                    }}>
                    <AppInput
                      onChangeText={(search) => {
                        this.setState(
                          {
                            search,
                          },
                          () => { },
                        );
                      }}
                      onFocus={() => {
                        setTimeout(() => {
                          configureNextScaleAnimation();
                          this.setState(
                            {
                              isCitiesSearching: true,
                            },
                            () => { },
                          );
                        }, 150);
                      }}
                      onBlur={() => {
                        setTimeout(() => {
                          configureNextScaleAnimation();
                          this.setState(
                            {
                              isCitiesSearching: false,
                            },
                            () => { },
                          );
                        }, 150);
                      }}
                      placeholder={Languages.Search}
                      textColor={AppColors.inputText}
                      value={search}
                      containerStyle={{
                        marginHorizontal: dimensionsCalculation(0),
                        marginTop: dimensionsCalculation(30),
                      }}
                    />
                  </View>
                }
                keyExtractor={(item, index) => index.toString()}
                data={
                  search
                    ? cities?.filter((x) =>
                      x?.name?.toLowerCase()?.includes(search?.toLowerCase()),
                    )
                    : cities
                }
                renderItem={({ item, index }) => {
                  return (
                    <AppTouchableOpacity
                      style={{}}
                      onPress={() => {
                        Keyboard.dismiss();
                        this.setState(
                          {
                            selectedCity: item,
                          },
                          () => {
                            this.citiesModalRef?.current?.close();
                          },
                        );
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          fontFamily: fonts.primaryBold,
                          fontSize: dimensionsCalculation(16),
                          color: AppColors.mainText,
                        }}>
                        {item?.name}
                      </Text>
                    </AppTouchableOpacity>
                  );
                }}
              />
            </View>
          </Modal>
          {selectedCity && (
            <Modal
              ref={this.areasModalRef}
              coverScreen
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: AppColors.transparent,
                justifyContent: 'flex-end',
              }}
              backdropColor={AppColors.black}
              statusBarTranslucent
              backdropOpacity={0.3}
              swipeToClose={false}
              backButtonClose
              onClosed={() => {
                this.setState(
                  {
                    search: '',
                  },
                  () => { },
                );
              }}>
              <AppTouchableOpacity
                androidRippleColor={AppColors.transparent}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: -1,
                }}
                activeOpacity={1}
                onPress={() => {
                  this.areasModalRef?.current?.close();
                }}
              />
              <View
                style={{
                  backgroundColor: AppColors.white,
                  borderTopLeftRadius: dimensionsCalculation(
                    isAreasSearching ? 0 : 40,
                  ),
                  borderTopRightRadius: dimensionsCalculation(
                    isAreasSearching ? 0 : 40,
                  ),
                  height: isAreasSearching ? '100%' : viewHeight,
                }}>
                <FlatList
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    flexGrow: 1,
                    paddingHorizontal: dimensionsCalculation(30),
                    paddingBottom: dimensionsCalculation(30),
                  }}
                  stickyHeaderIndices={[0]}
                  ListHeaderComponent={
                    <View
                      style={{
                        backgroundColor: AppColors.white,
                        borderRadius: dimensionsCalculation(40),
                      }}>
                      <AppInput
                        onChangeText={(search) => {
                          this.setState(
                            {
                              search,
                            },
                            () => { },
                          );
                        }}
                        onFocus={() => {
                          setTimeout(() => {
                            configureNextScaleAnimation();
                            this.setState(
                              {
                                isAreasSearching: true,
                              },
                              () => { },
                            );
                          }, 150);
                        }}
                        onBlur={() => {
                          setTimeout(() => {
                            configureNextScaleAnimation();
                            this.setState(
                              {
                                isAreasSearching: false,
                              },
                              () => { },
                            );
                          }, 150);
                        }}
                        placeholder={Languages.Search}
                        textColor={AppColors.inputText}
                        value={search}
                        containerStyle={{
                          marginHorizontal: dimensionsCalculation(0),
                          marginTop: dimensionsCalculation(30),
                        }}
                      />
                    </View>
                  }
                  keyExtractor={(item, index) => index.toString()}
                  data={
                    search
                      ? selectedCity?.areas?.filter((x) =>
                        x?.name
                          ?.toLowerCase()
                          ?.includes(search?.toLowerCase()),
                      )
                      : selectedCity?.areas
                  }
                  renderItem={({ item, index }) => {
                    return (
                      <AppTouchableOpacity
                        style={{}}
                        onPress={() => {
                          Keyboard.dismiss();
                          this.setState(
                            {
                              selectedArea: item,
                            },
                            () => {
                              this.areasModalRef?.current?.close();
                            },
                          );
                        }}>
                        <Text
                          style={{
                            textAlign: 'center',
                            fontFamily: fonts.primaryBold,
                            fontSize: dimensionsCalculation(16),
                            color: AppColors.mainText,
                          }}>
                          {item?.name}
                        </Text>
                      </AppTouchableOpacity>
                    );
                  }}
                />
              </View>
            </Modal>
          )}
          <AppTouchableOpacity
            androidRippleColor={AppColors.transparent}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: -1,
            }}
            activeOpacity={1}
            onPress={() => {
              this.addnewModalRef?.current?.close();
            }}
          />
          <View
            style={{
              backgroundColor: AppColors.white,
              // borderTopLeftRadius: dimensionsCalculation(40),
              // borderTopRightRadius: dimensionsCalculation(40),
              borderTopLeftRadius: dimensionsCalculation(
                keyboardheight ? 0 : 40,
              ),
              borderTopRightRadius: dimensionsCalculation(
                keyboardheight ? 0 : 40,
              ),
              height: keyboardheight ? '100%' : null,
            }}
            onLayout={(e) =>
              this.setState(
                {
                  viewHeight: e.nativeEvent.layout.height,
                },
                () => { },
              )
            }>
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                padding: dimensionsCalculation(30),
                // paddingBottom: keyboardheight
                //   ? keyboardheight
                //   : getBottomSpace(),
              }}>
              <AppInput
                onChangeText={(text) => {
                  this.setState(
                    {
                      adderssName: text,
                    },
                    () => { },
                  );
                }}
                onFocus={() => {
                  setTimeout(() => {
                    configureNextScaleAnimation();
                    this.setState(
                      {
                        keyboardheight: 10000,
                      },
                      () => { },
                    );
                  }, 250);
                }}
                onBlur={() => {
                  setTimeout(() => {
                    configureNextScaleAnimation();
                    this.setState(
                      {
                        keyboardheight: 0,
                      },
                      () => { },
                    );
                  }, 250);
                }}
                placeholder={Languages.AddressName}
                textColor={AppColors.inputText}
                value={adderssName}
              />
              <AppButton
                onPress={() => {
                  this.citiesModalRef?.current?.open();
                }}
                text={selectedCity?.name ?? Languages.SelectCity}
                containerStyle={{
                  backgroundColor: AppColors.primary,
                  marginBottom: dimensionsCalculation(20),
                }}
              />
              <AppButton
                onPress={() => {
                  this.areasModalRef?.current?.open();
                }}
                text={selectedArea?.name ?? Languages.SelectArea}
                containerStyle={{
                  backgroundColor: AppColors.primary,
                  marginBottom: dimensionsCalculation(20),
                }}
              />
              <AppButton
                onPress={() => {
                  this.addnewModalRef?.current?.close();
                  navigate('SelectLocationScreen', {
                    onSelect: (location, details) => {
                      this.setState(
                        {
                          pin: location,
                          details: details ? details : adderssName,
                        },
                        () => {
                          this.addnewModalRef?.current?.open();
                        },
                      );
                    },
                  });
                }}
                text={details ? details : Languages.PinYourLocation}
                containerStyle={{
                  backgroundColor: AppColors.primary,
                  marginBottom: dimensionsCalculation(20),
                }}
              />
              <LoadingButton
                isLoading={isLoading}
                onPress={() => {
                  if (adderssName && selectedCity && selectedArea && pin) {
                    this.setState(
                      {
                        isLoading: true,
                      },
                      async () => {
                        const result = await addressAddCall({
                          details: details,
                          lat: pin?.latitude,
                          lng: pin?.longitude,
                          location: adderssName,
                          areaid: selectedArea?.id,
                        });
                        this.addnewModalRef?.current?.close();
                        if (result?.data?.result) {
                          ShowToast(
                            Languages.AddressSavedSuccessfully,
                            'success',
                          );
                          this.getAddresses();
                          try {
                            this.props.route?.params?.onAddressAdded();
                          } catch (error) {
                            __DEV__ && console.error('ERROR', error);
                          }
                        } else {
                          ShowToast(Languages.Oops);
                        }
                        this.setState(
                          {
                            isLoading: false,
                          },
                          () => { },
                        );
                      },
                    );
                  } else {
                    Alert.alert('', Languages.FillInfo);
                  }
                }}
                text={Languages.SaveAddress}
                textColor={AppColors.white}
                androidRippleColor={AppColors.white}
                backgroundColor={AppColors.secondary}
              />
            </ScrollView>
          </View>
        </Modal>
        {isDeleting && <LoadingSpinner overlay />}
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {isIOS && isRefreshing && <LoadingSpinner overlay />}
            <FlatList
              contentContainerStyle={styles.flatlist}
              ListHeaderComponent={
                <View style={{}}>
                  <Text style={styles.title}>{Languages.MyAddresses}</Text>
                </View>
              }
              refreshControl={
                <RefreshControl
                  progressViewOffset={dimensionsCalculation(80)}
                  refreshing={isRefreshing}
                  onRefresh={() => {
                    this.getAddresses(false, true);
                  }}
                />
              }
              keyExtractor={(item, index) => index.toString()}
              data={addresses}
              renderItem={this.renderAddress}
              ListFooterComponent={
                <AppButton
                  onPress={() => {
                    this.setState(
                      {
                        isAddingAddress: true,
                      },
                      () => { },
                    );
                    this.addnewModalRef?.current?.open();
                    // navigate('SelectLocationScreen', {
                    //   getAddresses: this.getAddresses,
                    // });
                  }}
                  text={Languages.AddNewAddress}
                  textColor={AppColors.white}
                  androidRippleColor={AppColors.androidRippleColor.black15}
                  containerStyle={styles.addnew}
                />
              }
            />
          </>
        )}
      </View>
    );
  }
}

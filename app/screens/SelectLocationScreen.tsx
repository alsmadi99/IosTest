import {
  QudsPaintsStore,
  SelectLocationScreenProps,
  SelectLocationScreenState,
} from '../common/Types';
import {
  AppButton,
  AppHeader,
  AppTabBar,
  AppTouchableOpacity,
  LoadingSpinner,
} from '../components';
import React, { Component, createRef, Dispatch, RefObject } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Keyboard,
  Alert,
  FlatList,
} from 'react-native';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { AppColors } from '../theme';
import MapView, { Marker, LatLng } from 'react-native-maps';
import {
  configureNextAnimation,
  configureNextScaleAnimation,
  dimensionsCalculation,
  getAddressFromCoordinates,
  getPlaceLatLng,
  isRTL,
  placesAutoComplete,
  requestLocationPermission,
  ShowToast,
} from '../utils';
import { AppIcon, Constants, fonts, Languages } from '../common';
import { goBack } from '../navigation';
import { addressAddCall } from '../services/api/calls';
import Geolocation from '@react-native-community/geolocation';
import { openSettings } from 'react-native-permissions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: Constants.headerHeight + dimensionsCalculation(20),
    left: dimensionsCalculation(20),
    right: dimensionsCalculation(20),
    zIndex: 1500,
    backgroundColor: AppColors.white,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    paddingVertical: dimensionsCalculation(5),
    paddingHorizontal: dimensionsCalculation(15),
    borderRadius: dimensionsCalculation(5),
  },
  searchTxt: {
    fontSize: dimensionsCalculation(13),
    color: 'rgba(1, 34, 65,0.42)',
    marginLeft: dimensionsCalculation(10),
    padding: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
    flex: 1,
  },
  bottomView: {
    // position: 'absolute',
    // bottom: 0,
    // left: 0,
    // right: 0,
    zIndex: 1500,
    paddingBottom: Constants.tabBarHeight + dimensionsCalculation(20),
    paddingTop: dimensionsCalculation(20),
    paddingHorizontal: dimensionsCalculation(20),
    backgroundColor: AppColors.white,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  currentAddressContainer: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.3)',
    borderRadius: dimensionsCalculation(20),
    paddingHorizontal: dimensionsCalculation(20),
    paddingVertical: dimensionsCalculation(5),
    alignSelf: 'stretch',
    marginBottom: dimensionsCalculation(20),
  },
  currentAddress: {
    fontSize: dimensionsCalculation(12),
    color: '#012241',
    padding: 0,
  },
  pinLocationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: dimensionsCalculation(20),
  },
  pinLocationTxt: {
    flex: 1,
    textAlign: 'left',
    fontSize: dimensionsCalculation(15),
    color: 'rgba(1, 34, 65,0.42)',
  },
  submit: {
    backgroundColor: AppColors.secondary,
    paddingVertical: dimensionsCalculation(0),
    borderRadius: dimensionsCalculation(20),
    paddingHorizontal: dimensionsCalculation(20),
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
  },
});

class SelectLocationScreen extends Component<
  SelectLocationScreenProps,
  SelectLocationScreenState
> {
  searchInputRef = null as RefObject<TextInput>;
  selectLocationRef = null as RefObject<MapView>;
  constructor(props: SelectLocationScreenProps) {
    super(props);
    this.state = {
      isKeyboardShown: false,
      currentLocation: {
        latitude: 31.9539,
        longitude: 35.9106,
      },
      location: '',
      details: '',
      isLoading: false,
      searchResults: [],
    };
    this.searchInputRef = createRef();
    this.selectLocationRef = createRef();
  }

  componentDidMount = () => {
    !__DEV__ &&
      Alert.alert(Languages.Location, Languages.LocationDesc, [
        {
          text: Languages.No,
        },
        {
          text: Languages.Yes,
          onPress: this.getUserLocation,
        },
      ]);
  };

  getLocationName = async () => {
    const { currentLocation } = this.state;
    const location = await getAddressFromCoordinates(
      currentLocation?.longitude,
      currentLocation?.latitude,
    );
    if (location)
      this.setState(
        {
          location,
        },
        () => { },
      );
  };

  getUserLocation = async () => {
    const result = await requestLocationPermission();
    if (result.granted) {
      Geolocation.getCurrentPosition(
        (position) => {
          const {
            coords: { longitude, latitude },
          } = position;
          this.selectLocationRef.current.animateToRegion(
            {
              longitude,
              latitude,
              longitudeDelta: longitude * 0.0002,
              latitudeDelta: latitude * 0.0002,
            },
            500,
          );
        },
        (error) => { },
        {
          enableHighAccuracy: true,
          timeout: 10000,
        },
      );
    } else {
      Alert.alert(Languages.Location, Languages.LocationPermission, [
        {
          text: Languages.No,
        },
        {
          text: Languages.OpenSettings,
          onPress: () => {
            openSettings();
          },
        },
      ]);
    }
  };

  doSearch = async (text: string) => {
    if (text?.length >= 3) {
      const result = await placesAutoComplete(text);
      this.setState(
        {
          searchResults: result,
        },
        () => { },
      );
    } else {
      this.setState(
        {
          searchResults: [],
        },
        () => { },
      );
    }
  };

  renderSearchBar = () => {
    return (
      <View
        style={{
          position: 'absolute',
          zIndex: 15000,
          top: Constants.headerHeight + dimensionsCalculation(20),
          left: dimensionsCalculation(20),
          right: dimensionsCalculation(20),
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          height: dimensionsCalculation(30),
          backgroundColor: AppColors.white,
          borderRadius: dimensionsCalculation(15),
          flexDirection: 'row',
        }}>
        <TextInput
          style={{
            borderRadius: dimensionsCalculation(15),
            padding: 0,
            paddingHorizontal: dimensionsCalculation(20),
            flex: 1,
            textAlign: isRTL ? 'right' : 'left',
          }}
          placeholder={Languages.Search}
          onChangeText={(text) => {
            this.doSearch(text);
          }}
          onFocus={() => {
            this.setState(
              {
                isKeyboardShown: true,
              },
              () => { },
            );
          }}
          onBlur={() => {
            this.setState(
              {
                isKeyboardShown: false,
                searchResults: [],
              },
              () => { },
            );
          }}
        />
      </View>
    );
  };

  renderSearchResults = () => {
    const { searchResults } = this.state;
    return (
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          zIndex: 111,
          backgroundColor: AppColors.white,
          paddingTop: Constants.headerHeight + dimensionsCalculation(60),
        }}>
        <AppTouchableOpacity
          androidRippleColor={AppColors.transparent}
          activeOpacity={1}
          style={{
            ...StyleSheet.absoluteFillObject,
            zIndex: -1,
          }}
          onPress={() => {
            Keyboard.dismiss();
          }}
        />
        <FlatList
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
          }}
          keyExtractor={(item, index) => index.toString()}
          data={searchResults}
          renderItem={({ item, index }) => {
            return (
              <AppTouchableOpacity
                androidRippleColor={AppColors.androidRippleColor.black15}
                style={{
                  zIndex: 10,
                  backgroundColor: AppColors.white,
                  paddingHorizontal: dimensionsCalculation(20),
                  paddingVertical: dimensionsCalculation(10),
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                onPress={async () => {
                  const result = await getPlaceLatLng(item.place_id);
                  result &&
                    this.selectLocationRef?.current?.animateToRegion(
                      {
                        latitudeDelta: result?.lat * 0.0002,
                        longitudeDelta: result?.lng * 0.0002,
                        latitude: result?.lat,
                        longitude: result?.lng,
                      },
                      500,
                    );
                  Keyboard.dismiss();
                }}>
                <Text
                  style={{
                    textAlign: 'left',
                    flex: 1,
                    fontSize: dimensionsCalculation(15),
                  }}>
                  {item.description}
                </Text>
                <AppIcon
                  name="arrow-up-right"
                  type="Feather"
                  size={dimensionsCalculation(12)}
                  color={AppColors.inputText}
                />
              </AppTouchableOpacity>
            );
          }}
        />
      </View>
    );
  };

  render() {
    const {
      isKeyboardShown,
      currentLocation,
      location,
      details,
      isLoading,
    } = this.state;
    return (
      <View style={styles.container}>
        <AppHeader />
        {!isKeyboardShown && <AppTabBar />}
        {isLoading && <LoadingSpinner overlay />}

        <View
          style={{
            flex: 1,
          }}>
          {this.renderSearchBar()}
          {isKeyboardShown && this.renderSearchResults()}
          {!isKeyboardShown && (
            <AppTouchableOpacity
              androidRippleColor={AppColors.androidRippleColor.black15}
              style={{
                position: 'absolute',
                bottom: dimensionsCalculation(20),
                left: dimensionsCalculation(20),
                zIndex: 10,
                backgroundColor: AppColors.white,
                width: dimensionsCalculation(40),
                height: dimensionsCalculation(40),
                justifyContent: 'center',
                alignItems: 'center',
                elevation: 3,
                borderRadius: dimensionsCalculation(5),
              }}
              onPress={() => {
                this.getUserLocation();
              }}>
              <AppIcon
                name="gps-fixed"
                size={dimensionsCalculation(20)}
                type="MaterialIcons"
                color={AppColors.black}
              />
            </AppTouchableOpacity>
          )}
          <MapView
            ref={this.selectLocationRef}
            style={{
              flex: 1,
              minHeight: 120,
              ...StyleSheet.absoluteFillObject,
            }}
            initialRegion={{
              latitude: 31.9539,
              longitude: 35.9106,
              latitudeDelta: 31.9539 * 0.0002,
              longitudeDelta: 35.9106 * 0.0002,
            }}
            onPoiClick={(e) => {
              if (isKeyboardShown) {
                this.setState(
                  {
                    isKeyboardShown: false,
                  },
                  () => {
                    this.searchInputRef?.current?.blur();
                  },
                );
              } else {
                this.selectLocationRef?.current?.animateToRegion(
                  {
                    latitudeDelta: e.nativeEvent?.coordinate?.latitude * 0.0002,
                    longitudeDelta:
                      e.nativeEvent?.coordinate?.longitude * 0.0002,
                    latitude: e.nativeEvent?.coordinate?.latitude,
                    longitude: e.nativeEvent?.coordinate?.longitude,
                  },
                  500,
                );
                this.setState(
                  {
                    currentLocation: {
                      latitude: e.nativeEvent?.coordinate?.latitude,
                      longitude: e.nativeEvent?.coordinate?.longitude,
                    },
                  },
                  () => {
                    this.getLocationName();
                  },
                );
              }
            }}
            onPress={(e) => {
              if (isKeyboardShown) {
                this.setState(
                  {
                    isKeyboardShown: false,
                  },
                  () => {
                    this.searchInputRef?.current?.blur();
                  },
                );
              } else {
                this.selectLocationRef?.current?.animateToRegion(
                  {
                    latitudeDelta: e.nativeEvent?.coordinate?.latitude * 0.0002,
                    longitudeDelta:
                      e.nativeEvent?.coordinate?.longitude * 0.0002,
                    latitude: e.nativeEvent?.coordinate?.latitude,
                    longitude: e.nativeEvent?.coordinate?.longitude,
                  },
                  500,
                );
                this.setState(
                  {
                    currentLocation: {
                      latitude: e.nativeEvent?.coordinate?.latitude,
                      longitude: e.nativeEvent?.coordinate?.longitude,
                    },
                  },
                  () => {
                    this.getLocationName();
                  },
                );
              }
            }}
            onRegionChangeComplete={(e) => {
              this.setState(
                {
                  currentLocation: {
                    latitude: e?.latitude,
                    longitude: e?.longitude,
                  },
                },
                () => {
                  this.getLocationName();
                },
              );
            }}>
            <Marker coordinate={currentLocation} pinColor={AppColors.primary} />
          </MapView>
        </View>
        {!isKeyboardShown && (
          <View style={styles.bottomView}>
            <View style={styles.pinLocationContainer}>
              <Text style={styles.pinLocationTxt} numberOfLines={1}>
                {location ? location : Languages.PinYourLocation}
              </Text>
              <AppButton
                onPress={() => {
                  try {
                    this.props.route?.params?.onSelect(
                      currentLocation,
                      location,
                    );
                    goBack();
                  } catch (error) {
                    __DEV__ && console.error('error', error + '');
                  }
                }}
                containerStyle={styles.submit}
                text={Languages.Submit}
                androidRippleColor={AppColors.androidRippleColor.black15}
              />
            </View>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelectLocationScreen);

import { Constants, fonts, Languages } from '../common';
import {
  DistributionPointsScreenProps,
  DistributionPointsScreenState,
  Point,
  QudsPaintsStore,
} from '../common/Types';
import { AppButton, AppHeader, AppTabBar, LoadingSpinner } from '../components';
import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Dimensions,
  Linking,
  Platform,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import { AppColors } from '../theme';
import { configureNextAnimation, dimensionsCalculation, ShowToast } from '../utils';
import { branchesGetCall } from '../services/api/calls';
import { goBack } from '../navigation';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  listStyle: {
    paddingTop: Constants.headerHeight + dimensionsCalculation(20),
    paddingBottom: Constants.tabBarHeight + dimensionsCalculation(20),
    paddingHorizontal: dimensionsCalculation(20),
  },
  headerTitle: {
    color: AppColors.mainText,
    fontFamily: fonts.primaryBold,
    fontSize: dimensionsCalculation(18),
    textAlign: 'left',
  },
  headerSubTitle: {
    color: AppColors.secondary,
    fontSize: dimensionsCalculation(15),
    textAlign: 'left',
  },
  mapImage: {
    width: Dimensions.get('screen').width * 0.8 - dimensionsCalculation(40),
    height: Dimensions.get('screen').width * 0.8 - dimensionsCalculation(40),
    alignSelf: 'center',
  },
  pointBtn: {
    elevation: 3,
    backgroundColor: AppColors.mainText,
    paddingHorizontal: dimensionsCalculation(10),
    borderRadius: dimensionsCalculation(20),
    height: dimensionsCalculation(40),
    borderWidth: 1,
    borderColor: '#0088C0',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  pointName: {
    fontSize: dimensionsCalculation(16),
    fontFamily: fonts.primaryBold,
    marginLeft: dimensionsCalculation(5),
  },
  visitFactory: {
    alignSelf: 'center',
    borderRadius: dimensionsCalculation(20),
    height: dimensionsCalculation(40),
    backgroundColor: AppColors.secondary,
    width: '65%',
    marginTop: dimensionsCalculation(20),
  },
  visitFactoryTxt: {
    fontSize: dimensionsCalculation(16),
    fontFamily: fonts.primaryRegular,
    textAlign: 'center',
  },
});

class DistributionPointsScreen extends Component<
  DistributionPointsScreenProps,
  DistributionPointsScreenState
> {
  constructor(props: DistributionPointsScreenProps) {
    super(props);
    this.state = {
      isLoading: true,
      points: [],
    };
  }

  componentDidMount = () => {
    this.pointsGet();
  };

  pointsGet = () => {
    this.setState(
      {
        isLoading: true,
      },
      async () => {
        const result = await branchesGetCall();
        configureNextAnimation();
        if (result?.data?.braches) {
          this.setState(
            {
              points: result?.data?.braches,
              isLoading: false,
            },
            () => { },
          );
        } else {
          goBack();
          ShowToast(Languages.Oops);
        }
      },
    );
  };

  renderPoint = ({ item, index }: { item: Point; index: number }) => {
    return (
      <View
        style={{
          flex: 1,
          marginRight: index % 2 == 0 ? dimensionsCalculation(10) : 0,
          marginBottom: dimensionsCalculation(10),
        }}>
        <AppButton
          onPress={async () => {
            try {

              const firstTryURL = Platform.select({
                ios: `googleMaps://app?saddr=${item?.article?.lat}+${item?.article?.lng}`,
                android: `google.navigation:q=${item?.article?.lat}+${item?.article?.lng}`
              })
              let canOpenURL = await Linking.canOpenURL(firstTryURL);
              if (canOpenURL) {
                Linking.openURL(firstTryURL)
              } else {
                const scheme = Platform.select({
                  ios: 'googleMaps://app?saddr=',
                  android: 'google.navigation:q=',
                });
                const latLng = `${item?.article?.lat},${item?.article?.lng}`;
                const label = item?.article?.location;
                const url = Platform.select({
                  ios: `${scheme}${label}@${latLng}`,
                  android: `${scheme}${latLng}(${label})`,
                });
                canOpenURL = await Linking.canOpenURL(url);
                canOpenURL && Linking.openURL(url);
              }

              !canOpenURL && ShowToast(Languages.NotSupported);
            } catch (error) {
              console.error(error + "")
            }
          }}
          text={item?.article?.name}
          textColor={AppColors.white}
          androidRippleColor={AppColors.androidRippleColor.white}
          containerStyle={styles.pointBtn}
          textStyle={styles.pointName}
          icon={require('../../assets/images/marker.png')}
          iconSize={dimensionsCalculation(22)}
          useIconDefaultColors
          iconType="Image"
          iconStyle={{ marginRight: 0 }}
        />
      </View>
    );
  };

  render() {
    const { isLoading, points } = this.state;
    return (
      <View style={styles.container}>
        <AppHeader />
        <AppTabBar />
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <FlatList
            contentContainerStyle={styles.listStyle}
            numColumns={2}
            ListHeaderComponent={
              <View
                style={{
                  marginBottom: dimensionsCalculation(20),
                }}>
                <Text style={styles.headerTitle}>
                  {Languages.DistrebutionPoints}
                </Text>
                <Text style={styles.headerSubTitle}>
                  {Languages.ClickLocation}
                </Text>
                <FastImage
                  source={require('../../assets/images/jordanMap.png')}
                  style={styles.mapImage}
                  resizeMode="contain"
                />
              </View>
            }
            // ListFooterComponent={
            //   <AppButton
            //     onPress={() => {}}
            //     containerStyle={styles.visitFactory}
            //     textStyle={styles.visitFactoryTxt}
            //     textColor={AppColors.white}
            //     text={Languages.VisitFactory}
            //   />
            // }
            keyExtractor={(item, index) => index.toString()}
            data={points}
            renderItem={this.renderPoint}
          />
        )}
      </View>
    );
  }
}

const mapStateToProps = ({ auth }: QudsPaintsStore) => {
  return {
    user: auth.user,
  };
};

export default connect(mapStateToProps, null)(DistributionPointsScreen);

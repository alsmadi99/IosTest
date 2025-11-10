import { Constants, fonts, Languages } from '../common';
import {
  ProfileScreenProps,
  ProfileScreenState,
  QudsPaintsStore,
} from '../common/Types';
import { AppButton, AppHeader, AppTabBar } from '../components';
import { navigate } from '../navigation';
import React, { Component } from 'react';
import { Dispatch } from 'react';
import { View, StyleSheet, Text, ScrollView, Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { getUserDataAction } from '../store/actions/AuthActions';
import { AppColors } from '../theme';
import { configureNextAnimation, dimensionsCalculation } from '../utils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  scrollView: {
    paddingTop: Constants.headerHeight + dimensionsCalculation(40),
    paddingBottom: Constants.tabBarHeight + dimensionsCalculation(20),
    paddingHorizontal: dimensionsCalculation(20),
  },
  title: {
    color: AppColors.mainText,
    fontSize: dimensionsCalculation(25),
    fontFamily: fonts.primaryBold,
    textAlign: 'left',
    marginBottom: dimensionsCalculation(20),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userImage: {
    width: Dimensions.get('screen').width * 0.25,
    height: Dimensions.get('screen').width * 0.25,
    borderRadius: Dimensions.get('screen').width * 0.2,
  },
  username: {
    color: '#5F5D5D',
    fontSize: dimensionsCalculation(20),
    fontFamily: fonts.primaryBold,
    textAlign: 'right',
  },
  userAddress: {
    color: '#5F5D5D',
    fontSize: dimensionsCalculation(14),
    textAlign: 'right',
  },
  editProfileBtn: {
    backgroundColor: AppColors.transparent,
    paddingHorizontal: 0,
    paddingVertical: 0,
    alignSelf: 'flex-end',
  },
  editProfileTxt: {
    fontSize: dimensionsCalculation(14),
    fontFamily: fonts.primaryRegular,
  },
  actionBtn: {
    flex: 1,
    height: dimensionsCalculation(40),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.mainText,
    marginBottom: dimensionsCalculation(10),
    borderRadius: dimensionsCalculation(20),
  },
  actionBtnTxt: {
    fontFamily: fonts.primaryRegular,
    fontSize: dimensionsCalculation(14),
  },
});

class ProfileScreen extends Component<ProfileScreenProps, ProfileScreenState> {
  constructor(props: ProfileScreenProps) {
    super(props);
    this.state = {
      showInfo: false,
    };
  }

  componentDidMount = () => {
    configureNextAnimation();
    this.props.user && this.props.getUserData();
  };

  render() {
    const { user } = this.props;
    const { showInfo } = this.state;
    return (
      <View style={styles.container}>
        <AppHeader activeScreen="profile" />
        <AppTabBar />
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Text style={styles.title}>{Languages.MyProfile}</Text>
          <View style={styles.row}>
            {false && (
              <FastImage
                source={
                  user?.photo
                    ? {
                      uri: '',
                    }
                    : require('../../assets/images/userPlaceholder.png')
                }
                style={[styles.userImage]}
              />
            )}
            <View style={{}}></View>
            <View
              style={{
                flex: 1,
                justifyContent: 'space-between',
              }}>
              <Text style={styles.username}>
                {`${Languages.Hello}, ${user?.name}`}
              </Text>
              {/* <Text style={styles.userAddress}>
                {'Amman, Jordan - Jabal Amman'}
              </Text> */}
              <Text style={styles.userAddress}>{user?.phone}</Text>
              <AppButton
                androidRippleColor={AppColors.androidRippleColor.black15}
                onPress={() => {
                  navigate('EditProfileScreen');
                }}
                containerStyle={styles.editProfileBtn}
                text={Languages.EditProfile}
                textColor={AppColors.mainText}
                textStyle={styles.editProfileTxt}
                icon="gear"
                iconSize={dimensionsCalculation(16)}
                iconType="Octicons"
                iconStyle={{
                  marginRight: dimensionsCalculation(5),
                }}
              />
            </View>
          </View>
          <View style={[styles.row, { marginTop: dimensionsCalculation(10) }]}>
            <AppButton
              onPress={() => { }}
              disabled
              androidRippleColor={AppColors.androidRippleColor.white}
              containerStyle={[
                styles.actionBtn,
                { backgroundColor: AppColors.white },
              ]}
              text={Languages.MyInfo}
              textStyle={styles.actionBtnTxt}
              textColor={AppColors.white}
            />
            <AppButton
              onPress={() => {
                navigate('EditProfileScreen', {
                  viewMode: true,
                });
              }}
              androidRippleColor={AppColors.androidRippleColor.white}
              containerStyle={[
                styles.actionBtn,
                { marginHorizontal: dimensionsCalculation(10) },
                showInfo && { backgroundColor: AppColors.secondary },
              ]}
              text={Languages.MyInfo}
              textStyle={styles.actionBtnTxt}
              textColor={AppColors.white}
            />
            <AppButton
              onPress={() => {
                navigate('EditPasswordScreen');
              }}
              androidRippleColor={AppColors.androidRippleColor.white}
              containerStyle={styles.actionBtn}
              text={Languages.MyPassword}
              textStyle={styles.actionBtnTxt}
              textColor={AppColors.white}
            />
          </View>
          <View style={styles.row}>
            <AppButton
              onPress={() => {
                navigate('MyOrdersScreen');
              }}
              androidRippleColor={AppColors.androidRippleColor.white}
              containerStyle={[
                styles.actionBtn,
                { backgroundColor: AppColors.secondary },
              ]}
              text={Languages.MyOrders}
              textStyle={styles.actionBtnTxt}
              textColor={AppColors.white}
            />
            <AppButton
              onPress={() => {
                navigate('WishlistScreen');
              }}
              androidRippleColor={AppColors.androidRippleColor.white}
              containerStyle={[
                styles.actionBtn,
                { marginHorizontal: dimensionsCalculation(10) },
              ]}
              text={Languages.MyWishList}
              textStyle={styles.actionBtnTxt}
              textColor={AppColors.white}
            />
            <AppButton
              onPress={() => {
                navigate('MyAddressesScreen');
              }}
              androidRippleColor={AppColors.androidRippleColor.white}
              containerStyle={[styles.actionBtn]}
              text={Languages.MyAddresses}
              textStyle={styles.actionBtnTxt}
              textColor={AppColors.white}
            />
          </View>
        </ScrollView>
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
  return {
    getUserData: () => {
      return dispatch(getUserDataAction() as any);
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);

import { AppIcon, Constants, fonts, Languages } from '../common';
import {
  EditProfileScreenProps,
  EditProfileScreenState,
  QudsPaintsStore,
} from '../common/Types';
import {
  AppHeader,
  AppInput,
  AppTabBar,
  AppTouchableOpacity,
  LoadingButton,
  LoadingSpinner,
} from '../components';
import React, { Component, createRef, RefObject } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TextInput,
  Dimensions,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { AppColors } from '../theme';
import {
  configureNextAnimation,
  dimensionsCalculation,
  ShowToast,
  validateEmail,
} from '../utils';
import ImagePicker from 'react-native-image-crop-picker';
import Modal from 'react-native-modalbox';
import { goBack } from '../navigation';
import { connect } from 'react-redux';
import { Dispatch } from 'react';
import { AnyAction } from 'redux';
import {
  getUserDataAction,
  updateProfileAction,
} from '../store/actions/AuthActions';
import { TouchableOpacity } from 'react-native';
import { StatusBar } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  scrollview: {
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
  photoType: {
    paddingVertical: dimensionsCalculation(20),
    alignItems: 'center',
    borderBottomColor: '#F8F8F8',
    borderBottomWidth: 1,
  },
  photoTypeTxt: {
    color: AppColors.mainText,
    fontFamily: fonts.primaryBold,
    fontSize: dimensionsCalculation(20),
  },
  title: {
    fontSize: dimensionsCalculation(22),
    textAlign: 'center',
    color: AppColors.mainText,
    fontFamily: fonts.primaryBold,
    marginBottom: dimensionsCalculation(20),
  },
  profilePic: {
    width: dimensionsCalculation(100),
    height: dimensionsCalculation(100),
    borderRadius: dimensionsCalculation(50),
    alignSelf: 'center',
  },
  profilePicBtn: {
    alignSelf: 'center',
    marginBottom: dimensionsCalculation(20),
    borderRadius: dimensionsCalculation(50),
  },
});

class EditProfileScreen extends Component<
  EditProfileScreenProps,
  EditProfileScreenState
> {
  emailRef = null as RefObject<TextInput>;
  phoneRef = null as RefObject<TextInput>;
  userTypeModalRef = null as RefObject<Modal>;
  constructor(props: EditProfileScreenProps) {
    super(props);
    this.state = {
      isLoading: true,
      isEditingProfile: false,
      isEditBtnClicked: false,
      fullname: props.user?.name,
      email: props.user?.email,
      phone: props.user?.phone,
      isModalOpen: false,
      profilePic: this.props.user?.photo,
      userType: {
        type:
          this.props?.user?.usertypenew === 0 ||
            this.props?.user?.usertypenew === 1 ||
            this.props?.user?.usertypenew === 2
            ? Languages[Constants?.userTypes?.[this.props.user.usertypenew]]
            : Languages.User,
        id: this.props.user.usertypenew || 0,
      },
    };
    this.emailRef = createRef();
    this.phoneRef = createRef();
    this.userTypeModalRef = createRef();
  }

  componentDidMount = async () => {
    await this.props.getUserData();
    configureNextAnimation();
    this.setState(
      {
        isLoading: false,
      },
      () => { },
    );
  };

  componentDidUpdate = (
    prevProps: EditProfileScreenProps,
    prevState: EditProfileScreenState,
  ) => {
    if (this.props.user && prevProps?.user != this.props.user) {
      this.setState(
        {
          fullname: this.props.user?.name,
          email: this.props.user?.email,
          phone: this.props.user?.phone,
          profilePic: this.props.user?.photo,
        },
        () => { },
      );
    }
  };

  handleEditProfile = () => {
    const { fullname, email, phone, profilePic } = this.state;
    this.setState(
      {
        isEditBtnClicked: true,
      },
      () => {
        if (fullname == '') return ShowToast(Languages.EnterFullName);
        if (fullname?.length < 3) return ShowToast(Languages.FullnameTooShort);
        if (email == '') return ShowToast(Languages.EnterEmail);
        if (!validateEmail(email)) return ShowToast(Languages.EnterValidEmail);
        if (phone == '') return ShowToast(Languages.EnterPhone);
        if (phone?.length !== 9) return ShowToast(Languages.IncorrectPhone);
        this.setState(
          {
            isEditingProfile: true,
          },
          async () => {
            const success = await this.props.updateProfile({
              firstname: fullname,
              lastname: fullname,
              city: fullname,
              email: email,
              country: fullname,
              phone,
              photo:
                profilePic && typeof profilePic != 'string'
                  ? `${profilePic.data}`
                  : null,
              usertypenew: this.state.userType?.id,
            });
            if (success) {
              ShowToast(Languages.ProfileUpdatedSuccess, 'success');
              goBack();
            } else {
              this.setState(
                {
                  isEditingProfile: false,
                },
                () => { },
              );
            }
          },
        );
      },
    );
  };

  openCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 300,
      cropping: true,
      mediaType: 'photo',
      includeBase64: true,
      compressImageQuality: 0.6,
    }).then((profilePic) => {
      this.setState(
        {
          profilePic,
        },
        () => { },
      );
    });
  };

  openPicker = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      mediaType: 'photo',
      includeBase64: true,
      compressImageQuality: 0.6,
    }).then((profilePic) => {
      this.setState(
        {
          profilePic,
        },
        () => { },
      );
    });
  };

  render() {
    const {
      isLoading,
      isEditingProfile,
      isEditBtnClicked,
      fullname,
      email,
      phone,
      isModalOpen,
      profilePic,
    } = this.state;
    const viewMode = this.props.route?.params?.viewMode;
    return (
      <View style={styles.container}>
        <AppHeader />
        <AppTabBar />
        <ScrollView contentContainerStyle={styles.scrollview}>
          {isLoading && <LoadingSpinner overlay />}
          <Modal
            isOpen={isModalOpen}
            style={{
              width: '100%',
              height: '100%',
              flex: 1,
              backgroundColor: AppColors.transparent,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            coverScreen
            backButtonClose
            backdropPressToClose={false}
            swipeToClose={false}>
            <AppTouchableOpacity
              androidRippleColor={AppColors.transparent}
              style={styles.modalBackDrop}
              onPress={() => {
                this.setState(
                  {
                    isModalOpen: false,
                  },
                  () => { },
                );
              }}
            />
            <View style={styles.addnewModal}>
              <AppTouchableOpacity
                style={styles.photoType}
                onPress={() => {
                  this.setState(
                    {
                      isModalOpen: false,
                    },
                    () => {
                      setTimeout(() => {
                        this.openPicker();
                      }, 500);
                    },
                  );
                }}>
                <Text style={styles.photoTypeTxt}>{Languages.UseGallery}</Text>
              </AppTouchableOpacity>
              <AppTouchableOpacity
                style={[styles.photoType, { borderBottomWidth: 0 }]}
                onPress={() => {
                  this.setState(
                    {
                      isModalOpen: false,
                    },
                    () => {
                      setTimeout(() => {
                        this.openCamera();
                      }, 500);
                    },
                  );
                }}>
                <Text style={styles.photoTypeTxt}>{Languages.UseCamera}</Text>
              </AppTouchableOpacity>
            </View>
          </Modal>
          <Text style={styles.title}>
            {viewMode ? Languages.MyInfo : Languages.EditProfile}
          </Text>
          {false && (
            <AppTouchableOpacity
              disabled={viewMode || isEditingProfile}
              style={styles.profilePicBtn}
              onPress={() => {
                this.setState({ isModalOpen: true }, () => { });
              }}>
              <FastImage
                source={
                  !profilePic
                    ? require('../../assets/images/userPlaceholder.png')
                    : {
                      uri:
                        typeof profilePic == 'string'
                          ? profilePic ?? ''
                          : profilePic?.path,
                    }
                }
                style={styles.profilePic}
              />
            </AppTouchableOpacity>
          )}
          <AppInput
            textColor={AppColors.inputText}
            onChangeText={(fullname) => {
              this.setState({ fullname }, () => { });
            }}
            headerText={Languages.Fullname}
            editable={!viewMode && !isEditingProfile}
            placeholder={Languages.Fullname}
            value={fullname}
            autoCapitalize="words"
            returnKeyType="next"
            showError={
              isEditBtnClicked && (fullname == '' || fullname?.length < 3)
            }
            errorMsg={
              fullname == '' ? Languages.Required : Languages.FullnameTooShort
            }
            onSubmitEditing={() => {
              this.emailRef?.current?.focus();
            }}
            containerStyle={{
              marginHorizontal: dimensionsCalculation(20),
            }}
          />
          <AppInput
            forwardedRef={this.emailRef}
            textColor={AppColors.inputText}
            onChangeText={(email) => {
              this.setState({ email }, () => { });
            }}
            headerText={Languages.Email}
            editable={!viewMode && !isEditingProfile}
            placeholder={Languages.Email}
            value={email}
            keyboardType="email-address"
            returnKeyType="next"
            showError={
              isEditBtnClicked && (email == '' || !validateEmail(email))
            }
            errorMsg={
              email == '' ? Languages.Required : Languages.EnterValidEmail
            }
            onSubmitEditing={() => {
              this.phoneRef?.current?.focus();
            }}
            containerStyle={{
              marginHorizontal: dimensionsCalculation(20),
            }}
          />
          <AppInput
            forwardedRef={this.phoneRef}
            textColor={AppColors.inputText}
            onChangeText={(phone) => {
              this.setState({ phone }, () => { });
            }}
            headerText={Languages.Phone}
            editable={!viewMode && !isEditingProfile}
            placeholder={Languages.Phone}
            value={phone}
            keyboardType="phone-pad"
            returnKeyType="next"
            showError={isEditBtnClicked && phone?.length !== 9}
            errorMsg={
              phone?.length == 0 ? Languages.Required : Languages.PhoneTooShort
            }
            onSubmitEditing={() => {
              this.handleEditProfile();
            }}
            maxLength={9}
            containerStyle={{
              marginHorizontal: dimensionsCalculation(20),
            }}
          />

          <Modal
            ref={this.userTypeModalRef}
            backdrop={false}
            backButtonClose
            swipeToClose={false}
            coverScreen
            onClosed={() => { }}
            style={{
              width: '100%',
              flex: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              justifyContent: 'flex-end',
            }}>
            <StatusBar backgroundColor="rgba(0, 0, 0, 0.5)" />
            <View
              style={{
                width: '100%',
                height: 300,
                backgroundColor: 'white',
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
                padding: 20,
                alignItems: 'center',
              }}>
              <Text style={{ fontSize: 20, marginBottom: 30 }}>
                {Languages.SelectUserType}
              </Text>

              {Constants.userTypesList.map((item, index) => (
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      userType: {
                        id: item.id,
                        type: Languages[Constants?.userTypes?.[item.id]],
                      },
                    });
                    this.userTypeModalRef?.current?.close();
                  }}
                  key={index}
                  style={{
                    alignSelf: 'flex-start',
                    marginBottom: 20,
                    paddingVertical: 5,
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                    }}>
                    {index + 1 + ')  '}
                    {Languages[Constants?.userTypes?.[item.id]]}
                  </Text>
                </TouchableOpacity>
              ))}

              <AppIcon
                onPress={() => this.userTypeModalRef?.current?.close()}
                name="close"
                type="AntDesign"
                size={24}
                style={{
                  position: 'absolute',
                  padding: 5,
                  margin: 20,
                  right: 0,
                }}
              />
            </View>
          </Modal>

          <TouchableOpacity
            disabled={viewMode}
            onPress={() => this.userTypeModalRef?.current?.open()}>
            <AppInput
              textColor={AppColors.inputText}
              onChangeText={(phone) => {
                this.setState({ phone }, () => { });
              }}
              headerText={Languages.UserType}
              editable={false}
              placeholder={Languages.UserType}
              value={this.state.userType.type}
              containerStyle={{
                marginHorizontal: dimensionsCalculation(20),
              }}
            />
          </TouchableOpacity>

          {!viewMode && (
            <LoadingButton
              onPress={() => {
                this.handleEditProfile();
              }}
              isLoading={isEditingProfile}
              text={Languages.Submit}
              textColor={AppColors.white}
              backgroundColor={AppColors.secondary}
              androidRippleColor={AppColors.androidRippleColor.black15}
              containerStyle={{
                marginTop: dimensionsCalculation(10),
                elevation: 3,
                height: dimensionsCalculation(40),
                borderRadius: dimensionsCalculation(50),
                alignSelf: 'center',
                width: '50%',
              }}
            />
          )}
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
    updateProfile: (params) => {
      return dispatch(updateProfileAction(params) as any);
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditProfileScreen);

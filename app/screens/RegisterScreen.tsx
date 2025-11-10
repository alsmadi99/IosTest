import { AppIcon, Constants, fonts, Languages } from '../common';
import {
  QudsPaintsStore,
  RegisterParams,
  RegisterScreenProps,
  RegisterScreenState,
} from '../common/Types';
import {
  AppButton,
  AppInput,
  AppTouchableOpacity,
  ImageHeader,
  LoadingButton,
  LoadingSpinner,
} from '../components';
import { navigate } from '../navigation';
import React, { Component, createRef, RefObject } from 'react';
import { Dispatch } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import {
  loginUsingAppleAction,
  loginUsingFacebookAction,
  loginUsingGoogleAction,
  registerAction,
} from '../store/actions/AuthActions';
import { AppColors } from '../theme';
import {
  dimensionsCalculation,
  isIOS,
  isRTL,
  ShowToast,
  validateEmail,
} from '../utils';
import PhoneInput from 'react-native-phone-input';
import Modal from 'react-native-modalbox';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  scrollViewStyle: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: dimensionsCalculation(25),
    fontFamily: fonts.primaryBold,
    color: AppColors.mainText,
    marginBottom: dimensionsCalculation(20),
  },
  or: {
    textAlign: 'center',
    color: '#d9d9d9',
    marginBottom: dimensionsCalculation(10),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  socialBtn: {
    borderRadius: dimensionsCalculation(20),
    flex: 1,
    paddingVertical: dimensionsCalculation(5),
    marginHorizontal: dimensionsCalculation(20),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    overflow: 'visible',
    marginBottom: dimensionsCalculation(10),
  },
  socialBtnTxt: {
    flex: 0.8,
    fontFamily: fonts.primaryRegular,
  },
  socialBtnIcn: {
    flex: 0.2,
    textAlign: 'center',
  },
  userAgree: {
    flex: 1,
    color: AppColors.inputText,
    fontSize: dimensionsCalculation(12),
    textAlign: 'left',
    fontFamily: fonts.primaryLight,
  },
  forgotPass: {
    color: AppColors.mainText,
    textDecorationLine: 'underline',
    fontSize: dimensionsCalculation(11),
    fontFamily: fonts.primaryBold,
  },
});

class RegisterScreen extends Component<
  RegisterScreenProps,
  RegisterScreenState
> {
  userTypeModalRef: RefObject<Modal> = null;
  emailRef = null as RefObject<TextInput>;
  phoneRef = null as RefObject<TextInput>;
  passwordRef = null as RefObject<TextInput>;
  confirmPasswordRef = null as RefObject<TextInput>;
  phone = null as PhoneInput;
  timeout = null;
  constructor(props: RegisterScreenProps) {
    super(props);
    this.state = {
      isLoading: false,
      isSocialLoginLoading: false,
      isSignupBtnClicked: false,
      isUserAgree: false,
      fullname: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      isValidPhone: true,
      userType: {},
    };
    this.emailRef = createRef();
    this.phoneRef = createRef();
    this.passwordRef = createRef();
    this.confirmPasswordRef = createRef();
    this.userTypeModalRef = createRef();
  }

  handleRegister = () => {
    const {
      isUserAgree,
      fullname,
      email,
      phone,
      password,
      confirmPassword,
      isValidPhone,
      userType,
    } = this.state;
    this.setState(
      {
        isSignupBtnClicked: true,
      },
      () => {
        if (fullname == '') return ShowToast(Languages.EnterFullName);
        if (fullname?.length < 3) return ShowToast(Languages.FullnameTooShort);
        if (fullname?.trim().split(' ').length < 2)
          return ShowToast(Languages.FullNameIncorrect);
        // if (email == '') return ShowToast(Languages.EnterEmail);
        if (email != '' && !validateEmail(email))
          return ShowToast(Languages.EnterValidEmail);
        if (phone == '') return ShowToast(Languages.EnterPhone);
        if (phone?.length < 10) return ShowToast(Languages.PhoneTooShort);
        if (!isValidPhone) return ShowToast(Languages.IncorrectPhone);
        if (password == '') return ShowToast(Languages.EnterPassword);
        if (password?.length < 6) return ShowToast(Languages.PasswordTooShort);
        if (confirmPassword == '')
          return ShowToast(Languages.EnterConfirmPassword);
        if (confirmPassword != password)
          return ShowToast(Languages.PassDontMatch);
        if (!isUserAgree) return ShowToast(Languages.UserAgreeRequired);
        if (!this.state.userType?.type)
          return ShowToast(Languages.SelectUserType);
        const nameArr = fullname.trim().split(' ');
        const firstname = nameArr[0];
        let lastname = '';
        nameArr.slice(1, nameArr.length).map((i) => (lastname += i + ' '));
        lastname = lastname.trim();
        this.setState(
          {
            isLoading: true,
          },
          async () => {
            const params: RegisterParams = {
              city: fullname,
              country: fullname,
              email: email,
              password: password,
              phone: `+962${phone}`,
              name: firstname,
              lastname: lastname,
              usertypenew: this.state.userType?.id,
              extraAction: this.props.route?.params?.extraAction,
            };
            await this.props.register(params);
            this.setState(
              {
                isLoading: false,
              },
              () => { },
            );
          },
        );
      },
    );
  };

  render() {
    const {
      isLoading,
      isSocialLoginLoading,
      isSignupBtnClicked,
      isUserAgree,
      fullname,
      email,
      phone,
      password,
      confirmPassword,
      isValidPhone,
    } = this.state;
    return (
      <View style={styles.container}>
        {isSocialLoginLoading && <LoadingSpinner overlay />}
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
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewStyle}>
          <ImageHeader source={require('../../assets/images/register.png')} />
          <View
            style={{
              paddingVertical: dimensionsCalculation(20),
              paddingHorizontal: Dimensions.get('screen').width * 0.1,
            }}>
            <Text style={styles.title}>{Languages.Register}</Text>
            <AppInput
              textColor={AppColors.inputText}
              onChangeText={(fullname) => {
                this.setState({ fullname }, () => { });
              }}
              editable={!isLoading}
              placeholder={Languages.FullnamePH}
              value={fullname}
              autoCapitalize="words"
              returnKeyType="next"
              showError={
                isSignupBtnClicked &&
                (fullname?.trim() == '' ||
                  fullname?.trim().length < 3 ||
                  fullname?.trim().split(' ').length < 2)
              }
              errorMsg={
                fullname.trim() == ''
                  ? Languages.Required
                  : fullname.trim().length < 3
                    ? Languages.FullnameTooShort
                    : Languages.FullNameIncorrect
              }
              onSubmitEditing={() => {
                // this.emailRef?.current?.focus();
                this.phoneRef.current.focus();
              }}
              containerStyle={{
                marginHorizontal: dimensionsCalculation(20),
              }}
            />
            {false && (
              <AppInput
                forwardedRef={this.emailRef}
                textColor={AppColors.inputText}
                onChangeText={(email) => {
                  this.setState({ email }, () => { });
                }}
                editable={!isLoading}
                placeholder={Languages.Email}
                value={email}
                keyboardType="email-address"
                returnKeyType="next"
                showError={
                  isSignupBtnClicked && email != '' && !validateEmail(email)
                }
                errorMsg={Languages.EnterValidEmail}
                onSubmitEditing={() => {
                  this.phoneRef?.current?.focus();
                }}
                containerStyle={{
                  marginHorizontal: dimensionsCalculation(20),
                }}
              />
            )}
            <AppInput
              forwardedRef={this.phoneRef}
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
              showError={
                isSignupBtnClicked && (phone?.length < 10 || !isValidPhone)
              }
              errorMsg={
                phone?.length == 0
                  ? Languages.Required
                  : !isValidPhone
                    ? Languages.EnterValidPhone
                    : Languages.PhoneTooShort
              }
              onSubmitEditing={() => {
                this.passwordRef?.current?.focus();
              }}
              containerStyle={{
                marginHorizontal: dimensionsCalculation(20),
              }}
            />
            <AppInput
              forwardedRef={this.passwordRef}
              textColor={AppColors.inputText}
              onChangeText={(password) => {
                this.setState({ password }, () => { });
              }}
              editable={!isLoading}
              placeholder={Languages.Password}
              secureTextEntry
              value={password}
              showError={isSignupBtnClicked && password?.length < 6}
              errorMsg={
                password?.length == 0
                  ? Languages.Required
                  : Languages.PasswordTooShort
              }
              onSubmitEditing={() => {
                this.confirmPasswordRef?.current?.focus();
              }}
              containerStyle={{
                marginHorizontal: dimensionsCalculation(20),
              }}
            />
            <AppInput
              forwardedRef={this.confirmPasswordRef}
              textColor={AppColors.inputText}
              onChangeText={(confirmPassword) => {
                this.setState({ confirmPassword }, () => { });
              }}
              editable={!isLoading}
              placeholder={Languages.ConfirmPassword}
              secureTextEntry
              value={confirmPassword}
              showError={
                isSignupBtnClicked &&
                (confirmPassword?.length < 6 || password != confirmPassword)
              }
              errorMsg={
                confirmPassword?.length == 0
                  ? Languages.Required
                  : confirmPassword?.length < 6
                    ? Languages.PasswordTooShort
                    : Languages.PassDontMatch
              }
              onSubmitEditing={() => {
                // this.handleRegister();
              }}
              containerStyle={{
                marginBottom: dimensionsCalculation(10),
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

            <View
              style={{
                width: '100%',
                paddingHorizontal: dimensionsCalculation(20),
              }}>
              <TouchableOpacity
                onPress={() => this.userTypeModalRef?.current?.open()}
                style={{
                  width: '100%',
                  marginVertical: dimensionsCalculation(10),
                  alignSelf: 'center',
                  height: 50,
                  borderWidth: 1,
                  borderColor:
                    isSignupBtnClicked && !this.state.userType?.type
                      ? 'red'
                      : '#d9d9d9',
                  borderRadius: dimensionsCalculation(5),
                  paddingHorizontal: dimensionsCalculation(15),
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontSize: dimensionsCalculation(14),
                    fontFamily: fonts.primaryRegular,
                    color: this.state.userType?.type
                      ? AppColors.inputText
                      : '#a0a0a0',
                  }}>
                  {this.state.userType?.type
                    ? Languages[Constants?.userTypes?.[this.state.userType?.id]]
                    : Languages.UserType}
                </Text>
              </TouchableOpacity>
              {isSignupBtnClicked && !this.state.userType?.type ? (
                <Text
                  style={{
                    color: 'red',
                    fontSize: dimensionsCalculation(12),
                    fontFamily: fonts.primaryLight,
                    top: -dimensionsCalculation(9),
                    marginHorizontal: 6,
                  }}>
                  Required
                </Text>
              ) : null}
            </View>

            <Text style={styles.or}>{Languages.OR}</Text>
            <View>
              <AppButton
                disabled={isLoading}
                onPress={() => {
                  this.setState(
                    {
                      isSocialLoginLoading: true,
                    },
                    async () => {
                      await this.props.gooogleLogin(
                        this.props.route?.params?.extraAction,
                      );
                      this.setState(
                        {
                          isSocialLoginLoading: false,
                        },
                        () => { },
                      );
                    },
                  );
                }}
                containerStyle={[
                  styles.socialBtn,
                  {
                    backgroundColor: '#DB3F2C',
                  },
                ]}
                icon="google"
                iconSize={dimensionsCalculation(20)}
                iconType="FontAwesome"
                text={Languages.Google}
                textStyle={styles.socialBtnTxt}
                iconStyle={styles.socialBtnIcn}
              />
              {
                <AppButton
                  disabled={isLoading}
                  onPress={() => {
                    this.setState(
                      {
                        isSocialLoginLoading: true,
                      },
                      async () => {
                        await this.props.fbLogin(
                          this.props.route?.params?.extraAction,
                        );
                        this.setState(
                          {
                            isSocialLoginLoading: false,
                          },
                          () => { },
                        );
                      },
                    );
                  }}
                  containerStyle={[
                    styles.socialBtn,
                    {
                      backgroundColor: '#3B5998',
                    },
                  ]}
                  icon="facebook"
                  iconSize={dimensionsCalculation(20)}
                  iconType="FontAwesome"
                  text={Languages.Facebook}
                  textStyle={styles.socialBtnTxt}
                  iconStyle={styles.socialBtnIcn}
                />
              }
              {isIOS && (
                <AppButton
                  disabled={isLoading}
                  onPress={() => {
                    this.setState(
                      {
                        isSocialLoginLoading: true,
                      },
                      async () => {
                        await this.props.appleLogin(
                          this.props.route?.params?.extraAction,
                        );
                        this.setState(
                          {
                            isSocialLoginLoading: false,
                          },
                          () => { },
                        );
                      },
                    );
                  }}
                  androidRippleColor={AppColors.androidRippleColor.black15}
                  containerStyle={[
                    styles.socialBtn,
                    {
                      backgroundColor: '#FFFFFF',
                    },
                  ]}
                  icon="apple"
                  textColor={AppColors.black}
                  iconSize={dimensionsCalculation(20)}
                  iconType="FontAwesome"
                  text={Languages.Apple}
                  textStyle={styles.socialBtnTxt}
                  iconStyle={styles.socialBtnIcn}
                />
              )}
            </View>
            <View
              style={[
                styles.row,
                {
                  paddingVertical: dimensionsCalculation(5),
                  paddingHorizontal: dimensionsCalculation(0),
                  marginTop: dimensionsCalculation(0),
                  justifyContent: 'space-between',
                },
              ]}>
              <AppTouchableOpacity
                androidRippleColor={AppColors.androidRippleColor.black15}
                onPress={() => {
                  this.setState(
                    {
                      isUserAgree: !isUserAgree,
                    },
                    () => { },
                  );
                }}
                borderless
                style={{
                  overflow: 'visible',
                }}>
                <AppIcon
                  name={isUserAgree ? 'check-box' : 'check-box-outline-blank'}
                  type="MaterialIcons"
                  size={dimensionsCalculation(20)}
                  color={
                    isUserAgree
                      ? AppColors.mainText
                      : isSignupBtnClicked
                        ? 'red'
                        : AppColors.inputText
                  }
                />
              </AppTouchableOpacity>
              <Text
                style={[
                  styles.userAgree,
                  isSignupBtnClicked && !isUserAgree && { color: 'red' },
                ]}
                onPress={() => {
                  navigate('StaticPageScreen', {
                    istabbar: false,
                    type: '30119',
                  });
                }}
                numberOfLines={1}
                adjustsFontSizeToFit>
                {Languages.AgreeStatements}
                <Text
                  onPress={() => {
                    navigate('StaticPageScreen', {
                      istabbar: false,
                      type: '30119',
                    });
                  }}
                  style={{
                    fontSize: dimensionsCalculation(12),
                    color:
                      isSignupBtnClicked && !isUserAgree
                        ? 'red'
                        : AppColors.mainText,
                    textDecorationLine: 'underline',
                  }}>
                  {Languages.TermsNConditions}
                </Text>
              </Text>
              {/* <Text
                style={[
                  {
                    color: AppColors.inputText,
                    fontSize: dimensionsCalculation(12),
                  },
                  isSignupBtnClicked && !isUserAgree && {color: 'red'},
                ]}>{` ${isRTL ? 'و' : '&'} `}</Text>
              <Text
                onPress={() => {
                  navigate('StaticPageScreen', {
                    istabbar: false,
                    type: '30117',
                  });
                }}
                style={{
                  fontSize: dimensionsCalculation(12),
                  color:
                    isSignupBtnClicked && !isUserAgree
                      ? 'red'
                      : AppColors.mainText,
                  textDecorationLine: 'underline',
                }}>
                {Languages.TermsOfSales}
              </Text> */}
            </View>
            <View
              style={[
                styles.row,
                {
                  marginTop: dimensionsCalculation(10),
                  justifyContent: 'center',
                },
              ]}>
              <AppTouchableOpacity
                androidRippleColor={AppColors.androidRippleColor.black15}
                style={{ padding: dimensionsCalculation(5) }}
                onPress={() => {
                  navigate('LoginScreen');
                }}>
                <Text style={styles.forgotPass}>{Languages.HaveAccount}</Text>
              </AppTouchableOpacity>
            </View>
            <LoadingButton
              onPress={() => {
                this.handleRegister();
              }}
              isLoading={isLoading}
              text={Languages.Register}
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
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = ({ }: QudsPaintsStore) => {
  return {};
};
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return {
    register: (userDetails) => {
      return dispatch(registerAction(userDetails) as any);
    },
    appleLogin: (extraAction) => {
      return dispatch(loginUsingAppleAction(extraAction) as any);
    },
    fbLogin: (extraAction) => {
      return dispatch(loginUsingFacebookAction(extraAction) as any);
    },
    gooogleLogin: (extraAction) => {
      return dispatch(loginUsingGoogleAction(extraAction) as any);
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterScreen);

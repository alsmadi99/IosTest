import { AppIcon, fonts, Languages } from '../common';
import {
  LoginScreenProps,
  LoginScreenState,
  QudsPaintsStore,
  VerifyCodeScreenNavigateType,
} from '../common/Types';
import {
  AppButton,
  AppInput,
  AppTouchableOpacity,
  ImageHeader,
  LoadingButton,
  LoadingSpinner,
} from '../components';
import { canGoBack, goBack, navigate, push, reset } from '../navigation';
import React, { Component, createRef, RefObject } from 'react';
import { Dispatch } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Dimensions,
  TextInput,
  BackHandler,
} from 'react-native';
import Modal from 'react-native-modalbox';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import {
  forgotPasswordEmailCall,
  forgotPasswordPhoneCall,
} from '../services/api/calls';
import {
  loginAction,
  loginUsingAppleAction,
  loginUsingFacebookAction,
  loginUsingGoogleAction,
} from '../store/actions/AuthActions';
import { AppColors } from '../theme';
import {
  dimensionsCalculation,
  getStatusBarHeight,
  isIOS,
  isRTL,
  ShowToast,
  validateEmail,
  validatePassword,
} from '../utils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  modalStyle: {
    width: '100%',
    height: '100%',
    flex: 1,
    backgroundColor: AppColors.white,
  },
  closeBtn: {
    position: 'absolute',
    top: getStatusBarHeight() + dimensionsCalculation(20),
    left: dimensionsCalculation(20),
    zIndex: 1500,
    overflow: 'visible',
    alignSelf: 'flex-start',
  },
  scrollViewStyle: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Dimensions.get('screen').width * 0.1,
  },
  optionBtn: {
    backgroundColor: 'grey',
    flex: 1,
    borderRadius: dimensionsCalculation(5),
  },
  optionTxt: {
    fontFamily: fonts.primaryRegular,
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
    overflow: 'visible',
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    marginBottom: dimensionsCalculation(10),
  },
  socialBtnTxt: {
    textAlign: isRTL ? 'center' : 'left',
    flex: 0.8,
    fontFamily: fonts.primaryRegular,
  },
  socialBtnIcn: {
    flex: 0.2,
    textAlign: 'center',
  },
  forgotPass: {
    color: AppColors.mainText,
    textDecorationLine: 'underline',
    fontSize: dimensionsCalculation(11),
    fontFamily: fonts.primaryBold,
  },
  login: {
    marginTop: dimensionsCalculation(20),
    elevation: 3,
    height: dimensionsCalculation(40),
    borderRadius: dimensionsCalculation(50),
    alignSelf: 'center',
    width: '50%',
  },
});

class LoginScreen extends Component<LoginScreenProps, LoginScreenState> {
  passwordRef = null as RefObject<TextInput>;
  forgotPasswordModalRef = null as RefObject<Modal>;
  back: any;
  constructor(props: LoginScreenProps) {
    super(props);
    this.state = {
      forgotPassClicked: false,
      isLoading: false,
      isSocialLoginLoading: false,
      email: '',
      password: '',
      forgotPassEmail: '',
      isSigninBtnClicked: false,
      forgotType: 'email',
      forgotPassPhone: '',
    };
    this.passwordRef = createRef();
    this.forgotPasswordModalRef = createRef();
  }

  componentDidMount = () => {
    this.back = BackHandler.addEventListener('hardwareBackPress', () => {
      if (canGoBack()) {
        goBack();
      } else {
        reset([
          {
            name: 'HomeScreen',
          },
        ]);
      }
      return true;
    });
  };

  componentWillUnmount = () => {
    this.back?.remove();
  };

  handleLogin = () => {
    this.setState(
      {
        isSigninBtnClicked: true,
      },
      () => {
        const { email, password } = this.state;
        if (email == '') return ShowToast(Languages.EnterUsername);
        if (password == '') return ShowToast(Languages.EnterPassword);
        // if (!validateEmail(email)) return ShowToast(Languages.EnterValidEmail);
        if (password.length < 6) return ShowToast(Languages.PasswordTooShort);
        this.setState(
          {
            isLoading: true,
          },
          async () => {
            await this.props.login({
              username: email,
              password,
              extraAction: this.props.route?.params?.extraAction,
            });
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

  handleForgotPassword = () => {
    const { forgotPassEmail, forgotPassPhone, forgotType } = this.state;
    this.setState(
      {
        forgotPassClicked: true,
      },
      () => {
        if (!forgotPassPhone && !forgotPassEmail)
          return ShowToast(Languages.Required);
        if (forgotType == 'email' && !validateEmail(forgotPassEmail))
          return ShowToast(Languages.EnterValidEmail);
        this.setState(
          {
            isLoading: true,
          },
          async () => {
            const result =
              forgotType == 'email'
                ? await forgotPasswordEmailCall({
                  username: forgotPassEmail,
                })
                : await forgotPasswordPhoneCall({
                  username: forgotPassPhone,
                });
            if (result?.data?.result == 1) {
              ShowToast(Languages.NewPassSent, 'success');
              this.forgotPasswordModalRef?.current?.close();
              forgotType == 'phone' &&
                push('VerifyOtpScreen', {
                  type: VerifyCodeScreenNavigateType.forgot_password,
                  token: result?.data?.token,
                  phone: forgotPassPhone,
                });
            } else {
              ShowToast(Languages.UserNotFound);
            }
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
      isSigninBtnClicked,
      email,
      password,
      forgotPassPhone,
      forgotPassEmail,
      forgotPassClicked,
      forgotType,
    } = this.state;
    return (
      <View style={styles.container}>
        {isSocialLoginLoading && <LoadingSpinner overlay />}
        <Modal
          ref={this.forgotPasswordModalRef}
          style={styles.modalStyle}
          keyboardTopOffset={0}
          backButtonClose
          backdrop={false}
          swipeToClose
          onClosed={() => {
            this.setState(
              {
                forgotPassEmail: '',
                isLoading: false,
                forgotPassClicked: false,
                forgotType: 'email',
              },
              () => { },
            );
          }}
          swipeArea={dimensionsCalculation(getStatusBarHeight() + 30)}
          statusBarTranslucent>
          <AppTouchableOpacity
            disabled={isLoading || isSocialLoginLoading}
            androidRippleColor={AppColors.androidRippleColor.black15}
            borderless
            onPress={() => {
              this.forgotPasswordModalRef?.current?.close();
            }}
            style={styles.closeBtn}>
            <AppIcon
              name="closecircleo"
              type="AntDesign"
              size={dimensionsCalculation(30)}
              color={AppColors.mainText}
            />
          </AppTouchableOpacity>
          <ScrollView
            contentContainerStyle={[
              styles.scrollViewStyle,
              {
                justifyContent: 'flex-start',
                paddingTop: getStatusBarHeight() + dimensionsCalculation(90),
              },
            ]}>
            <Text
              style={[
                styles.title,
                {
                  fontFamily: fonts.primaryRegular,
                  fontSize: dimensionsCalculation(18),
                },
              ]}>
              {Languages.EnterEmailToSendCode}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                marginBottom: dimensionsCalculation(20),
              }}>
              <AppButton
                onPress={() => {
                  this.setState(
                    {
                      forgotPassEmail: '',
                      forgotPassPhone: '',
                      forgotPassClicked: false,
                      forgotType: 'email',
                    },
                    () => { },
                  );
                }}
                text={Languages.ByEmail}
                androidRippleColor={AppColors.androidRippleColor.white}
                textColor={AppColors.white}
                containerStyle={[
                  styles.optionBtn,
                  forgotType == 'email' && {
                    backgroundColor: AppColors.primary,
                  },
                ]}
                icon="email"
                iconType="MaterialIcons"
                iconSize={dimensionsCalculation(16)}
                textStyle={styles.optionTxt}
                disabled={isLoading || isSocialLoginLoading}
              />
              <AppButton
                onPress={() => {
                  this.setState(
                    {
                      forgotPassEmail: '',
                      forgotPassPhone: '',
                      forgotPassClicked: false,
                      forgotType: 'phone',
                    },
                    () => { },
                  );
                }}
                text={Languages.ByPhone}
                androidRippleColor={AppColors.androidRippleColor.white}
                textColor={AppColors.white}
                containerStyle={[
                  styles.optionBtn,
                  { marginLeft: dimensionsCalculation(10) },
                  forgotType == 'phone' && {
                    backgroundColor: AppColors.primary,
                  },
                ]}
                icon="call"
                iconType="MaterialIcons"
                iconSize={dimensionsCalculation(16)}
                textStyle={styles.optionTxt}
                disabled={isLoading || isSocialLoginLoading}
              />
            </View>
            <AppInput
              textColor={AppColors.inputText}
              keyboardType={
                forgotType == 'phone' ? 'number-pad' : 'email-address'
              }
              onChangeText={(forgotPassEmail) => {
                forgotType == 'phone'
                  ? this.setState(
                    {
                      forgotPassPhone: forgotPassEmail,
                    },
                    () => { },
                  )
                  : this.setState({ forgotPassEmail }, () => { });
              }}
              placeholder={
                forgotType == 'phone' ? '07xxxxxxxx' : Languages.Email
              }
              value={forgotType == 'phone' ? forgotPassPhone : forgotPassEmail}
              onSubmitEditing={this.handleForgotPassword}
              editable={!isLoading}
              showError={
                forgotPassClicked &&
                (forgotType == 'phone'
                  ? !forgotPassPhone
                  : !forgotPassEmail || !validateEmail(forgotPassEmail))
              }
              errorMsg={
                forgotType == 'email'
                  ? !forgotPassEmail
                    ? Languages.Required
                    : Languages.EnterValidEmail
                  : !forgotPassPhone
                    ? Languages.Required
                    : null
              }
            />
            <LoadingButton
              onPress={this.handleForgotPassword}
              isLoading={isLoading}
              text={Languages.SendCode}
              textColor={AppColors.white}
              backgroundColor={AppColors.secondary}
              androidRippleColor={AppColors.androidRippleColor.black15}
              containerStyle={[
                styles.login,
                { backgroundColor: AppColors.primary, marginTop: 0 },
              ]}
              textStyle={{
                fontFamily: fonts.primaryRegular,
              }}
            />
          </ScrollView>
        </Modal>
        <ImageHeader source={require('../../assets/images/login.png')} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewStyle}>
          <Text style={styles.title}>{Languages.Login}</Text>
          <AppInput
            textColor={AppColors.inputText}
            onChangeText={(email) => {
              this.setState({ email }, () => { });
            }}
            editable={!isLoading}
            placeholder={Languages.EmailPhone}
            value={email}
            keyboardType={
              email != '' && !isNaN(email as any)
                ? 'number-pad'
                : 'email-address'
            }
            returnKeyType="next"
            showError={isSigninBtnClicked && email == ''}
            errorMsg={Languages.Required}
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
            showError={isSigninBtnClicked && password?.length < 6}
            errorMsg={
              password?.length == 0
                ? Languages.EnterPassword
                : Languages.PasswordTooShort
            }
            onSubmitEditing={() => {
              this.handleLogin();
            }}
            containerStyle={{
              marginBottom: dimensionsCalculation(10),
              marginHorizontal: dimensionsCalculation(20),
            }}
          />
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
                marginHorizontal: dimensionsCalculation(20),
                marginTop: dimensionsCalculation(10),
              },
            ]}>
            <AppTouchableOpacity
              disabled={isLoading || isSocialLoginLoading}
              androidRippleColor={AppColors.androidRippleColor.black15}
              style={{ padding: dimensionsCalculation(5) }}
              onPress={() => {
                this.setState(
                  {
                    forgotPassEmail: email,
                  },
                  () => {
                    this.forgotPasswordModalRef?.current?.open();
                  },
                );
              }}>
              <Text style={styles.forgotPass}>{Languages.ForgotPass}</Text>
            </AppTouchableOpacity>
            <AppTouchableOpacity
              disabled={isLoading || isSocialLoginLoading}
              androidRippleColor={AppColors.androidRippleColor.black15}
              style={{ padding: dimensionsCalculation(5) }}
              onPress={() => {
                navigate('RegisterScreen');
              }}>
              <Text style={styles.forgotPass}>{Languages.CreateAccount}</Text>
            </AppTouchableOpacity>
          </View>
          <LoadingButton
            onPress={() => {
              this.handleLogin();
            }}
            isLoading={isLoading}
            text={Languages.Login}
            textColor={AppColors.white}
            backgroundColor={AppColors.secondary}
            androidRippleColor={AppColors.androidRippleColor.black15}
            containerStyle={styles.login}
          />
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
    login: (credintials) => {
      return dispatch(loginAction(credintials) as any);
    },
    fbLogin: (extraAction) => {
      return dispatch(loginUsingFacebookAction(extraAction) as any);
    },
    gooogleLogin: (extraAction) => {
      return dispatch(loginUsingGoogleAction(extraAction) as any);
    },
    appleLogin: (extraAction) => {
      return dispatch(loginUsingAppleAction(extraAction) as any);
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);

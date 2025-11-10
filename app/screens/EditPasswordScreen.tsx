import { AppIcon, Constants, fonts, Languages } from '../common';
import { EditPasswordScreenProps, EditPasswordScreenState } from '../common/Types';
import {
  AppButton,
  AppHeader,
  AppInput,
  AppTabBar,
  AppTouchableOpacity,
  LoadingButton,
} from '../components';
import { goBack, push, reset } from '../navigation';
import React, { Component, createRef, RefObject } from 'react';
import { View, StyleSheet, Text, ScrollView, TextInput } from 'react-native';
import Modal from 'react-native-modalbox';
import {
  changePasswordCall,
  forgotPasswordPhoneCall,
  forgotPasswordEmailCall,
} from '../services/api/calls';
import { AppColors } from '../theme';
import {
  configureNextAnimation,
  dimensionsCalculation,
  getStatusBarHeight,
  ShowToast,
  validateEmail,
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
  scrollview: {
    paddingTop: Constants.headerHeight + dimensionsCalculation(20),
    paddingBottom: Constants.tabBarHeight + dimensionsCalculation(20),
    paddingHorizontal: dimensionsCalculation(20),
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
    fontSize: dimensionsCalculation(22),
    textAlign: 'center',
    color: AppColors.mainText,
    fontFamily: fonts.primaryBold,
    marginBottom: dimensionsCalculation(20),
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

export default class EditPasswordScreen extends Component<
  EditPasswordScreenProps,
  EditPasswordScreenState
> {
  confirmPasswordRef: RefObject<TextInput>;
  forgotPasswordModalRef: RefObject<Modal>;
  constructor(props: EditPasswordScreenProps) {
    super(props);
    this.state = {
      isEditingPassword: false,
      isEditBtnClicked: false,
      password: '',
      confirmPassword: '',
      forgotPassClicked: false,
      forgotPassEmail: '',
      forgotPassPhone: '',
      forgotType: 'email',
      isLoading: false,
      isModalOpen: false,
    };
    this.confirmPasswordRef = createRef();
    this.forgotPasswordModalRef = createRef();
  }

  handleChangePassword = () => {
    const { password, confirmPassword } = this.state;
    this.setState(
      {
        isEditBtnClicked: true,
      },
      () => {
        if (password == '') return ShowToast(Languages.EnterPassword);
        if (password?.length < 6) return ShowToast(Languages.PasswordTooShort);
        if (confirmPassword == '')
          return ShowToast(Languages.EnterConfirmPassword);
        if (confirmPassword != password)
          return ShowToast(Languages.PassDontMatch);
        this.setState(
          {
            isEditingPassword: true,
          },
          async () => {
            const result = await changePasswordCall({
              password,
              token: this.props.route?.params?.token ?? null,
            });
            if (result?.data?.result == 1) {
              ShowToast(Languages.PasswordChangedSuccess, 'success');
              goBack();
              this.props.route?.params?.token && reset([{ name: 'LoginScreen' }]);
            } else {
              ShowToast(result?.data?.msg);
              this.setState(
                {
                  isEditingPassword: false,
                },
                () => { },
              );
            }
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
              forgotType == 'phone' && push('VerifyOtpScreen');
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
      isEditingPassword,
      isEditBtnClicked,
      password,
      confirmPassword,
      isLoading,
      forgotType,
      forgotPassPhone,
      forgotPassEmail,
      forgotPassClicked,
      isModalOpen,
    } = this.state;
    return (
      <View style={styles.container}>
        {!isModalOpen && (
          <>
            <AppHeader />
            <AppTabBar />
          </>
        )}
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
                isModalOpen: false,
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
            disabled={isLoading}
            androidRippleColor={AppColors.androidRippleColor.black15}
            borderless
            onPress={() => {
              this.setState(
                {
                  isModalOpen: false,
                },
                () => {
                  this.forgotPasswordModalRef?.current?.close();
                },
              );
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
              styles.scrollview,
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
        <ScrollView contentContainerStyle={styles.scrollview}>
          <Text style={styles.title}>{Languages.EditPassword}</Text>
          <AppInput
            textColor={AppColors.inputText}
            onChangeText={(password) => {
              this.setState({ password }, () => { });
            }}
            editable={!isEditingPassword}
            placeholder={Languages.Password}
            secureTextEntry
            value={password}
            showError={isEditBtnClicked && password?.length < 6}
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
            editable={!isEditingPassword}
            placeholder={Languages.ConfirmPassword}
            secureTextEntry
            value={confirmPassword}
            showError={
              isEditBtnClicked &&
              (confirmPassword?.length < 6 || password != confirmPassword)
            }
            errorMsg={
              confirmPassword?.length == 0
                ? Languages.Required
                : confirmPassword?.length < 6
                  ? Languages.PasswordTooShort
                  : Languages.PassDontMatch
            }
            onSubmitEditing={() => { }}
            containerStyle={{
              marginHorizontal: dimensionsCalculation(20),
              marginBottom: dimensionsCalculation(5),
            }}
          />
          {!this.props.route?.params?.token && (
            <AppTouchableOpacity
              disabled={isLoading}
              androidRippleColor={AppColors.androidRippleColor.black15}
              style={{
                marginHorizontal: dimensionsCalculation(20),
                padding: dimensionsCalculation(5),
              }}
              onPress={() => {
                this.forgotPasswordModalRef?.current?.open();
                this.setState(
                  {
                    isModalOpen: true,
                  },
                  () => { },
                );
              }}>
              <Text style={styles.forgotPass}>{Languages.ForgotPass}</Text>
            </AppTouchableOpacity>
          )}
          <LoadingButton
            onPress={() => {
              this.handleChangePassword();
            }}
            isLoading={isEditingPassword}
            text={Languages.Submit}
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

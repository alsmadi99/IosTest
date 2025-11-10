import OTPInputView from '@twotalltotems/react-native-otp-input';
import { AppIcon, fonts, Languages } from '../common';
import { VerifyCodeScreenNavigateType, VerifyOtpScreenProps } from '../common/Types';
import { AppTouchableOpacity, LoadingButton } from '../components';
import { canGoBack, goBack, push, reset } from '../navigation';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import {
  checkOTPCall,
  forgotPasswordPhoneCall,
  resendOTPCall,
} from '../services/api/calls';
import { getUserDataAction } from '../store/actions/AuthActions';
import { AppColors } from '../theme';
import {
  dimensionsCalculation,
  getStatusBarHeight,
  isRTL,
  ShowToast,
} from '../utils';

const VerifyOtpScreen = ({ route }: VerifyOtpScreenProps) => {
  const dispatch = useDispatch();
  const type: VerifyCodeScreenNavigateType = route?.params?.type;

  const [confirmationCode, setConfirmationCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(60);

  useEffect(() => {
    if (timer && timer > 0) {
      setTimeout(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
  }, [timer]);

  const handleVerifyOTP = async (code: string = confirmationCode) => {
    if (code?.length < 4) return ShowToast(Languages.EnterValidCode);
    setIsLoading(true);
    const result = await checkOTPCall({
      otp: code,
      token: route?.params?.token ?? null,
    });
    if (result?.data?.result == 1) {
      route?.params?.extraAction && route?.params?.extraAction();
      type == VerifyCodeScreenNavigateType.checkout
        ? goBack()
        : type == VerifyCodeScreenNavigateType.forgot_password
          ? push('EditPasswordScreen', {
            token: route?.params?.token || 'token',
          })
          : reset([{ name: 'HomeScreen' }]);
      type != VerifyCodeScreenNavigateType.forgot_password &&
        (await dispatch(getUserDataAction(false)));
    } else {
      ShowToast(Languages.InvalidCode);
    }
    setIsLoading(false);
    setConfirmationCode('');
  };

  const handleResendOTP = async () => {
    setTimer(60);
    if (type == VerifyCodeScreenNavigateType.forgot_password) {
      const result = await forgotPasswordPhoneCall({
        username: route?.params?.phone,
      });
    } else {
      const result = await resendOTPCall();
      if (result?.data?.result == 1) {
        ShowToast(Languages.CodeSent, 'success');
      }
    }
  };

  const Header = () => (
    <View style={styles.header}>
      <AppTouchableOpacity
        androidRippleColor={AppColors.androidRippleColor.white}
        style={styles.backBtn}
        borderless
        onPress={() => {
          canGoBack() ? goBack() : reset([{ name: 'HomeScreen' }]);
        }}>
        <AppIcon
          name={isRTL ? 'arrowright' : 'arrowleft'}
          color={'rgba(0,0,0,0.5)'}
          size={dimensionsCalculation(24)}
          type="AntDesign"
        />
      </AppTouchableOpacity>
      <Text style={styles.title}>
        {type == VerifyCodeScreenNavigateType.forgot_password
          ? Languages.ForgotPass?.replace('?', '')?.replace('؟', '')
          : Languages.VerifyAccount}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollview}>
        <Text style={styles.enterCode}>{Languages.EnterOTP}</Text>

        <OTPInputView
          code={confirmationCode}
          style={{
            width: '100%',
            alignSelf: 'center',
            height: dimensionsCalculation(40),
          }}
          pinCount={4}
          onCodeChanged={setConfirmationCode}
          autoFocusOnLoad
          codeInputFieldStyle={styles.underlineStyleBase}
          codeInputHighlightStyle={styles.underlineStyleHighLighted}
          onCodeFilled={(code) => {
            handleVerifyOTP(code);
          }}
        />

        <AppTouchableOpacity
          disabled={timer > 0}
          androidRippleColor={AppColors.androidRippleColor.black15}
          style={{
            alignSelf: 'center',
            marginTop: dimensionsCalculation(20),
            padding: dimensionsCalculation(5),
          }}
          onPress={handleResendOTP}>
          <Text
            style={{
              color: timer > 0 ? 'gray' : AppColors.black,
              fontSize: dimensionsCalculation(16),
            }}>
            {`${Languages.Resend}`}
            <Text style={{ color: AppColors.black }}>
              {timer > 0 ? ` 00:${timer < 10 ? '0' + timer : timer}` : ''}
            </Text>
          </Text>
        </AppTouchableOpacity>

        <LoadingButton
          onPress={handleVerifyOTP}
          isLoading={isLoading}
          text={Languages.Verify}
          textColor={AppColors.white}
          backgroundColor={AppColors.secondary}
          androidRippleColor={AppColors.androidRippleColor.white}
          containerStyle={[
            styles.login,
            confirmationCode?.length < 5 && { backgroundColor: 'grey' },
          ]}
        />
      </ScrollView>
    </View>
  );
};

export default VerifyOtpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  header: {
    paddingTop: getStatusBarHeight() + dimensionsCalculation(10),
    paddingBottom: dimensionsCalculation(10),
    paddingHorizontal: dimensionsCalculation(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backBtn: {
    // backgroundColor: 'rgba(0,0,0,0.3)',
    width: dimensionsCalculation(40),
    height: dimensionsCalculation(40),
    borderRadius: dimensionsCalculation(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'left',
    flex: 1,
    marginLeft: dimensionsCalculation(20),
    fontFamily: fonts.primaryBold,
    fontSize: dimensionsCalculation(20),
    color: AppColors.mainText,
  },
  scrollview: {
    flexGrow: 1,
    paddingTop: dimensionsCalculation(20),
    paddingHorizontal: dimensionsCalculation(20),
  },
  enterCode: {
    textAlign: 'left',
    fontSize: dimensionsCalculation(15),
    marginBottom: dimensionsCalculation(40),
  },
  underlineStyleBase: {
    width: dimensionsCalculation(45),
    height: dimensionsCalculation(45),
    borderWidth: 1,
    borderColor: '#DEDEDE',
    fontFamily: fonts.primaryLight,
    fontSize: dimensionsCalculation(15),
    color: '#1E2432',
  },

  underlineStyleHighLighted: {
    borderWidth: 1,
    borderColor: AppColors.secondary,
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

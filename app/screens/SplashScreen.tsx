import { QudsPaintsStore, SplashScreenProps } from '../common/Types';
import { reset } from '../navigation';
import React, { useEffect } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDataAction } from '../store/actions/AuthActions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default function SplashScreen(props: SplashScreenProps) {
  const { user } = useSelector(({ auth }: QudsPaintsStore) => ({ user: auth?.user }));
  const dispatch = useDispatch();

  useEffect(() => {
    user && dispatch(getUserDataAction(true));
    const timeout = setTimeout(() => {
      if (user && !user.otpactive) return reset([{ name: 'VerifyOtpScreen' }]);
      reset([{ name: 'HomeScreen' }]);
    }, 3000);
    return () => {
      timeout && clearTimeout(timeout);
    };
  }, []);

  return (
    <ImageBackground
      source={require('../../assets/images/splash.png')}
      style={styles.container}
    />
  );
}

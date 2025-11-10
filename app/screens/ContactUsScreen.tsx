import { AppIcon, Constants, fonts, Languages } from '../common';
import { ContactUsScreenProps } from '../common/Types';
import {
  AppHeader,
  AppTabBar,
  AppTouchableOpacity,
  ImageHeader,
  SearchBar,
} from '../components';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Linking, I18nManager } from 'react-native';
import { AppColors } from '../theme';
import {
  configureNextAnimation,
  dimensionsCalculation,
  isRTL,
  ShowToast,
} from '../utils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.headerHeight,
    paddingBottom: Constants.tabBarHeight,
  },
  imageTitle: {
    flex: 1,
    textAlign: 'left',
    marginTop: dimensionsCalculation(20),
    justifyContent: 'flex-start',
    paddingHorizontal: dimensionsCalculation(20),
  },
  title: {
    color: AppColors.secondary,
    fontSize: dimensionsCalculation(30),
    fontFamily: fonts.primaryBold,
    textAlign: isRTL ? 'right' : 'auto',
  },
  happy: {
    color: AppColors.white,
    maxWidth: '60%',
    fontSize: dimensionsCalculation(12),
    fontFamily: fonts.primaryLight,
  },
  button: {
    marginHorizontal: dimensionsCalculation(40),
    borderRadius: dimensionsCalculation(40),
    paddingVertical: dimensionsCalculation(15),
    borderWidth: 0.3,
    borderColor: '#95989A',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: dimensionsCalculation(20),
  },
  buttonTxt: {
    marginLeft: dimensionsCalculation(20),
    color: AppColors.mainText,
  },
});

const ContactUsScreen = (props: ContactUsScreenProps) => {
  useEffect(() => {
    configureNextAnimation();
    return () => { };
  }, []);

  const Button = ({ onPress, phone, text }) => {
    return (
      <AppTouchableOpacity
        androidRippleColor={AppColors.androidRippleColor.black15}
        style={styles.button}
        onPress={() => {
          try {
            onPress();
          } catch (error) { }
        }}>
        <AppIcon
          name={phone ? 'call' : 'email'}
          size={dimensionsCalculation(20)}
          color={AppColors.secondary}
          type={phone ? 'MaterialIcons' : 'MaterialIcons'}
          style={
            phone && isRTL
              ? {
                transform: [
                  {
                    rotateY: '180deg',
                  },
                ],
              }
              : {}
          }
        />
        <Text style={styles.buttonTxt}>{text}</Text>
      </AppTouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader />
      <AppTabBar />
      <ImageHeader
        hideMenuButton
        source={require('../../assets/images/contactUs.png')}
        style={{
          paddingTop: dimensionsCalculation(15),
        }}>
        <SearchBar />
        <View style={styles.imageTitle}>
          <Text style={styles.title}>{Languages.ContactUS}</Text>
        </View>
      </ImageHeader>
      <View
        style={{
          flex: 1,
          justifyContent: 'space-evenly',
        }}>
        <Button
          onPress={() => {
            Linking.openURL('tel:+962797557772');
          }}
          phone
          text={'+962797557772'}
        />
        <Button
          onPress={() => {
            Linking.openURL('tel:+96264029023');
          }}
          phone
          text={'+96264029023'}
        />
        <Button
          onPress={() => {
            Linking.openURL('mailto:info@qudspaints.com');
          }}
          phone={false}
          text={'hello@qudspaints.com'}
        />

        <AppTouchableOpacity
          androidRippleColor={AppColors.androidRippleColor.black15}
          style={styles.button}
          onPress={() => {
            try {
              Linking.openURL('whatsapp://send?phone=+962797557772&text=');
            } catch (error) {
              ShowToast(Languages.WhatsappNotSupported);
            }
          }}>
          <AppIcon
            name={'whatsapp'}
            size={dimensionsCalculation(20)}
            color={'#25D366'}
            type={'FontAwesome'}
            style={{}}
          />
          <Text style={styles.buttonTxt}>{Languages.Whatsapp}</Text>
        </AppTouchableOpacity>
      </View>
    </View>
  );
};

export default ContactUsScreen;

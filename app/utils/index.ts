import { Constants, Languages } from '../common';
import {
  Dimensions,
  I18nManager,
  LayoutAnimation,
  Platform,
  StatusBar,
  UIManager,
} from 'react-native';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';


export const isIOS = Platform.OS == 'ios';
export const isRTL = I18nManager.isRTL;

export function isIphoneX() {
  const dimen = Dimensions.get('window');
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (dimen.height === 780 ||
      dimen.width === 780 ||
      dimen.height === 812 ||
      dimen.width === 812 ||
      dimen.height === 844 ||
      dimen.width === 844 ||
      dimen.height === 896 ||
      dimen.width === 896 ||
      dimen.height === 926 ||
      dimen.width === 926)
  );
}

export function ifIphoneX(iphoneXStyle, regularStyle) {
  if (isIphoneX()) {
    return iphoneXStyle;
  }
  return regularStyle;
}

export function getStatusBarHeight(safe?) {
  return Platform.select({
    ios: ifIphoneX(safe ? 44 : 30, 20),
    android: StatusBar.currentHeight,
    default: 0,
  });
}

export function getBottomSpace() {
  return isIphoneX() ? 34 : 0;
}

const defaultOptions = {
  significantDigits: 0,
  thousandsSeparator: ',',
  decimalSeparator: '',
  symbol: '',
};

export const currencyFormatter = (
  value: number,
  options?: {
    significantDigits?: number;
    thousandsSeparator?: string;
    decimalSeparator?: string;
    symbol?: string;
  },
) => {
  options = { ...defaultOptions, ...options };
  let newValue = '';
  newValue = value.toFixed(options.significantDigits);

  const [currency, decimal] = newValue.split('.');
  return `${options.symbol} ${currency.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    options.thousandsSeparator,
  )}${options.decimalSeparator}${decimal ? decimal : ''}`;
};

export const validateEmail = (email) => {
  var re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const validatePassword = (password) => {
  var re = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
  return re.test(String(password));
};

const { width, height } = Dimensions.get('window');
export const dimensionsCalculation = (IPhonePixel) => {
  return (width * IPhonePixel) / 375;
};

export const getAddressFromCoordinates = (
  longitude,
  latitude,
  apiKey = Constants.googleApiKey,
) => {
  return fetch(
    'https://maps.googleapis.com/maps/api/geocode/json?address=' +
    latitude +
    ',' +
    longitude +
    '&key=' +
    apiKey +
    '&language=' +
    Languages.getLanguage(),
  )
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson?.results) {
        return responseJson?.results[0]?.formatted_address ?? '';
      }
    })
    .catch((err) => {
      return '';
    })
    .catch((err2) => {
      return '';
    });
};

export const getPlaceLatLng = (placeID) => {
  return fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeID}&fields=geometry&key=${Constants.googleApiKey}`,
  )
    .then((response) => response.json())
    .then((responseJson) => {
      let location = null;
      if (responseJson?.result?.geometry?.location) {
        location = responseJson?.result?.geometry?.location;
      }
      return location;
    })
    .catch((err) => {
      return [];
    })
    .catch((err2) => {
      return [];
    });
};

export const placesAutoComplete = (keyword: string) => {
  return fetch(
    `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${keyword}&key=${Constants.googleApiKey
    }&components=country:JO&language=${Languages.getLanguage()}`,
  )
    .then((response) => response.json())
    .then((responseJson) => {
      let predictions = [];
      if (responseJson?.predictions) {
        predictions = responseJson?.predictions;
      }
      return predictions;
    })
    .catch((err) => {
      return [];
    })
    .catch((err2) => {
      return [];
    });
};

export const configureNextAnimation = () => {
  if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  LayoutAnimation.configureNext({
    duration: 350,
    create: {
      type: LayoutAnimation.Types.easeIn,
      property: LayoutAnimation.Properties.opacity,
    },
    update: {
      type: LayoutAnimation.Types.easeInEaseOut,
    },
  });
};

export const configureNextScaleAnimation = () => {
  if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  LayoutAnimation.configureNext({
    duration: 350,
    create: {
      type: LayoutAnimation.Types.easeIn,
      property: LayoutAnimation.Properties.scaleXY,
    },
    update: {
      type: LayoutAnimation.Types.easeInEaseOut,
    },
  });
};

export const ShowToast = (
  text: string,
  type: 'danger' | 'success' | 'warning' = 'danger',
) => {
  const glob = global as any;
  setTimeout(() => {
    glob?.toast?.show(text, {
      type,
      placement: 'bottom',
      // duration: 4000,
      animationType: 'slide-in',
    });
  }, 0);
};

export const requestExternalStoragePermission = () => {
  return request(
    Platform.select({
      android: PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      ios: PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY,
    }),
  ).then((response) => {
    if (response != RESULTS.GRANTED) {
      return { granted: false, response };
    } else {
      return { granted: true, response };
    }
  });
};

export const checkExternalStoragePermission = () => {
  return check(
    Platform.select({
      android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
    }),
  ).then((response) => {
    if (response != RESULTS.GRANTED) {
      return { granted: false, response };
    } else {
      return { granted: true, response };
    }
  });
};

export const checkLocationPermission = () => {
  if (Platform.OS == 'android') {
    return check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then((response) => {
      if (response != RESULTS.GRANTED) {
        return { granted: false, response };
      } else {
        return { granted: true, response };
      }
    });
  } else {
    return check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then((response) => {
      if (response != RESULTS.GRANTED) {
        return { granted: false, response };
      } else {
        return { granted: true, response };
      }
    });
  }
};

export const requestLocationPermission = () => {
  return request(
    Platform.select({
      android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    }),
  ).then((response) => {
    if (response != RESULTS.GRANTED) {
      return { granted: false, response };
    } else {
      return { granted: true, response };
    }
  });
};

export * from './responsive';
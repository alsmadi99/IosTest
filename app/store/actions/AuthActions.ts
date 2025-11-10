import { Languages } from '../../common';
import { RegisterParams, UpdateProfileParams, User } from '../../common/Types';
import { reset } from '../../navigation';
import { Dispatch } from 'react';
import { AccessToken, LoginManager } from 'react-native-fbsdk-next';
import { AnyAction } from 'redux';
import {
  appleLoginCall,
  facebookLoginCall,
  getUserProfileCall,
  getWishlistCall,
  googleLoginCall,
  loginCall,
  registerCall,
  setFireBaseTokenCall,
  updateProfileCall,
} from '../../services/api/calls';
import { ShowToast } from '../../utils';
import actions from './types';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import appleAuth from '@invertase/react-native-apple-authentication';
import { getCartAction } from './CartActions';
import messaging from '@react-native-firebase/messaging';



export const registerAction = (params: RegisterParams) => async (
  dispatch: Dispatch<AnyAction>,
) => {
  const result = await registerCall(params);
  if (result?.data?.user) {
    dispatch(saveUser(result?.data?.user));
    dispatch(getUserDataAction(true) as any);
    params.extraAction && params.extraAction();
    reset(
      [
        { name: 'HomeScreen' },
        {
          name: 'VerifyOtpScreen',
          params: { phone: params?.phone, extraAction: params.extraAction },
        },
      ],
      1,
    );
    ShowToast(Languages.UserRegisterdSucessfully, 'success');
  } else {
    ShowToast(Languages.UserExists);
    dispatch({
      type: actions.SAVE_USER,
      payload: {
        user: null,
      },
    });
  }
};

export const loginAction = (params: {
  username: string;
  password: string;
  extraAction: () => void;
}) => async (dispatch: Dispatch<AnyAction>) => {
  const result = await loginCall(params);
  if (result?.data?.user) {
    dispatch(saveUser(result?.data?.user));
    dispatch(getUserDataAction(true) as any);
    reset([{ name: 'HomeScreen' }]);
    params.extraAction && params.extraAction();
    ShowToast(Languages.UserLoggedIn, 'success');
  } else {
    ShowToast(Languages.EmailPassIncorrect);
    dispatch({
      type: actions.SAVE_USER,
      payload: {
        user: null,
      },
    });
  }
};

const getFBUser = async (
  token: string,
): Promise<{
  email: string;
  name: string;
  picture: {
    data: {
      height: number;
      is_silhouette: boolean;
      url: string;
      width: number;
    };
  };
  id: string;
}> => {
  try {
    const result = await (
      await fetch(
        `https://graph.facebook.com/v5.0/me?fields=email,name,friends,picture&access_token=${token}`,
      )
    ).json();
    if (result?.id) {
      return result;
    }
    return null;
  } catch (error) {
    __DEV__ && console.error('ERROR', error + '');
    return null;
  }
};

export const loginUsingFacebookAction = (extraAction: () => void) => async (
  dispatch: Dispatch<AnyAction>,
) => {
  try {
    try {
      LoginManager.logOut();
    } catch (error) { }
    // LoginManager.setLoginBehavior('native_only');
    const fbResult = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);
    if (fbResult?.isCancelled) return;
    const token = await AccessToken.getCurrentAccessToken();
    const fbUser = await getFBUser(token?.accessToken);
    if (!fbUser) return;
    const result = await facebookLoginCall({
      facebookid: fbUser?.id,
      email: fbUser?.email || `fb${fbUser?.id}@facebook.com`,
      name: fbUser?.name,
    });
    if (result?.data?.user) {
      dispatch(saveUser(result?.data?.user));
      dispatch(getUserDataAction(true) as any);
      reset([{ name: 'HomeScreen' }]);
      extraAction && extraAction();
      ShowToast(Languages.UserLoggedIn, 'success');
    } else {
      ShowToast(Languages.Oops);
    }
  } catch (error) {
    __DEV__ && console.error('FB_LOGIN_ERROR', error + '');
    ShowToast(Languages.Oops);
  }
};

export const loginUsingGoogleAction = (extraAction: () => void) => async (
  dispatch: Dispatch<AnyAction>,
) => {
  try {
    const hasPlayServices = await GoogleSignin.hasPlayServices();
    if (hasPlayServices) {
      try {
        await GoogleSignin.signOut();
      } catch (error) { }
      GoogleSignin.configure();
      const googleUser = await GoogleSignin.signIn();
      const result = await googleLoginCall({
        email: googleUser?.user?.email,
        name: googleUser?.user?.name,
      });
      if (result?.data?.user?.id != '00000000-0000-0000-0000-000000000000') {
        dispatch(saveUser(result?.data?.user));
        dispatch(getUserDataAction(true) as any);
        reset([{ name: 'HomeScreen' }]);
        extraAction && extraAction();
        ShowToast(Languages.UserLoggedIn, 'success');
      }
    } else {
      ShowToast(Languages.NotSupported);
    }
  } catch (error) {
    __DEV__ && console.error('GOOGLE_LOGIN_ERROR', error + '');
    error?.code != statusCodes.SIGN_IN_CANCELLED && ShowToast(Languages.Oops);
  }
};

export const loginUsingAppleAction = (extraAction: () => void) => async (
  dispatch: Dispatch<AnyAction>,
) => {
  try {
    const isSupported = appleAuth.isSupported;
    if (!isSupported) throw new Error();
    const appleUser = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    const result = await appleLoginCall({
      email: appleUser?.email,
      name:
        appleUser?.fullName.givenName + ' ' + appleUser?.fullName?.familyName,
      appleid: appleUser.user,
    });
    if (result?.data?.user) {
      dispatch(saveUser(result?.data?.user));
      dispatch(getUserDataAction() as any);
      reset([{ name: 'HomeScreen' }]);
      extraAction && extraAction();
      ShowToast(Languages.UserLoggedIn, 'success');
    }
  } catch (error) {
    __DEV__ && console.error('APPLE_LOGIN_ERROR', error + '');
    error?.code != statusCodes.SIGN_IN_CANCELLED && ShowToast(Languages.Oops);
  }
};

export const getUserDataAction = (
  getWishlistAndCart: boolean = false,
) => async (dispatch: Dispatch<AnyAction>) => {
  const result = await getUserProfileCall();
  if (result?.data?.user) {
    dispatch(saveUser(result?.data?.user));
    getWishlistAndCart && dispatch(getWishlistAction() as any);
    getWishlistAndCart && dispatch(getCartAction() as any);
    getWishlistAndCart && dispatch(setFireBaseTokenAction() as any);
  } else {
    dispatch(clearUser() as any);
  }
};

export const getWishlistAction = () => async (
  dispatch: Dispatch<AnyAction>,
) => {
  let count = 1;
  const products = [];
  const result = await getWishlistCall({ p: 1 });
  if (result?.data) {
    products.push(...result?.data?.products);
    count = result.data.pages;
    let i = 2;
    while (i <= count) {
      const result2 = await getWishlistCall({
        p: i,
      });
      if (result2?.data?.products) products.push(...result2?.data?.products);
      i++;
    }
    dispatch({
      type: actions.SAVE_USER_WISHLIST,
      payload: {
        wishlist: products,
      },
    });
  } else {
  }
};

export const setFireBaseTokenAction = () => async (
  dispatch: Dispatch<AnyAction>,
) => {
  try {
    await messaging().requestPermission();
    const hasPermission = await messaging()?.hasPermission();
    const firebasetoken = await messaging().getToken();
    const result = await setFireBaseTokenCall({
      firebasetoken,
    });
    if (hasPermission) {
      await messaging().subscribeToTopic('all');
    }
  } catch (error) {
    __DEV__ && console.error('error token', error + '');
  }
};

export const updateProfileAction = (params: UpdateProfileParams) => async (
  dispatch: Dispatch<AnyAction>,
) => {
  const result = await updateProfileCall(params);
  if (result?.data?.user) {
    dispatch(saveUser(result?.data?.user));
    return true;
  } else {
    ShowToast(Languages.PhoneIsUsed);
    return false;
  }
};

export const saveUser = (user: User) => {
  return {
    type: actions.SAVE_USER,
    payload: {
      user,
    },
  };
};

export const clearUser = () => async (dispatch: Dispatch<AnyAction>) => {
  //Logout social,logout api...
  const hasPlayServices = await GoogleSignin.hasPlayServices();
  if (hasPlayServices) {
    try {
      await GoogleSignin.signOut();
    } catch (error) { }
  }
  try {
    LoginManager.logOut();
  } catch (error) { }
  dispatch({
    type: actions.CLEAR_CART,
  });
  dispatch({
    type: actions.SAVE_USER_WISHLIST,
    payload: {
      wishlist: [],
    },
  });
  dispatch({
    type: actions.CLEAR_USER,
  });
  reset([{ name: 'LoginScreen' }]);
};

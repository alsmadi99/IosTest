/* eslint-disable indent */
import { AppService } from '..';
import { Constants } from '../../common';
import { RegisterParams, SortByType, UpdateProfileParams } from '../../common/Types';
const apiUrl = Constants.url;

const join = (payload: Object, separator = '&') => {
  let string = '';
  Object.keys(payload).map((cur, index) => {
    string += payload[cur] ? `${cur}=${payload[cur]}${separator}` : '';
  });
  return string;
};

export const registerCall = (params: RegisterParams) => {
  let url = `${apiUrl}Register?`;
  url = url + join(params);
  return AppService({
    url,
    method: 'get',
  });
};

export const loginCall = (params: { username: string; password: string }) => {
  let url = `${apiUrl}Login?`;
  url = url + join(params);
  return AppService({
    url,
    method: 'get',
  });
};

export const productsGetCall = (params: {
  p?: number;
  cats?: string;
  colors?: string;
  min?: number;
  max?: number;
  search?: string;
  sortby?: SortByType;
  type?: 'normal' | 'offers' | 'best';
}) => {
  let url = `${apiUrl}${params.type == 'offers'
    ? 'Offers'
    : params.type == 'best'
      ? 'BestSelling'
      : 'Products'
    }?`;
  url = url + join(params);
  return AppService({
    url,
    method: 'get',
    // params,
  });
};

export const relatedProductsGetCall = (params: { productid: string }) => {
  let url = `${apiUrl}related?`;
  url = url + join(params);
  return AppService({
    url,
    method: 'get',
    // params,
  });
};

export const homePageGetCall = () => {
  let url = `${apiUrl}mobilehome?`;
  return AppService({
    url,
    method: 'get',
  });
};

export const blogsGetCall = (params: { p?: number }) => {
  let url = `${apiUrl}News?`;
  url = url + join(params);
  return AppService({
    url,
    method: 'get',
  });
};

export const videosGetCall = (params: { p?: number }) => {
  let url = `${apiUrl}Videos?`;
  url = url + join(params);
  return AppService({
    url,
    method: 'get',
  });
};

export const galleryGetCall = (params: { p?: number }) => {
  let url = `${apiUrl}Gallery?`;
  url = url + join(params);
  return AppService({
    url,
    method: 'get',
  });
};

export const technicalGetCall = (params: { p?: number }) => {
  let url = `${apiUrl}Technical?`;
  url = url + join(params);
  return AppService({
    url,
    method: 'get',
  });
};

export const branchesGetCall = () => {
  let url = `${apiUrl}Branches?`;
  return AppService({
    url,
    method: 'get',
  });
};

export const getUserProfileCall = () => {
  let url = `${apiUrl}Profile?`;
  return AppService({
    url,
    method: 'get',
  });
};

export const updateProfileCall = (params: UpdateProfileParams) => {
  let url = `${apiUrl}UpdateProfile?`;
  return AppService({
    url,
    method: 'POST',
    params,
  });
};

export const changePasswordCall = (params: {
  password: string;
  token?: string;
}) => {
  let url = `${apiUrl}ChangePassword?`;
  if (params.token) {
    url += join({ token: params.token });
  }
  return AppService({
    url,
    method: 'POST',
    params,
  });
};

export const addToWishlistCall = (params: {
  id: string;
  // colorid: string;
  // sizeid: string;
  quantity: number;
  tinting: string;
  attrid: string;
}) => {
  let url = `${apiUrl}WishList/Add?`;
  url = url + join(params);
  return AppService({
    url,
    method: 'get',
  });
};

export const removeFromWishlistCall = (params: { id: string }) => {
  let url = `${apiUrl}WishList/Remove?`;
  url = url + join(params);
  return AppService({
    url,
    method: 'get',
  });
};

export const getWishlistCall = (params: { p: number }) => {
  let url = `${apiUrl}WishList?`;
  url += join(params);
  return AppService({
    url,
    method: 'get',
  });
};

export const getProductDetailsCall = (params: { id: string }) => {
  let url = `${apiUrl}Product?`;
  url = url + join(params);
  return AppService({
    url,
    method: 'get',
  });
};

export const facebookLoginCall = (params: {
  facebookid: string;
  name: string;
  email: string;
}) => {
  let url = `${apiUrl}Facebook?`;
  url = url + join(params);
  return AppService({
    url,
    method: 'get',
  });
};

export const googleLoginCall = (params: { email: string; name: string }) => {
  let url = `${apiUrl}Google?`;
  // url = url + join(params);
  return AppService({
    url,
    method: 'POST',
    params,
  });
};

export const appleLoginCall = (params: {
  email: string;
  name: string;
  appleid: string;
}) => {
  let url = `${apiUrl}Apple?`;
  // url = url + join(params);
  return AppService({
    url,
    method: 'POST',
    params,
  });
};

export const userOrdersGetCall = (params: { p: number }) => {
  let url = `${apiUrl}Orders?`;
  url = url + join(params);
  return AppService({
    url,
    method: 'get',
  });
};

export const orderDetailsGetCall = (params: { id: string }) => {
  let url = `${apiUrl}Order?`;
  url = url + join(params);
  return AppService({
    url,
    method: 'get',
  });
};

export const bookCallRequest = (params: { productid: string; date: string }) => {
  let url = `${apiUrl}RequestCall?`;
  return AppService({
    url,
    method: 'POST',
    params,
  });
};

export const getProductPriceCall = (params: {
  id: string;
  sizeid: string;
  colorid: string;
}) => {
  let url = `${apiUrl}ProductInfo?`;
  url = url + join(params);
  return AppService({
    url,
    method: 'get',
  });
};

export const checkProductCodeCall = (params: { code: string }) => {
  let url = `${apiUrl}CheckCode?`;
  url = url + join(params);
  return AppService({
    url,
    method: 'get',
  });
};

export const addToCartCall = (params: {
  productid: string;
  // colorid: string;
  // sizeid: string;
  quantity: number;
  tinting: string;
  attrid: string;
}) => {
  let url = `${apiUrl}Cart/Add?`;
  url = url + join(params);
  return AppService({
    url,
    method: 'get',
  });
};

export const cartGetCall = () => {
  let url = `${apiUrl}Cart/Items?`;
  return AppService({
    url,
    method: 'get',
  });
};

export const removeFromCartCall = (params: { id: string }) => {
  let url = `${apiUrl}Cart/Remove?`;
  url = url + join(params);
  return AppService({
    url,
    method: 'get',
  });
};

export const decreaseCartItemCall = (params: {
  productid: string;
  // colorid: string;
  // sizeid: string;
  quantity: number;
  attrid: string;
}) => {
  let url = `${apiUrl}Cart/DeCrease?`;
  url = url + join(params);
  return AppService({
    url,
    method: 'get',
  });
};

export const getProductQuestionsCall = (params: { id: string }) => {
  let url = `${apiUrl}Product/Questions?`;
  url = url + join(params);
  return AppService({
    url,
    method: 'get',
  });
};

export const paintCalculatorCall = (params: {
  productid: string;
  values: string[];
  window?: number;
  door?: number;
}) => {
  let url = `${apiUrl}Calculator?`;
  return AppService({
    url,
    method: 'POST',
    params,
  });
};

export const cartCheckoutCall = (params: {
  // cartid: string;
  addressid: string;
  // getway: 1 | 2 | 3;
}) => {
  let url = `${apiUrl}Checkout?`;
  url = url + join(params);
  return AppService({
    url,
    method: 'get',
    // params,
  });
};

export const addressAddCall = (params: {
  location: string;
  lat: string;
  lng: string;
  details: string;
  areaid: any;
}) => {
  let url = `${apiUrl}AddAddress?`;
  return AppService({
    url,
    method: 'POST',
    params,
  });
};

export const getDeliveryFeesCall = (params: { areaid: any }) => {
  let url = `${apiUrl}Area?`;
  return AppService({
    url,
    method: 'POST',
    params,
  });
};

export const addressesGetCall = () => {
  let url = `${apiUrl}Addresses?`;
  return AppService({
    url,
    method: 'get',
  });
};

export const deleteAddressCall = (params: { id: string }) => {
  let url = `${apiUrl}DeleteAddress?`;
  url = url + join(params);
  return AppService({
    url,
    method: 'get',
  });
};

export const trackOrderCall = (params: { id: string }) => {
  let url = `${apiUrl}Order/Track?`;
  url = url + join(params);
  return AppService({
    url,
    method: 'get',
  });
};

export const surveyQuestionsGetCall = () => {
  let url = `${apiUrl}Survey?`;
  return AppService({
    url,
    method: 'get',
  });
};

export const surveyResultsGetCall = (params: { answers: string }) => {
  let url = `${apiUrl}GetSurveyResult?`;
  url += join(params);
  return AppService({
    url,
    method: 'get',
  });
};

export const dynamicPageGetCall = (params: { id: string }) => {
  let url = `${apiUrl}Dynamic?`;
  url += join(params);
  return AppService({
    url,
    method: 'get',
  });
};

export const staticPageGetCall = (params: { id: string }) => {
  let url = `${apiUrl}Static?`;
  url += join(params);
  return AppService({
    url,
    method: 'get',
  });
};

export const notificationsGetCall = (params: { p: number }) => {
  let url = `${apiUrl}Notifications?`;
  url += join(params);
  return AppService({
    url,
    method: 'get',
  });
};

export const getCitiesCall = () => {
  let url = `${apiUrl}Cities?`;
  return AppService({
    url,
    method: 'get',
  });
};

export const getAreasCall = () => {
  let url = `${apiUrl}Areas?`;
  return AppService({
    url,
    method: 'get',
  });
};

export const albumsGetCall = (params: { id: string; p: number }) => {
  let url = `${apiUrl}Albums?`;
  url += join(params);
  return AppService({
    url,
    method: 'get',
  });
};

export const setFireBaseTokenCall = (params: { firebasetoken: string }) => {
  let url = `${apiUrl}SetFireBaseToken?`;
  url += join(params);
  return AppService({
    url,
    method: 'get',
  });
};

export const getTechnicalExcelence = (params: { id: string }) => {
  let url = `${apiUrl}TechnicalDetails?`;
  url += join(params);
  return AppService({
    url,
    method: 'get',
  });
};

export const forgotPasswordEmailCall = (params: { username: string }) => {
  let url = `${apiUrl}ForgotPassword?`;
  url += join(params);
  return AppService({
    url,
    method: 'get',
  });
};

export const forgotPasswordPhoneCall = (params: { username: string }) => {
  let url = `${apiUrl}RequestReset?`;
  url += join(params);
  return AppService({
    url,
    method: 'get',
  });
};

export const addPhoneCall = (params: { phone: string }) => {
  let url = `${apiUrl}SavePhone?`;
  url += join(params);
  return AppService({
    url,
    method: 'get',
  });
};

export const checkOTPCall = (params: { otp: string; token?: string }) => {
  let url = `${apiUrl}UserCheckOTP?`;
  url += join(params);
  return AppService({
    url,
    method: 'get',
  });
};

export const resendOTPCall = () => {
  let url = `${apiUrl}UserReSendOTP?`;
  return AppService({
    url,
    method: 'get',
  });
};

export const checkoutCheckCall = () => {
  let url = `${apiUrl}CheckCheckout?`;
  return AppService({
    url,
    method: 'get',
  });
};

export const getColorsCall = (params: { type?: 1 | 2 }) => {
  let url = `${apiUrl}Colors?`;
  url = url + join(params);
  return AppService({
    url,
    method: 'get',
  });
};

export const getPhotosCall = (params: { id: string; p: number }) => {
  let url = `${apiUrl}Album?`;
  url += join(params);
  return AppService({
    url,
    method: 'get',
  });
};

export const clearNotificationsGet = () => {
  const url = `${apiUrl}ClearNewNotifications?`;
  return AppService({
    url,
    method: 'get',
  });
};

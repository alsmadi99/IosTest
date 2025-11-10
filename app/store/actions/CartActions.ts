import { Languages } from '../../common';
import { AnyAction, Dispatch } from 'redux';
import {
  addToCartCall,
  cartGetCall,
  decreaseCartItemCall,
  removeFromCartCall,
} from '../../services/api/calls';
import { ShowToast } from '../../utils';
import actions from './types';

export const addToCartAction = (
  productid: string,
  colorid: string,
  sizeid: string,
  quantity: number,
  tinting: string,
  attrid: string,
) => async (dispatch: Dispatch<AnyAction>) => {
  try {
    dispatch({
      type: actions.ADD_CART_ITEM_PENDING,
    });
    const result = await addToCartCall({
      productid,
      // colorid,
      // sizeid,
      quantity,
      tinting,
      attrid,
    });
    if (result?.data?.result == 1) {
      dispatch({
        type: actions.ADD_CART_ITEM_SUCCESS,
      });
      dispatch(getCartAction() as any);
      ShowToast(Languages.AddedSuccessfully, 'success');
      return true;
    } else {
      dispatch({
        type: actions.ADD_CART_ITEM_FAILED,
      });
      ShowToast(Languages.Oops);
      return false;
    }
  } catch (error) {
    __DEV__ && console.error('ERROR_ADD_TO_CART', error + '');
    ShowToast(Languages.Oops);
    return false;
  }
};

export const removeCartItemAction = (id: string) => async (
  dispatch: Dispatch<AnyAction>,
) => {
  dispatch({
    type: actions.DELETE_CART_ITEM_PENDING,
  });
  const result = await removeFromCartCall({
    id,
  });
  if (result?.data?.result) {
    dispatch({
      type: actions.DELETE_CART_ITEM_SUCCESS,
    });
    ShowToast(Languages.RemovedSuccessfully, 'warning');
    await dispatch(getCartAction() as any);
  } else {
    dispatch({
      type: actions.DELETE_CART_ITEM_FAILED,
    });
    ShowToast(Languages.Oops);
  }
};

export const getCartAction = () => async (dispatch: Dispatch<AnyAction>) => {
  dispatch({
    type: actions.GET_CART_PENDING,
  });
  const result = await cartGetCall();
  if (result?.data?.cartid) {
    dispatch({
      type: actions.GET_CART_SUCCESS,
      payload: result?.data,
    });
    return true;
  } else {
    dispatch({
      type: actions.GET_CART_FAILED,
      payload: {
        cartid: null,
        items: [],
        count: 0,
        total: 0,
      },
    });
    return false;
  }
};

export const decreaseCartItemAction = (params: {
  productid: string;
  // colorid: string;
  // sizeid: string;
  quantity: number;
  attrid: string;
}) => async (dispatch: Dispatch<AnyAction>) => {
  dispatch({
    type: actions.ADD_CART_ITEM_PENDING,
  });
  const result = await decreaseCartItemCall(params);
  if (result?.data?.result == 1) {
    dispatch({
      type: actions.ADD_CART_ITEM_SUCCESS,
      payload: result?.data,
    });
    dispatch(getCartAction() as any);
    ShowToast(Languages.RemovedSuccessfully, 'warning');
    return true;
  } else {
    dispatch({
      type: actions.ADD_CART_ITEM_FAILED,
    });
    ShowToast(Languages.Oops);
    return false;
  }
};

import { CartStore } from '../common/Types';
import actions from '../actions/types';

const initialState: CartStore = {
  isAddingToCart: false,
  isCartFetching: false,
  isCartItemDeleting: false,
  cartid: null,
  items: [],
  count: 0,
  total: 0,
};

const CartReducer = (state = initialState, action): CartStore => {
  const { type, payload } = action;
  switch (type) {
    case actions.ADD_CART_ITEM_PENDING: {
      return {
        ...state,
        isAddingToCart: true,
      };
    }

    case actions.ADD_CART_ITEM_SUCCESS: {
      return {
        ...state,
        isAddingToCart: false,
      };
    }

    case actions.ADD_CART_ITEM_FAILED: {
      return {
        ...state,
        isAddingToCart: false,
      };
    }

    case actions.DELETE_CART_ITEM_PENDING: {
      return {
        ...state,
        isCartItemDeleting: true,
      };
    }

    case actions.DELETE_CART_ITEM_SUCCESS: {
      return {
        ...state,
        isCartItemDeleting: false,
      };
    }

    case actions.DELETE_CART_ITEM_FAILED: {
      return {
        ...state,
        isCartItemDeleting: false,
      };
    }

    case actions.GET_CART_PENDING: {
      return {
        ...state,
        isCartFetching: true,
        isCartItemDeleting: false,
      };
    }

    case actions.GET_CART_SUCCESS: {
      return {
        ...state,
        isCartFetching: false,
        isCartItemDeleting: false,
        ...payload,
      };
    }

    case actions.GET_CART_FAILED: {
      return {
        ...state,
        isCartFetching: false,
        isCartItemDeleting: false,
        ...payload,
      };
    }

    case actions.CLEAR_CART: {
      return initialState;
    }

    default:
      return state;
  }
};

export default CartReducer;

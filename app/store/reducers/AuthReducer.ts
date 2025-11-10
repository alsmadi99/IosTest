import { AuthStore } from '../common/Types';
import actions from '../actions/types';

const initialState: AuthStore = {
  user: null,
  wishlist: [],
};

const AuthReducer = (state = initialState, action): AuthStore => {
  const { type, payload } = action;
  switch (type) {
    case actions.SAVE_USER: {
      return {
        ...state,
        user: payload.user,
      };
    }

    case actions.CLEAR_USER: {
      return {
        ...state,
        user: initialState.user,
      };
    }

    case actions.SAVE_USER_WISHLIST: {
      return {
        ...state,
        wishlist: payload?.wishlist,
      };
    }

    default:
      return state;
  }
};

export default AuthReducer;

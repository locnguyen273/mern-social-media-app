import { GLOBAL_TYPES } from "../actions/globalTypes";

const initialState = {};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case GLOBAL_TYPES.AUTH:
      return action.payload;

      case GLOBAL_TYPES.USER_INFO:
        return action.payload;

    default:
      return state;
  }
};

export default authReducer;

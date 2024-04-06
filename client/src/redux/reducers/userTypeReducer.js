import { GLOBAL_TYPES } from './../actions/globalTypes';

const userTypeReducer = (state = "user", action) => {
  switch (action.type) {
    case GLOBAL_TYPES.USER_TYPE:
      return action.payload;

    default:
      return state;
  }
};

export default userTypeReducer;

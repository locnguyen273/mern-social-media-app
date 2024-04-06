import { ADMIN_TYPES } from "../actions/adminAction";
import { DeleteData } from "../actions/globalTypes";

const initialState = {
  totalUsers: 0,
  totalPosts: 0,
  totalComments: 0,
  totalLikes: 0,
  totalActiveUsers: 0,
  totalSpamPosts: 0,
  spamPosts: [],
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADMIN_TYPES.GET_TOTAL_USERS:
      return {
        ...state,
        totalUsers: action.payload.totalUsers,
      };

    case ADMIN_TYPES.GET_TOTAL_POSTS:
      return {
        ...state,
        totalPosts: action.payload.totalPosts,
      };

    case ADMIN_TYPES.GET_TOTAL_COMMENTS:
      return {
        ...state,
        totalComments: action.payload.totalComments,
      };

    case ADMIN_TYPES.GET_TOTAL_LIKES:
      return {
        ...state,
        totalLikes: action.payload.totalLikes,
      };

    case ADMIN_TYPES.GET_TOTAL_SPAM_POSTS:
      return {
        ...state,
        totalSpamPosts: action.payload.totalSpamPosts,
      };

    case ADMIN_TYPES.GET_TOTAL_ACTIVE_USERS:
      return {
        ...state,
        totalActiveUsers: action.payload,
      };

    case ADMIN_TYPES.LOADING_ADMIN:
      return {
        ...state,
        loading: action.payload,
      };

    case ADMIN_TYPES.GET_SPAM_POSTS:
      return {
        ...state,
        spamPosts: [...action.payload],
      };
    case ADMIN_TYPES.DELETE_POST:
      return {
        ...state,
        spamPosts: DeleteData(state.spamPosts, action.payload._id),
      };

    default:
      return state;
  }
};

export default authReducer;

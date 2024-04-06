import { getDataAPI, deleteDataAPI } from "../../utils/fetchData";
import { createNotify } from "./notifyAction";
import { GLOBAL_TYPES } from './globalTypes';

export const ADMIN_TYPES = {
  GET_TOTAL_USERS: "GET_TOTAL_USERS",
  GET_TOTAL_POSTS: "GET_TOTAL_POSTS",
  GET_TOTAL_COMMENTS: "GET_TOTAL_COMMENTS",
  GET_TOTAL_LIKES: "GET_TOTAL_LIKES",
  GET_TOTAL_SPAM_POSTS: "GET_TOTAL_SPAM_POSTS",
  GET_TOTAL_ACTIVE_USERS: "GET_TOTAL_ACTIVE_USERS",
  GET_SPAM_POSTS: "GET_SPAM_POSTS",
  LOADING_ADMIN: "LOADING_ADMIN",
  DELETE_POST: "DELETE_POST",
};



export const getTotalUsers = (token) => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_TYPES.LOADING_ADMIN, payload: true });
    const res = await getDataAPI("get-total-users", token);
    dispatch({ type: ADMIN_TYPES.GET_TOTAL_USERS, payload: res.data });

    dispatch({ type: ADMIN_TYPES.LOADING_ADMIN, payload: false });
  } catch (err) {
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: {
        error: err.response.data.message,
      },
    });
  }
};

export const getTotalPosts = (token) => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_TYPES.LOADING_ADMIN, payload: true });
    const res = await getDataAPI("get-total-posts", token);
    dispatch({ type: ADMIN_TYPES.GET_TOTAL_POSTS, payload: res.data });

    dispatch({ type: ADMIN_TYPES.LOADING_ADMIN, payload: false });
  } catch (err) {
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: {
        error: err.response.data.message,
      },
    });
  }
};

export const getTotalComments = (token) => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_TYPES.LOADING_ADMIN, payload: true });
    const res = await getDataAPI("get-total-comments", token);
    dispatch({ type: ADMIN_TYPES.GET_TOTAL_COMMENTS, payload: res.data });
    dispatch({ type: ADMIN_TYPES.LOADING_ADMIN, payload: false });
  } catch (err) {
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: {
        error: err.response.data.message,
      },
    });
  }
};


export const getTotalLikes = (token) => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_TYPES.LOADING_ADMIN, payload: true });
    const res = await getDataAPI("get-total-likes", token);
    dispatch({ type: ADMIN_TYPES.GET_TOTAL_LIKES, payload: res.data });
    dispatch({ type: ADMIN_TYPES.LOADING_ADMIN, payload: false });
  } catch (err) {
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: {
        error: err.response.data.message,
      },
    });
  }
};

export const getTotalSpamPosts = (token) => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_TYPES.LOADING_ADMIN, payload: true });
    const res = await getDataAPI("get-total-spam-posts", token);
    dispatch({ type: ADMIN_TYPES.GET_TOTAL_SPAM_POSTS, payload: res.data });
    dispatch({ type: ADMIN_TYPES.LOADING_ADMIN, payload: false });
  } catch (err) {
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: {
        error: err.response.data.message,
      },
    });
  }
};

export const getSpamPosts = (token) => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_TYPES.LOADING_ADMIN, payload: true });
    const res = await getDataAPI("get-spam-posts", token);
    dispatch({ type: ADMIN_TYPES.GET_SPAM_POSTS, payload: res.data.spamPosts });
    dispatch({ type: ADMIN_TYPES.LOADING_ADMIN, payload: false });
  } catch (err) {
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: {
        error: err.response.data.message,
      },
    });
  }
};

export const deleteSpamPost = ({ post, auth, socket }) => async (dispatch) => {
  dispatch({ type: ADMIN_TYPES.DELETE_POST, payload: post });
  try {
    const res = await deleteDataAPI(
      `delete-spam-posts/${post._id}`,
      auth.token
    );
    dispatch({ type: GLOBAL_TYPES.ALERT, payload: { success: res.data.message } });
    // todo notification
    const message = {
      id: auth.user._id,
      text: "Your Post is deleted due to too many reports.",
      recipients: [post.user._id],
      url: `/profile/${post.user._id}`,
    };
    dispatch(createNotify({ message, auth, socket }));
  } catch (err) {
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: {
        error: err.response.data.message,
      },
    });
  }
};

export const getTotalActiveUsers = ({auth, socket}) => async (dispatch) => {
  try {
    socket.emit('getActiveUsers', auth.user._id);
  } catch (err) {
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: {
        error: err.response.data.message,
      },
    });
  }
};
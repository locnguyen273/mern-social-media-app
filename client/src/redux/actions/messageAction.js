import { postDataAPI, getDataAPI } from "../../utils/fetchData";
import { GLOBAL_TYPES } from './globalTypes';

export const MESSAGE_TYPES = {
  ADD_USER: "ADD_USER",
  ADD_MESSAGE: "ADD_MESSAGE",
  GET_CONVERSATIONS: "GET_CONVERSATIONS",
  GET_MESSAGES: "GET_MESSAGES",
};

export const addUser = ({ user, message }) => async (dispatch) => {
  if (message.users.every((item) => item._id !== user._id)) {
    dispatch({
      type: MESSAGE_TYPES.ADD_USER,
      payload: { ...user, text: "", media: [] },
    });
  }
};

export const addMessage = ({ message, auth, socket }) => async (dispatch) => {
  dispatch({ type: MESSAGE_TYPES.ADD_MESSAGE, payload: message });
  socket.emit("addMessage", message);
  try {
    await postDataAPI("message", message, auth.token);
  } catch (err) {
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: { error: err.response.data.message },
    });
  }
};

export const getConversations = ({ auth, page = 1 }) => async (dispatch) => {
  try {
    const res = await getDataAPI(`conversations?limit=${page * 9}`, auth.token);
    let newArr = [];
    res.data.conversations.forEach((item) => {
      item.recipients.forEach((cv) => {
        if (cv._id !== auth.user._id) {
          newArr.push({ ...cv, text: item.text, media: item.media });
        }
      });
    });
    dispatch({
      type: MESSAGE_TYPES.GET_CONVERSATIONS,
      payload: { newArr, result: res.data.result },
    });
  } catch (err) {
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: { error: err.response.data.message },
    });
  }
};

export const getMessages = ({ auth, id, page = 1 }) => async (dispatch) => {
  try {
    const res = await getDataAPI(`message/${id}?limit=${page * 9}`, auth.token);
    dispatch({ type: MESSAGE_TYPES.GET_MESSAGES, payload: res.data });
  } catch (err) {
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: { error: err.response.data.message },
    });
  }
};

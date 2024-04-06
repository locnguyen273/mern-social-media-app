import { postDataAPI } from "../../utils/fetchData";
import valid from "../../utils/validation";
import { GLOBAL_TYPES } from './globalTypes';

export const TYPES = {
  AUTH: "AUTH",
};

export const login = (data) => async (dispatch) => {
  try {
    dispatch({ type: GLOBAL_TYPES.ALERT, payload: { loading: true } });
    const res = await postDataAPI("login", data);
    dispatch({
      type: GLOBAL_TYPES.USER_TYPE,
      payload: res?.data?.user?.role,
    });
    localStorage.setItem("firstLogin", true);
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: { success: res?.data?.message },
    });
    if(res.status === 200) {
      dispatch({
        type: GLOBAL_TYPES.USER_INFO,
        payload: res.data
      })
    }
  } catch (err) {
    console.log(err)
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: { error: err },
    });
  }
};

export const changePassword = ({ oldPassword, newPassword, cnfNewPassword, auth }) => async (dispatch) => {
  if (!oldPassword || oldPassword.length === 0) {
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: { error: "Please enter your old  password." },
    });
  }
  if (!newPassword || newPassword.length === 0) {
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: { error: "Please enter your new  password." },
    });
  }
  if (!cnfNewPassword || cnfNewPassword.length === 0) {
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: { error: "Please confirm your new  password." },
    });
  }
  if (newPassword !== cnfNewPassword) {
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: { error: "Your password does not match" },
    });
  }
  try {
    dispatch({ type: GLOBAL_TYPES.ALERT, payload: { loading: true } });
    const res = await postDataAPI(
      "changePassword",
      { oldPassword, newPassword },
      auth.token
    );
    dispatch({ type: GLOBAL_TYPES.ALERT, payload: { loading: false } });
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: { success: res.data.message },
    });
  } catch (err) {
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: { error: err.response.data.message },
    });
  }
};

export const adminLogin = (data) => async (dispatch) => {
  try {
    dispatch({ type: GLOBAL_TYPES.ALERT, payload: { loading: true } });
    const res = await postDataAPI("admin-login", data);
    dispatch({
      type: GLOBAL_TYPES.AUTH,
      payload: { token: res.data.access_token, user: res.data.user },
    });
    dispatch({
      type: GLOBAL_TYPES.USER_TYPE,
      payload: res.data.user.role,
    });
    localStorage.setItem("firstLogin", true);
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: { success: res.data.message },
    });
  } catch (err) {
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: { error: err.response.data.message },
    });
  }
};

export const refreshToken = () => async (dispatch) => {
  const firstLogin = localStorage.getItem("firstLogin");
  if (firstLogin) {
    dispatch({ type: GLOBAL_TYPES.ALERT, payload: { loading: true } });
    try {
      const res = await postDataAPI("refresh-token");
      dispatch({
        type: GLOBAL_TYPES.AUTH,
        payload: { token: res.data.access_token, user: res.data.user },
      });

      dispatch({
        type: GLOBAL_TYPES.USER_TYPE,
        payload: res.data.user.role,
      });

      dispatch({ type: GLOBAL_TYPES.ALERT, payload: {} });
    } catch (err) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: err.response.data.msg },
      });
    }
  }
};

export const register = (data) => async (dispatch) => {
  const check = valid(data);
  if (check.errLength > 0) {
    return dispatch({ type: GLOBAL_TYPES.ALERT, payload: check.errMsg });
  }
  try {
    dispatch({ type: GLOBAL_TYPES.ALERT, payload: { loading: true } });
    const res = await postDataAPI("register", data);
    dispatch({
      type: GLOBAL_TYPES.AUTH,
      payload: { token: res.data.access_token, user: res.data.user },
    });
    dispatch({
      type: GLOBAL_TYPES.USER_TYPE,
      payload: res.data.user.role,
    });
    localStorage.setItem("firstLogin", true);
    dispatch({ type: GLOBAL_TYPES.ALERT, payload: { success: res.data.msg } });
  } catch (err) {
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: { error: err.response.data.msg },
    });
  }
};

export const registerAdmin = (data) => async (dispatch) => {
  const check = valid(data);
  if (check.errLength > 0) {
    return dispatch({ type: GLOBAL_TYPES.ALERT, payload: check.errMsg });
  }
  try {
    dispatch({ type: GLOBAL_TYPES.ALERT, payload: { loading: true } });
    const res = await postDataAPI("register-admin", data);
    dispatch({ type: GLOBAL_TYPES.ALERT, payload: { success: res.data.msg } });
  } catch (err) {
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: { error: err.response.data.msg },
    });
  }
};

export const logout = () => async (dispatch) => {
  try {
    localStorage.removeItem("firstLogin");
    await postDataAPI("logout");
    window.location.href = "/";
  } catch (err) {
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: { error: err.response.data.msg },
    });
  }
};

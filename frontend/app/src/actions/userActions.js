import axios from "axios";
import {
  USER_SIGNUP_REQUEST, USER_SIGNUP_SUCCESS, USER_SIGNUP_FAIL,
  USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_LIST_REQUEST, USER_LIST_SUCCESS, USER_LIST_FAIL,
  USER_DELETE_REQUEST, USER_DELETE_SUCCESS, USER_DELETE_FAIL,
  USER_UPDATE_REQUEST, USER_UPDATE_SUCCESS, USER_UPDATE_FAIL,
  USER_DETAILS_REQUEST, USER_DETAILS_SUCCESS, USER_DETAILS_FAIL,
  USER_UPDATE_PROFILE_REQUEST, USER_UPDATE_PROFILE_SUCCESS, USER_UPDATE_PROFILE_FAIL
} from "../constants/userConstants";

import { getToken } from "../utils/auth";


export const signup = (fname, lname, email, password, username) => async (dispatch) => {
  try {
    dispatch({ type: USER_SIGNUP_REQUEST });

    const { data } = await axios.post("/api/users/register/", {
      username,
      first_name: fname,
      last_name: lname,
      email,
      password,
    });

    dispatch({ type: USER_SIGNUP_SUCCESS, payload: data });

    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });

    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_SIGNUP_FAIL,
      payload: error.response?.data?.detail || error.message,
    });
  }
};


export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });

    const { data } = await axios.post("/api/users/login/", {
      username: email,
      password,
    });

    console.log("FULL RESPONSE:", data);

    const userData = {
      id: data.id,
      username: data.username,
      email: data.email,
      isAdmin: data.isAdmin,
      access: data.access,
      refresh: data.refresh,
    };

    console.log("LOGIN RESPONSE:", data)

    dispatch({ type: USER_LOGIN_SUCCESS, payload: userData });

    localStorage.setItem("userInfo", JSON.stringify(userData));
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload: error.response?.data?.detail || error.message,
    });
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem("userInfo");
  localStorage.removeItem("cartItems");

  dispatch({ type: USER_LOGOUT });
};


export const listUsers = () => async (dispatch) => {
  try {
    dispatch({ type: USER_LIST_REQUEST });

    const token = getToken();

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(
      "http://127.0.0.1:8000/api/users/getallusers/",
      config
    );

    dispatch({ type: USER_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: USER_LIST_FAIL,
      payload: error.response?.data?.detail || error.message,
    });
  }
};


export const deleteUser = (id) => async (dispatch) => {
  try {
    dispatch({ type: USER_DELETE_REQUEST });

    const token = getToken();

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    await axios.delete(`/api/users/delete/${id}/`, config);

    dispatch({ type: USER_DELETE_SUCCESS });
  } catch (error) {
    dispatch({
      type: USER_DELETE_FAIL,
      payload: error.response?.data?.detail || error.message,
    });
  }
};


export const updateUser = (user) => async (dispatch) => {
  try {
    dispatch({ type: USER_UPDATE_REQUEST });

    const token = getToken();

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.put(
      `/api/users/update/${user.id}/`,
      user,
      config
    );

    dispatch({ type: USER_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: USER_UPDATE_FAIL,
      payload: error.response?.data?.detail || error.message,
    });
  }
};


export const getUserProfile = () => async (dispatch) => {
  try {
    dispatch({ type: USER_DETAILS_REQUEST });

    const token = getToken();

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get("/api/users/profile/", config);

    dispatch({ type: USER_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: USER_DETAILS_FAIL,
      payload: error.response?.data?.detail || error.message,
    });
  }
};

export const getUserDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: USER_DETAILS_REQUEST });

    const token = getToken();

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(
      `/api/users/${id}/`,
      config
    );

    dispatch({
      type: USER_DETAILS_SUCCESS,
      payload: data,
    });

  } catch (error) {
    dispatch({
      type: USER_DETAILS_FAIL,
      payload: error.response?.data?.detail || error.message,
    });
  }
};



export const updateUserProfile = (user) => async (dispatch) => {
  try {
    dispatch({ type: USER_UPDATE_PROFILE_REQUEST });

    const token = getToken();

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.put(
      "/api/users/profile/update/",
      user,
      config
    );

    dispatch({ type: USER_UPDATE_PROFILE_SUCCESS, payload: data });

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data
    });

    if (data?.id || data?._id) {

      localStorage.setItem("userInfo", JSON.stringify(data));

    }

  } catch (error) {
    dispatch({
      type: USER_UPDATE_PROFILE_FAIL,
      payload: error.response?.data?.detail || error.message,
    });
  }
};
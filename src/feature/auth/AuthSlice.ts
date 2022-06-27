import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  Dispatch,
} from "@reduxjs/toolkit";
import type { LoginParam } from "../../interface/auth";
import { setInfo } from "../user/userSlice";
import * as fetchApi from "../../utils/fetchApi";
import { AxiosRequestConfig } from "axios";
import { config } from "process";
export const getStoreLocal = (item: string) => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(item);
  }
};
export const removeStoreLocal = (item: string) => {
  if (typeof window !== "undefined") {
    return localStorage.removeItem(item);
  }
};
export interface authState {
  accessToken: string;
  isSuccess: boolean;
  isLoading: boolean;
  isError: boolean;
  messageError: string;
}

const initialState: authState = {
  accessToken: getStoreLocal("id") ? (getStoreLocal("id") as string) : "",
  isSuccess: false,
  isLoading: false,
  isError: false,
  messageError: "",
};

export const Login = createAsyncThunk(
  "user/login",
  async (data: LoginParam, thunkAPI) => {
    try {
      const res = await fetchApi.login(data);
      thunkAPI.dispatch(setId(res.data));
      thunkAPI.dispatch(
        setInfo({
          name: res.data.name,
          username: res.data.username,
        })
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setId: (
      state,
      action: PayloadAction<{
        id: string;
        name: string;
        username: string;
      }>
    ) => {
      localStorage.setItem("id", action.payload.id);
    },
    logOut: (state) => {
      state.isSuccess = false;
      removeStoreLocal("id");
      console.log("đăng xuất");
    },
  },
  extraReducers: {
    [Login.pending.toString()]: (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    },
    [Login.fulfilled.toString()]: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = true;
      return state;
    },
    [Login.rejected.toString()]: (state, actions) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
      state.messageError = actions.payload.message;
    },
  },
});
export const { setId, logOut } = authSlice.actions;
export default authSlice.reducer;

import {
  Dispatch,
  PayloadAction,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import * as fetchApi from "../../utils/fetchApi";

export interface userState {
  name: string;
  userName: string;
}
export const getStoreLocal = (item: string) => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(item);
  }
};
const initialState: userState = {
  name: "",
  userName: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setInfo: (
      state,
      actions: PayloadAction<{
        name: string;
        username: string;
      }>
    ) => {
      state.name = actions.payload.name;
      state.userName = actions.payload.username;
    },
  },
});
export const { setInfo } = userSlice.actions;

export default userSlice.reducer;

import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../feature/auth/AuthSlice";
import userSlice from "../feature/user/userSlice";

export const store = configureStore({
  reducer: {
    authSlice: authSlice,
    userSlice: userSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { configureStore } from "@reduxjs/toolkit";
import { userReducerSlice } from "./reducers/user.reducer";

export const store = configureStore({
  reducer: {
    user: userReducerSlice,
  },
});

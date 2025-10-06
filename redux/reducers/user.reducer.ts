import { UserReducerInitial } from "@/types/type";
import { createSlice } from "@reduxjs/toolkit";

const userReducerInitial: UserReducerInitial = {
  error: false,
  user: null,
  loading: false,
};

const userReducer = createSlice({
  initialState: userReducerInitial,
  reducers: {},
  name: "user-reducer",
});

export const { reducer: userReducerSlice } = userReducer;

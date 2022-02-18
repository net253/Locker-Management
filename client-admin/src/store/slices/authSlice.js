import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const authSlice = createSlice({
  name: "authReducer",
  initialState,
  reducers: {
    updateAuth: (state, action) => {
      return { ...action.payload };
    },
  },
});

export const { updateAuth } = authSlice.actions;

export default authSlice.reducer;

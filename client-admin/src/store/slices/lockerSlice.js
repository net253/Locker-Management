import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const lockerSlice = createSlice({
  name: "lockerReducer",
  initialState,
  reducers: {
    updateLocker: (state, action) => {
      return [...action.payload];
    },
  },
});

export const { updateLocker } = lockerSlice.actions;

export default lockerSlice.reducer;

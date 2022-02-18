import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const overallSlice = createSlice({
  name: "overallReducer",
  initialState,
  reducers: {
    updateOverall: (state, action) => {
      return [...action.payload];
    },
  },
});

export const { updateOverall } = overallSlice.actions;

export default overallSlice.reducer;

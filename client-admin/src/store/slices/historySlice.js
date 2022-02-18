import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const historySlice = createSlice({
  name: "historyReducer",
  initialState,
  reducers: {
    updateHistory: (state, action) => {
      return [...action.payload];
    },
  },
});

export const { updateHistory } = historySlice.actions;

export default historySlice.reducer;

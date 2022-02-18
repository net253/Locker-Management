import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const presentUsedSlice = createSlice({
  name: "presentUsedReducer",
  initialState,
  reducers: {
    updatePresentUsed: (state, action) => {
      return [...action.payload];
    },
  },
});

export const { updatePresentUsed } = presentUsedSlice.actions;

export default presentUsedSlice.reducer;

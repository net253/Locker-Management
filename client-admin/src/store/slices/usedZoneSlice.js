import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const usedZoneSlice = createSlice({
  name: "usedZoneReducer",
  initialState,
  reducers: {
    updateUsedZone: (state, action) => {
      return [...action.payload];
    },
  },
});

export const { updateUsedZone } = usedZoneSlice.actions;

export default usedZoneSlice.reducer;

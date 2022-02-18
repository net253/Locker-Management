import { configureStore } from "@reduxjs/toolkit";

import overallSlice from "./slices/overallSlice";
import usedZoneSlice from "./slices/usedZoneSlice";
import historySlice from "./slices/historySlice";
import lockerSlice from "./slices/lockerSlice";
import presentUsedSlice from "./slices/presentUsedSlice";
import authSlice from "./slices/authSlice";

export default configureStore({
  reducer: {
    overallInfo: overallSlice, // camel case
    zoneUsedInfo: usedZoneSlice, // snake case
    historyInfo: historySlice,
    lockerInfo: lockerSlice,
    presentInfo: presentUsedSlice,
    auth: authSlice,
  },
});

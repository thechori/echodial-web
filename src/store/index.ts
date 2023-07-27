import { configureStore } from "@reduxjs/toolkit";

//
import userReducer from "./user/slice";
import dialerReducer from "./dialer/slice";
import phaseReducer from "./phases/slice";

const store = configureStore({
  reducer: {
    user: userReducer,
    dialer: dialerReducer,
    phase: phaseReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

import { configureStore } from "@reduxjs/toolkit";

//
import userReducer from "./user/slice";
import dialerReducer from "./dialer/slice";

const store = configureStore({
  reducer: {
    user: userReducer,
    dialer: dialerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

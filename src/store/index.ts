import { configureStore } from "@reduxjs/toolkit";

//
import userReducer from "./user/slice";
import dialerReducer from "./dialer/slice";
import phaseReducer from "./phases/slice";
import { leadApi } from "../services/lead";
import { callerIdApi } from "../services/caller-id";

const store = configureStore({
  reducer: {
    user: userReducer,
    dialer: dialerReducer,
    phase: phaseReducer,
    [leadApi.reducerPath]: leadApi.reducer,
    [callerIdApi.reducerPath]: callerIdApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(leadApi.middleware, callerIdApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

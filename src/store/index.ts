import { configureStore } from "@reduxjs/toolkit";

//
import userReducer from "./user/slice";
import dialerReducer from "./dialer/slice";
import phaseReducer from "./phases/slice";
import metricReducer from "./metric/slice";
import leadReducer from "./leads/slice";
import { leadApi } from "../services/lead";
import { callerIdApi } from "../services/caller-id";
import { callApi } from "../services/call";
import { metricApi } from "../services/metric";

const store = configureStore({
  reducer: {
    user: userReducer,
    dialer: dialerReducer,
    phase: phaseReducer,
    metric: metricReducer,
    leads: leadReducer,
    [leadApi.reducerPath]: leadApi.reducer,
    [callerIdApi.reducerPath]: callerIdApi.reducer,
    [callApi.reducerPath]: callApi.reducer,
    [metricApi.reducerPath]: metricApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(
      leadApi.middleware,
      callerIdApi.middleware,
      callApi.middleware,
      metricApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

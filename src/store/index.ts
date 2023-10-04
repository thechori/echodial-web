import { configureStore } from "@reduxjs/toolkit";

//
import userReducer from "./user/slice";
import dialerReducer from "./dialer/slice";
import bucketReducer from "./buckets/slice";
import metricReducer from "./metric/slice";
import billingReducer from "./billing/slice";
import leadReducer from "./leads/slice";
import { leadApi } from "../services/lead";
import { callerIdApi } from "../services/caller-id";
import { callApi } from "../services/call";
import { metricApi } from "../services/metric";

const store = configureStore({
  reducer: {
    user: userReducer,
    dialer: dialerReducer,
    buckets: bucketReducer,
    metric: metricReducer,
    leads: leadReducer,
    billing: billingReducer,
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

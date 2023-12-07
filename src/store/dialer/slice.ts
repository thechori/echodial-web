import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Device, Call } from "@twilio/voice-sdk";
//
import { RootState } from "..";
import { Lead } from "../../types";

export const LOCAL_STORAGE_KEY__DIALER_OPTIONS = "dialer__options";
export const LOCAL_STORAGE_KEY__DIALER_FROM_NUMBER = "dialer__from_number";
export const LOCAL_STORAGE_KEY__DIAL_QUEUE = "dialer__dial_queue";
export const LOCAL_STORAGE_KEY__DIAL_QUEUE_INDEX = "dialer__dial_queue_index";
export const LOCAL_STORAGE_KEY__DIALER_IS_OPEN = "dialer__is_open";

const buildOptions = (): TDialerOptions => {
  // Check for local storage
  const cachedOptions = localStorage.getItem(LOCAL_STORAGE_KEY__DIALER_OPTIONS);

  if (cachedOptions) {
    return JSON.parse(cachedOptions);
  }

  return {
    maxRingTimeInSeconds: 10, // 10 seems like a good sweet spot
    maxCallTries: 3,
    cooldownTimeInSeconds: 10,
  };
};

export type TDialerOptions = {
  maxRingTimeInSeconds: number;
  maxCallTries: number;
  cooldownTimeInSeconds: number;
};

export type TRequestAction = null | "startCall" | "stopCall" | "skipToNextLead";

type TDialerState = {
  // This variable is to manage the state across the app, while being explicit about the ONE thing the
  // dialer component should be doing to make the state more approachable
  requestAction: TRequestAction;
  //
  error: string;
  isDialerOpen: boolean;
  device: any | Device;
  connectedAt: null | Date;
  currentDialAttempts: null | number;
  call: null | Call;
  currentCallId: null | number;
  status: Call.State;
  muted: boolean;
  token: null | string;
  tokenLoading: boolean;
  identity: null | string;
  fromNumber: null | string;
  activeLead: null | Lead;
  options: TDialerOptions;
  showOptions: boolean;
  showNewCallerIdModal: boolean;
  showNewCallerIdValidatingModal: boolean;
};

const buildInitialState = (): TDialerState => ({
  requestAction: null,
  //
  isDialerOpen:
    localStorage.getItem(LOCAL_STORAGE_KEY__DIALER_IS_OPEN) === "false"
      ? false
      : true,
  tokenLoading: false,
  device: null,
  call: null,
  currentCallId: null,
  connectedAt: null,
  currentDialAttempts: null,
  muted: false,
  fromNumber:
    localStorage.getItem(LOCAL_STORAGE_KEY__DIALER_FROM_NUMBER) || null,
  error: "",
  status: Call.State.Closed,
  token: null,
  identity: null,
  activeLead: JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_KEY__DIAL_QUEUE_INDEX) || "null"
  ),
  //
  options: buildOptions(),
  showOptions: false,
  showNewCallerIdModal: false,
  showNewCallerIdValidatingModal: false,
});

export const DialerSlice = createSlice({
  name: "dialer",
  initialState: buildInitialState(),
  reducers: {
    setRequestAction: (state, action: PayloadAction<TRequestAction>) => {
      state.requestAction = action.payload;
    },
    setIsDialerOpen: (state, action) => {
      state.isDialerOpen = action.payload;

      localStorage.setItem(
        LOCAL_STORAGE_KEY__DIALER_IS_OPEN,
        JSON.stringify(action.payload)
      );
    },
    setDevice: (state, action) => {
      state.device = action.payload;
    },
    setTokenLoading: (state, action) => {
      state.tokenLoading = action.payload;
    },
    setCall: (state, action) => {
      state.call = action.payload;
    },
    setCurrentCallId: (state, action) => {
      state.currentCallId = action.payload;
    },
    setFromNumber: (state, action) => {
      state.fromNumber = action.payload;

      // Persist in local storage
      localStorage.setItem(
        LOCAL_STORAGE_KEY__DIALER_FROM_NUMBER,
        action.payload
      );
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setIdentity: (state, action) => {
      state.identity = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setActiveLead: (state, action) => {
      state.activeLead = action.payload;

      // Persist in local storage
      localStorage.setItem(
        LOCAL_STORAGE_KEY__DIAL_QUEUE_INDEX,
        JSON.stringify(action.payload)
      );
    },

    setConnectedAt: (state, action) => {
      state.connectedAt = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setShowOptions: (state, action) => {
      state.showOptions = action.payload;
    },
    setOptions: (state, action) => {
      state.options = action.payload;

      // Persist in local storage
      localStorage.setItem(
        LOCAL_STORAGE_KEY__DIALER_OPTIONS,
        JSON.stringify(action.payload)
      );
    },
    setCurrentDialAttempts: (state, action) => {
      state.currentDialAttempts = action.payload;
    },

    setShowNewCallerIdModal: (state, action) => {
      state.showNewCallerIdModal = action.payload;
    },
    setShowNewCallerIdValidatingModal: (state, action) => {
      state.showNewCallerIdValidatingModal = action.payload;
    },
  },
});

export const {
  setRequestAction,
  setIsDialerOpen,
  setCall,
  setCurrentCallId,
  setCurrentDialAttempts,
  setDevice,
  setTokenLoading,
  setFromNumber,
  setIdentity,
  setToken,
  setError,
  setActiveLead,
  setStatus,
  setShowOptions,
  setOptions,
  setConnectedAt,
  setShowNewCallerIdModal,
  setShowNewCallerIdValidatingModal,
} = DialerSlice.actions;

export const selectIsDialerOptionsModalOpen = (state: RootState) =>
  state.dialer.showOptions;

export default DialerSlice.reducer;

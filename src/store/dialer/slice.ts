import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Device, Call } from "@twilio/voice-sdk";
//
import numbers from "../../configs/numbers";
import { RootState } from "..";
import { Lead } from "../../types";

const buildOptions = (): TDialerOptions => {
  // Check for local storage
  const cachedOptions = localStorage.getItem("dialer__options");

  if (cachedOptions) {
    return JSON.parse(cachedOptions);
  }

  return {
    maxRingTimeInMilliseconds: 3000,
    maxCallTries: 3,
    cooldownTimeInMilliseconds: 10000,
    showAlphaDialer: true,
  };
};

export type TDialerOptions = {
  maxRingTimeInMilliseconds: number;
  maxCallTries: number;
  cooldownTimeInMilliseconds: number;
  showAlphaDialer: boolean;
};

export type TRequestAction =
  | null
  | "startDialing"
  | "startCall"
  | "stopCall"
  | "stopDialing"
  | "determineNextAction"
  | "resetDialer"
  | "error";

interface IDialerState {
  // This variable is to manage the state across the app, while being explicit about the ONE thing the
  // dialer component should be doing to make the state more approachable
  requestAction: TRequestAction;
  //
  error: string;
  alphaDialerVisible: boolean;
  device: any | Device;
  wasCallConnected: null | boolean;
  currentDialAttempts: null | number;
  call: null | Call;
  currentCallId: null | number;
  currentCallTimer: any;
  status: "idle" | "calling" | "failed" | "stopped" | "connected";
  muted: boolean;
  token: null | string;
  tokenLoading: boolean;
  identity: null | string;
  fromNumber: string;
  currentDialIndex: null | number;
  dialQueue: Lead[];
  options: TDialerOptions;
  showOptions: boolean;
}

const buildInitialState = (): IDialerState => ({
  requestAction: null,
  //
  alphaDialerVisible: false,
  tokenLoading: false,
  device: null,
  call: null,
  currentCallId: null,
  wasCallConnected: null,
  currentDialAttempts: null,
  currentCallTimer: null,
  muted: false,
  // TODO: Remove this hardcoded value in favor of values from API
  fromNumber: localStorage.getItem("dialer__fromNumber") || numbers[2].value,
  error: "",
  status: "idle",
  token: null,
  identity: null,
  currentDialIndex: null,
  dialQueue: JSON.parse(localStorage.getItem("dialer__contactQueue") || "[]"),
  //
  options: buildOptions(),
  showOptions: false,
});

export const DialerSlice = createSlice({
  name: "dialer",
  initialState: buildInitialState(),
  reducers: {
    setRequestAction: (state, action: PayloadAction<TRequestAction>) => {
      state.requestAction = action.payload;
    },
    setAlphaDialerVisible: (state, action) => {
      state.alphaDialerVisible = action.payload;
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
      localStorage.setItem("dialer__fromNumber", action.payload);
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
    setCurrentDialIndex: (state, action) => {
      state.currentDialIndex = action.payload;
    },
    setDialQueue: (state, action) => {
      state.dialQueue = action.payload;

      // Persist in local storage
      localStorage.setItem(
        "dialer__contactQueue",
        JSON.stringify(action.payload)
      );
    },
    setIsMuted: (state, action) => {
      state.muted = action.payload;
    },
    setWasCallConnected: (state, action) => {
      state.wasCallConnected = action.payload;
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
      localStorage.setItem("dialer__options", JSON.stringify(action.payload));
    },
    setCurrentDialAttempts: (state, action) => {
      state.currentDialAttempts = action.payload;
    },
    setCurrentCallTimer: (state, action) => {
      state.currentCallTimer = action.payload;
    },
    moveLeadUpInQueue: (state, action) => {
      const id = action.payload;
      const indexFound = state.dialQueue.findIndex((lead) => lead.id === id);

      if (indexFound === -1) {
        console.error("Lead index not found");
        return;
      }

      // If at the top, do nothing
      if (indexFound === 0) {
        return;
      }

      const queue = [...state.dialQueue];
      const item = queue.splice(indexFound, 1)[0];
      queue.splice(indexFound - 1, 0, item);

      state.dialQueue = queue;
    },
    moveLeadDownInQueue: (state, action) => {
      const id = action.payload;
      const indexFound = state.dialQueue.findIndex((lead) => lead.id === id);

      if (indexFound === -1) {
        console.error("Lead index not found");
        return;
      }

      // If at the bottom, do nothing
      if (indexFound === state.dialQueue.length - 1) {
        return;
      }

      const queue = [...state.dialQueue];
      const item = queue.splice(indexFound, 1)[0];
      queue.splice(indexFound + 1, 0, item);

      state.dialQueue = queue;
    },
    deleteLeadFromQueue: (state, action) => {
      state.dialQueue = state.dialQueue.filter(
        (lead) => lead.id !== action.payload
      );
    },
  },
});

export const {
  setRequestAction,
  setAlphaDialerVisible,
  setCall,
  setCurrentCallId,
  setCurrentDialAttempts,
  setCurrentCallTimer,
  setDevice,
  setTokenLoading,
  setFromNumber,
  setIdentity,
  setToken,
  setError,
  setDialQueue,
  setCurrentDialIndex,
  setIsMuted,
  setStatus,
  setShowOptions,
  setOptions,
  moveLeadUpInQueue,
  moveLeadDownInQueue,
  deleteLeadFromQueue,
  setWasCallConnected,
} = DialerSlice.actions;

export const selectIsCallActive = (state: RootState) => state.dialer.call;

export const selectActivePhoneNumber = (state: RootState) => {
  const { currentDialIndex, dialQueue } = state.dialer;
  return currentDialIndex !== null
    ? dialQueue[currentDialIndex].phone
    : undefined;
};

export const selectActiveFullName = (state: RootState) => {
  const { currentDialIndex, dialQueue } = state.dialer;
  return currentDialIndex !== null
    ? `${dialQueue[currentDialIndex].first_name} ${dialQueue[currentDialIndex].last_name}`
    : undefined;
};

export const selectShowAlphaDialer = (state: RootState) =>
  state.dialer.options.showAlphaDialer;

export const selectIsDialerOptionsModalOpen = (state: RootState) =>
  state.dialer.showOptions;

export default DialerSlice.reducer;

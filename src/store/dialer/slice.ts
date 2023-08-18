import { createSlice } from "@reduxjs/toolkit";
import { Device, Call } from "@twilio/voice-sdk";
//
import numbers from "../../configs/numbers";
import { RootState } from "..";
import { TLead } from "../../services/lead";

const buildOptions = (): TDialerOptions => {
  // Check for local storage
  const cachedOptions = localStorage.getItem("dialer__options");

  if (cachedOptions) {
    return JSON.parse(cachedOptions);
  }

  return {
    maxCallTries: 3,
    cooldownTimeInMilliseconds: 10000,
    showAlphaDialer: true,
  };
};

type TDialerOptions = {
  maxCallTries: number;
  cooldownTimeInMilliseconds: number;
  showAlphaDialer: boolean;
};

interface IDialerState {
  error: string;
  alphaDialerVisible: boolean;
  device: any | Device;
  isCalling: boolean;
  call: null | Call;
  status: "idle" | "calling" | "failed" | "stopped" | "connected";
  muted: boolean;
  token: null | string;
  tokenLoading: boolean;
  identity: null | string;
  fromNumber: string;
  activeContactIndex: null | number;
  contactQueue: TLead[];
  options: TDialerOptions;
  showOptions: boolean;
}

const buildInitialState = (): IDialerState => ({
  alphaDialerVisible: false,
  tokenLoading: false,
  device: null,
  call: null,
  isCalling: false,
  muted: false,
  // TODO: Remove this hardcoded value in favor of values from API
  fromNumber: localStorage.getItem("dialer__fromNumber") || numbers[2].value,
  error: "",
  status: "idle",
  token: null,
  identity: null,
  activeContactIndex: null,
  contactQueue: JSON.parse(
    localStorage.getItem("dialer__contactQueue") || "[]"
  ),
  //
  options: buildOptions(),
  showOptions: false,
});

export const DialerSlice = createSlice({
  name: "dialer",
  initialState: buildInitialState(),
  reducers: {
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
    setActiveContactIndex: (state, action) => {
      state.activeContactIndex = action.payload;
    },
    setContactQueue: (state, action) => {
      state.contactQueue = action.payload;

      // Persist in local storage
      localStorage.setItem(
        "dialer__contactQueue",
        JSON.stringify(action.payload)
      );
    },
    setIsMuted: (state, action) => {
      state.muted = action.payload;
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
    setIsCalling: (state, action) => {
      state.isCalling = action.payload;
    },
  },
});

export const {
  setAlphaDialerVisible,
  setCall,
  setIsCalling,
  setDevice,
  setTokenLoading,
  setFromNumber,
  setIdentity,
  setToken,
  setError,
  setContactQueue,
  setActiveContactIndex,
  setIsMuted,
  setStatus,
  setShowOptions,
  setOptions,
} = DialerSlice.actions;

export const selectIsCallActive = (state: RootState) => state.dialer.isCalling;

export const selectActivePhoneNumber = (state: RootState) => {
  const { activeContactIndex, contactQueue } = state.dialer;
  return activeContactIndex !== null
    ? contactQueue[activeContactIndex].phone
    : undefined;
};

export const selectActiveFullName = (state: RootState) => {
  const { activeContactIndex, contactQueue } = state.dialer;
  return activeContactIndex !== null
    ? `${contactQueue[activeContactIndex].first_name} ${contactQueue[activeContactIndex].last_name}`
    : undefined;
};

export const selectShowAlphaDialer = (state: RootState) =>
  state.dialer.options.showAlphaDialer;

export const selectIsDialerOptionsModalOpen = (state: RootState) =>
  state.dialer.showOptions;

export default DialerSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import { Device, Call } from "@twilio/voice-sdk";
//
import numbers from "../../configs/numbers";
import { TContact } from "../contacts/types";
import contacts from "../../pages/dialer/contacts";
import { RootState } from "..";

const buildInitialOptions = (): TDialerOptions => ({
  maxCallTries: 3,
  cooldownTimeInMilliseconds: 10000,
  showAlphaDialer:
    JSON.parse(localStorage.getItem("dialer__showAlphaDialer") || "null") ||
    true,
});

type TDialerOptions = {
  maxCallTries: number;
  cooldownTimeInMilliseconds: number;
  showAlphaDialer: boolean;
};

interface IDialerState {
  error: string;
  alphaDialerVisible: boolean;
  device: any | Device;
  call: null | Call;
  status: "idle" | "calling" | "failed" | "stopped" | "connected";
  muted: boolean;
  token: null | string;
  tokenLoading: boolean;
  identity: null | string;
  fromNumber: string;
  activeContactIndex: null | number;
  contactQueue: TContact[];
  options: TDialerOptions;
  showOptions: boolean;
}

const buildInitialState = (): IDialerState => ({
  alphaDialerVisible: false,
  tokenLoading: false,
  device: null,
  call: null,
  muted: false,
  // TODO: Remove this hardcoded value in favor of values from API
  fromNumber: localStorage.getItem("dialer__fromNumber") || numbers[2].value,
  error: "",
  status: "idle",
  token: null,
  identity: null,
  activeContactIndex: null,
  contactQueue: contacts,
  //
  options: buildInitialOptions(),
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
    },
    setIsMuted: (state, action) => {
      state.muted = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setShowAlphaDialer: (state, action) => {
      state.options.showAlphaDialer = action.payload;

      // Persist in local storage
      localStorage.setItem(
        "dialer__showAlphaDialer",
        JSON.stringify(action.payload)
      );
    },
    setShowOptions: (state, action) => {
      state.showOptions = action.payload;
    },
  },
});

export const {
  setAlphaDialerVisible,
  setCall,
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
  setShowAlphaDialer,
  setShowOptions,
} = DialerSlice.actions;

export const selectIsCallActive = (state: RootState) => {
  const { status } = state.dialer;
  return status === "calling" || status === "connected";
};

export const selectActivePhoneNumber = (state: RootState) => {
  const { activeContactIndex, contactQueue } = state.dialer;
  return activeContactIndex !== null
    ? contactQueue[activeContactIndex].phone
    : undefined;
};

export const selectActiveFullName = (state: RootState) => {
  const { activeContactIndex, contactQueue } = state.dialer;
  return activeContactIndex !== null
    ? `${contactQueue[activeContactIndex].firstName} ${contactQueue[activeContactIndex].lastName}`
    : undefined;
};

export const selectShowAlphaDialer = (state: RootState) =>
  state.dialer.options.showAlphaDialer;

export const selectIsDialerOptionsModalOpen = (state: RootState) =>
  state.dialer.showOptions;

export default DialerSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import numbers from "../../configs/numbers";
//
import { TContact } from "../contacts/types";
import contacts from "../../pages/dialer/contacts";
import { RootState } from "..";
import { Device, Call } from "@twilio/voice-sdk";

const initialOptions: TDialerOptions = {
  maxCallTries: 3,
};

type TDialerOptions = {
  maxCallTries: number;
};

interface IDialerState {
  error: string;
  alphaDialerVisible: boolean;
  device: any | Device;
  call: null | Call;
  status: "idle" | "calling" | "failed" | "stopped" | "connected";
  muted: boolean;
  onHold: boolean;
  token: null | string;
  tokenLoading: boolean;
  identity: null | string;
  fromNumber: string;
  activeContactIndex: null | number;
  contactQueue: TContact[];
  options: TDialerOptions;
}

const initialState: IDialerState = {
  alphaDialerVisible: false,
  tokenLoading: false,
  device: null,
  call: null,
  fromNumber: numbers[2].value,
  error: "",
  status: "idle",
  muted: false,
  onHold: false,
  token: null,
  identity: null,
  activeContactIndex: null,
  contactQueue: contacts,
  //
  options: initialOptions,
};

export const DialerSlice = createSlice({
  name: "dialer",
  initialState,
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
    setMuted: (state, action) => {
      state.muted = action.payload;
    },
    setOnHold: (state, action) => {
      state.onHold = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
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
  setMuted,
  setOnHold,
  setStatus,
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

export default DialerSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import numbers from "../../configs/numbers";
//
import { TContact } from "../contacts/types";
import contacts from "../../pages/dialer/contacts";
import { RootState } from "..";
import { Device, Call } from "@twilio/voice-sdk";

interface IDialerState {
  error: string;
  device: any | Device;
  call: null | Call;
  status: "idle" | "calling" | "failed" | "stopped" | "connected";
  muted: boolean;
  onHold: boolean;
  token: null | string;
  identity: null | string;
  fromNumber: string;
  activeContact: null | TContact;
  contactQueue: TContact[];
}

const initialState: IDialerState = {
  device: null,
  call: null,
  fromNumber: numbers[2].value,
  error: "",
  status: "idle",
  muted: false,
  onHold: false,
  token: null,
  identity: null,
  activeContact: null,
  contactQueue: contacts,
};

export const DialerSlice = createSlice({
  name: "dialer",
  initialState,
  reducers: {
    setDevice: (state, action) => {
      state.device = action.payload;
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
    setActiveContact: (state, action) => {
      console.log("setActiveContact", action.payload);
      state.activeContact = action.payload;
    },
    setContactQueue: (state, action) => {
      console.log("setContactQueue", action.payload);
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
  setCall,
  setDevice,
  setFromNumber,
  setIdentity,
  setToken,
  setError,
  setContactQueue,
  setActiveContact,
  setMuted,
  setOnHold,
  setStatus,
} = DialerSlice.actions;

export const selectIsCallActive = (state: RootState) => {
  const { status } = state.dialer;
  return status === "calling" || status === "connected";
};

export default DialerSlice.reducer;

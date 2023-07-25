import { createSlice } from "@reduxjs/toolkit";
import numbers from "../../configs/numbers";
//
import { TContact } from "../contacts/types";
import contacts from "../../pages/dialer/contacts";

interface IDialerState {
  error: string;
  status: "idle" | "calling" | "failed" | "stopped" | "connected";
  muted: boolean;
  token: null | string;
  identity: null | string;
  fromNumber: string;
  contactsActive: TContact[];
  contactQueue: TContact[];
  activeCallSids: string[];
  activeConferenceIds: string[];
  selectedConferenceId: null | string;
}

const initialState: IDialerState = {
  fromNumber: numbers[2].value,
  error: "",
  status: "idle",
  muted: false,
  token: null,
  identity: null,
  contactsActive: [],
  contactQueue: contacts,
  activeCallSids: [],
  activeConferenceIds: [],
  selectedConferenceId: null,
};

export const DialerSlice = createSlice({
  name: "dialer",
  initialState,
  reducers: {
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
    setActiveCallSids: (state, action) => {
      state.activeCallSids = action.payload;
    },
    setContactsActive: (state, action) => {
      console.log("setContactsActive", action.payload);
      state.contactsActive = action.payload;
    },
    setContactQueue: (state, action) => {
      console.log("setContactQueue", action.payload);
      state.contactQueue = action.payload;
    },
    setMuted: (state, action) => {
      state.muted = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setActiveConferenceIds: (state, action) => {
      state.activeConferenceIds = action.payload;
    },
    setSelectedConferenceId: (state, action) => {
      state.selectedConferenceId = action.payload;
    },
    //
    startDialer: (state, action) => {},
    stopDialer: (state, action) => {},
  },
});

export const {
  setFromNumber,
  setActiveCallSids,
  setIdentity,
  setToken,
  setError,
  setContactQueue,
  setContactsActive,
  setMuted,
  setStatus,
  setActiveConferenceIds,
  setSelectedConferenceId,
} = DialerSlice.actions;

export default DialerSlice.reducer;

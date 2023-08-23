import { createSlice } from "@reduxjs/toolkit";
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

type TDialerOptions = {
  maxRingTimeInMilliseconds: number;
  maxCallTries: number;
  cooldownTimeInMilliseconds: number;
  showAlphaDialer: boolean;
};

interface IDialerState {
  error: string;
  alphaDialerVisible: boolean;
  device: any | Device;
  isDialing: boolean;
  isCallBeingCreated: boolean;
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
  alphaDialerVisible: false,
  tokenLoading: false,
  device: null,
  call: null,
  currentCallId: null,
  isDialing: false,
  isCallBeingCreated: false,
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
    setIsCallBeingCreated: (state, action) => {
      state.isCallBeingCreated = action.payload;
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
    setIsDialing: (state, action) => {
      state.isDialing = action.payload;
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

    // startDialer: (state, action: PayloadAction<number | undefined>) => {

    // },

    // Ends the current call and maintains place in queue
    endDialer: (state, action) => {},

    // Resets all of the items in the dialer
    resetDialer: (state, action) => {},

    // [ ] Should retry call if no answer AND under option.maxAttempts
    // [ ] Should continue to next call if nobody answered AND over option.maxAttempts
    // [ ] Should stop if a call connects (maybe they want to write notes, update Lead data, etc)
    // [ ] Should stop if an error exists? Or retry?
    determineFollowingAction: (state) => {
      const { currentDialAttempts, options } = state;

      if (currentDialAttempts === null) {
        return console.error("Current dial attempts not found");
      }

      // Check attempts against options
      const { maxCallTries } = options;

      if (currentDialAttempts < maxCallTries) {
        // Retry call by incrementing dial attempt
        state.currentDialAttempts = currentDialAttempts + 1;
      } else {
        // Continue to next Lead
        continueToNextLead();
      }
    },
    continueToNextLead: (state) => {
      console.log("continuing");

      const { currentDialIndex, dialQueue } = state;

      // Reset attempt count
      state.currentDialAttempts = 1;

      // Check for null active index
      if (currentDialIndex === null) {
        return console.error("No active contact index found");
      }

      // Stop if we're at the last index of the queue
      if (currentDialIndex === dialQueue.length - 1) {
        return console.info("No more leads to dial");
      }

      // Reset dial attempts counter
      state.currentDialAttempts = 1;

      state.currentDialIndex = currentDialIndex + 1;

      // Start new timer
    },
    startCallTimer: (state) => {
      const {
        wasCallConnected,
        currentCallTimer,
        currentDialAttempts,
        options,
      } = state;
      // Start timer that will check to see if:
      // - Call has connected or not
      // - Current attempts is beneath options.maxAttempts
      // - If there is another Lead in the Queue to continue to
      const timer = setTimeout(() => {
        console.log("maxRingTimeInMilliseconds hit! moving on...");

        // Check to see if connected or not
        if (wasCallConnected) {
          console.log("Call seems to have connected, clearing the timer!");
          clearTimeout(currentCallTimer);
          setCurrentCallTimer(null);
        }

        // BUG HERE
        // Check for null value in currentDialAttempts
        if (currentDialAttempts === null) {
          console.error("currentDialAttempts is null");
          return;
        }

        // Call has gone past allowed time, determine if retrying or continuing
        if (currentDialAttempts > options.maxCallTries) {
          console.log("Max attempts reached, moving to next Lead...");
          continueToNextLead();
        }

        // Retry lead!
        console.log("Calling Lead again...");
        setCurrentDialAttempts(currentDialAttempts + 1);
      }, options.maxRingTimeInMilliseconds);

      setCurrentCallTimer(timer);
    },
  },
});

export const {
  setAlphaDialerVisible,
  setCall,
  setCurrentCallId,
  setIsDialing,
  setIsCallBeingCreated,
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
  determineFollowingAction,
  continueToNextLead,
  startCallTimer,
} = DialerSlice.actions;

export const selectIsCallActive = (state: RootState) => state.dialer.isDialing;

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

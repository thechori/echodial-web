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
  isCallBeingCreated: boolean;
  wasCallConnected: null | boolean;
  currentDialAttempts: null | number;
  call: null | Call;
  currentCallId: null | number;
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
  currentCallId: null,
  isCalling: false,
  isCallBeingCreated: false,
  wasCallConnected: null,
  currentDialAttempts: null,
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
    setCurrentDialAttempts: (state, action) => {
      state.currentDialAttempts = action.payload;
    },
    moveLeadUpInQueue: (state, action) => {
      const id = action.payload;
      const indexFound = state.contactQueue.findIndex((lead) => lead.id === id);

      if (indexFound === -1) {
        console.error("Lead index not found");
        return;
      }

      // If at the top, do nothing
      if (indexFound === 0) {
        return;
      }

      const queue = [...state.contactQueue];
      const item = queue.splice(indexFound, 1)[0];
      queue.splice(indexFound - 1, 0, item);

      state.contactQueue = queue;
    },
    moveLeadDownInQueue: (state, action) => {
      const id = action.payload;
      const indexFound = state.contactQueue.findIndex((lead) => lead.id === id);

      if (indexFound === -1) {
        console.error("Lead index not found");
        return;
      }

      // If at the bottom, do nothing
      if (indexFound === state.contactQueue.length - 1) {
        return;
      }

      const queue = [...state.contactQueue];
      const item = queue.splice(indexFound, 1)[0];
      queue.splice(indexFound + 1, 0, item);

      state.contactQueue = queue;
    },
    deleteLeadFromQueue: (state, action) => {
      state.contactQueue = state.contactQueue.filter(
        (lead) => lead.id !== action.payload
      );
    },
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
      const { activeContactIndex, contactQueue } = state;

      // Reset attempt count
      state.currentDialAttempts = 1;

      // Check for null active index
      if (activeContactIndex === null) {
        return console.error("No active contact index found");
      }

      // Stop if we're at the last index of the queue
      if (activeContactIndex === contactQueue.length - 1) {
        return console.info("No more leads to dial");
      }

      // Reset dial attempts counter
      state.currentDialAttempts = 1;

      state.activeContactIndex = activeContactIndex + 1;
    },
  },
});

export const {
  setAlphaDialerVisible,
  setCall,
  setCurrentCallId,
  setIsCalling,
  setIsCallBeingCreated,
  setCurrentDialAttempts,
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
  moveLeadUpInQueue,
  moveLeadDownInQueue,
  deleteLeadFromQueue,
  determineFollowingAction,
  continueToNextLead,
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

// First, create the thunk
// const startCalling = createAsyncThunk(
//   "dialer/startCalling",
//   async (userId: number, thunkAPI) => {
//     // const response = await userAPI.fetchById(userId)
//     // return response.data
//   }
// );

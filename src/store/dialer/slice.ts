import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Device, Call } from "@twilio/voice-sdk";
//
import numbers from "../../configs/numbers";
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

  // Check for APP_VERSION difference, clear settings if found to leave room for enhancements to the user experience

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
  isDialerOpen: boolean;
  isDialing: boolean;
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
  fromNumber: string;
  dialQueueIndex: null | number;
  dialQueue: Lead[];
  options: TDialerOptions;
  showOptions: boolean;
}

const buildInitialState = (): IDialerState => ({
  requestAction: null,
  //
  isDialerOpen:
    localStorage.getItem(LOCAL_STORAGE_KEY__DIALER_IS_OPEN) === "false"
      ? false
      : true,
  tokenLoading: false,
  device: null,
  isDialing: false,
  call: null,
  currentCallId: null,
  connectedAt: null,
  currentDialAttempts: null,
  muted: false,
  // TODO: Remove this hardcoded value in favor of values from API
  fromNumber:
    localStorage.getItem(LOCAL_STORAGE_KEY__DIALER_FROM_NUMBER) ||
    numbers[2].value,
  error: "",
  status: Call.State.Closed,
  token: null,
  identity: null,
  dialQueue: JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_KEY__DIAL_QUEUE) || "[]"
  ),
  dialQueueIndex: JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_KEY__DIAL_QUEUE_INDEX) || "null"
  ),
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
    setIsDialerOpen: (state, action) => {
      state.isDialerOpen = action.payload;

      console.log("!", action.payload);

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
    setIsDialing: (state, action) => {
      state.isDialing = action.payload;
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
    setDialQueueIndex: (state, action) => {
      state.dialQueueIndex = action.payload;

      // Persist in local storage
      localStorage.setItem(
        LOCAL_STORAGE_KEY__DIAL_QUEUE_INDEX,
        JSON.stringify(action.payload)
      );
    },
    setDialQueue: (state, action) => {
      state.dialQueue = action.payload;

      // Persist in local storage
      localStorage.setItem(
        LOCAL_STORAGE_KEY__DIAL_QUEUE,
        JSON.stringify(action.payload)
      );
    },
    updateLeadById: (
      state,
      action: PayloadAction<{ id: number; leadUpdated: Lead }>
    ) => {
      const { dialQueue } = state;
      const { id, leadUpdated } = action.payload;
      const indexFound = dialQueue.findIndex((lead) => lead.id === id);
      if (indexFound === -1) {
        return console.log("Error finding lead in queue");
      }
      dialQueue[indexFound] = leadUpdated;
    },
    setIsMuted: (state, action) => {
      state.muted = action.payload;
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

      // Update dial index, if active
      if (state.dialQueueIndex !== null) {
        state.dialQueueIndex--;
      }
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

      // Update dial index, if active
      if (state.dialQueueIndex !== null) {
        state.dialQueueIndex++;
      }
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
  setIsDialerOpen,
  setIsDialing,
  setCall,
  setCurrentCallId,
  setCurrentDialAttempts,
  setDevice,
  setTokenLoading,
  setFromNumber,
  setIdentity,
  setToken,
  setError,
  setDialQueue,
  setDialQueueIndex,
  setIsMuted,
  setStatus,
  setShowOptions,
  setOptions,
  moveLeadUpInQueue,
  moveLeadDownInQueue,
  deleteLeadFromQueue,
  setConnectedAt,
  updateLeadById,
} = DialerSlice.actions;

export const selectIsCallActive = (state: RootState) => state.dialer.call;

export const selectActivePhoneNumber = (state: RootState) => {
  const { dialQueueIndex, dialQueue } = state.dialer;
  return dialQueueIndex !== null ? dialQueue[dialQueueIndex].phone : undefined;
};

export const selectActiveFullName = (state: RootState) => {
  const { dialQueueIndex, dialQueue } = state.dialer;
  return dialQueueIndex !== null
    ? `${dialQueue[dialQueueIndex].first_name} ${dialQueue[dialQueueIndex].last_name}`
    : undefined;
};

export const selectShowAlphaDialer = (state: RootState) =>
  state.dialer.isDialerOpen;

export const selectIsDialerOptionsModalOpen = (state: RootState) =>
  state.dialer.showOptions;

export default DialerSlice.reducer;

import { deepSignal } from "deepsignal/react";
// import { Call, Device } from "@twilio/voice-sdk";

type DialerStateStatus = "idle" | "connecting" | "ringing" | "inCall";

type DialerState = {
  visible: boolean;
  error: string;
  isDialing: boolean;
  wasCallConnected: boolean;
  currentCallId: number | null;
  dialQueueIndex: number | null;
  currentDialAttempts: number;
  call: any;
  // call: Call | null;
  device: any;
  // device: Device | null;
  token: string | null;
  currentCallTimer: any;
  currentCallDuration: number | null;
  totalDialingDuration: number | null;
  status: DialerStateStatus;
};

const initialDialerState: DialerState = {
  visible: false,
  isDialing: false,
  error: "",
  wasCallConnected: false,
  currentCallId: null,
  dialQueueIndex: null,
  currentDialAttempts: 0,
  call: null,
  device: null,
  token: null,
  currentCallTimer: null,
  currentCallDuration: null,
  totalDialingDuration: null,
  status: "idle",
};

export const dialerSignal = deepSignal(initialDialerState);

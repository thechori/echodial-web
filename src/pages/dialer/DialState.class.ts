import { Call, Device } from "@twilio/voice-sdk";

type DialerStateStatus = "idle" | "connecting" | "ringing" | "inCall";

class DialerState {
  error: string;
  isDialing: boolean;
  wasCallConnected: boolean;
  currentCallId: number | null;
  dialQueueIndex: number | null;
  currentDialAttempts: number;
  call: Call | null;
  device: Device | null;
  token: string | null;
  currentCallTimer: any;
  currentCallDuration: number | null;
  totalDialingDuration: number | null;
  status: DialerStateStatus;

  constructor() {
    this.isDialing = false;
    this.error = "";
    this.wasCallConnected = false;
    this.currentCallId = null;
    this.dialQueueIndex = null;
    this.currentDialAttempts = 0;
    this.call = null;
    this.device = null;
    this.token = null;
    this.currentCallTimer = null;
    this.currentCallDuration = null;
    this.totalDialingDuration = null;
    this.status = "idle";
  }
}

const dialStateInstance = new DialerState();

export { dialStateInstance };

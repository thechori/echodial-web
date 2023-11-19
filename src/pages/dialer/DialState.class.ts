import { Call, Device } from "@twilio/voice-sdk";

class DialerState {
  error: string;
  isDialing: boolean;
  connectedAt: Date | null;
  currentCallId: number | null;
  dialQueueIndex: number | null;
  currentDialAttempts: number;
  call: Call | null;
  device: Device | null;
  token: string | null;
  currentCallTimer: any;
  currentCallDuration: number | null;
  totalDialingDuration: number | null;
  status: Call.State;

  constructor() {
    this.isDialing = false;
    this.error = "";
    this.connectedAt = null;
    this.currentCallId = null;
    this.dialQueueIndex = null;
    this.currentDialAttempts = 0;
    this.call = null;
    this.device = null;
    this.token = null;
    this.currentCallTimer = null;
    this.currentCallDuration = null;
    this.totalDialingDuration = null;
    this.status = Call.State.Closed;
  }
}

const dialStateInstance = new DialerState();

export { dialStateInstance };

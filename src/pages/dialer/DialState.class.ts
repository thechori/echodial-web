import { Call, Device } from "@twilio/voice-sdk";

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

  constructor() {
    // log
    console.log("DialerState initializing...");

    // init
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
  }

  getState() {
    console.log(this);
  }
}

const dialStateInstance = new DialerState();

export { dialStateInstance };

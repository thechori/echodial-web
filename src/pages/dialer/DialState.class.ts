import { Call, Device } from "@twilio/voice-sdk";
import { Lead } from "../../types";

class DialerState {
  error: string;
  connectedAt: Date | null;
  currentCallId: number | null;
  activeLead: Lead | null;
  currentDialAttempts: number;
  call: Call | null;
  device: Device | null;
  token: string | null;
  currentCallTimer: any;
  currentCallDuration: number | null;
  totalDialingDuration: number | null;
  status: Call.State;
  gridRef: any;

  constructor() {
    this.error = "";
    this.connectedAt = null;
    this.currentCallId = null;
    this.activeLead = null;
    this.currentDialAttempts = 0;
    this.call = null;
    this.device = null;
    this.token = null;
    this.currentCallTimer = null;
    this.currentCallDuration = null;
    this.totalDialingDuration = null;
    this.status = Call.State.Closed;
    this.gridRef = null;
  }
}

const dialStateInstance = new DialerState();

export { dialStateInstance };

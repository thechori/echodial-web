import { createSlice } from "@reduxjs/toolkit";
import numbers from "../../configs/numbers";
//
import type { RootState } from "..";

interface IDialerState {
  device: any;
  //
  calls: ICall[];
}

interface ICall {
  id: number;
  //
  fromNumber: string | null;
  toNumber?: string;
  token: string | null;
  identity: string | null;
  call: any;
  error: string;
}

const initialState: IDialerState = {
  device: null,
  //
  calls: [
    {
      id: 0,
      fromNumber: numbers[0].value,
      toNumber: "+18326460869",
      token: null,
      identity: null,
      call: null,
      error: "",
    },
  ],
};

export const DialerSlice = createSlice({
  name: "dialer",
  initialState,
  reducers: {
    setFromNumber: (state, action) => {
      state.fromNumber = action.payload;
    },
    setToNumber: (state, action) => {
      state.toNumber = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setIdentity: (state, action) => {
      state.identity = action.payload;
    },
    setCall: (state, action) => {
      state.call = action.payload;
    },
    setDevice: (state, action) => {
      state.device = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setFromNumber,
  setToNumber,
  setIdentity,
  setToken,
  setCall,
  setDevice,
  setError,
} = DialerSlice.actions;

export const selectRingtoneDevices = (state: RootState) => {
  const { device } = state.dialer;
  if (!device) return [];
  const ringtoneDevices = device.audio.speakerDevices.get();
  console.log("ringtoneDevices", ringtoneDevices);

  console.log("device.audio", device.audio);

  // device.audio.availableOutputDevices.forEach(function (device, id) {
  //   var isActive = selectedDevices.size === 0 && id === "default";
  //   selectedDevices.forEach(function (device) {
  //     if (device.deviceId === id) {
  //       isActive = true;
  //     }
  //   });

  //   var option = document.createElement("option");
  //   option.label = device.label;
  //   option.setAttribute("data-id", id);
  //   if (isActive) {
  //     option.setAttribute("selected", "selected");
  //   }
  //   selectEl.appendChild(option);
  // });

  return ringtoneDevices;
};

export default DialerSlice.reducer;

import { useEffect, useState } from "react";
// import { styled } from "styled-components";
import { Device } from "@twilio/voice-sdk";
// import { BsFillMicMuteFill } from "react-icons/bs";
// import { FaHandPaper } from "react-icons/fa";
// import { BsFillTelephoneFill, BsFillTelephoneXFill } from "react-icons/bs";
// import { IoIosArrowDropdownCircle } from "react-icons/io";
// import { TbGridDots } from "react-icons/tb";
import { Button, Select, TextInput } from "@mantine/core";
//
import DialerStyled from "./Dialer.styles";
import apiService from "../../services/api";
import numbers from "../../configs/numbers";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  setCall,
  setError,
  setFromNumber,
  setToNumber,
  setToken,
} from "../../store/dialer/slice";

/**

- [x] Ability to trigger 1 call
- [ ] Ability to trigger 3 concurrent calls
- [ ] Ability to listen to first call made
- [ ] Ability to be notified of someone picking up on another line (and is now currently on hold)
- [ ] Ability for person on hold to be greeted with a prerecorded message
- [ ] Ability to switch between calls

 */
function Dialer() {
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState<
    "idle" | "calling" | "accepted" | "ended" | "canceled" | "rejected"
  >("idle");
  const [device, setDevice] = useState<any>(null);
  // const [selectedDevices, setSelectedDevices] = useState<any>(null);
  // const [availableInputDevices, setAvailableInputDevices] = useState([]);
  // const [availableOutputDevices, setAvailableOutputDevices] = useState([]);

  const { call, token, error, identity, fromNumber, toNumber } = useAppSelector(
    (state) => state.dialer
  );

  async function startupClient() {
    console.log("Requesting Access Token...");

    try {
      const { data } = await apiService("/dialer/token");
      console.log("Got a token.");
      const token = data.token;
      dispatch(setToken(token));
    } catch (err) {
      console.log(err);
      dispatch(
        setError(
          "An error occurred. See your browser console for more information."
        )
      );
    }
  }

  async function initializeDevice() {
    dispatch(setError(""));

    // const mediaDevices = await navigator.mediaDevices.getUserMedia({
    //   audio: true,
    // });
    // console.log("mediaDevices", mediaDevices);

    if (!token) {
      dispatch(setError("No token found"));
      return;
    }

    const device = new Device(token, {
      logLevel: 1,
      // Set Opus as our preferred codec. Opus generally performs better, requiring less bandwidth and
      // providing better audio quality in restrained network conditions.
      // @ts-ignore
      codecPreferences: ["opus", "pcmu"],
    });

    // Device must be registered in order to receive incoming calls
    device.register();

    setDevice(device);
  }

  function hangUp() {
    console.log("Hanging up ...");
    call.disconnect();
  }

  async function makeOutgoingCall() {
    const params = {
      To: toNumber,
      From: fromNumber,
    };

    if (device) {
      console.log(`Attempting to call ${params.To} ...`);

      // Twilio.Device.connect() returns a Call object
      const call = await device.connect({ params });

      call.on("accept", () => setStatus("accepted"));
      call.on("disconnect", () => setStatus("ended"));
      call.on("cancel", () => setStatus("canceled"));
      call.on("reject", () => setStatus("rejected"));

      dispatch(setCall(call));

      // add listeners to the Call
      // "accepted" means the call has finished connecting and the state is now "open"
      // call.on("accept", updateUIAcceptedOutgoingCall);
      // call.on("disconnect", updateUIDisconnectedOutgoingCall);
      // call.on("cancel", updateUIDisconnectedOutgoingCall);
    } else {
      console.log("Unable to make call.");
      setError("No device found.");
    }
  }

  useEffect(() => {
    if (device) {
      console.log("device??", device);

      console.log("speakerDevices", device.audio.speakerDevices.get());
      console.log("ringtoneDevices", device.audio.ringtoneDevices.get());
      console.log(
        "device.audio.availableInputDevices",
        device.audio.availableInputDevices
      );

      // device.audio.availableInputDevices.forEach((d) => {
      //   console.log("d", d);
      // });

      console.log("hi");
      // for (const [key, value] of device.audio.availableInputDevices.entries()) {
      //   console.log(key, value);
      // }
      device.audio.availableOutputDevices.forEach(function (
        device: any,
        id: any
      ) {
        console.log("device: ", device);
        console.log("id: ", id);
      });
    }
  }, [device]);

  // Initialize device once a token exists
  useEffect(() => {
    if (token) {
      console.log("token found, initializing device...");
      initializeDevice();
    }
  }, [token]);

  return (
    <DialerStyled>
      <div className="container">
        <h1>Dialer</h1>
        <div className="error">{error}</div>
        <button
          className={`startup ${device ? "active" : "inactive"}`}
          onClick={startupClient}
        >
          {device ? "Device activated" : "Startup device"}
        </button>

        <div>Identity: {identity}</div>
        {/* <div>Device status: {}</div> */}
        <div>Call status: {status}</div>

        {/* <div>
          <Select
            label="Input Devices"
            // value={}
            data={availableInputDevices}
          />
        </div>

        <div>
          <Select
            label="Output Devices"
            // value={}
            data={availableOutputDevices}
          />
        </div> */}

        <Select
          label="Your number"
          placeholder="Pick one"
          data={numbers}
          value={fromNumber}
          onChange={(number) => dispatch(setFromNumber(number))}
        />

        <TextInput
          label="Number to call"
          value={toNumber}
          onChange={(e: any) => dispatch(setToNumber(e.target.value))}
        />

        <Button onClick={makeOutgoingCall}>Call</Button>
        <Button onClick={hangUp}>Hang up</Button>

        {/* <div>{device}</div> */}

        {/* <div className="dialer-container">
          <div className="left">
            <Dial number="(832) 111-2222" />
            <Dial number="(281) 222-3333" />
            <Dial number="(346) 333-4444" />
          </div>

          <div className="right">
            <DialList />
          </div>
        </div> */}
      </div>
    </DialerStyled>
  );
}

export default Dialer;

// function Dial({ number }: { number: string }) {
//   const [status, setStatus] = useState<"idle" | "calling" | "active" | "ended">(
//     "idle"
//   );
//   const [muted, setMuted] = useState(false);
//   const [onHold, setOnHold] = useState(false);

//   return (
//     <DialStyled>
//       <div className="number-container">
//         <div className="number">{number}</div>
//         <IoIosArrowDropdownCircle />
//       </div>
//       <div className="status label">
//         {status === "calling" ? "calling..." : status}
//       </div>
//       <div className="call-options">
//         <div
//           className={`option ${muted && "active"}`}
//           onClick={() => setMuted(!muted)}
//         >
//           <div className="icon">
//             <BsFillMicMuteFill fontSize="20px" />
//           </div>
//           <div className="label">mute</div>
//         </div>
//         <div
//           className={`option ${onHold && "active"}`}
//           onClick={() => setOnHold(!onHold)}
//         >
//           <div className="icon">
//             <FaHandPaper fontSize="20px" />
//           </div>
//           <div className="label">hold</div>
//         </div>
//         <div className="option">
//           <div className="icon">
//             <TbGridDots fontSize="20px" />
//           </div>
//           <div className="label">options</div>
//         </div>
//       </div>

//       <div className="end-section">
//         {status === "idle" || status === "ended" ? (
//           <div className="option" onClick={() => setStatus("calling")}>
//             <div className="icon">
//               <BsFillTelephoneFill fontSize="30px" color="green" />
//             </div>
//             <div className="label">call</div>
//           </div>
//         ) : (
//           <div className="option" onClick={() => setStatus("ended")}>
//             <div className="icon">
//               <BsFillTelephoneXFill fontSize="30px" color="red" />
//             </div>
//             <div className="label">end</div>
//           </div>
//         )}
//       </div>
//     </DialStyled>
//   );
// }

// const DialListStyled = styled.div`
//   padding: 2rem;

//   .title {
//     font-size: 2rem;
//   }
// `;

// function DialList() {
//   return (
//     <DialListStyled>
//       <div className="title">Call Queue</div>
//       <div className="list">
//         <div>(832) 111-2222</div>
//         <div>(281) 222-3333</div>
//         <div>(832) 111-2222</div>
//         <div>(346) 111-2222</div>
//         <div>(713) 111-2222</div>
//       </div>
//     </DialListStyled>
//   );
// }

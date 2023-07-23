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
import TwilioSDK from "twilio";
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
import ActiveCalls from "./ActiveCalls";
import ContactQueue from "./ContactQueue";
import contacts from "./contacts";

/**

- [x] Ability to trigger 1 call
- [ ] Ability to trigger 3 concurrent calls
- [ ] Ability to listen to first call made
- [ ] Ability to be notified of someone picking up on another line (and is now currently on hold)
- [ ] Ability for person on hold to be greeted with a prerecorded message
- [ ] Ability to switch between calls
*/

const numbersToCall = ["+18326460869", "+18328638635"];

function Dialer() {
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState<
    | "idle"
    | "calling"
    | "accepted"
    | "answered"
    | "ended"
    | "canceled"
    | "rejected"
  >("idle");
  const [error, setError] = useState("");
  const [token, setToken] = useState<null | string>(null);
  const [device, setDevice] = useState<any>(null);
  const [activeCall, setActiveCall] = useState<any>(null);
  const [calls, setCalls] = useState<any>({});

  // const twilio = TwilioSDK(process.env.);

  async function startupClient() {
    try {
      const { data } = await apiService("/dialer/token");
      console.log("Got a token.");
      const token = data.token;
      setToken(token);
    } catch (err) {
      console.log(err);

      setError(
        "An error occurred. See your browser console for more information."
      );
    }
  }

  async function initializeDevice() {
    setError("");

    if (!token) {
      setError("No token found");
      return;
    }

    const device = new Device(token, {
      logLevel: 1,
      // @ts-ignore
      codecPreferences: ["opus", "pcmu"],
    });

    // Device must be registered in order to receive incoming calls
    device.register();

    setDevice(device);
  }

  function hangUp() {
    if (activeCall) {
      activeCall.disconnect();
    }
  }

  async function makeCall() {
    if (device) {
      numbersToCall.forEach(async (number, index) => {
        if (index > 0) return;
        // Twilio.Device.connect() returns a Call object
        const call = await device.connect({
          To: number,
          From: numbers[0].value,
        });

        // Events
        call.on("accept", () => setStatus("accepted"));
        call.on("disconnect", () => setStatus("ended"));
        call.on("cancel", () => setStatus("canceled"));
        call.on("reject", () => setStatus("rejected"));
        // call.on("mute", (isMuted: boolean) => {
        //   setMuted(isMuted);
        // });
        call.on("answer", (props: any) => {
          setStatus("answered");
          console.log("answer.props", props);
        });
        call.on("ack", (props: any) => {
          console.log("ack.props", props);
        });
        call.on("message", (props: any) => {
          console.log("message.props", props);
        });
      });
    } else {
      console.log("Unable to make call.");
      setError("No device found.");
    }
  }

  // Initialize device once a token exists
  useEffect(() => {
    if (token) {
      initializeDevice();
    }
  }, [token]);

  return (
    <DialerStyled>
      <div className="container">
        <h1>Dialer</h1>
        <button
          className={`startup ${device ? "active" : "inactive"}`}
          onClick={startupClient}
        >
          {device ? "Device activated" : "Startup device"}
        </button>

        <div className="calls">
          <ActiveCalls />
        </div>

        {/* <div>Identity: {identity}</div> */}
        <div>Call status: {status}</div>

        <div className={`settings ${device && "active"}`}>
          <Select
            label="Your number"
            placeholder="Pick one"
            data={numbers}
            value={numbers[0].value}
            onChange={(number) => dispatch(setFromNumber(number))}
          />

          <TextInput
            label="Number to call"
            value={"+18326460869"}
            onChange={(e: any) => dispatch(setToNumber(e.target.value))}
          />

          <Button onClick={makeCall}>Call</Button>
          <Button onClick={hangUp}>Hang up</Button>

          <div className="dialer-container">
            <div className="left">
              {/* <Dial number="(832) 111-2222" />
              <Dial number="(281) 222-3333" />
              <Dial number="(346) 333-4444" /> */}
            </div>

            <div className="right">
              <ContactQueue contacts={contacts} />
            </div>
          </div>
        </div>
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

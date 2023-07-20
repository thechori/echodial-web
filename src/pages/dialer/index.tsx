import { useState } from "react";
import { styled } from "styled-components";
import { Device } from "@twilio/voice-sdk";
import { BsFillMicMuteFill } from "react-icons/bs";
import { FaHandPaper } from "react-icons/fa";
import { BsFillTelephoneFill, BsFillTelephoneXFill } from "react-icons/bs";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { TbGridDots } from "react-icons/tb";
//
import DialerStyled, { DialStyled } from "./Dialer.styles";
import apiService from "../../services/api";

/**

- [ ] Ability to trigger 3 concurrent calls
- [ ] Ability to listen to first call made
- [ ] Ability to be notified of someone picking up on another line (and is now currently on hold)
- [ ] Ability for person on hold to be greeted with a prerecorded message
- [ ] Ability to switch between calls

 */
function Dialer() {
  const [device, setDevice] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  async function startupClient() {
    console.log("Requesting Access Token...");

    try {
      const data = await apiService("/token");
      console.log("Got a token.");
      const token = data.token;
      setToken(token);
      setClientNameUI(data.identity);
      intitializeDevice();
    } catch (err) {
      console.log(err);
      console.log(
        "An error occurred. See your browser console for more information."
      );
    }
  }

  function startupDevice() {
    setDevice(true);

    const device = new Device(token, {
      logLevel: 1,
      // Set Opus as our preferred codec. Opus generally performs better, requiring less bandwidth and
      // providing better audio quality in restrained network conditions.
      codecPreferences: ["opus", "pcmu"],
    });

    addDeviceListeners(device);

    // Device must be registered in order to receive incoming calls
    device.register();
  }

  return (
    <DialerStyled>
      <div className="container">
        <h1>Dialer</h1>
        <button
          className={`startup ${device ? "active" : "inactive"}`}
          onClick={startupDevice}
        >
          {device ? "Device activated" : "Startup device"}
        </button>
        <div className="dialer-container">
          <div className="left">
            <Dial number="(832) 111-2222" />
            <Dial number="(281) 222-3333" />
            <Dial number="(346) 333-4444" />
          </div>

          <div className="right">
            <DialList />
          </div>
        </div>
      </div>
    </DialerStyled>
  );
}

export default Dialer;

function Dial({ number }: { number: string }) {
  const [status, setStatus] = useState<"idle" | "calling" | "active" | "ended">(
    "idle"
  );
  const [muted, setMuted] = useState(false);
  const [onHold, setOnHold] = useState(false);

  return (
    <DialStyled>
      <div className="number-container">
        <div className="number">{number}</div>
        <IoIosArrowDropdownCircle />
      </div>
      <div className="status label">
        {status === "calling" ? "calling..." : status}
      </div>
      <div className="call-options">
        <div
          className={`option ${muted && "active"}`}
          onClick={() => setMuted(!muted)}
        >
          <div className="icon">
            <BsFillMicMuteFill fontSize="20px" />
          </div>
          <div className="label">mute</div>
        </div>
        <div
          className={`option ${onHold && "active"}`}
          onClick={() => setOnHold(!onHold)}
        >
          <div className="icon">
            <FaHandPaper fontSize="20px" />
          </div>
          <div className="label">hold</div>
        </div>
        <div className="option">
          <div className="icon">
            <TbGridDots fontSize="20px" />
          </div>
          <div className="label">options</div>
        </div>
      </div>

      <div className="end-section">
        {status === "idle" || status === "ended" ? (
          <div className="option" onClick={() => setStatus("calling")}>
            <div className="icon">
              <BsFillTelephoneFill fontSize="30px" color="green" />
            </div>
            <div className="label">call</div>
          </div>
        ) : (
          <div className="option" onClick={() => setStatus("ended")}>
            <div className="icon">
              <BsFillTelephoneXFill fontSize="30px" color="red" />
            </div>
            <div className="label">end</div>
          </div>
        )}
      </div>
    </DialStyled>
  );
}

const DialListStyled = styled.div`
  padding: 2rem;

  .title {
    font-size: 2rem;
  }
`;

function DialList() {
  return (
    <DialListStyled>
      <div className="title">Call Queue</div>
      <div className="list">
        <div>(832) 111-2222</div>
        <div>(281) 222-3333</div>
        <div>(832) 111-2222</div>
        <div>(346) 111-2222</div>
        <div>(713) 111-2222</div>
      </div>
    </DialListStyled>
  );
}
